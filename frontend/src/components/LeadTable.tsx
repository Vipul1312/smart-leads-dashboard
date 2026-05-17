import type { Lead } from "../types";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";

interface Props {
  leads: Lead[];
  onEdit: (l: Lead) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const statusColors: Record<string, string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  Qualified: "bg-green-100 text-green-700",
  Lost: "bg-red-100 text-red-700",
};

const LeadTable = ({ leads, onEdit, onDelete, onView }: Props) => {
  const { user } = useAuth();
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Source</th>
            <th className="p-3 text-left">Created</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr
              key={l._id}
              className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="p-3">{l.name}</td>
              <td className="p-3">{l.email}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs ${statusColors[l.status]}`}
                >
                  {l.status}
                </span>
              </td>
              <td className="p-3">{l.source}</td>
              <td className="p-3">{new Date(l.createdAt).toLocaleDateString()}</td>
              <td className="p-3 flex gap-2 flex-wrap">
                <Button variant="secondary" onClick={() => onView(l._id)}>
                  View
                </Button>
                <Button variant="secondary" onClick={() => onEdit(l)}>
                  Edit
                </Button>
                {user?.role === "admin" && (
                  <Button variant="danger" onClick={() => onDelete(l._id)}>
                    Delete
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
