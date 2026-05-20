"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Users,
  UserCheck,
  UserX,
  Clock,
  CalendarHeart,
  Heart,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalGuests: number;
  attending: number;
  notAttending: number;
  pending: number;
  totalAttendees: number;
  checkedIn: number;
  viewCount: number;
}

interface InvitationData {
  id: string;
  groomName: string;
  brideName: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  slug: string;
  tier: string;
  layout: string;
}

interface GuestData {
  id: string;
  name: string;
  rsvpStatus: string;
  message: string | null;
  attendees: number;
  createdAt: string;
}

interface ClientDashboardProps {
  invitation: InvitationData;
  stats: DashboardStats;
  guests: GuestData[];
}

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

function getCountdown(eventDate: string) {
  const now = new Date();
  const event = new Date(eventDate);
  const diff = event.getTime() - now.getTime();

  if (diff <= 0) return { days: 0, label: "Hari ini! 🎉" };

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return { days, label: `${days} hari lagi` };
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  iconBg,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  iconBg: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl border border-[#f0ebe1] p-5 hover:shadow-lg hover:shadow-[#f0ebe1]/50 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8c8885] mb-2">
            {label}
          </p>
          <p className={`text-3xl font-bold font-display ${color}`}>{value}</p>
        </div>
        <div
          className={`p-2.5 rounded-xl ${iconBg} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>
    </motion.div>
  );
}

export default function ClientDashboard({ invitation, stats, guests }: ClientDashboardProps) {
  const countdown = getCountdown(invitation.eventDate);
  const recentMessages = guests
    .filter((g) => g.message && g.message.trim().length > 0)
    .slice(0, 5);

  const eventDateFormatted = new Date(invitation.eventDate).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/[0.03] blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="bg-white rounded-3xl border border-[#f0ebe1] p-6 sm:p-8 shadow-sm overflow-hidden relative">
            {/* Subtle pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-rose-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                    Aktif
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#2c2a29] tracking-tight">
                  {invitation.groomName} & {invitation.brideName}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                  <span className="text-sm text-[#5c5957] flex items-center gap-1.5">
                    <CalendarHeart className="h-3.5 w-3.5 text-rose-400" />
                    {eventDateFormatted}
                  </span>
                  <span className="text-sm text-[#8c8885]">•</span>
                  <span className="text-sm text-[#5c5957]">{invitation.venueName}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <p className="text-xs font-semibold text-[#8c8885] uppercase tracking-wider">
                    Menuju Hari H
                  </p>
                  <p className="text-3xl font-display font-bold text-rose-500 mt-1">
                    {countdown.label}
                  </p>
                </div>
                <a
                  href={`/invitation/${invitation.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2c2a29] rounded-xl hover:bg-[#1a1918] transition-colors shadow-sm"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Lihat Undangan
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8"
        >
          <StatCard
            icon={Eye}
            label="Dilihat"
            value={stats.viewCount.toLocaleString()}
            color="text-blue-600"
            iconBg="bg-blue-50"
          />
          <StatCard
            icon={Users}
            label="Total Tamu"
            value={stats.totalGuests}
            color="text-[#2c2a29]"
            iconBg="bg-[#faf8f5]"
          />
          <StatCard
            icon={UserCheck}
            label="Hadir"
            value={stats.attending}
            color="text-emerald-600"
            iconBg="bg-emerald-50"
          />
          <StatCard
            icon={UserX}
            label="Tidak Hadir"
            value={stats.notAttending}
            color="text-rose-500"
            iconBg="bg-rose-50"
          />
        </motion.div>

        {/* Secondary Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl border border-[#f0ebe1] p-5"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-50">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#8c8885] uppercase tracking-wider">
                  Menunggu RSVP
                </p>
                <p className="text-xl font-bold text-amber-600">{stats.pending}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl border border-[#f0ebe1] p-5"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-violet-50">
                <Users className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#8c8885] uppercase tracking-wider">
                  Total Tamu Hadir
                </p>
                <p className="text-xl font-bold text-violet-600">{stats.totalAttendees} orang</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl border border-[#f0ebe1] p-5"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-50">
                <UserCheck className="h-5 w-5 text-teal-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#8c8885] uppercase tracking-wider">
                  Sudah Check-in
                </p>
                <p className="text-xl font-bold text-teal-600">{stats.checkedIn}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom: Recent Messages + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="lg:col-span-3 bg-white rounded-2xl border border-[#f0ebe1] p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-rose-400" />
                <h3 className="text-sm font-bold text-[#2c2a29] uppercase tracking-wider">
                  Ucapan Terbaru
                </h3>
              </div>
              <Link
                href="/client/guests"
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
              >
                Lihat Semua →
              </Link>
            </div>

            {recentMessages.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-8 w-8 text-[#e8e4db] mx-auto mb-2" />
                <p className="text-sm text-[#8c8885]">Belum ada ucapan dari tamu.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((guest) => (
                  <div
                    key={guest.id}
                    className="flex gap-3 p-3 rounded-xl bg-[#faf8f5]/70 hover:bg-[#faf8f5] transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-300 to-pink-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                      {guest.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#2c2a29] truncate">
                        {guest.name}
                      </p>
                      <p className="text-xs text-[#5c5957] line-clamp-2 mt-0.5 leading-relaxed">
                        {guest.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-[#f0ebe1] p-6"
          >
            <h3 className="text-sm font-bold text-[#2c2a29] uppercase tracking-wider mb-5">
              Akses Cepat
            </h3>
            <div className="space-y-2.5">
              <Link
                href="/client/details"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#faf8f5] hover:bg-rose-50 text-[#2c2a29] transition-colors group"
              >
                <Heart className="h-4 w-4 text-rose-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Edit Detail Undangan</span>
              </Link>
              <Link
                href="/client/guests"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#faf8f5] hover:bg-rose-50 text-[#2c2a29] transition-colors group"
              >
                <Users className="h-4 w-4 text-rose-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Lihat Daftar Tamu</span>
              </Link>
              <a
                href={`/invitation/${invitation.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#faf8f5] hover:bg-rose-50 text-[#2c2a29] transition-colors group"
              >
                <ExternalLink className="h-4 w-4 text-rose-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Buka Halaman Undangan</span>
              </a>
            </div>

            {/* Tier badge */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100">
              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1">
                Tier Undangan
              </p>
              <p className="text-lg font-display font-bold text-[#2c2a29]">
                {invitation.tier === "PREMIUM"
                  ? "Premium ✨"
                  : invitation.tier === "ULTIMATE"
                  ? "Ultimate 💎"
                  : invitation.tier === "BASIC"
                  ? "Basic"
                  : invitation.tier === "B2B_GENERATED"
                  ? "B2B Pro"
                  : "Draft"}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
