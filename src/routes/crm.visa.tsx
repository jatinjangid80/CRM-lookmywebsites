import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useLocalStorage } from "@/lib/use-local-storage";
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

export const Route = createFileRoute("/crm/visa")({ component: VisaPage });

/* ─── Types ─── */
type VisaStatus = "Pending Documents" | "Submitted" | "Under Review" | "Approved" | "Rejected";

interface VisaDoc {
  name: string;
  received: boolean;
}
interface VisaApp {
  id: string;
  customer: string;
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

interface VisaRequirement {
  id: string;
  country: string;
  visaType: string;
  docs: { name: string; shortName: string }[];
  formUrls: string[];
  currency: string;
  visaFees: number;
  vfsFees: number;
  otherFees: number;
  serviceFees: number;
  consulateFees: number;
  urgentFees: number;
  urgentFees2: number;
  extraName1: string;
  extraFees1: number;
  extraName2: string;
  extraFees2: number;
  extraName3: string;
  extraFees3: number;
  timeRequired: string;
  remark1: string;
  remark2: string;
  remark3: string;
  supportFiles?: { name: string; data: string; size: number }[];
}

/* ─── Mock data ─── */
const APPS: VisaApp[] = [];

const INITIAL_REQUIREMENTS: VisaRequirement[] = [];

const STATUS_STYLE: Record<VisaStatus, string> = {
  "Pending Documents": "bg-amber-100 text-amber-700",
  Submitted: "bg-blue-100 text-blue-700",
  "Under Review": "bg-violet-100 text-violet-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
};

const STATUS_ICON: Record<VisaStatus, React.ReactNode> = {
  "Pending Documents": <AlertTriangle className="h-3.5 w-3.5" />,
  Submitted: <Clock className="h-3.5 w-3.5" />,
  "Under Review": <FileText className="h-3.5 w-3.5" />,
  Approved: <CheckCircle2 className="h-3.5 w-3.5" />,
  Rejected: <XCircle className="h-3.5 w-3.5" />,
};

const ALL_STATUSES: VisaStatus[] = [
  "Pending Documents",
  "Submitted",
  "Under Review",
  "Approved",
  "Rejected",
];

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
  const [requirements, setRequirements] = useLocalStorage<VisaRequirement[]>(
    "crm_visa_requirements",
    INITIAL_REQUIREMENTS,
  );
  const [activeSubTab, setActiveSubTab] = useState<"applications" | "requirements">("applications");

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<VisaStatus | "All">("All");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteAppTargetId, setDeleteAppTargetId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Visa Application Form state
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [appCustomer, setAppCustomer] = useState("");
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

    const match = requirements.find(
      (r) =>
        r.country.toLowerCase() === appCountry.toLowerCase() &&
        r.visaType.toLowerCase() === appVisaType.toLowerCase(),
    );

    const initialDocs = match
      ? match.docs.map((d) => ({ name: d.name, received: false }))
      : [
          { name: "Passport copy (front & back)", received: false },
          { name: "Passport-size photo", received: false },
          { name: "Flight tickets", received: false },
          { name: "Hotel bookings", received: false },
        ];

    const newApp: VisaApp = {
      id: `V-${2200 + Math.floor(Math.random() * 1000)}`,
      customer: appCustomer,
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
    setAppCountry("");
    setAppVisaType("");

    setAppTravelDate("");
  };

  // Requirement configuration states
  const [reqFormMode, setReqFormMode] = useState<"list" | "add" | "edit">("list");
  const [editingReq, setEditingReq] = useState<VisaRequirement | null>(null);
  const [reqQ, setReqQ] = useState("");

  // Requirement form state
  const [formCountry, setFormCountry] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [formVisaType, setFormVisaType] = useState("");
  const [formDocs, setFormDocs] = useState<{ name: string; shortName: string }[]>([
    { name: "", shortName: "" },
  ]);
  const [formUrls, setFormUrls] = useState<string[]>([""]);
  const [formCurrency, setFormCurrency] = useState("INR");
  const [formVisaFees, setFormVisaFees] = useState("");
  const [formVfsFees, setFormVfsFees] = useState("");
  const [formOtherFees, setFormOtherFees] = useState("");
  const [formServiceFees, setFormServiceFees] = useState("");
  const [formConsulateFees, setFormConsulateFees] = useState("");
  const [formUrgentFees, setFormUrgentFees] = useState("");
  const [formUrgentFees2, setFormUrgentFees2] = useState("");
  const [formExtraName1, setFormExtraName1] = useState("");
  const [formExtraFees1, setFormExtraFees1] = useState("");
  const [formExtraName2, setFormExtraName2] = useState("");
  const [formExtraFees2, setFormExtraFees2] = useState("");
  const [formExtraName3, setFormExtraName3] = useState("");
  const [formExtraFees3, setFormExtraFees3] = useState("");
  const [formTimeRequired, setFormTimeRequired] = useState("");
  const [formRemark1, setFormRemark1] = useState("");
  const [formRemark2, setFormRemark2] = useState("");
  const [formRemark3, setFormRemark3] = useState("");
  const [formFiles, setFormFiles] = useState<{ name: string; data: string; size: number }[]>([]);

