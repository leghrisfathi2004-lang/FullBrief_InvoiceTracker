import API from "./configAPI";

export const getPaymentsByInvoice = (invoiceId) => {
  return API.get(`/invoices/${invoiceId}/payments`);
};

export const createPayment = (invoiceId, data) => {
  return API.post(`/invoices/${invoiceId}/payments`, data);
};
