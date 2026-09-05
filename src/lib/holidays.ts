export interface Holiday {
  name: string;
  isoDate: string; // "YYYY-MM-DD"
  type: "National" | "Gazetted" | "Restricted";
  day?: string;
  color?: string;
}

export interface UpcomingHoliday extends Holiday {
  date: string; // e.g. "Oct 2, 2026"
  day: string;  // e.g. "Friday"
  daysRemaining: number;
}

export const MASTER_HOLIDAYS: Holiday[] = [
  // 2025
  { name: "New Year's Day", isoDate: "2025-01-01", type: "Restricted", color: "bg-blue-500" },
  { name: "Republic Day", isoDate: "2025-01-26", type: "National", color: "bg-primary/100" },
  { name: "Maha Shivratri", isoDate: "2025-02-26", type: "Gazetted", color: "bg-purple-500" },
  { name: "Holi", isoDate: "2025-03-14", type: "Gazetted", color: "bg-pink-500" },
  { name: "Eid-ul-Fitr", isoDate: "2025-03-31", type: "Gazetted", color: "bg-emerald-500" },
  { name: "Mahavir Jayanti", isoDate: "2025-04-10", type: "Gazetted", color: "bg-amber-500" },
  { name: "Good Friday", isoDate: "2025-04-18", type: "Gazetted", color: "bg-sky-500" },
  { name: "Buddha Purnima", isoDate: "2025-05-12", type: "Gazetted", color: "bg-yellow-500" },
  { name: "Bakrid / Eid al-Adha", isoDate: "2025-06-07", type: "Gazetted", color: "bg-emerald-500" },
  { name: "Muharram", isoDate: "2025-07-06", type: "Gazetted", color: "bg-teal-500" },
  { name: "Independence Day", isoDate: "2025-08-15", type: "National", color: "bg-primary/100" },
  { name: "Janmashtami", isoDate: "2025-08-16", type: "Gazetted", color: "bg-indigo-500" },
  { name: "Milad un-Nabi", isoDate: "2025-09-05", type: "Gazetted", color: "bg-emerald-500" },
  { name: "Gandhi Jayanti", isoDate: "2025-10-02", type: "National", color: "bg-primary/100" },
  { name: "Dussehra", isoDate: "2025-10-02", type: "National", color: "bg-amber-500" },
  { name: "Diwali", isoDate: "2025-10-20", type: "National", color: "bg-yellow-500" },
  { name: "Guru Nanak Jayanti", isoDate: "2025-11-05", type: "Gazetted", color: "bg-orange-500" },
  { name: "Christmas", isoDate: "2025-12-25", type: "National", color: "bg-emerald-500" },

  // 2026
  { name: "New Year's Day", isoDate: "2026-01-01", type: "Restricted", color: "bg-blue-500" },
  { name: "Makar Sankranti / Pongal", isoDate: "2026-01-14", type: "Restricted", color: "bg-amber-500" },
  { name: "Republic Day", isoDate: "2026-01-26", type: "National", color: "bg-primary/100" },
  { name: "Maha Shivratri", isoDate: "2026-02-15", type: "Gazetted", color: "bg-purple-500" },
  { name: "Holi", isoDate: "2026-03-04", type: "Gazetted", color: "bg-pink-500" },
  { name: "Eid-ul-Fitr", isoDate: "2026-03-20", type: "Gazetted", color: "bg-emerald-500" },
  { name: "Mahavir Jayanti", isoDate: "2026-03-31", type: "Gazetted", color: "bg-amber-500" },
  { name: "Good Friday", isoDate: "2026-04-03", type: "Gazetted", color: "bg-sky-500" },
  { name: "Buddha Purnima", isoDate: "2026-05-01", type: "Gazetted", color: "bg-yellow-500" },
  { name: "Bakrid / Eid al-Adha", isoDate: "2026-05-27", type: "Gazetted", color: "bg-emerald-500" },
  { name: "Muharram", isoDate: "2026-06-26", type: "Gazetted", color: "bg-teal-500" },
  { name: "Independence Day", isoDate: "2026-08-15", type: "National", color: "bg-primary/100" },
  { name: "Raksha Bandhan", isoDate: "2026-08-28", type: "Restricted", color: "bg-red-500" },
  { name: "Janmashtami", isoDate: "2026-09-04", type: "Gazetted", color: "bg-indigo-500" },
  { name: "Milad un-Nabi (Id-e-Milad)", isoDate: "2026-09-25", type: "Gazetted", color: "bg-emerald-500" },
  { name: "Gandhi Jayanti", isoDate: "2026-10-02", type: "National", color: "bg-primary/100" },
  { name: "Dussehra", isoDate: "2026-10-20", type: "National", color: "bg-amber-500" },
  { name: "Diwali (Deepavali)", isoDate: "2026-11-08", type: "National", color: "bg-yellow-500" },
  { name: "Govardhan Puja / Bhai Dooj", isoDate: "2026-11-10", type: "Restricted", color: "bg-orange-500" },
  { name: "Guru Nanak Jayanti", isoDate: "2026-11-24", type: "Gazetted", color: "bg-orange-500" },
  { name: "Christmas", isoDate: "2026-12-25", type: "National", color: "bg-emerald-500" },

  // 2027
  { name: "New Year's Day", isoDate: "2027-01-01", type: "Restricted", color: "bg-blue-500" },
  { name: "Makar Sankranti / Pongal", isoDate: "2027-01-14", type: "Restricted", color: "bg-amber-500" },
  { name: "Republic Day", isoDate: "2027-01-26", type: "National", color: "bg-primary/100" },
  { name: "Maha Shivratri", isoDate: "2027-03-06", type: "Gazetted", color: "bg-purple-500" },
  { name: "Eid-ul-Fitr", isoDate: "2027-03-10", type: "Gazetted", color: "bg-emerald-500" },
  { name: "Holi", isoDate: "2027-03-22", type: "Gazetted", color: "bg-pink-500" },
  { name: "Good Friday", isoDate: "2027-03-26", type: "Gazetted", color: "bg-sky-500" },
  { name: "Mahavir Jayanti", isoDate: "2027-04-19", type: "Gazetted", color: "bg-amber-500" },
  { name: "Buddha Purnima", isoDate: "2027-05-20", type: "Gazetted", color: "bg-yellow-500" },
  { name: "Bakrid / Eid al-Adha", isoDate: "2027-05-17", type: "Gazetted", color: "bg-emerald-500" },
  { name: "Muharram", isoDate: "2027-06-16", type: "Gazetted", color: "bg-teal-500" },
  { name: "Independence Day", isoDate: "2027-08-15", type: "National", color: "bg-primary/100" },
  { name: "Raksha Bandhan", isoDate: "2027-08-16", type: "Restricted", color: "bg-red-500" },
  { name: "Janmashtami", isoDate: "2027-08-24", type: "Gazetted", color: "bg-indigo-500" },
  { name: "Milad un-Nabi", isoDate: "2027-09-15", type: "Gazetted", color: "bg-emerald-500" },
  { name: "Gandhi Jayanti", isoDate: "2027-10-02", type: "National", color: "bg-primary/100" },
  { name: "Dussehra", isoDate: "2027-10-09", type: "National", color: "bg-amber-500" },
  { name: "Diwali", isoDate: "2027-10-29", type: "National", color: "bg-yellow-500" },
  { name: "Bhai Dooj", isoDate: "2027-10-31", type: "Restricted", color: "bg-orange-500" },
  { name: "Guru Nanak Jayanti", isoDate: "2027-11-14", type: "Gazetted", color: "bg-orange-500" },
  { name: "Christmas", isoDate: "2027-12-25", type: "National", color: "bg-emerald-500" },
];

/**
 * Returns upcoming holidays filtered from the given date (default: today).
 * Automatically formats date, day of week, and calculates days remaining.
 */
export function getUpcomingHolidays(limit = 4, refDate = new Date()): UpcomingHoliday[] {
  const todayStr = refDate.toISOString().split("T")[0];
  const refTime = new Date(todayStr).getTime();

  const sortedHolidays = [...MASTER_HOLIDAYS].sort((a, b) => a.isoDate.localeCompare(b.isoDate));
  const upcoming = sortedHolidays.filter((h) => h.isoDate >= todayStr);

  return upcoming.slice(0, limit).map((h) => {
    const hDate = new Date(h.isoDate + "T00:00:00");
    const diffMs = hDate.getTime() - refTime;
    const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    const formattedDate = hDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const dayName = hDate.toLocaleDateString("en-US", { weekday: "long" });

    return {
      ...h,
      date: formattedDate,
      day: dayName,
      daysRemaining,
    };
  });
}