  const resetReqForm = () => {
    setFormCountry("");
    setFormVisaType("");
    setFormDocs([{ name: "", shortName: "" }]);
    setFormUrls([""]);
    setFormCurrency("INR");
    setFormVisaFees("");
    setFormVfsFees("");
    setFormOtherFees("");
    setFormServiceFees("");
    setFormConsulateFees("");
    setFormUrgentFees("");
    setFormUrgentFees2("");
    setFormExtraName1("");
    setFormExtraFees1("");
    setFormExtraName2("");
    setFormExtraFees2("");
    setFormExtraName3("");
    setFormExtraFees3("");
    setFormTimeRequired("");
    setFormRemark1("");
    setFormRemark2("");
    setFormRemark3("");
    setFormFiles([]);
    setEditingReq(null);
  };

  const handleOpenAddReq = () => {
    resetReqForm();
    setReqFormMode("add");
  };

  const handleOpenEditReq = (req: VisaRequirement) => {
    setEditingReq(req);
    setFormCountry(req.country);
    setFormVisaType(req.visaType);
    setFormDocs(req.docs.length > 0 ? req.docs : [{ name: "", shortName: "" }]);
    setFormUrls(req.formUrls.length > 0 ? req.formUrls : [""]);
    setFormCurrency(req.currency);
    setFormVisaFees(req.visaFees ? String(req.visaFees) : "");
    setFormVfsFees(req.vfsFees ? String(req.vfsFees) : "");
    setFormOtherFees(req.otherFees ? String(req.otherFees) : "");
    setFormServiceFees(req.serviceFees ? String(req.serviceFees) : "");
    setFormConsulateFees(req.consulateFees ? String(req.consulateFees) : "");
    setFormUrgentFees(req.urgentFees ? String(req.urgentFees) : "");
    setFormUrgentFees2(req.urgentFees2 ? String(req.urgentFees2) : "");
    setFormExtraName1(req.extraName1 || "");
    setFormExtraFees1(req.extraFees1 ? String(req.extraFees1) : "");
    setFormExtraName2(req.extraName2 || "");
    setFormExtraFees2(req.extraFees2 ? String(req.extraFees2) : "");
    setFormExtraName3(req.extraName3 || "");
    setFormExtraFees3(req.extraFees3 ? String(req.extraFees3) : "");
    setFormTimeRequired(req.timeRequired || "");
    setFormRemark1(req.remark1 || "");
    setFormRemark2(req.remark2 || "");
    setFormRemark3(req.remark3 || "");
    setFormFiles(req.supportFiles || []);
    setReqFormMode("edit");
  };

  const handleAddDocRow = () => {
    setFormDocs([...formDocs, { name: "", shortName: "" }]);
  };

  const handleRemoveDocRow = (idx: number) => {
    if (formDocs.length > 1) {
      setFormDocs(formDocs.filter((_, i) => i !== idx));
    }
  };

  const handleDocChange = (idx: number, field: "name" | "shortName", value: string) => {
    setFormDocs(
      formDocs.map((doc, i) =>
        i === idx ? { name: doc.name, shortName: doc.shortName, [field]: value } : doc,
      ),
    );
  };

  const handleAddUrlRow = () => {
    setFormUrls([...formUrls, ""]);
  };

  const handleRemoveUrlRow = (idx: number) => {
    if (formUrls.length > 1) {
      setFormUrls(formUrls.filter((_, i) => i !== idx));
    }
  };

