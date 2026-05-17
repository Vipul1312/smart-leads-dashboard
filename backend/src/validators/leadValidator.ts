import { body } from "express-validator";

export const leadValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("status")
    .optional()
    .isIn(["New", "Contacted", "Qualified", "Lost"]),
  body("source").isIn(["Website", "Instagram", "Referral"]),
];
