"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Search,
  Loader2,
  MessageCircle,
  ChevronDown,
  Heart,
} from "lucide-react";

interface GuestData {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  rsvpStatus: string;
  message: string | null;
  attendees: number;
  checkedIn: boolean;
  createdAt: string;
}

type FilterType = "ALL" | "ATTENDING" | "NOT_ATTENDING" | "PENDING";

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  ATTENDING: {
    label: "Hadir",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
  },
  NOT_ATTENDING: {
    label: "Tidak Hadir",
    bg: "bg-rose-50",
    text: "text-rose-600",
    dot: "bg-rose-400",
  },
  PENDING: {
    label: "Menunggu",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
  },
};

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function ClientGuestsPage() {
  const [guests, setGuests] = useState<GuestData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/client/dashboard")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setGuests(json.data.guests || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredGuests = guests
    .filter((g) => (filter === "ALL" ? true : g.rsvpStatus === filter))
    .filter((g) =>
      search.trim()
        ? g.name.toLowerCase().includes(search.toLowerCase()) ||
          g.email?.toLowerCase().includes(search.toLowerCase()) ||
          g.phone?.includes(search)
        : true
    );

  const counts = {
    all: guests.length,
    attending: guests.filter((g) => g.rsvpStatus === "ATTENDING").length,
    notAttending: guests.filter((g) => g.rsvpStatus === "NOT_ATTENDING").length,
    pending: guests.filter((g) => g.rsvpStatus === "PENDING").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-[#2c2a29] tracking-tight">
          Daftar Tamu
        </h1>
        <p className="text-sm text-[#8c8885] mt-1">
          Pantau RSVP dan ucapan dari para tamu undangan Anda.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          {
            key: "ALL" as FilterType,
            label: "Semua",
            count: counts.all,
            icon: Users,
          },
          {
            key: "ATTENDING" as FilterType,
            label: "Hadir",
            count: counts.attending,
            icon: UserCheck,
          },
          {
            key: "NOT_ATTENDING" as FilterType,
            label: "Tidak Hadir",
            count: counts.notAttending,
            icon: UserX,
          },
          {
            key: "PENDING" as FilterType,
            label: "Menunggu",
            count: counts.pending,
            icon: Clock,
          },
        ].map(({ key, label, count, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              filter === key
                ? "bg-[#2c2a29] text-white shadow-sm"
                : "bg-white text-[#5c5957] border border-[#f0ebe1] hover:bg-[#faf8f5]"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            <span
              className={`ml-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                filter === key
                  ? "bg-white/20 text-white"
                  : "bg-[#faf8f5] text-[#8c8885]"
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c8885]" />
        <input
          type="text"
          placeholder="Cari nama, email, atau telepon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#f0ebe1] bg-white text-sm text-[#2c2a29] placeholder:text-[#c4c0ba] focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 outline-none transition-all"
        />
      </div>

      {/* Guest List */}
      {filteredGuests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#f0ebe1]">
          <Heart className="h-10 w-10 text-[#e8e4db] mx-auto mb-3" />
          <p className="text-sm text-[#8c8885] font-medium">
            {search.trim()
              ? "Tidak ada tamu yang cocok dengan pencarian."
              : "Belum ada tamu yang terdaftar."}
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-2.5"
        >
          {filteredGuests.map((guest) => {
            const config = statusConfig[guest.rsvpStatus] || statusConfig.PENDING;
            const isExpanded = expandedId === guest.id;

            return (
              <motion.div
                key={guest.id}
                variants={itemVariants}
                className="bg-white rounded-2xl border border-[#f0ebe1] overflow-hidden hover:shadow-md hover:shadow-[#f0ebe1]/50 transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : guest.id)}
                  className="w-full flex items-center gap-3 sm:gap-4 p-4 text-left"
                >
                  {/* Avatar */}
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-rose-300 to-pink-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                    {guest.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#2c2a29] truncate">
                      {guest.name}
                    </p>
                    <p className="text-xs text-[#8c8885] truncate">
                      {guest.email || guest.phone || "—"}
                    </p>
                  </div>

                  {/* Status + Attendees */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {guest.rsvpStatus === "ATTENDING" && (
                      <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-lg hidden sm:block">
                        {guest.attendees} orang
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${config.bg} ${config.text}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                      {config.label}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#c4c0ba] transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-[#f0ebe1]"
                  >
                    <div className="p-4 bg-[#faf8f5]/50 space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="font-semibold text-[#8c8885] uppercase tracking-wider block mb-0.5">
                            Email
                          </span>
                          <span className="text-[#2c2a29]">
                            {guest.email || "—"}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-[#8c8885] uppercase tracking-wider block mb-0.5">
                            Telepon
                          </span>
                          <span className="text-[#2c2a29]">
                            {guest.phone || "—"}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-[#8c8885] uppercase tracking-wider block mb-0.5">
                            Jumlah Tamu
                          </span>
                          <span className="text-[#2c2a29]">
                            {guest.attendees} orang
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-[#8c8885] uppercase tracking-wider block mb-0.5">
                            Check-in
                          </span>
                          <span
                            className={
                              guest.checkedIn
                                ? "text-emerald-600 font-semibold"
                                : "text-[#8c8885]"
                            }
                          >
                            {guest.checkedIn ? "✓ Sudah" : "Belum"}
                          </span>
                        </div>
                      </div>

                      {guest.message && (
                        <div className="flex gap-2.5 p-3 rounded-xl bg-white border border-[#f0ebe1]">
                          <MessageCircle className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-[#5c5957] leading-relaxed italic">
                            "{guest.message}"
                          </p>
                        </div>
                      )}

                      <p className="text-[10px] text-[#c4c0ba]">
                        RSVP pada{" "}
                        {new Date(guest.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Summary Footer */}
      {filteredGuests.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-xs text-[#8c8885]">
            Menampilkan {filteredGuests.length} dari {guests.length} tamu
          </p>
        </div>
      )}
    </section>
  );
}
