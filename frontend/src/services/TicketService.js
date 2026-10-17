import { api } from "./ApiClient";

/** Support-ticket operations. Authorization is attached by ApiClient. */
class TicketService {
  listTickets() { return api.get("/tickets"); }
  createTicket(ticket) { return api.post("/tickets", ticket); }
  addComment(ticketId, body) { return api.post(`/tickets/${ticketId}/comments`, { body }); }
  updateStatus(ticketId, status) { return api.patch(`/tickets/${ticketId}/status`, { status }); }
}

export const ticketService = new TicketService();
