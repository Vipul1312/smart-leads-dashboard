import api from "./axios";
import type { Lead, LeadsResponse, LeadFormData, LeadFilters } from "../types";

export const getLeadsApi = async (
  filters: LeadFilters
): Promise<LeadsResponse> => {
  const res = await api.get<LeadsResponse>("/leads", { params: filters });
  return res.data;
};

export const getLeadApi = async (
  id: string
): Promise<{ success: boolean; data: Lead }> => {
  const res = await api.get(`/leads/${id}`);
  return res.data;
};

export const createLeadApi = async (
  data: LeadFormData
): Promise<{ success: boolean; data: Lead }> => {
  const res = await api.post("/leads", data);
  return res.data;
};

export const updateLeadApi = async (
  id: string,
  data: LeadFormData
): Promise<{ success: boolean; data: Lead }> => {
  const res = await api.put(`/leads/${id}`, data);
  return res.data;
};

export const deleteLeadApi = async (id: string): Promise<void> => {
  await api.delete(`/leads/${id}`);
};

export const exportLeadsApi = async (filters: LeadFilters): Promise<Blob> => {
  const res = await api.get("/leads/export", {
    params: filters,
    responseType: "blob",
  });
  return res.data;
};
