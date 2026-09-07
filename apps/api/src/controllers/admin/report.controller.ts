import type { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { getReportSummary, type ReportRange } from "../../services/report.service";
import { getActiveBranch } from "../../services/branch.service";

const VALID_RANGES: ReportRange[] = ["today", "week", "month"];

export const getReports = asyncHandler(async (req: Request, res: Response) => {
  const rangeParam = typeof req.query.range === "string" ? req.query.range : "today";
  const range: ReportRange = VALID_RANGES.includes(rangeParam as ReportRange) ? (rangeParam as ReportRange) : "today";
  const branch = await getActiveBranch();
  const summary = await getReportSummary(branch.id, range);
  res.json(summary);
});
