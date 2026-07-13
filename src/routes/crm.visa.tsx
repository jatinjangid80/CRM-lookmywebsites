import { createFileRoute } from '@tanstack/react-router'
import { useState, Fragment, useMemo } from "react";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { toast } from "sonner";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  Stamp,
  Edit,
  Trash2,
  Globe,
  FileSpreadsheet,
  ShieldCheck,
  Check,
  ChevronsUpDown,
  Download,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

const BRAND_STYLE = { background: "var(--gradient-brand)" };

function initials(n: string) {
  if (!n) return "";
  return n
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-600 border-blue-200",
  "bg-purple-100 text-purple-600 border-purple-200",
  "bg-green-100 text-green-600 border-green-200",
  "bg-orange-100 text-orange-600 border-orange-200",
  "bg-pink-100 text-pink-600 border-pink-200",
  "bg-indigo-100 text-indigo-600 border-indigo-200",
  "bg-rose-100 text-rose-600 border-rose-200",
  "bg-teal-100 text-teal-600 border-teal-200"
];

function getAvatarColor(name: string) {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export const Route = createFileRoute("/crm/visa")({ component: VisaPage });

/* ─── Types ─── */
type VisaStatus = "Pending Documents" | "Documents Complete" | "Submitted" | "Under Review" | "Approved" | "Rejected";

interface VisaDoc {
  name: string;
  received: boolean;
}
interface VisaApp {
  id: string;
  customer: string;
  phone?: string;
  email?: string;
  avatar: string;
  country: string;
  flag: string;
  visaType: string;
  appliedOn: string;
  travelDate: string;
  status: VisaStatus;
  embassyRef?: string;
  docs: VisaDoc[];
}


const STATUS_STYLE: Record<VisaStatus, string> = {
  "Pending Documents": "bg-amber-100 text-amber-700",
  "Documents Complete": "bg-cyan-100 text-cyan-700",
  Submitted: "bg-blue-100 text-blue-700",
  "Under Review": "bg-violet-100 text-violet-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
};

const STATUS_ICON: Record<VisaStatus, React.ReactNode> = {
  "Pending Documents": <AlertTriangle className="h-3.5 w-3.5" />,
  "Documents Complete": <ShieldCheck className="h-3.5 w-3.5" />,
  Submitted: <Clock className="h-3.5 w-3.5" />,
  "Under Review": <FileText className="h-3.5 w-3.5" />,
  Approved: <CheckCircle2 className="h-3.5 w-3.5" />,
  Rejected: <XCircle className="h-3.5 w-3.5" />,
};

const ALL_STATUSES: VisaStatus[] = [
  "Pending Documents",
  "Documents Complete",
  "Submitted",
  "Under Review",
  "Approved",
  "Rejected",
];

const APPS: VisaApp[] = [];

const COUNTRY_CODES: Record<string, string> = {
  Afghanistan: "af",
  Albania: "al",
  Algeria: "dz",
  Andorra: "ad",
  Angola: "ao",
  "Antigua and Barbuda": "ag",
  Argentina: "ar",
  Armenia: "am",
  Australia: "au",
  Austria: "at",
  Azerbaijan: "az",
  Bahamas: "bs",
  Bahrain: "bh",
  Bangladesh: "bd",
  Barbados: "bb",
  Belarus: "by",
  Belgium: "be",
  Belize: "bz",
  Benin: "bj",
  Bhutan: "bt",
  Bolivia: "bo",
  "Bosnia and Herzegovina": "ba",
  Botswana: "bw",
  Brazil: "br",
  Brunei: "bn",
  Bulgaria: "bg",
  "Burkina Faso": "bf",
  Burundi: "bi",
  "Cabo Verde": "cv",
  Cambodia: "kh",
  Cameroon: "cm",
  Canada: "ca",
  "Central African Republic": "cf",
  Chad: "td",
  Chile: "cl",
  China: "cn",
  Colombia: "co",
  Comoros: "km",
  Congo: "cg",
  "Costa Rica": "cr",
  Croatia: "hr",
  Cuba: "cu",
  Cyprus: "cy",
  Czechia: "cz",
  Denmark: "dk",
  Djibouti: "dj",
  Dominica: "dm",
  "Dominican Republic": "do",
  Ecuador: "ec",
  Egypt: "eg",
  "El Salvador": "sv",
  "Equatorial Guinea": "gq",
  Eritrea: "er",
  Estonia: "ee",
  Eswatini: "sz",
  Ethiopia: "et",
  Fiji: "fj",
  Finland: "fi",
  France: "fr",
  "France / Schengen": "fr",
  Gabon: "ga",
  Gambia: "gm",
  Georgia: "ge",
  Germany: "de",
  Ghana: "gh",
  Greece: "gr",
  Grenada: "gd",
  Guatemala: "gt",
  Guinea: "gn",
  "Guinea-Bissau": "gw",
  Guyana: "gy",
  Haiti: "ht",
  Honduras: "hn",
  Hungary: "hu",
  Iceland: "is",
  India: "in",
  Indonesia: "id",
  Iran: "ir",
  Iraq: "iq",
  Ireland: "ie",
  Israel: "il",
  Italy: "it",
  Jamaica: "jm",
  Japan: "jp",
  Jordan: "jo",
  Kazakhstan: "kz",
  Kenya: "ke",
  Kiribati: "ki",
  Kuwait: "kw",
  Kyrgyzstan: "kg",
  Laos: "la",
  Latvia: "lv",
  Lebanon: "lb",
  Lesotho: "ls",
  Liberia: "lr",
  Libya: "ly",
  Liechtenstein: "li",
  Lithuania: "lt",
  Luxembourg: "lu",
  Madagascar: "mg",
  Malawi: "mw",
  Malaysia: "my",
  Maldives: "mv",
  Mali: "ml",
  Malta: "mt",
  "Marshall Islands": "mh",
  Mauritania: "mr",
  Mauritius: "mu",
  Mexico: "mx",
  Micronesia: "fm",
  Moldova: "md",
  Monaco: "mc",
  Mongolia: "mn",
  Montenegro: "me",
  Morocco: "ma",
  Mozambique: "mz",
  Myanmar: "mm",
  Namibia: "na",
  Nauru: "nr",
  Nepal: "np",
  Netherlands: "nl",
  "New Zealand": "nz",
  Nicaragua: "ni",
  Niger: "ne",
  Nigeria: "ng",
  "North Korea": "kp",
  "North Macedonia": "mk",
  Norway: "no",
  Oman: "om",
  Pakistan: "pk",
  Palau: "pw",
  Palestine: "ps",
  Panama: "pa",
  "Papua New Guinea": "pg",
  Paraguay: "py",
  Peru: "pe",
  Philippines: "ph",
  Poland: "pl",
  Portugal: "pt",
  Qatar: "qa",
  Romania: "ro",
  Russia: "ru",
  Rwanda: "rw",
  "Saint Kitts and Nevis": "kn",
  "Saint Lucia": "lc",
  "Saint Vincent and the Grenadines": "vc",
  Samoa: "ws",
  "San Marino": "sm",
  "Sao Tome and Principe": "st",
  "Saudi Arabia": "sa",
  Senegal: "sn",
  Serbia: "rs",
  Seychelles: "sc",
  "Sierra Leone": "sl",
  Singapore: "sg",
  Slovakia: "sk",
  Slovenia: "si",
  "Solomon Islands": "sb",
  Somalia: "so",
  "South Africa": "za",
  "South Korea": "kr",
  "South Sudan": "ss",
  Spain: "es",
  "Sri Lanka": "lk",
  Sudan: "sd",
  Suriname: "sr",
  Sweden: "se",
  Switzerland: "ch",
  Syria: "sy",
  Taiwan: "tw",
  Tajikistan: "tj",
  Tanzania: "tz",
  Thailand: "th",
  "Timor-Leste": "tl",
  Togo: "tg",
  Tonga: "to",
  "Trinidad and Tobago": "tt",
  Tunisia: "tn",
  Turkey: "tr",
  Turkmenistan: "tm",
  Tuvalu: "tv",
  UAE: "ae",
  Uganda: "ug",
  Ukraine: "ua",
  "United Kingdom": "gb",
  "United States": "us",
  Uruguay: "uy",
  Uzbekistan: "uz",
  Vanuatu: "vu",
  "Vatican City": "va",
  Venezuela: "ve",
  Vietnam: "vn",
  Yemen: "ye",
  Zambia: "zm",
  Zimbabwe: "zw",
};

const COUNTRIES_LIST = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "France / Schengen",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "UAE",
  "Uganda",
  "Ukraine",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];
