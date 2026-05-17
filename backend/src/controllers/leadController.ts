import { Response, NextFunction } from "express";
import { Parser } from "json2csv";
import Lead from "../models/Lead";
import { AppError } from "../utils/AppError";
import { AuthRequest, LeadStatus, LeadSource } from "../types";

interface LeadQuery {
  status?: LeadStatus;
  source?: LeadSource;
  $or?: Array<Record<string, { $regex: string; $options: string }>>;
}

const buildQuery = (req: AuthRequest): LeadQuery => {
  const { status, source, search } = req.query;
  const query: LeadQuery = {};
  if (status) query.status = status as LeadStatus;
  if (source) query.source = source as LeadSource;
  if (search) {
    query.$or = [
      { name: { $regex: search as string, $options: "i" } },
      { email: { $regex: search as string, $options: "i" } },
    ];
  }
  return query;
};

export const getLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort === "oldest" ? 1 : -1;

    const query = buildQuery(req);

    const [data, total] = await Promise.all([
      Lead.find(query).sort({ createdAt: sort }).skip(skip).limit(limit),
      Lead.countDocuments(query),
    ]);

    res.json({
      success: true,
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

export const getLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return next(new AppError("Lead not found", 404));
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

export const createLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.create({
      ...req.body,
      createdBy: req.user?.id,
    });
    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

export const updateLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lead) return next(new AppError("Lead not found", 404));
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

export const deleteLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return next(new AppError("Lead not found", 404));
    res.json({ success: true, message: "Lead deleted" });
  } catch (err) {
    next(err);
  }
};

export const exportLeadsCSV = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = buildQuery(req);
    const leads = await Lead.find(query).lean();

    const fields = ["name", "email", "status", "source", "createdAt"];
    const parser = new Parser({ fields });
    const csv = parser.parse(leads);

    res.header("Content-Type", "text/csv");
    res.attachment("leads.csv");
    res.send(csv);
  } catch (err) {
    next(err);
  }
};
