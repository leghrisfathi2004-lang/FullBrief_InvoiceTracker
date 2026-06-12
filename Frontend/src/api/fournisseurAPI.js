import API from "./configAPI";

export const getAllSuppliers = () => {
  return API.get("/suppliers");
};

export const getSupplierById = (id) => {
  return API.get(`/suppliers/${id}`);
};

export const createSupplier = (data) => {
  return API.post("/suppliers", data);
};

export const updateSupplier = (id, data) => {
  return API.put(`/suppliers/${id}`, data);
};

export const deleteSupplier = (id) => {
  return API.delete(`/suppliers/${id}`);
};