  const handleUrlChange = (idx: number, value: string) => {
    setFormUrls(formUrls.map((url, i) => (i === idx ? value : url)));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormFiles((prev) => [
            ...prev,
            {
              name: file.name,
              data: event.target?.result as string,
              size: file.size,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveFile = (idx: number) => {
    setFormFiles(formFiles.filter((_, i) => i !== idx));
  };

  const handleSaveReq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCountry || !formVisaType) return;

    // Filter empty documents/URLs
    const cleanDocs = formDocs.filter((d) => d.name.trim() !== "");
    const cleanUrls = formUrls.filter((u) => u.trim() !== "");

    const newReq: VisaRequirement = {
      id: editingReq ? editingReq.id : `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      country: formCountry,
      visaType: formVisaType,
      docs: cleanDocs,
      formUrls: cleanUrls,
      currency: formCurrency,
      visaFees: Number(formVisaFees) || 0,
      vfsFees: Number(formVfsFees) || 0,
      otherFees: Number(formOtherFees) || 0,
      serviceFees: Number(formServiceFees) || 0,
      consulateFees: Number(formConsulateFees) || 0,
      urgentFees: Number(formUrgentFees) || 0,
      urgentFees2: Number(formUrgentFees2) || 0,
      extraName1: formExtraName1,
      extraFees1: Number(formExtraFees1) || 0,
      extraName2: formExtraName2,
      extraFees2: Number(formExtraFees2) || 0,
      extraName3: formExtraName3,
      extraFees3: Number(formExtraFees3) || 0,
      timeRequired: formTimeRequired,
      remark1: formRemark1,
      remark2: formRemark2,
      remark3: formRemark3,
      supportFiles: formFiles,
    };

    if (editingReq) {
      setRequirements(requirements.map((r) => (r.id === editingReq.id ? newReq : r)));
    } else {
      setRequirements([newReq, ...requirements]);
    }
    setReqFormMode("list");
    resetReqForm();
  };

  const handleDeleteReq = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      setRequirements(requirements.filter((r) => r.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  const confirmDeleteApp = () => {
    if (deleteAppTargetId) {
      setApps(apps.filter((a) => a.id !== deleteAppTargetId));
      setDeleteAppTargetId(null);
    }
  };

  const filteredApps = apps.filter(
    (a) =>
      (filter === "All" || a.status === filter) &&
      (q === "" ||
        a.customer.toLowerCase().includes(q.toLowerCase()) ||
        a.country.toLowerCase().includes(q.toLowerCase())),
  );

  const filteredReqs = requirements.filter(
    (r) =>
      reqQ === "" ||
      r.country.toLowerCase().includes(reqQ.toLowerCase()) ||
      r.visaType.toLowerCase().includes(reqQ.toLowerCase()),
  );

  const counts: Record<string, number> = { All: apps.length };
  ALL_STATUSES.forEach((s) => {
    counts[s] = apps.filter((a) => a.status === s).length;
  });

  const toggleDoc = (appId: string, docName: string) => {
    setApps(
      apps.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            docs: app.docs.map((doc) =>
              doc.name === docName ? { name: doc.name, received: !doc.received } : doc,
            ),
          };
        }
        return app;
      }),
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* If requirement configuration form mode is active, show full-page mockup form directly */}
      {activeSubTab === "requirements" && reqFormMode !== "list" ? (
        <div className="max-w-4xl mx-auto">
          {/* Mockup Form card */}
          <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden border-t-4 border-t-rose-500">
            <form onSubmit={handleSaveReq}>
              {/* Form Top Title Bar */}
              <div className="bg-background border-b border-border px-6 py-4 flex items-center gap-2">
                <span className="bg-[#1d1d1f] text-white text-[10px] font-mono px-2 py-0.5 rounded tracking-wide shrink-0 inline-flex items-center justify-center font-extrabold select-none">
                  VISA
                </span>
                <div>
                  <h2 className="font-display text-sm font-bold text-foreground leading-tight">
                    Visa Document
                  </h2>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                    Visa Document
                  </p>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6">
                {/* Form Section Header */}
                <div className="border-b border-border pb-3">
                  <h3 className="font-display text-sm font-bold text-rose-500 tracking-wide">
                    Visa Information (Fees Per Person)
                  </h3>
                </div>

                {/* Countries / Visa Type */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1 flex flex-col justify-end">
                    <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      Countries <span className="text-rose-500">*</span>
                    </label>
                    <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={countryOpen}
                          className={`flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${!formCountry && "text-muted-foreground"}`}
                        >
                          {formCountry ? (
                            <div className="flex items-center gap-2 overflow-hidden">
                              <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full bg-secondary">
                                <img
                                  height="20"
                                  title={COUNTRY_CODES[formCountry]}
                                  src={`https://react-circle-flags.pages.dev/${COUNTRY_CODES[formCountry] || "un"}.svg`}
                                  alt=""
                                />
                              </div>
                              <span className="truncate">{formCountry}</span>
                            </div>
                          ) : (
                            <span className="font-normal">Select Country</span>
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search country..." className="h-9 text-xs" />
                          <CommandList>
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                              {COUNTRIES_LIST.map((country) => (
                                <CommandItem
                                  key={country}
                                  value={country}
                                  onSelect={(currentValue) => {
                                    const actualCountry =
                                      COUNTRIES_LIST.find(
                                        (c) => c.toLowerCase() === currentValue.toLowerCase(),
                                      ) || country;
                                    setFormCountry(
                                      actualCountry === formCountry ? "" : actualCountry,
                                    );
                                    setCountryOpen(false);
                                  }}
                                  className="flex items-center w-full gap-2 px-2 py-1.5 text-sm"
                                >
                                  <div className="flex flex-grow w-0 space-x-2 overflow-hidden items-center">
                                    <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full bg-secondary">
                                      <img
                                        height="20"
                                        title={COUNTRY_CODES[country]}
                                        src={`https://react-circle-flags.pages.dev/${COUNTRY_CODES[country] || "un"}.svg`}
                                        alt=""
                                      />
                                    </div>
                                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                      {country}
                                    </span>
                                  </div>
                                  <Check
                                    className={`ml-auto h-4 w-4 shrink-0 ${formCountry === country ? "opacity-100" : "opacity-0"}`}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      Visa Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formVisaType}
                      required
                      onChange={(e) => setFormVisaType(e.target.value)}
                      className="flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Select Visa</option>
                      {VISA_TYPES_LIST.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Documents checklist configuration - directly inline */}
                <div className="space-y-4 pt-2">
                  {formDocs.map((doc, idx) => (
                    <div key={`form-doc-${idx}`} className="space-y-2">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                            Document {idx + 1}{" "}
                            {idx === 0 && <span className="text-rose-500">*</span>}
                          </label>
                          <Input
                            placeholder="Document"
                            required={idx === 0}
                            value={doc.name}
                            onChange={(e) => handleDocChange(idx, "name", e.target.value)}
                            className="h-9 text-xs rounded-lg"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                            Short Name for auto mails {idx + 1}{" "}
                            {idx === 0 && <span className="text-rose-500">*</span>}
                          </label>
                          <div className="flex gap-2 items-center">
                            <Input
                              placeholder="Short Name for auto mails"
                              required={idx === 0}
                              value={doc.shortName}
                              onChange={(e) => handleDocChange(idx, "shortName", e.target.value)}
                              className="h-9 text-xs rounded-lg flex-1"
                            />
                            {formDocs.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-rose-500 hover:bg-rose-50 rounded-lg shrink-0"
                                onClick={() => handleRemoveDocRow(idx)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex">
                    <button
                      type="button"
                      onClick={handleAddDocRow}
                      className="text-rose-500 hover:text-rose-600 text-xs font-semibold flex items-center gap-1 mt-1.5 transition-colors"
                    >
                      <span className="text-sm">⊕</span>Add More
                    </button>
                  </div>
                </div>

                {/* Form URLs configuration - directly inline */}
                <div className="space-y-4 pt-2">
                  {formUrls.map((url, idx) => (
                    <div key={`url-${idx}`} className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">
                          Form Url {idx + 1}
                        </label>
                        <div className="flex gap-2 items-center">
                          <Input
                            placeholder="Form Url"
                            value={url}
                            onChange={(e) => handleUrlChange(idx, e.target.value)}
                            className="h-9 text-xs rounded-lg flex-1"
                          />
                          {formUrls.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-rose-500 hover:bg-rose-50 rounded-lg shrink-0"
                              onClick={() => handleRemoveUrlRow(idx)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex">
                    <button
                      type="button"
                      onClick={handleAddUrlRow}
                      className="text-rose-500 hover:text-rose-600 text-xs font-semibold flex items-center gap-1 mt-1.5 transition-colors"
                    >
                      <span className="text-sm">⊕</span>Add More
                    </button>
                  </div>
                </div>

                {/* Inline fees 6-col grids */}
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-6 border-t border-border pt-6">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Currency</label>
                    <select
                      value={formCurrency}
                      onChange={(e) => setFormCurrency(e.target.value)}
                      className="flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    >
                      {CURRENCY_LIST.map((curr) => (
                        <option key={curr} value={curr}>
                          {curr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Visa Fees <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      type="number"
                      placeholder="Visa Fees"
                      required
                      value={formVisaFees}
                      onChange={(e) => setFormVisaFees(e.target.value)}
                      className="h-9 text-xs rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">VFS Fees</label>
                    <Input
                      type="number"
                      placeholder="VFS Fees"
                      value={formVfsFees}
                      onChange={(e) => setFormVfsFees(e.target.value)}
                      className="h-9 text-xs rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Other Fees
                    </label>
                    <Input
                      type="number"
                      placeholder="Other Fees"
                      value={formOtherFees}
                      onChange={(e) => setFormOtherFees(e.target.value)}
                      className="h-9 text-xs rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Service Fees
                    </label>
                    <Input
                      type="number"
                      placeholder="Service Fees"
                      value={formServiceFees}
                      onChange={(e) => setFormServiceFees(e.target.value)}
                      className="h-9 text-xs rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Consulate Fees
                    </label>
                    <Input
                      type="number"
                      placeholder="Consulate Fees"
                      value={formConsulateFees}
                      onChange={(e) => setFormConsulateFees(e.target.value)}
                      className="h-9 text-xs rounded-lg"
                    />
                  </div>
                </div>

                {/* Extra & Urgent fees row */}
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-6">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Urgent Fees
                    </label>
                    <Input
                      type="number"
                      placeholder="Urgent Fees"
                      value={formUrgentFees}
                      onChange={(e) => setFormUrgentFees(e.target.value)}
                      className="h-9 text-xs rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Urgent Fees 2
                    </label>
                    <Input
                      type="number"
                      placeholder="Urgent Fees 2"
                      value={formUrgentFees2}
                      onChange={(e) => setFormUrgentFees2(e.target.value)}
                      className="h-9 text-xs rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Extra Name 1
                    </label>
                    <Input
                      placeholder="Extra Name"
                      value={formExtraName1}
                      onChange={(e) => setFormExtraName1(e.target.value)}
                      className="h-9 text-xs rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Extra Fees 1
                    </label>
                    <Input
                      type="number"
                      placeholder="Extra Fees"
                      value={formExtraFees1}
                      onChange={(e) => setFormExtraFees1(e.target.value)}
                      className="h-9 text-xs rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Extra Name 2
                    </label>
                    <Input
                      placeholder="Extra Name"
                      value={formExtraName2}
                      onChange={(e) => setFormExtraName2(e.target.value)}
                      className="h-9 text-xs rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Extra Fees 2
                    </label>
                    <Input
                      type="number"
                      placeholder="Extra Fees"
                      value={formExtraFees2}
                      onChange={(e) => setFormExtraFees2(e.target.value)}
                      className="h-9 text-xs rounded-lg"
                    />
                  </div>
                </div>

                {/* Third row fields */}
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-6">
                  <div className="space-y-1 sm:col-span-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Extra Name 3
                    </label>
                    <Input
                      placeholder="Extra Name"
                      value={formExtraName3}
                      onChange={(e) => setFormExtraName3(e.target.value)}
                      className="h-9 text-xs rounded-lg"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Extra Fees 3
                    </label>
                    <Input
                      type="number"
                      placeholder="Extra Fees"
                      value={formExtraFees3}
                      onChange={(e) => setFormExtraFees3(e.target.value)}
                      className="h-9 text-xs rounded-lg"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Time Required
                    </label>
                    <Input
                      placeholder="Time Required"
                      value={formTimeRequired}
                      onChange={(e) => setFormTimeRequired(e.target.value)}
                      className="h-9 text-xs rounded-lg"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-3">
                    <label className="text-xs font-semibold text-muted-foreground">Remark 1</label>
                    <Input
                      placeholder="Remark"
                      value={formRemark1}
                      onChange={(e) => setFormRemark1(e.target.value)}
                      className="h-9 text-xs rounded-lg"
                    />
                  </div>
                </div>

                {/* Remarks 2 & 3 */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Remark 2</label>
                    <Input
                      placeholder="Remark"
                      value={formRemark2}
                      onChange={(e) => setFormRemark2(e.target.value)}
                      className="h-9 text-xs rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Remark 3</label>
                    <Input
                      placeholder="Remark"
                      value={formRemark3}
                      onChange={(e) => setFormRemark3(e.target.value)}
                      className="h-9 text-xs rounded-lg"
                    />
                  </div>
                </div>

                {/* Files Upload row */}
                <div className="pt-2 border-t border-border/50">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="file"
                      id="req-support-files-inline"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button
                      type="button"
                      onClick={() => document.getElementById("req-support-files-inline")?.click()}
                      variant="outline"
                      className="h-9 text-xs border border-border bg-background hover:bg-secondary rounded-lg gap-1.5"
                    >
                      Choose Files
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {formFiles.length > 0
                        ? `${formFiles.length} file(s) selected`
                        : "No file chosen"}
                    </span>
                  </div>
                  {formFiles.length > 0 && (
                    <div className="space-y-2">
                      {formFiles.map((file, idx) => (
                        <div
                          key={file.name}
                          className="flex items-center justify-between p-3 border border-border rounded-lg bg-secondary/20"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="h-4 w-4 text-rose-500 shrink-0" />
                            <span className="text-xs font-medium truncate">{file.name}</span>
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              ({Math.round(file.size / 1024)} KB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-rose-500 shrink-0"
                            onClick={() => handleRemoveFile(idx)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="bg-secondary/10 border-t border-border px-6 py-4 flex gap-2 justify-start">
                <Button
                  type="submit"
                  className="rounded-lg text-xs font-semibold px-6 bg-rose-500 hover:bg-rose-600 text-white shadow-sm h-9"
                >
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setReqFormMode("list")}
                  className="rounded-lg text-xs font-semibold px-6 border border-border bg-background hover:bg-secondary h-9"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* Page Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold">Visa Management</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Track applications, document checklists, and setup country-wise requirements.
              </p>
            </div>
            <div className="flex gap-2">
              {activeSubTab === "applications" ? (
                <Button
                  onClick={() => setAppModalOpen(true)}
                  className="gap-2 rounded-xl"
                  style={BRAND_STYLE}
                >
                  <Plus className="h-4 w-4" /> New Application
                </Button>
              ) : (
                <Button
                  onClick={handleOpenAddReq}
                  className="gap-2 rounded-xl"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  <Plus className="h-4 w-4" /> New Visa Setup
                </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto border-b border-border pb-px scrollbar-hide">
            <button
              onClick={() => setActiveSubTab("applications")}
              className={`whitespace-nowrap px-5 py-2.5 text-sm font-semibold transition-colors border-b-2 ${activeSubTab === "applications" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              📄 Applications Checklist ({apps.length})
            </button>
            <button
              onClick={() => setActiveSubTab("requirements")}
              className={`whitespace-nowrap px-5 py-2.5 text-sm font-semibold transition-colors border-b-2 ${activeSubTab === "requirements" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              ⚙️ Visa Requirements Setup ({requirements.length})
            </button>
          </div>

          {activeSubTab === "applications" ? (
            <>
              {/* Stat strip */}
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-5">
                {[
                  {
                    label: "Pending Docs",
                    count: counts["Pending Documents"],
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                  },
                  {
                    label: "Submitted",
                    count: counts["Submitted"],
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                  {
                    label: "Under Review",
                    count: counts["Under Review"],
                    color: "text-violet-600",
                    bg: "bg-violet-50",
                  },
                  {
                    label: "Approved",
                    count: counts["Approved"],
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                  },
                  {
                    label: "Rejected",
                    count: counts["Rejected"],
                    color: "text-red-600",
                    bg: "bg-red-50",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`rounded-2xl border border-border bg-card p-4 shadow-card hover:shadow-md transition-shadow`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </p>
                    <p className={`mt-1 font-display text-3xl font-bold ${s.color}`}>{s.count}</p>
                  </div>
                ))}
              </div>

              {/* Filter bar */}
              <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
                <div className="relative max-w-xs flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search customer or country..."
                    className="pl-9 rounded-xl"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(["All", ...ALL_STATUSES] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilter(s as typeof filter)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${filter === s ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
                    >
                      {s} {counts[s] !== undefined ? `(${counts[s]})` : ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Applications list */}
              <div className="space-y-3">
                {filteredApps.map((app) => {
                  const docsReceived = app.docs.filter((d) => d.received).length;
                  const isOpen = expanded === app.id;
                  return (
                    <div
                      key={app.id}
                      className="overflow-hidden rounded-2xl border border-border bg-card shadow-card hover:shadow-md transition-shadow"
                    >
                      {/* Main row */}
                      <div className="flex flex-wrap items-center gap-4 px-5 py-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold border border-primary/20">
                          {app.customer.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold">{app.customer}</p>
                            <span className="text-xs text-muted-foreground">{app.id}</span>
                          </div>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {app.flag} {app.country} · {app.visaType}
                          </p>
                        </div>

                        {/* Dates */}
                        <div className="hidden text-xs text-muted-foreground sm:block">
                          <p>
                            Applied:{" "}
                            <span className="font-medium text-foreground">{app.appliedOn}</span>
                          </p>
                          <p>
                            Travel:{" "}
                            <span className="font-medium text-foreground">{app.travelDate}</span>
                          </p>
                        </div>

                        {/* Doc progress */}
                        <div className="hidden w-28 sm:block">
                          <p className="mb-1 text-xs text-muted-foreground">
                            Docs {docsReceived}/{app.docs.length}
                          </p>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={Object.assign(
                                {},
                                { width: `${Math.round((docsReceived / app.docs.length) * 100)}%` },
                              )}
                            />
                          </div>
                        </div>

                        {/* Status badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[app.status]}`}
                        >
                          {STATUS_ICON[app.status]} {app.status}
                        </span>

                        {/* Expand */}
                        <button
                          onClick={() => setExpanded(isOpen ? null : app.id)}
                          className="rounded-lg p-2 hover:bg-secondary transition-colors"
                        >
                          {isOpen ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {/* Document checklist (expanded) */}
                      {isOpen && (
                        <div className="border-t border-border bg-secondary/35 px-5 py-5">
                          <div className="grid gap-6 md:grid-cols-3">
                            {/* Left column: Application Details */}
                            <div className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm">
                              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Application Details
                              </p>

                              <div className="space-y-3 text-sm">
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-xs font-semibold text-muted-foreground">
                                    Visa Type
                                  </label>
                                  <Input
                                    value={app.visaType}
                                    onChange={(e) => {
                                      setApps(
                                        apps.map((a) =>
                                          a.id === app.id ? { ...a, visaType: e.target.value } : a,
                                        ),
                                      );
                                    }}
                                    className="h-8 text-sm rounded-lg bg-background"
                                  />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-xs font-semibold text-muted-foreground">
                                    Travel Date
                                  </label>
                                  <Input
                                    type="date"
                                    value={app.travelDate}
                                    onChange={(e) => {
                                      setApps(
                                        apps.map((a) =>
                                          a.id === app.id
                                            ? { ...a, travelDate: e.target.value }
                                            : a,
                                        ),
                                      );
                                    }}
                                    className="h-8 text-sm rounded-lg bg-background"
                                  />
                                </div>
                              </div>

                              <div className="flex gap-2 border-t border-border pt-4 mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 rounded-xl text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                  onClick={() => setDeleteAppTargetId(app.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  className="flex-[4] rounded-xl text-xs font-semibold shadow-sm"
                                  style={{ background: "var(--gradient-brand)" }}
                                  onClick={() => {
                                    toast.success("Application saved successfully");
                                    setExpanded(null);
                                  }}
                                >
                                  Save Changes
                                </Button>
                              </div>
                            </div>

                            {/* Right columns: Document Checklist */}
                            <div className="md:col-span-2">
                              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Stamp className="h-3.5 w-3.5" /> Document Checklist
                              </p>
                              <div className="grid gap-2 sm:grid-cols-2">
                                {app.docs.map((doc) => (
                                  <button
                                    key={doc.name}
                                    onClick={() => toggleDoc(app.id, doc.name)}
                                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-colors text-left ${doc.received ? "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50" : "border-border bg-background hover:bg-secondary/50"}`}
                                  >
                                    {doc.received ? (
                                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                                    ) : (
                                      <div className="h-4 w-4 shrink-0 rounded-full border-2 border-border transition-colors" />
                                    )}
                                    <span
                                      className={
                                        doc.received ? "text-foreground" : "text-muted-foreground"
                                      }
                                    >
                                      {doc.name}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* Visa Requirements Setup Tab */}
              <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
                <div className="relative max-w-xs flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={reqQ}
                    onChange={(e) => setReqQ(e.target.value)}
                    placeholder="Search country or visa type..."
                    className="pl-9 rounded-xl"
                  />
                </div>
                <span className="text-xs text-muted-foreground ml-auto">
                  {filteredReqs.length} configurations setup
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                      <tr>
                        <th className="px-5 py-3.5">Country</th>
                        <th className="px-5 py-3.5">Visa Type</th>
                        <th className="px-5 py-3.5">Required Documents</th>
                        <th className="px-5 py-3.5">Form Links</th>
                        <th className="px-5 py-3.5">Basic Visa Fee</th>
                        <th className="px-5 py-3.5">Time Required</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredReqs.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                            No visa requirements setup. Click "New Visa Setup" to create one.
                          </td>
                        </tr>
                      ) : (
                        filteredReqs.map((req) => (
                          <tr key={req.id} className="hover:bg-secondary/20 transition-colors">
                            <td className="px-5 py-4 font-semibold text-foreground flex items-center gap-2">
                              <Globe className="h-4 w-4 text-primary shrink-0" />
                              {req.country}
                            </td>
                            <td className="px-5 py-4 font-medium text-muted-foreground">
                              {req.visaType}
                            </td>
                            <td className="px-5 py-4">
                              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-xs font-semibold border border-blue-100">
                                {req.docs.length} Documents
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              {(() => {
                                const totalForms =
                                  req.formUrls.length + (req.supportFiles?.length || 0);
                                if (totalForms === 0)
                                  return <span className="text-muted-foreground/60">—</span>;

                                if (totalForms === 1) {
                                  if (req.formUrls.length === 1) {
                                    const url = req.formUrls[0];
                                    const formattedUrl = url.startsWith("http")
                                      ? url
                                      : `https://${url}`;
                                    return (
                                      <a
                                        href={formattedUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-primary hover:underline font-medium text-xs"
                                      >
                                        <Download className="h-3 w-3" /> Download Form (1)
                                      </a>
                                    );
                                  } else {
                                    const file = req.supportFiles![0];
                                    return (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const link = document.createElement("a");
                                          link.href = file.data;
                                          link.download = file.name;
                                          document.body.appendChild(link);
                                          link.click();
                                          document.body.removeChild(link);
                                        }}
                                        className="inline-flex items-center gap-1 text-primary hover:underline font-medium text-xs cursor-pointer bg-transparent border-none p-0"
                                      >
                                        <Download className="h-3 w-3" /> Download Form (1)
                                      </button>
                                    );
                                  }
                                }

                                return (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <button className="inline-flex items-center gap-1 text-primary hover:underline font-medium text-xs">
                                        <Download className="h-3 w-3" /> Download Forms (
                                        {totalForms})
                                      </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64 p-3 text-sm" align="start">
                                      <div className="space-y-3">
                                        {req.formUrls.length > 0 && (
                                          <div>
                                            <div className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                                              Web Links
                                            </div>
                                            <div className="space-y-1">
                                              {req.formUrls.map((url, i) => {
                                                const formattedUrl = url.startsWith("http")
                                                  ? url
                                                  : `https://${url}`;
                                                return (
                                                  <a
                                                    key={i}
                                                    href={formattedUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="block text-primary hover:underline truncate"
                                                  >
                                                    {url}
                                                  </a>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        )}
                                        {req.supportFiles && req.supportFiles.length > 0 && (
                                          <div>
                                            <div className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                                              Files
                                            </div>
                                            <div className="space-y-1">
                                              {req.supportFiles.map((file, i) => (
                                                <button
                                                  key={`file-${i}`}
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    const link = document.createElement("a");
                                                    link.href = file.data;
                                                    link.download = file.name;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                  }}
                                                  className="block text-primary hover:underline truncate w-full text-left bg-transparent border-none p-0 cursor-pointer text-sm"
                                                >
                                                  {file.name}
                                                </button>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                );
                              })()}
                            </td>
                            <td className="px-5 py-4 font-semibold text-primary">
                              {req.visaFees > 0 ? `${req.currency} ${req.visaFees}` : "N/A"}
                            </td>
                            <td className="px-5 py-4 font-medium text-muted-foreground">
                              {req.timeRequired || "—"}
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-muted-foreground hover:text-primary rounded-lg"
                                  onClick={() => handleOpenEditReq(req)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg"
                                  onClick={() => handleDeleteReq(req.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
      <DeleteConfirmModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
        title="Delete Visa Configuration"
        description="Are you sure you want to delete this visa requirements configuration? This action cannot be undone."
      />
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
              <Input
                placeholder="e.g. Ananya Verma"
                value={appCustomer}
                onChange={(e) => setAppCustomer(e.target.value)}
                required
                className="rounded-xl bg-background border-border"
              />
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
