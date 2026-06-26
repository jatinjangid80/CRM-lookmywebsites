import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getAuth } from "@/lib/auth";
import { Plus, Search, Edit2, Trash2, X, Download, Upload, Package, Star, Clock, Users, Tag, FileText, Table2, Briefcase, Paperclip, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useLocalStorage } from "@/lib/use-local-storage";

export const Route = createFileRoute("/crm/packages")({ component: PackagesPage });

// ─── Types ──────────────────────────────────────────────────────────────────
interface PackageFile {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  dataUrl: string;
}

interface Package {
  id: string;
  title: string;
  nights: string;
  img: string;
  price: string;
  priceNum: number;
  tag: string;
  incl: string[];
  destination: string;
  description: string;
  active: boolean;
  files?: PackageFile[];
  assignedTo?: string;
}

// ─── Seed data from LookMyHolidays ──────────────────────────────────────────
export const SEED_PACKAGES: Package[] = [
  { id: "PKG-001", title: "Dubai City + Desert", nights: "5N / 6D", img: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=900&q=80", price: "₹48,750", priceNum: 48750, tag: "Family", incl: ["Burj Khalifa", "Safari", "Cruise"], destination: "Dubai, UAE", description: "Experience the best of Dubai — towering skyscrapers, thrilling desert safari, and a stunning dhow cruise.", active: true },
  { id: "PKG-002", title: "Swiss Alps Adventure", nights: "7N / 8D", img: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=900&q=80", price: "₹1,34,500", priceNum: 134500, tag: "Adventure", incl: ["Jungfraujoch", "Glacier 3000"], destination: "Switzerland, Europe", description: "Breathtaking views from Jungfraujoch, scenic train rides, and snowy peaks at Glacier 3000.", active: true },
  { id: "PKG-003", title: "Thailand Beach Combo", nights: "6N / 7D", img: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=900&q=80", price: "₹41,200", priceNum: 41200, tag: "Beach", incl: ["Phuket", "Krabi", "Ferries"], destination: "Thailand", description: "Sun, sand, and crystal waters across Phuket and Krabi with island hopping by ferry.", active: true },
  { id: "PKG-004", title: "Vietnam Explorer Tour", nights: "5N / 6D", img: "https://images.unsplash.com/photo-1528127269322-539801943592?w=900&q=80", price: "₹38,500", priceNum: 38500, tag: "Adventure", incl: ["Hanoi", "Halong Bay", "Flights", "Hotels"], destination: "Vietnam", description: "Cruise through Halong Bay, explore ancient Hanoi streets, and taste authentic Vietnamese cuisine.", active: true },
  { id: "PKG-005", title: "Almaty Scenic Getaway", nights: "4N / 5D", img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=80", price: "₹42,000", priceNum: 42000, tag: "Scenic", incl: ["Charyn Canyon", "Medeu", "Flights", "Meals"], destination: "Almaty, Kazakhstan", description: "Discover the dramatic Charyn Canyon, ice-skate at Medeu, and enjoy the charm of Almaty city.", active: true },
  { id: "PKG-006", title: "Nepal & Everest Panorama", nights: "5N / 6D", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=900&q=80", price: "₹29,999", priceNum: 29999, tag: "Trekking", incl: ["Kathmandu", "Pokhara", "Temples", "Guide"], destination: "Nepal, Himalayas", description: "Trek through Kathmandu's ancient temples, sail on Phewa Lake in Pokhara, and witness Everest panoramas.", active: true },
  { id: "PKG-007", title: "Bhutan Peaceful Valley Tour", nights: "5N / 6D", img: "https://images.unsplash.com/photo-1571679654681-ba01b9e1e117?w=900&q=80", price: "₹45,500", priceNum: 45500, tag: "Scenic", incl: ["Thimphu", "Paro", "Monasteries", "Guide"], destination: "Bhutan, Himalayas", description: "Explore the serene valleys of Bhutan — Tiger's Nest monastery, Thimphu city, and the Paro festival.", active: true },
  { id: "PKG-008", title: "Bali Honeymoon Escape", nights: "6N / 7D", img: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=900&q=80", price: "₹64,999", priceNum: 64999, tag: "Honeymoon", incl: ["Hotel", "Flights", "Villa", "Spa"], destination: "Bali, Indonesia", description: "Romantic sunsets, luxury villas, couples spa, and private beach dinners for the perfect honeymoon.", active: true },
  { id: "PKG-009", title: "Royal Rajasthan Heritage", nights: "5N / 6D", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&q=80", price: "₹32,500", priceNum: 32500, tag: "Cultural", incl: ["Palace Stay", "Guide", "Meals"], destination: "Rajasthan, India", description: "Stay in heritage palaces, explore majestic forts, and experience the royal culture of Rajasthan.", active: true },
  { id: "PKG-010", title: "Maldives Water Villa", nights: "4N / 5D", img: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=900&q=80", price: "₹89,000", priceNum: 89000, tag: "Luxury", incl: ["Overwater Villa", "All Meals", "Transfers"], destination: "Maldives, South Asia", description: "Unwind in an overwater villa with turquoise lagoons, snorkelling reefs, and all-inclusive luxury dining.", active: true },
];

const ALL_TAGS = ["All", "Family", "Adventure", "Beach", "Scenic", "Trekking", "Honeymoon", "Cultural", "Luxury"];

const TAG_COLORS: Record<string, string> = {
  Family: "bg-blue-50 text-blue-700 border-blue-100",
  Adventure: "bg-orange-50 text-orange-700 border-orange-100",
  Beach: "bg-cyan-50 text-cyan-700 border-cyan-100",
  Scenic: "bg-teal-50 text-teal-700 border-teal-100",
  Trekking: "bg-lime-50 text-lime-700 border-lime-100",
  Honeymoon: "bg-pink-50 text-pink-700 border-pink-100",
  Cultural: "bg-amber-50 text-amber-700 border-amber-100",
  Luxury: "bg-purple-50 text-purple-700 border-purple-100",
};

import { EmployeeProfileCard } from "@/components/EmployeeProfileCard";

const EMPTY: Omit<Package, "id"> = {
  title: "", nights: "", img: "", price: "", priceNum: 0, tag: "Family",
  incl: [], destination: "", description: "", active: true, assignedTo: "Pushplata Kriplani"
};

// ─── Component ───────────────────────────────────────────────────────────────
function PackagesPage() {
  const auth = getAuth();
  const isAdmin = auth?.role === "admin";

  const [packages, setPackages] = useLocalStorage<Package[]>("crm_packages", SEED_PACKAGES);
  const [q, setQ] = useState("");
  const [filterTag, setFilterTag] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<Package | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Package | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [inclInput, setInclInput] = useState("");

  const [localForm, setLocalForm] = useState<Omit<Package, "id">>(EMPTY);
  const [managingFilesPkg, setManagingFilesPkg] = useState<Package | null>(null);
  const [isFilesOpen, setIsFilesOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = localForm;
  const setForm = setLocalForm;

  const filtered = packages.filter(p => {
    const matchTag = filterTag === "All" || p.tag === filterTag;
    const matchQ = q === "" ||
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.destination.toLowerCase().includes(q.toLowerCase()) ||
      p.tag.toLowerCase().includes(q.toLowerCase());
    return matchTag && matchQ;
  });

  // ── File Helpers ─────────────────────────────────────────────────────────
  function getFileIcon(type: string, name: string) {
    const lowercaseName = name.toLowerCase();
    if (type === "application/pdf" || lowercaseName.endsWith(".pdf")) {
      return <FileText className="h-4 w-4 text-rose-500" />;
    }
    if (type.includes("sheet") || type.includes("excel") || lowercaseName.endsWith(".xlsx") || lowercaseName.endsWith(".xls") || lowercaseName.endsWith(".csv")) {
      return <Table2 className="h-4 w-4 text-emerald-500" />;
    }
    if (type.includes("word") || type.includes("document") || lowercaseName.endsWith(".docx") || lowercaseName.endsWith(".doc")) {
      return <Briefcase className="h-4 w-4 text-blue-500" />;
    }
    if (type.startsWith("image/")) {
      return <FileImage className="h-4 w-4 text-purple-500" />;
    }
    return <FileText className="h-4 w-4 text-gray-400" />;
  }

  function fmtSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }

  function readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const handleAddFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !managingFilesPkg) return;

    setUploading(true);
    try {
      const dataUrl = await readAsDataUrl(uploadFile);
      const newFile: PackageFile = {
        name: uploadFile.name,
        size: uploadFile.size,
        type: uploadFile.type || "application/octet-stream",
        uploadedAt: new Date().toISOString(),
        dataUrl,
      };

      const updatedPkg: Package = {
        ...managingFilesPkg,
        files: [...(managingFilesPkg.files || []), newFile]
      };

      setPackages(prev => prev.map(p => p.id === managingFilesPkg.id ? updatedPkg : p));
      setManagingFilesPkg(updatedPkg);
      setUploadFile(null);
      const fileInput = document.getElementById("pkg-doc-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error("File upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = (fileName: string) => {
    if (!managingFilesPkg) return;
    const updatedPkg = {
      ...managingFilesPkg,
      files: (managingFilesPkg.files || []).filter(f => f.name !== fileName)
    };
    setPackages(prev => prev.map(p => p.id === managingFilesPkg.id ? updatedPkg : p));
    setManagingFilesPkg(updatedPkg);
  };

  // ── Open form ────────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingPkg(null);
    setForm(EMPTY);
    setInclInput("");
    setIsFormOpen(true);
  };

  const openEdit = (pkg: Package) => {
    setEditingPkg(pkg);
    setForm({ ...pkg });
    setInclInput(pkg.incl.join(", "));
    setIsFormOpen(true);
  };

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const inclArr = inclInput.split(",").map(s => s.trim()).filter(Boolean);
    const priceNum = parseInt(form.price.replace(/[^\d]/g, "")) || 0;
    const formatted = form.price.startsWith("₹") ? form.price : `₹${Number(priceNum).toLocaleString("en-IN")}`;

    if (editingPkg) {
      setPackages(prev => prev.map(p => p.id === editingPkg.id ? { ...p, ...form, incl: inclArr, priceNum, price: formatted } : p));
    } else {
      const newPkg: Package = {
        id: `PKG-${(packages.length + 1).toString().padStart(3, "0")}`,
        ...form,
        incl: inclArr,
        priceNum,
        price: formatted,
      };
      setPackages(prev => [newPkg, ...prev]);
    }
    setIsFormOpen(false);
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = () => {
    if (!deleteTarget) return;
    setPackages(prev => prev.filter(p => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  // ── Toggle active ────────────────────────────────────────────────────────
  const toggleActive = (id: string) => {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  // ── Exports ──────────────────────────────────────────────────────────────
  const exportToExcel = () => {
    const headers = ["ID", "Title", "Destination", "Nights", "Price", "Tag", "Includes", "Active"];
    const rows = [
      headers.join(","),
      ...filtered.map(p => [
        `"${p.id}"`, `"${p.title.replace(/"/g, '""')}"`, `"${p.destination}"`,
        `"${p.nights}"`, `"${p.price}"`, `"${p.tag}"`,
        `"${p.incl.join("; ")}"`, p.active ? "Yes" : "No"
      ].join(","))
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `packages_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const exportToWord = () => {
    const th = "<tr><th>ID</th><th>Title</th><th>Destination</th><th>Nights</th><th>Price</th><th>Tag</th><th>Includes</th></tr>";
    const rows = filtered.map(p =>
      `<tr><td>${p.id}</td><td>${p.title}</td><td>${p.destination}</td><td>${p.nights}</td><td>${p.price}</td><td>${p.tag}</td><td>${p.incl.join(", ")}</td></tr>`
    ).join("");
    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'><head><title>Packages Export</title><style>table{border-collapse:collapse;width:100%;font-family:Arial}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f2f2f2}</style></head><body><h2>Grand Journeys CRM - Package Catalog</h2><table>${th}${rows}</table></body></html>`;
    const blob = new Blob([html], { type: "application/msword" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = `packages_export_${new Date().toISOString().slice(0, 10)}.doc`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const exportToPDF = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    const th = "<tr><th>ID</th><th>Title</th><th>Destination</th><th>Duration</th><th>Price</th><th>Tag</th><th>Includes</th></tr>";
    const rows = filtered.map(p =>
      `<tr><td>${p.id}</td><td>${p.title}</td><td>${p.destination}</td><td>${p.nights}</td><td>${p.price}</td><td>${p.tag}</td><td>${p.incl.join(", ")}</td></tr>`
    ).join("");
    win.document.write(`<html><head><title>Package Catalog PDF</title><style>body{font-family:sans-serif;padding:20px;color:#333}h2{color:#f43f5e}p{font-size:12px;color:#666;margin-bottom:20px}table{border-collapse:collapse;width:100%;font-size:11px}th,td{border:1px solid #ddd;padding:6px;text-align:left}th{background:#f9fafb;font-weight:bold}tr:nth-child(even){background:#f3f4f6}</style></head><body><h2>Grand Journeys CRM — Package Catalog</h2><p>Generated on ${new Date().toLocaleDateString("en-IN")} | Packages: ${filtered.length}</p><table><thead>${th}</thead><tbody>${rows}</tbody></table><script>window.onload=function(){window.print();window.onafterprint=function(){window.close();}}<\/script></body></html>`);
    win.document.close();
  };

  // ── Stats ────────────────────────────────────────────────────────────────
  const activeCount = packages.filter(p => p.active).length;
  const avgPrice = packages.length ? Math.round(packages.reduce((s, p) => s + p.priceNum, 0) / packages.length) : 0;
  const topTag = (() => {
    const count: Record<string, number> = {};
    packages.forEach(p => { count[p.tag] = (count[p.tag] || 0) + 1; });
    return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  })();

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Package Catalog</h1>
          <p className="text-sm text-muted-foreground">Manage holiday packages synced with LookMyHolidays.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" className="gap-2 rounded-xl" onClick={() => setIsExportOpen(true)}>
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button className="btn-hero gap-2" onClick={openAdd}>
            <Plus className="h-4 w-4" /> New Package
          </Button>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Packages", value: packages.length, icon: <Package className="h-5 w-5" />, color: "text-primary bg-primary/10" },
          { label: "Active Packages", value: activeCount, icon: <Star className="h-5 w-5" />, color: "text-emerald-600 bg-emerald-50" },
          { label: "Avg. Price", value: `₹${avgPrice.toLocaleString("en-IN")}`, icon: <Tag className="h-5 w-5" />, color: "text-amber-600 bg-amber-50" },
          { label: "Top Category", value: topTag, icon: <Users className="h-5 w-5" />, color: "text-purple-600 bg-purple-50" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className={`inline-grid h-10 w-10 place-items-center rounded-xl ${s.color}`}>{s.icon}</div>
            <p className="mt-3 text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Search + Filter ────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search packages, destinations, tags…"
            value={q}
            onChange={e => setQ(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {ALL_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filterTag === tag
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── Package Cards Grid ─────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center text-muted-foreground">
          <Package className="h-12 w-12 opacity-30" />
          <p className="text-sm">No packages match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(pkg => (
            <div
              key={pkg.id}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card hover:shadow-premium hover:-translate-y-1 transition-all duration-300 ${!pkg.active ? "opacity-60" : ""}`}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden bg-secondary/30">
                <img
                  src={pkg.img}
                  alt={pkg.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=60"; }}
                />
                {/* Tag badge */}
                <span className={`absolute top-3 left-3 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm ${TAG_COLORS[pkg.tag] || "bg-gray-50 text-gray-600 border-gray-100"}`}>
                  {pkg.tag}
                </span>
                {/* Active toggle */}
                <button
                  onClick={() => toggleActive(pkg.id)}
                  title={pkg.active ? "Deactivate" : "Activate"}
                  className={`absolute top-3 right-3 h-6 w-11 rounded-full border transition-all ${pkg.active ? "bg-emerald-500 border-emerald-400" : "bg-gray-300 border-gray-200"}`}
                >
                  <span className={`block h-4 w-4 rounded-full bg-white shadow transition-transform mx-1 ${pkg.active ? "translate-x-5" : "translate-x-0"}`} />
                </button>
                {/* Files Badge */}
                {pkg.files && pkg.files.length > 0 && (
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50/90 px-2 py-0.5 text-[9px] font-bold text-blue-700 backdrop-blur-sm shadow-sm">
                    📁 {pkg.files.length} file{pkg.files.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-bold text-base leading-tight">{pkg.title}</h3>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{pkg.nights}</span>
                  <span className="truncate">{pkg.destination}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{pkg.description}</p>

                {/* Inclusions */}
                <div className="flex flex-wrap gap-1 mt-1 mb-2">
                  {pkg.incl.slice(0, 3).map(i => (
                    <span key={i} className="rounded-md bg-secondary/60 px-2 py-0.5 text-[10px] font-medium text-foreground">{i}</span>
                  ))}
                  {pkg.incl.length > 3 && (
                    <span className="rounded-md bg-secondary/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">+{pkg.incl.length - 3} more</span>
                  )}
                </div>

                <div className="mt-auto pt-2 border-t border-border border-dashed">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Package Manager</p>
                  <div className="scale-90 origin-left -mx-2 -mt-1">
                    <EmployeeProfileCard employeeName={pkg.assignedTo || "Pushplata Kriplani"} />
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between pt-3 border-t border-border">
                  <span className="font-bold text-primary text-lg">{pkg.price}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => { setManagingFilesPkg(pkg); setIsFilesOpen(true); }}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                      title="Manage Attachments"
                    >
                      <Paperclip className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => openEdit(pkg)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => setDeleteTarget(pkg)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete (Admin only)"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add/Edit Form Dialog ───────────────────────────────── */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              {editingPkg ? "Edit Package" : "Add New Package"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {editingPkg ? `Editing: ${editingPkg.title}` : "Fill in details to add a new holiday package to the catalog."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 col-span-2">
                <Label htmlFor="pkg-title">Package Title *</Label>
                <Input id="pkg-title" required placeholder="e.g. Bali Honeymoon Escape" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="pkg-dest">Destination *</Label>
                <Input id="pkg-dest" required placeholder="e.g. Bali, Indonesia" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="pkg-nights">Duration *</Label>
                <Input id="pkg-nights" required placeholder="e.g. 6N / 7D" value={form.nights} onChange={e => setForm({ ...form, nights: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="pkg-price">Price (₹) *</Label>
                <Input id="pkg-price" required placeholder="e.g. ₹64,999" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="pkg-tag">Category *</Label>
                <select
                  id="pkg-tag"
                  value={form.tag}
                  onChange={e => setForm({ ...form, tag: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {ALL_TAGS.filter(t => t !== "All").map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1 col-span-2">
                <Label htmlFor="pkg-img">Image URL</Label>
                <Input id="pkg-img" placeholder="https://images.unsplash.com/…" value={form.img} onChange={e => setForm({ ...form, img: e.target.value })} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label htmlFor="pkg-incl">Inclusions (comma separated)</Label>
                <Input id="pkg-incl" placeholder="e.g. Hotel, Flights, Spa, Meals" value={inclInput} onChange={e => setInclInput(e.target.value)} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label htmlFor="pkg-assigned">Package Manager</Label>
                <select
                  id="pkg-assigned"
                  value={form.assignedTo || "Pushplata Kriplani"}
                  onChange={e => setForm({ ...form, assignedTo: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Suman Yadav">Suman Yadav</option>
                  <option value="Nikita Bairwa">Nikita Bairwa</option>
                  <option value="Pushplata Kriplani">Pushplata Kriplani</option>
                  <option value="AMAN SHARMA">AMAN SHARMA</option>
                  <option value="Deepak Kumar">Deepak Kumar</option>
                </select>
              </div>
              <div className="space-y-1 col-span-2">
                <Label htmlFor="pkg-desc">Description</Label>
                <textarea
                  id="pkg-desc"
                  rows={3}
                  placeholder="Short description of the package…"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <input
                  type="checkbox"
                  id="pkg-active"
                  checked={form.active}
                  onChange={e => setForm({ ...form, active: e.target.checked })}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                <Label htmlFor="pkg-active" className="cursor-pointer">Active (visible on website)</Label>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-border">
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit" className="rounded-xl">{editingPkg ? "Save Changes" : "Add Package"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Dialog ──────────────────────────────── */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm rounded-2xl border border-border bg-card shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold text-red-600">Delete Package?</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to delete <strong>"{deleteTarget?.title}"</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-4">
            <Button variant="outline" className="rounded-xl" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button className="rounded-xl bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>Yes, Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Export Dialog ──────────────────────────────────────── */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold">Export Packages</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Export the current list of {filtered.length} packages in your preferred file format.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-3 py-6">
            <button type="button" onClick={() => { exportToPDF(); setIsExportOpen(false); }}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border p-4 hover:border-rose-300 hover:bg-rose-50/50 hover:text-rose-600 transition-all text-center group">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-100">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold">PDF Report</span>
            </button>

            <button type="button" onClick={() => { exportToExcel(); setIsExportOpen(false); }}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border p-4 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-600 transition-all text-center group">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100">
                <Table2 className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold">Excel (CSV)</span>
            </button>

            <button type="button" onClick={() => { exportToWord(); setIsExportOpen(false); }}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border p-4 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600 transition-all text-center group">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold">Word (.doc)</span>
            </button>
          </div>

          <DialogFooter className="border-t border-border pt-4">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsExportOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Manage Files Dialog ────────────────────────────────── */}
      <Dialog open={isFilesOpen} onOpenChange={setIsFilesOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-border p-6 shadow-2xl bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold flex items-center gap-2">
              <Paperclip className="h-5 w-5 text-primary" />
              Manage Package Files
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Upload itineraries (PDF), brochures, photos (JPG/PNG) or pricing details for this package.
            </DialogDescription>
          </DialogHeader>

          {managingFilesPkg && (
            <div className="space-y-6 py-4">
              {/* Package summary info */}
              <div className="rounded-xl border border-border bg-secondary/20 p-4">
                <span className="font-mono text-[10px] font-bold text-primary">{managingFilesPkg.id}</span>
                <h4 className="font-bold text-sm text-foreground mt-1">{managingFilesPkg.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{managingFilesPkg.destination} • {managingFilesPkg.nights}</p>
              </div>

              {/* Upload Form */}
              <form onSubmit={handleAddFile} className="space-y-3 border-t border-border pt-4">
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Attach File</h5>
                <div className="space-y-2">
                  <Input
                    id="pkg-doc-file"
                    type="file"
                    required
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.xls,.xlsx,.doc,.docx"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="h-9 text-xs rounded-lg cursor-pointer"
                  />
                  <Button
                    type="submit"
                    disabled={uploading || !uploadFile}
                    className="w-full h-9 rounded-lg text-xs gap-1.5"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    {uploading ? "Uploading..." : <Upload className="h-3.5 w-3.5" />}
                    {uploading ? "Uploading..." : "Upload File"}
                  </Button>
                </div>
              </form>

              {/* Uploaded files list */}
              <div className="border-t border-border pt-4 space-y-3">
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Attached Documents & Images</h5>

                {!managingFilesPkg.files || managingFilesPkg.files.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground border border-dashed rounded-xl p-4 bg-secondary/15">
                    No files attached. Upload itineraries, flight details or maps.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {managingFilesPkg.files.map((file) => (
                      <div key={file.name} className="flex items-center justify-between rounded-xl border border-border p-3 bg-secondary/10 hover:bg-secondary/20 transition-all text-xs">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          {getFileIcon(file.type, file.name)}
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold truncate text-foreground">{file.name}</p>
                            <p className="text-[10px] text-muted-foreground">{fmtSize(file.size)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 ml-3 shrink-0">
                          <a
                            href={file.dataUrl}
                            download={file.name}
                            className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                            title="Download file"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteFile(file.name)}
                            className="rounded-lg p-1 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Delete file"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-border pt-4">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsFilesOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
