import { Router } from "express";
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from "../controllers/leadController";
import { protect, restrictTo } from "../middleware/auth";
import { leadValidator } from "../validators/leadValidator";
import { validate } from "../middleware/validate";

const router = Router();

router.use(protect);

router.get("/export", exportLeadsCSV);
router.get("/", getLeads);
router.get("/:id", getLead);
router.post("/", leadValidator, validate, createLead);
router.put("/:id", leadValidator, validate, updateLead);
router.delete("/:id", restrictTo("admin"), deleteLead);

export default router;
