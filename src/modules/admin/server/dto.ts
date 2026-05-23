// ============================================================
// Admin Module — DTOs (Data Transfer Objects)
// ============================================================

export interface AdminMetricsDto {
  totalUsers: number;
  totalInvitations: number;
  totalRevenue: number;           // Rp — sum of SUCCESS transactions
  paidInvitations: number;        // tier !== DRAFT
  draftInvitations: number;       // tier === DRAFT
  conversionRate: number;         // paidInvitations / totalInvitations * 100
  avgRevenuePerUser: number;      // totalRevenue / totalUsers
  newUsersThisMonth: number;
  newRevenueThisMonth: number;
  pendingTransactions: number;
}

export interface AdminChartDataPoint {
  date: string;     // ISO date string "YYYY-MM-DD"
  value: number;
}

export interface AdminTierDistribution {
  tier: string;
  count: number;
  percentage: number;
}

export interface AdminTransactionDto {
  id: string;
  userId: string;
  invitationId: string | null;
  amount: number;
  type: string;
  status: string;
  tier: string | null;
  paymentMethod: string | null;
  midtransId: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string | null;
    email: string | null;
  };
  invitation: {
    groomName: string;
    brideName: string;
    slug: string;
  } | null;
}

export interface AdminUserDto {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
  totalSpent: number;
  invitationCount: number;
}

export interface AdminInvitationDto {
  id: string;
  groomName: string;
  brideName: string;
  slug: string;
  tier: string;
  layout: string;
  viewCount: number;
  aiRegenCount: number;
  eventDate: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
  };
  guestCount: number;
  rsvpAttending: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
