import API from "./configAPI";

export const getAllInvoices = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append("status", filters.status);
  if (filters.fournisseurId) params.append("fournisseurId", filters.fournisseurId);
  if (filters.amount) params.append("amount", filters.amount);
  if (filters.dueDate) params.append("dueDate", filters.dueDate);

  const query = params.toString();
  return API.get(`/invoices${query ? `?${query}` : ""}`);
};

export const getInvoiceById = (id) => {
  return API.get(`/invoices/${id}`);
};

export const createInvoice = (data) => {
  return API.post("/invoices", data);
};

export const updateInvoice = (id, data) => {
  return API.put(`/invoices/${id}`, data);
};

export const deleteInvoice = (id) => {
  return API.delete(`/invoices/${id}`);
};
