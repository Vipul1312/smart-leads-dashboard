import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getLeadsApi,
  createLeadApi,
  updateLeadApi,
  deleteLeadApi,
  exportLeadsApi,
} from "../api/leadApi";
import type { Lead, LeadFilters, LeadFormData, LeadStatus, LeadSource } from "../types";
import { useDebounce } from "../hooks/useDebounce";
import Navbar from "../components/Navbar";
import LeadTable from "../components/LeadTable";
import LeadForm from "../components/LeadForm";
import Modal from "../components/Modal";
import Button from "../components/Button";
import Loader from "../components/Loader";
// @ts-ignore: imported JS component without type declaration
import EmptyState from "../components/EmptyState";
import Select from "../components/Select";
import Input from "../components/Input";

const Dashboard = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [source, setSource] = useState<LeadSource | "">("");
  const [sort, setSort] = useState<"latest" | "oldest">("latest");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const filters: LeadFilters = {
        page,
        status: status || undefined,
        source: source || undefined,
        search: debouncedSearch || undefined,
        sort,
      };
      const res = await getLeadsApi(filters);
      setLeads(res.data);
      setTotalPages(res.totalPages);
    } catch {
      setError("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }, [page, status, source, debouncedSearch, sort]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, source, sort]);

  const openCreate = () => {
    setEditingLead(undefined);
    setModalOpen(true);
  };

  const openEdit = (lead: Lead) => {
    setEditingLead(lead);
    setModalOpen(true);
  };

  const handleSubmit = async (data: LeadFormData) => {
    setSubmitting(true);
    try {
      if (editingLead) await updateLeadApi(editingLead._id, data);
      else await createLeadApi(data);
      setModalOpen(false);
      fetchLeads();
    } catch {
      alert("Failed to save lead");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    try {
      await deleteLeadApi(id);
      fetchLeads();
    } catch {
      alert("Failed to delete");
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportLeadsApi({
        status: status || undefined,
        source: source || undefined,
        search: debouncedSearch || undefined,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leads.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Export failed");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <h1 className="text-2xl font-bold">Leads</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleExport}>
              Export CSV
            </Button>
            <Button onClick={openCreate}>+ Add Lead</Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as LeadStatus | "")}
            options={[
              { value: "", label: "All Status" },
              { value: "New", label: "New" },
              { value: "Contacted", label: "Contacted" },
              { value: "Qualified", label: "Qualified" },
              { value: "Lost", label: "Lost" },
            ]}
          />
          <Select
            value={source}
            onChange={(e) => setSource(e.target.value as LeadSource | "")}
            options={[
              { value: "", label: "All Sources" },
              { value: "Website", label: "Website" },
              { value: "Instagram", label: "Instagram" },
              { value: "Referral", label: "Referral" },
            ]}
          />
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as "latest" | "oldest")}
            options={[
              { value: "latest", label: "Latest First" },
              { value: "oldest", label: "Oldest First" },
            ]}
          />
        </div>

        {/* List */}
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : leads.length === 0 ? (
          <EmptyState message="No leads found. Try changing filters or add a new lead." />
        ) : (
          <>
            <LeadTable
              leads={leads}
              onEdit={openEdit}
              onDelete={handleDelete}
              onView={(id) => navigate(`/leads/${id}`)}
            />
            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="secondary"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>
              <span className="px-3 py-2">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingLead ? "Edit Lead" : "Add Lead"}
        >
          <LeadForm initial={editingLead} onSubmit={handleSubmit} loading={submitting} />
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
