import { prisma } from "@/lib/prisma";

export interface AnalyticsSummary {
  totalApplications: number;
  totalPipelineValue: number;
  winRatePercentage: number;
  statusBreakdown: Record<string, number>;
  categoryBreakdown: Array<{ category: string; count: number; totalValue: number }>;
  topTenderOpportunities: Array<{
    id: string;
    referenceNumber: string;
    title: string;
    estimatedValue?: number | null;
    category: string;
  }>;
}

export class AnalyticsService {
  /**
   * Calculates real-time procurement analytics metrics for a company.
   */
  static async getCompanyAnalytics(companyId: string): Promise<AnalyticsSummary> {
    const applications = await prisma.application.findMany({
      where: { companyId },
      include: {
        tender: true,
      },
    });

    const statusBreakdown: Record<string, number> = {
      SAVED: 0,
      INTERESTED: 0,
      PREPARING: 0,
      SUBMITTED: 0,
      WON: 0,
      LOST: 0,
    };

    let totalPipelineValue = 0;
    let wonCount = 0;
    let totalClosedCount = 0;

    const categoryMap = new Map<string, { count: number; totalValue: number }>();

    for (const app of applications) {
      statusBreakdown[app.status] = (statusBreakdown[app.status] || 0) + 1;

      const tenderValue = app.tender.estimatedValue ? Number(app.tender.estimatedValue) : 0;
      totalPipelineValue += tenderValue;

      if (app.status === "WON") {
        wonCount++;
        totalClosedCount++;
      } else if (app.status === "LOST") {
        totalClosedCount++;
      }

      const cat = app.tender.category || "General";
      const existing = categoryMap.get(cat) || { count: 0, totalValue: 0 };
      categoryMap.set(cat, {
        count: existing.count + 1,
        totalValue: existing.totalValue + tenderValue,
      });
    }

    const winRatePercentage = totalClosedCount > 0 ? Math.round((wonCount / totalClosedCount) * 100) : 0;

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      count: stats.count,
      totalValue: stats.totalValue,
    }));

    const topTenders = await prisma.tender.findMany({
      where: { status: "ACTIVE" },
      orderBy: { estimatedValue: "desc" },
      take: 5,
      select: {
        id: true,
        referenceNumber: true,
        title: true,
        estimatedValue: true,
        category: true,
      },
    });

    return {
      totalApplications: applications.length,
      totalPipelineValue,
      winRatePercentage,
      statusBreakdown,
      categoryBreakdown,
      topTenderOpportunities: topTenders.map((t) => ({
        ...t,
        estimatedValue: t.estimatedValue ? Number(t.estimatedValue) : null,
      })),
    };
  }
}
