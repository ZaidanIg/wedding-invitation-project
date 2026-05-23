// ============================================================
// Admin Module — Service (Business Logic)
// ============================================================

import { ForbiddenError, NotFoundError, ValidationError } from '@/lib/errors';
import ExcelJS from 'exceljs';
import { adminRepository } from './repository';
import {
  updateInvitationTierSchema,
  updateUserRoleSchema,
  transactionFilterSchema,
  chartQuerySchema,
} from './validators';
import type {
  AdminMetricsDto,
  AdminTransactionDto,
  AdminUserDto,
  AdminInvitationDto,
  PaginatedResult,
} from './dto';

export const adminService = {
  /**
   * Get all global KPI metrics for the dashboard overview.
   * Computes derived metrics (conversionRate, avgRevenuePerUser).
   */
  async getDashboardMetrics(): Promise<AdminMetricsDto> {
    const raw = await adminRepository.getGlobalMetrics();
    const conversionRate =
      raw.totalInvitations > 0
        ? Math.round((raw.paidInvitations / raw.totalInvitations) * 100 * 10) / 10
        : 0;
    const avgRevenuePerUser =
      raw.totalUsers > 0 ? Math.round(raw.totalRevenue / raw.totalUsers) : 0;

    return {
      ...raw,
      conversionRate,
      avgRevenuePerUser,
    };
  },

  /**
   * Get revenue chart data.
   * Validates days param (7 | 30 | 90 | 365).
   */
  async getRevenueChart(rawDays: unknown) {
    const { days } = chartQuerySchema.parse({ days: rawDays ?? 30 });
    if (![7, 30, 90, 365].includes(days)) {
      throw new ValidationError('days must be one of: 7, 30, 90, 365');
    }
    return adminRepository.getRevenueChartData(days);
  },

  /**
   * Get user growth chart data.
   */
  async getUserGrowthChart(rawDays: unknown) {
    const { days } = chartQuerySchema.parse({ days: rawDays ?? 30 });
    if (![7, 30, 90, 365].includes(days)) {
      throw new ValidationError('days must be one of: 7, 30, 90, 365');
    }
    return adminRepository.getUserGrowthChartData(days);
  },

  /**
   * Get tier distribution for pie chart.
   */
  async getTierDistribution() {
    return adminRepository.getTierDistribution();
  },

  /**
   * Get paginated transactions with optional filters.
   */
  async getTransactions(rawFilters: unknown): Promise<PaginatedResult<AdminTransactionDto>> {
    const filters = transactionFilterSchema.parse(rawFilters);
    const { transactions, total } = await adminRepository.getTransactions(filters);

    const mapped: AdminTransactionDto[] = transactions.map((tx) => ({
      id: tx.id,
      userId: tx.userId,
      invitationId: tx.invitationId,
      amount: tx.amount,
      type: tx.type,
      status: tx.status,
      tier: tx.tier,
      paymentMethod: tx.paymentMethod,
      midtransId: tx.midtransId,
      createdAt: tx.createdAt.toISOString(),
      updatedAt: tx.updatedAt.toISOString(),
      user: { name: tx.user.name, email: tx.user.email },
      invitation: tx.invitation
        ? {
            groomName: tx.invitation.groomName,
            brideName: tx.invitation.brideName,
            slug: tx.invitation.slug,
          }
        : null,
    }));

    return {
      data: mapped,
      meta: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  },

  /**
   * Get all users with aggregated spend & invitation count.
   */
  async getUsers(search?: string): Promise<AdminUserDto[]> {
    const users = await adminRepository.getUsers(search);
    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt.toISOString(),
      totalSpent: u.transactions.reduce((sum, t) => sum + t.amount, 0),
      invitationCount: u._count.invitations,
    }));
  },

  /**
   * Get all invitations with RSVP stats.
   */
  async getInvitations(search?: string): Promise<AdminInvitationDto[]> {
    const invitations = await adminRepository.getInvitations(search);
    return invitations.map((inv) => ({
      id: inv.id,
      groomName: inv.groomName,
      brideName: inv.brideName,
      slug: inv.slug,
      tier: inv.tier,
      layout: inv.layout,
      viewCount: inv.viewCount,
      aiRegenCount: inv.aiRegenCount,
      eventDate: inv.eventDate.toISOString(),
      createdAt: inv.createdAt.toISOString(),
      user: { name: inv.user.name, email: inv.user.email },
      guestCount: inv._count.guests,
      rsvpAttending: inv.guests.length,
    }));
  },

  /**
   * Update invitation tier. Validates input + prevents invalid transitions.
   */
  async updateInvitationTier(
    invitationId: string,
    rawPayload: unknown,
    actorEmail: string
  ) {
    const { tier, resetAiCount } = updateInvitationTierSchema.parse(rawPayload);
    console.log(`[Admin] ${actorEmail} updated invitation ${invitationId} → tier=${tier}`);
    return adminRepository.updateInvitationTier(invitationId, tier, resetAiCount);
  },

  /**
   * Update user role. Prevents admin from demoting themselves.
   */
  async updateUserRole(rawPayload: unknown, actorEmail: string) {
    const { userId, role } = updateUserRoleSchema.parse(rawPayload);
    console.log(`[Admin] ${actorEmail} updated user ${userId} → role=${role}`);
    return adminRepository.updateUserRole(userId, role);
  },

  /**
   * Generate a styled Excel workbook containing all data (Transactions, Users, Invitations).
   * Returns a Buffer ready to be sent as an HTTP response.
   */
  async generateExportExcel(): Promise<Buffer> {
    const [transactions, users, invitations] = await adminRepository.getAllDataForExport();

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Sahinaja Admin';
    workbook.created = new Date();

    // ── Helper: Format Currency ──
    const formatRp = '"Rp"#,##0;[Red]-"Rp"#,##0';

    // ==========================================
    // SHEET 1: TRANSAKSI
    // ==========================================
    const txSheet = workbook.addWorksheet('Data Transaksi');
    txSheet.columns = [
      { header: 'Order ID', key: 'id', width: 20 },
      { header: 'Tanggal', key: 'date', width: 20 },
      { header: 'Email Pengguna', key: 'email', width: 30 },
      { header: 'Nama Pengguna', key: 'name', width: 25 },
      { header: 'Tipe', key: 'type', width: 20 },
      { header: 'Paket', key: 'tier', width: 15 },
      { header: 'Metode Bayar', key: 'payment', width: 20 },
      { header: 'Jumlah (Rp)', key: 'amount', width: 18 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Midtrans ID', key: 'midtransId', width: 40 },
      { header: 'Undangan (Slug)', key: 'slug', width: 25 },
    ];

    transactions.forEach((tx) => {
      txSheet.addRow({
        id: tx.id,
        date: tx.createdAt.toLocaleString('id-ID'),
        email: tx.user.email,
        name: tx.user.name ?? '-',
        type: tx.type.replace(/_/g, ' '),
        tier: tx.tier ?? '-',
        payment: tx.paymentMethod ?? '-',
        amount: tx.amount,
        status: tx.status,
        midtransId: tx.midtransId ?? '-',
        slug: tx.invitation?.slug ?? '-',
      });
    });
    txSheet.getColumn('amount').numFmt = formatRp;

    // ==========================================
    // SHEET 2: PENGGUNA
    // ==========================================
    const userSheet = workbook.addWorksheet('Data Pengguna');
    userSheet.columns = [
      { header: 'ID Pengguna', key: 'id', width: 30 },
      { header: 'Nama', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Role', key: 'role', width: 15 },
      { header: 'Total Undangan', key: 'invCount', width: 18 },
      { header: 'Total Belanja (Rp)', key: 'spent', width: 20 },
      { header: 'Tanggal Daftar', key: 'date', width: 20 },
    ];

    users.forEach((u) => {
      userSheet.addRow({
        id: u.id,
        name: u.name ?? '-',
        email: u.email,
        role: u.role,
        invCount: u._count.invitations,
        spent: u.transactions.reduce((sum, t) => sum + t.amount, 0),
        date: u.createdAt.toLocaleString('id-ID'),
      });
    });
    userSheet.getColumn('spent').numFmt = formatRp;

    // ==========================================
    // SHEET 3: UNDANGAN
    // ==========================================
    const invSheet = workbook.addWorksheet('Data Undangan');
    invSheet.columns = [
      { header: 'Slug', key: 'slug', width: 25 },
      { header: 'Mempelai Pria', key: 'groom', width: 20 },
      { header: 'Mempelai Wanita', key: 'bride', width: 20 },
      { header: 'Email Pemilik', key: 'email', width: 30 },
      { header: 'Paket', key: 'tier', width: 15 },
      { header: 'Dilihat', key: 'views', width: 12 },
      { header: 'RSVP Hadir', key: 'rsvp', width: 15 },
      { header: 'Total Tamu', key: 'guests', width: 15 },
      { header: 'Tanggal Event', key: 'eventDate', width: 20 },
      { header: 'Dibuat Pada', key: 'date', width: 20 },
    ];

    invitations.forEach((inv) => {
      invSheet.addRow({
        slug: inv.slug,
        groom: inv.groomName,
        bride: inv.brideName,
        email: inv.user.email,
        tier: inv.tier,
        views: inv.viewCount,
        rsvp: inv.guests.length,
        guests: inv._count.guests,
        eventDate: inv.eventDate.toLocaleDateString('id-ID'),
        date: inv.createdAt.toLocaleString('id-ID'),
      });
    });

    // ── Global Styling untuk Header ──
    workbook.eachSheet((sheet) => {
      // Freeze baris pertama (header)
      sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];
      
      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE11D48' }, // Rose 600
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headerRow.height = 25;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer as any);
  },
};