const VISA_TYPES_LIST = [
  "Tourist – Visa on Arrival",
  "Schengen Tourist",
  "Free 30-day on Arrival",
  "Tourist e-Visa",
  "30-day Tourist Visa",
  "14-day Tourist Visa",
  "Business Visa",
  "Student Visa",
  "Transit Visa",
  "Multiple Entry Tourist Visa",
];
const CURRENCY_LIST = ["INR", "USD", "EUR", "AED", "SGD", "THB", "GBP", "IDR"];

function VisaPage() {
  const [apps, setApps] = useSupabaseTable<VisaApp[]>("visa_apps", APPS);
  const [customers] = useSupabaseTable<any[]>("customers", []);

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<VisaStatus | "All">("All");
  const [countryFilter, setCountryFilter] = useState("All Destinations");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const uniqueCountries = useMemo(() => {
    return Array.from(new Set((apps || []).map((a) => a.country).filter(Boolean))).sort();
  }, [apps]);
  const [deleteAppTargetId, setDeleteAppTargetId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Visa Application Form state
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [appCustomer, setAppCustomer] = useState("");
  const [appCustomerPhone, setAppCustomerPhone] = useState("");
  const [appCustomerEmail, setAppCustomerEmail] = useState("");
  const [appCountry, setAppCountry] = useState("");
  const [appVisaType, setAppVisaType] = useState("");

  const [appTravelDate, setAppTravelDate] = useState("");

  const getFlagEmoji = (countryName: string) => {
    const flags: Record<string, string> = {
      Indonesia: "🇮🇩",
      France: "🇫🇷",
      "France / Schengen": "🇫🇷",
      Maldives: "🇲🇻",
      Singapore: "🇸🇬",
      UAE: "🇦🇪",
      Thailand: "🇹🇭",
      "United Kingdom": "🇬🇧",
      "United States": "🇺🇸",
      Canada: "🇨🇦",
      Australia: "🇦🇺",
      Germany: "🇩🇪",
      Italy: "🇮🇹",
      Spain: "🇪🇸",
      Japan: "🇯🇵",
      Switzerland: "🇨🇭",
      Vietnam: "🇻🇳",
      Malaysia: "🇲🇾",
    };
    return flags[countryName] || "🏳️";
  };

  const getRandomAvatar = () => {
    const avatars = [
      "/avatars/aman.jpeg",
      "/avatars/deepak.jpeg",
      "/avatars/manvendra.png",
      "/avatars/nikita.jpeg",
      "/avatars/pushplata.png",
      "/avatars/suman.jpeg",
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appCustomer || !appCountry || !appVisaType || !appTravelDate) return;

    const initialDocs = [
      { name: "Passport copy (front & back)", received: false },
      { name: "Passport-size photo", received: false },
      { name: "Flight tickets", received: false },
      { name: "Hotel bookings", received: false },
    ];

    const nextNumber = (apps?.length || 0) + 1;
    const newIdStr = String(nextNumber).padStart(3, '0');

    const newApp: VisaApp = {
      id: `V-${newIdStr}`,
      customer: appCustomer,
      phone: appCustomerPhone,
      email: appCustomerEmail,
      avatar: getRandomAvatar(),
      country: appCountry,
      flag: getFlagEmoji(appCountry),
      visaType: appVisaType,
      appliedOn: new Date()
        .toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .toUpperCase(),
      travelDate: appTravelDate,
      status: "Pending Documents",
      embassyRef: undefined,
      docs: initialDocs,
    };

    setApps((prev) => [newApp, ...prev]);
    setAppModalOpen(false);

    // Reset Form
    setAppCustomer("");
    setAppCustomerPhone("");
    setAppCustomerEmail("");
    setAppCountry("");
    setAppVisaType("");

    setAppTravelDate("");
  };

  const safeApps = apps || [];

  const baseForCounts = safeApps.filter(
    (a) => countryFilter === "All Destinations" || a.country === countryFilter
  );

  const counts: Record<string, number> = { All: baseForCounts.length };
  ALL_STATUSES.forEach((s) => {
    counts[s] = baseForCounts.filter((a) => a.status === s).length;
  });

  const filteredApps = safeApps.filter(
    (a) =>
      (filter === "All" || a.status === filter) &&
      (countryFilter === "All Destinations" || a.country === countryFilter)
  );

  const confirmDeleteApp = () => {
    if (deleteAppTargetId) {
      setApps(apps.filter((a) => a.id !== deleteAppTargetId));
      setDeleteAppTargetId(null);
      toast.success("Application deleted successfully");
    }
  };

  const toggleDoc = (appId: string, docName: string) => {
    setApps(
      apps.map((app) => {
        if (app.id === appId) {
          const newDocs = app.docs.map((doc) =>
            doc.name === docName ? { name: doc.name, received: !doc.received } : doc,
          );

          const allDocsReceived = newDocs.every((d) => d.received);
          let newStatus = app.status;

          if (allDocsReceived && app.status === "Pending Documents") {
            newStatus = "Documents Complete";
          } else if (!allDocsReceived && app.status === "Documents Complete") {
            newStatus = "Pending Documents";
          }

          return {
            ...app,
            docs: newDocs,
            status: newStatus,
          };
        }
        return app;
      }),
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">Visa Applications</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track customer visa applications.</p>
        </div>
        <Button onClick={() => setAppModalOpen(true)} className="gap-2 rounded-xl" style={BRAND_STYLE}>
          <Plus className="h-4 w-4" /> New Application
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-4 pb-4">
        <div className="flex-shrink-0">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="appearance-none h-10 w-[240px] rounded-full border border-[#e4d4c8] bg-white px-5 py-2 text-sm font-semibold text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#863711]/20 cursor-pointer hover:bg-[#fafafa] transition-colors"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231e293b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 16px center',
              backgroundSize: '16px'
            }}
          >
            {["All", ...ALL_STATUSES].map((s) => (
              <option key={s} value={s}>
                {s} ({counts[s] || 0})
              </option>
            ))}
          </select>
        </div>

        <div className="flex-shrink-0">
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="appearance-none h-10 w-[180px] rounded-full border border-[#e4d4c8] bg-white px-5 py-2 text-sm font-semibold text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#863711]/20 cursor-pointer hover:bg-[#fafafa] transition-colors"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231e293b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 16px center',
              backgroundSize: '16px'
            }}
          >
            <option value="All Destinations">All Destinations</option>
            {uniqueCountries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">Visa Type</th>
                <th className="px-6 py-4">Travel Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No visa applications found.
                  </td>
                </tr>
              ) : (
                filteredApps
                  .map((app) => (
                    <Fragment key={app.id}>
                      <tr onClick={() => setExpanded(expanded === app.id ? null : app.id)} className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${getAvatarColor(app.customer)}`}>
                              {initials(app.customer)}
                            </div>
                            <div>
                              <div className="font-medium">{app.customer}</div>
                              <div className="text-xs text-muted-foreground">{app.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span>{app.flag}</span>
                            <span>{app.country}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                            {app.visaType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{app.travelDate}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[app.status]}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={(e) => { e.stopPropagation(); setDeleteAppTargetId(app.id); }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                      {expanded === app.id && (
                        <tr>
                          <td colSpan={6} className="p-0 border-b border-border bg-[#fcfbf9]">
                            <div className="p-6">
                              <div className="flex flex-col lg:flex-row gap-8">

                                {/* Left side: Application Details Form */}
                                <div className="w-full lg:w-[350px] shrink-0 rounded-2xl border border-border bg-white p-5 shadow-sm">
                                  <h4 className="text-[10px] font-bold text-muted-foreground tracking-wider mb-4 uppercase">Application Details</h4>
                                  <div className="space-y-4">
                                    <div>
                                      <label className="text-[11px] font-medium text-muted-foreground block mb-1.5">Visa Type</label>
                                      <Input defaultValue={app.visaType} readOnly className="h-9 text-xs rounded-xl" />
                                    </div>
                                    <div>
                                      <label className="text-[11px] font-medium text-muted-foreground block mb-1.5">Travel Date</label>
                                      <Input defaultValue={app.travelDate} readOnly className="h-9 text-xs rounded-xl" />
                                    </div>

                                    <div className="pt-4 flex items-center justify-between border-t border-border mt-6">
                                      <Button variant="outline" size="sm" className="h-9 px-4 text-red-500 border-red-200 hover:bg-red-50 rounded-xl" onClick={() => setDeleteAppTargetId(app.id)}>
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                      <Button size="sm" className="h-9 bg-[#1d82e1] hover:bg-blue-600 text-white px-8 rounded-xl font-medium">
                                        Save Changes
                                      </Button>
                                    </div>
                                  </div>
                                </div>

                                {/* Right side: Document Checklist */}
                                <div className="flex-1">
                                  <h4 className="text-[10px] font-bold text-muted-foreground tracking-wider mb-4 uppercase flex items-center gap-1.5">
                                    <Stamp className="w-3.5 h-3.5" /> Document Checklist
                                  </h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {app.docs.map(doc => (
                                      <div
                                        key={doc.name}
                                        onClick={() => toggleDoc(app.id, doc.name)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-full border cursor-pointer transition-colors ${doc.received
                                            ? "bg-emerald-50/30 border-emerald-200"
                                            : "bg-white border-emerald-100 hover:border-emerald-300"
                                          }`}
                                      >
                                        <div
                                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${doc.received
                                              ? "border-emerald-500 text-emerald-500"
                                              : "border-emerald-300 text-transparent"
                                            }`}
                                        >
                                          <Check className="w-2.5 h-2.5" />
                                        </div>
                                        <span className={`text-xs ${doc.received ? "text-foreground" : "text-muted-foreground"}`}>
                                          {doc.name}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <DeleteConfirmModal
        isOpen={deleteAppTargetId !== null}
        onClose={() => setDeleteAppTargetId(null)}
        onConfirm={confirmDeleteApp}
        title="Delete Visa Application"
        description="Are you sure you want to delete this customer's visa application? All checklist progress will be lost."
      />

      <Dialog open={appModalOpen} onOpenChange={setAppModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold">
              New Visa Application
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Add a new visa application track for a customer.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddApplication} className="space-y-4 py-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <select
                value={appCustomer}
                onChange={(e) => {
                  const custName = e.target.value;
                  setAppCustomer(custName);
                  const cust = customers.find(c => c.name === custName);
                  if (cust) {
                    setAppCustomerPhone(cust.phone || "");
                    setAppCustomerEmail(cust.email || "");
                  } else {
                    setAppCustomerPhone("");
                    setAppCustomerEmail("");
                  }
                }}
                required
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={appCountry}
                  onChange={(e) => setAppCountry(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Country</option>
                  {COUNTRIES_LIST.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Visa Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={appVisaType}
                  onChange={(e) => setAppVisaType(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Visa Type</option>
                  {VISA_TYPES_LIST.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Travel Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={appTravelDate}
                  onChange={(e) => setAppTravelDate(e.target.value)}
                  required
                  className="rounded-xl bg-background border-border"
                />
              </div>
            </div>

            <DialogFooter className="border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => setAppModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl" style={BRAND_STYLE}>
                Add Application
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
