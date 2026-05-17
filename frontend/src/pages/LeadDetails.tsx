import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLeadApi } from "../api/leadApi";
import type { Lead } from "../types";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Button from "../components/Button";

const LeadDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getLeadApi(id)
      .then((res) => setLead(res.data))
      .catch(() => setError("Lead not found"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-6 max-w-2xl mx-auto">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-red-500 mt-4">{error}</p>
        ) : lead ? (
          <div className="bg-white dark:bg-gray-800 rounded shadow p-6 mt-4 space-y-3">
            <h2 className="text-2xl font-bold">{lead.name}</h2>
            <p><strong>Email:</strong> {lead.email}</p>
            <p><strong>Status:</strong> {lead.status}</p>
            <p><strong>Source:</strong> {lead.source}</p>
            <p><strong>Created:</strong> {new Date(lead.createdAt).toLocaleString()}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LeadDetails;
