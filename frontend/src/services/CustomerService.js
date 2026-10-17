import { api } from "./ApiClient";

/** Public contact, quote and contact-list requests. */
class CustomerService {
  sendContactMessage(form) { return api.post("/contact", form); }
  saveQuote(quote) { return api.post("/quote", quote); }
  listContacts() { return api.get("/contact"); }
}

export const customerService = new CustomerService();
