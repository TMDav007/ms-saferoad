import { requireAuth, requireOfficerAuth } from "@sfroads/common";
import express from "express";
import 
  createATicket
 from "../controllers/TicketControllers";

export default () => {
  const TicketRoute = express.Router();
  // TicketRoute.post("/", requireAuth, createATicket)
    // .get("/allTickets", requireAuth, getAllTickets)
    // .get("/:id", requireAuth, getATicket)
    // .patch("/:id", requireAuth, requireOfficerAuth, editATicket);
};
