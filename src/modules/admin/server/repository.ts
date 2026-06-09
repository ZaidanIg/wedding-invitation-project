// ============================================================
// Admin Module — Repository (Database Queries)
// ============================================================

import { prisma } from '@/lib/prisma';
import type { TransactionFilterInput } from './validators';

export const adminRepository = {
  /**
   * Aggregate all global KPI metrics for the dashboard overview.
   */
  async getGlobalMetrics() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      newUsersThisMonth,
      totalInvitations,
      paidInvitations,
      draftInvitations,
      totalRevenueResult,
      monthlyRevenueResult,
      pendingTransactions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.invitation.count(),
      prisma.invitation.count({ where: { tier: { not: 'DRAFT' } } }),
      prisma.invitation.count({ where: { tier: 'DRAFT' } }),
      prisma.transaction.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          status: 'PAID',
          createdAt: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.count({ where: { status: 'PENDING' } }),
    ]);

    return {
      totalUsers,
      newUsersThisMonth,
      totalInvitations,
      paidInvitations,
      draftInvitations,
      totalRevenue: totalRevenueResult._sum?.amount ?? 0,
      newRevenueThisMonth: monthlyRevenueResult._sum?.amount ?? 0,
      pendingTransactions,
    };
  },

  /**
   * Get daily revenue aggregated for line chart.
   * @param days - number of past days to fetch (7, 30, 90, 365)
   */
  async getRevenueChartData(days: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const transactions = await prisma.transaction.findMany({
      where: {
        status: 'PAID',
        createdAt: { gte: startDate },
      },
      select: {
        amount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by day
    const grouped: Record<string, number> = {};
    transactions.forEach((tx) => {
      const day = tx.createdAt.toISOString().split('T')[0];
      grouped[day] = (grouped[day] ?? 0) + tx.amount;
    });

    // Fill missing days with 0
    const result: { date: string; value: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      result.push({ date: key, value: grouped[key] ?? 0 });
    }
    return result;
  },

  /**
   * Get daily user registration count for bar chart.
   * @param days - number of past days to fetch (7, 30, 90, 365)
   */
  async getUserGrowthChartData(days: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const users = await prisma.user.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const grouped: Record<string, number> = {};
    users.forEach((u) => {
      const day = u.createdAt.toISOString().split('T')[0];
      grouped[day] = (grouped[day] ?? 0) + 1;
    });

    const result: { date: string; value: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      result.push({ date: key, value: grouped[key] ?? 0 });
    }
    return result;
  },

  /**
   * Get tier distribution counts for pie chart.
   */
  async getTierDistribution() {
    const tiers = ['DRAFT', 'BASIC', 'PREMIUM', 'ULTIMATE'] as const;
    const counts = await Promise.all(
      tiers.map((t) => prisma.invitation.count({ where: { tier: t } }))
    );
    const total = counts.reduce((a, b) => a + b, 0);
    return tiers.map((tier, i) => ({
      tier,
      count: counts[i],
      percentage: total > 0 ? Math.round((counts[i] / total) * 100) : 0,
    }));
  },

  /**
   * Paginated list of all transactions with optional filters.
   */
  async getTransactions(filters: TransactionFilterInput) {
    const { page, limit, status, type, startDate, endDate } = filters;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (startDate || endDate) {
      where.createdAt = {
        ...(startDate ? { gte: new Date(startDate) } : {}),
        ...(endDate ? { lte: new Date(endDate) } : {}),
      };
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          userId: true,
          invitationId: true,
          amount: true,
          type: true,
          status: true,
          tier: true,
          paymentMethod: true,
          midtransId: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: { name: true, email: true },
          },
          invitation: {
            select: { groomName: true, brideName: true, slug: true },
          },
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    return { transactions, total };
  },

  /**
   * List users with pagination and optional search.
   */
  async getUsers(search?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            select: { invitations: true },
          },
          transactions: {
            where: { status: 'PAID' },
            select: { amount: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  },

  /**
   * List all invitations with guest RSVP stats.
   */
  async getInvitations(search?: string) {
    return prisma.invitation.findMany({
      where: search
        ? {
            OR: [
              { groomName: { contains: search, mode: 'insensitive' } },
              { brideName: { contains: search, mode: 'insensitive' } },
              { slug: { contains: search, mode: 'insensitive' } },
              { user: { email: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : undefined,
      select: {
        id: true,
        groomName: true,
        brideName: true,
        slug: true,
        tier: true,
        layout: true,
        viewCount: true,
        aiRegenCount: true,
        eventDate: true,
        createdAt: true,
        user: {
          select: { name: true, email: true },
        },
        _count: {
          select: { guests: true },
        },
        guests: {
          where: { rsvpStatus: 'ATTENDING' },
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Update invitation tier with audit trail logging.
   */
  async updateInvitationTier(id: string, tier: string, resetAiCount: boolean) {
    return prisma.invitation.update({
      where: { id },
      data: {
        tier: tier as 'DRAFT' | 'BASIC' | 'PREMIUM' | 'ULTIMATE',
        ...(resetAiCount ? { aiRegenCount: 0 } : {}),
      },
    });
  },

  /**
   * Update user role.
   */
  async updateUserRole(userId: string, role: 'USER' | 'ADMIN') {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, role: true },
    });
  },

  /**
   * Fetch all raw data for Excel export (no pagination).
   */
  async getAllDataForExport() {
    return Promise.all([
      // 1. All Transactions
      prisma.transaction.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          amount: true,
          type: true,
          status: true,
          tier: true,
          paymentMethod: true,
          midtransId: true,
          createdAt: true,
          user: { select: { email: true, name: true } },
          invitation: { select: { slug: true } },
        },
      }),
      // 2. All Users
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { invitations: true } },
          transactions: {
            where: { status: 'PAID' },
            select: { amount: true },
          },
        },
      }),
      // 3. All Invitations
      prisma.invitation.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          groomName: true,
          brideName: true,
          slug: true,
          tier: true,
          viewCount: true,
          eventDate: true,
          createdAt: true,
          user: { select: { email: true } },
          _count: { select: { guests: true } },
          guests: {
            where: { rsvpStatus: 'ATTENDING' },
            select: { id: true },
          },
        },
      }),
    ]);
  },

  // ── Expenses ──
  async getExpenses(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.expense.count(),
    ]);
    return { expenses, total };
  },

  async createExpense(data: { category: any; amount: number; description: string; date?: Date }) {
    return prisma.expense.create({
      data: {
        category: data.category,
        amount: data.amount,
        description: data.description,
        date: data.date ?? new Date(),
      },
    });
  },

  async deleteExpense(id: string) {
    return prisma.expense.delete({
      where: { id },
    });
  },

  // ── Leads ──
  async getLeads() {
    return prisma.lead.findMany({
      orderBy: { date: 'desc' },
    });
  },

  async createLead(data: { name: string; source: any; status?: any; date?: Date }) {
    return prisma.lead.create({
      data: {
        name: data.name,
        source: data.source,
        status: data.status ?? 'NEW',
        date: data.date ?? new Date(),
      },
    });
  },

  async updateLeadStatus(id: string, status: any) {
    return prisma.lead.update({
      where: { id },
      data: { status },
    });
  },

  async deleteLead(id: string) {
    return prisma.lead.delete({
      where: { id },
    });
  },

  // ── Marketing Spends ──
  async getMarketingSpends() {
    return prisma.marketingSpend.findMany({
      orderBy: { date: 'desc' },
    });
  },

  async createMarketingSpend(data: { channel: any; amount: number; date?: Date }) {
    return prisma.marketingSpend.create({
      data: {
        channel: data.channel,
        amount: data.amount,
        date: data.date ?? new Date(),
      },
    });
  },
};

