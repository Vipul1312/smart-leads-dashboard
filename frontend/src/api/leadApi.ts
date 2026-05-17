import api from "./axios";
import type { Lead, LeadsResponse, LeadFormData, LeadFilters } from "../types";

export const getLeadsApi = async (
  filters: LeadFilters
): Promise<LeadsResponse> => {
  const res = await api.get<LeadsResponse>("/api/leads", { params: filters });
  return res.data;
};

export const getLeadApi = async (
  id: string
): Promise<{ success: boolean; data: Lead }> => {
  const res = await api.get(`/api/leads/${id}`);
  return res.data;
};

export const createLeadApi = async (
  data: LeadFormData
): Promise<{ success: boolean; data: Lead }> => {
  const res = await api.post("/api/leads", data);
  return res.data;
};

export const updateLeadApi = async (
  id: string,
  data: LeadFormData
): Promise<{ success: boolean; data: Lead }> => {
  const res = await api.put(`/api/leads/${id}`, data);
  return res.data;
};

export const deleteLeadApi = async (id: string): Promise<void> => {
  await api.delete(`/api/leads/${id}`);
};

export const exportLeadsApi = async (filters: LeadFilters): Promise<Blob> => {
  const res = await api.get("/api/leads/export", {
    params: filters,
    responseType: "blob",
  });
  return res.data;
};
