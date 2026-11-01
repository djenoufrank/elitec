import { api } from "./ApiClient";

/** Public contact, quote and contact-list requests. */
class CustomerService {
  sendContactMessage(form) { return api.post("/contact", form); }
  async startCalculatorLead(lead) {
    const { data } = await api.post("/quote/leads", lead);
    return data;
  }
  updateCalculatorLead(id, estimate) { return api.patch(`/quote/${id}`, estimate); }
  async completeCalculatorLead(id, estimate) {
    const { data } = await api.post(`/quote/${id}/complete`, estimate);
    return data;
  }
  listContacts() { return api.get("/contact"); }
}

export const customerService = new CustomerService();
