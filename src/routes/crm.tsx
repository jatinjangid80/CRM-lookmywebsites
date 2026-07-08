import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "@/lib/use-local-storage";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Package as Pkg,
  CalendarCheck,
  FileText,
  ClipboardList,
  FolderOpen,
  Star,
  BarChart3,
  UserCog,
  Settings,
  Plane,
  Bell,
  Search,
  LogOut,
  ListChecks,
  Shield,
  Plus,
  User,
  Clock,
  Calendar,
  CreditCard,
  Briefcase,
  Building2,
  Zap,
  Network,
  ShieldCheck,
  UserSquare,
  Phone,
  GraduationCap,
  Receipt,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAuth, clearAuth, type AuthUser } from "@/lib/auth";
import { EmployeeProfileModal } from "@/components/EmployeeProfileModal";
import { CommandPalette } from "@/components/CommandPalette";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoImg from "../assets/Logo.svg";

export const Route = createFileRoute("/crm")({
  head: () => ({ meta: [{ title: "CRM — LookMyHolidays" }] }),
  component: CrmLayout,
});

type NavItem = { to: string; label: string; icon: React.ElementType; exact?: boolean };

const FULL_NAV: NavItem[] = [
  { to: "/crm", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/crm/leads", label: "Leads", icon: Users },
  { to: "/crm/quotations", label: "Quotations", icon: FileText },
  { to: "/crm/tasks", label: "Tasks", icon: ListChecks },
  { to: "/crm/visa", label: "Visa", icon: Plane },
  { to: "/crm/customers", label: "Customers", icon: UserCheck },
  { to: "/crm/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/crm/documents", label: "Documents", icon: ClipboardList },
  { to: "/crm/packages", label: "Packages", icon: Pkg },
  { to: "/crm/employees", label: "Employees", icon: Briefcase },
  { to: "/crm/vendors", label: "Vendors", icon: Building2 },

  { to: "/crm/payment-requests", label: "Payment Requests", icon: Receipt },
  { to: "/crm/settings", label: "Settings", icon: Settings },
];

function getNavForUser(auth: AuthUser): NavItem[] {
  // Nikita
  if (auth.role === "admin") {
    return FULL_NAV;
  }

  if (auth.role === "manager") {
    // Manager has access to Employees and Tasks, plus regular modules
    return FULL_NAV.filter((n) => n.label !== "Settings");
  }

  // Employee role
  // Maintain some specific access for demonstration based on old role names if they exist
  const empSpecificNav = FULL_NAV.filter((n) => !["Employees", "Settings", "Payments"].includes(n.label));

  if (auth.name.toLowerCase().includes("nikita")) {
    return FULL_NAV.filter((n) => ["Leads", "Tasks", "Settings", "Payment Requests"].includes(n.label));
  }
  if (auth.name.toLowerCase().includes("aman")) {
    return FULL_NAV.filter((n) => ["Vendors", "Settings", "Tasks", "Payment Requests"].includes(n.label));
  }
  if (auth.name.toLowerCase().includes("deepak")) {
    return FULL_NAV.filter((n) => [
      "Leads",
      "Tasks",
      "Visa",
      "Customers",
      "Bookings",
      "Documents",
      "Vendors",
      "Payment Requests",
      "Settings"
    ].includes(n.label));
  }
  if (auth.name.toLowerCase().includes("puspa")) {
    return FULL_NAV.filter((n) => [
      "Leads",
      "Tasks",
      "Customers",
      "Quotations",
      "Bookings",
      "Documents",
      "Packages",
      "Vendors",
      "Payment Requests",
      "Settings"
    ].includes(n.label));
  }

  return empSpecificNav;
}

function CrmLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [auth, setAuth] = useState<AuthUser | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [profileSection, setProfileSection] = useState<string | null>(null);
  const [employees] = useSupabaseTable<any[]>("employees", []);

  const [appearance] = useLocalStorage("crm-appearance", {
    theme: "light",
    sidebarCompact: false,
    fontSize: "default",
    accentColor: "#f43f5e",
  });
  const isCompact = appearance.sidebarCompact;

  useEffect(() => {

    const user = getAuth();
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    setAuth(user);

    const userNav = getNavForUser(user);
    const hasDashboard = userNav.some((n) => n.to === "/crm");

    if (pathname === "/crm" && !hasDashboard && userNav.length > 0) {
      navigate({ to: userNav[0].to, replace: true });
      return;
    }

    // Employee visiting outside /crm/* → dynamic check
    if (user.role === "employee" && !pathname.startsWith("/crm")) {
      navigate({ to: userNav.length > 0 ? userNav[0].to : "/crm", replace: true });
    }
  }, [pathname, navigate]);

  function handleLogout() {
    clearAuth();
    navigate({ to: "/login" });
  }

  const openProfile = (section?: string) => {
    if (!auth) return;
    if (section) setProfileSection(section);

    const found = employees.find(
      (e: any) => e.name.toLowerCase() === auth.name.toLowerCase() || e.id === auth.empId,
    );

    if (found) {
      setSelectedEmployee(found);
    } else {
      setSelectedEmployee({
        id: auth.empId || "LMH-01",
        name: auth.name,
        avatar: auth.avatar,
        role: auth.role === "admin" ? "HR & Admin Manager" : "Travel Consultant",
        email:
          auth.role === "admin" ? "insurancesolutions58@gmail.com" : "employee@lookmyholidays.in",
        phone: "+91 9887155570",
        joinDate: "2022-01-15",
        status: "Active",
        leads: 0,
        closedDeals: 0,
        revenue: 0,
        rating: 5.0,
        recentActivity: "Active on dashboard",
        description: "Active system user.",
      });
    }
  };

  if (!auth) return null;

  const nav = getNavForUser(auth);
  const isAdmin = auth.role === "admin" || auth.role === "manager";

  return (
    <div className="flex min-h-screen bg-secondary/30">
      {/* Sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen ${isCompact ? "w-20" : "w-64"} shrink-0 flex-col border-r border-border bg-sidebar p-4 lg:flex transition-all duration-300`}
      >
        <Link
          to="/crm"
          className={`mb-6 flex items-center ${isCompact ? "justify-center" : "px-2"}`}
        >
          {isCompact ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3b9f4e] text-white shadow-sm">
              <span className="font-display font-bold text-2xl italic pr-1">H</span>
            </div>
          ) : (
            <img
              src={logoImg}
              alt="LookMyHolidays"
              className="h-12 w-auto dark:brightness-0 dark:invert transition-all"
            />
          )}
        </Link>

        {/* Role badge */}
        {!isCompact && (
          <div
            className={`mb-4 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${isAdmin ? "bg-primary/10 text-primary" : "bg-violet-100 text-violet-700"}`}
          >
            <Shield className="h-3.5 w-3.5" />
            {isAdmin ? "Admin Portal" : `Employee — ${auth.name.split(" ")[0]}`}
          </div>
        )}

        <nav className="flex-1 space-y-0.5 overflow-y-auto">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                title={isCompact ? n.label : undefined}
                className={`flex items-center ${isCompact ? "justify-center p-3" : "gap-3 px-3 py-2.5"} rounded-lg text-sm font-medium transition-colors ${active
                    ? "bg-primary text-primary-foreground shadow-card"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
              >
                <Icon className={isCompact ? "h-6 w-6" : "h-5 w-5"} />
                {!isCompact && n.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title={isCompact ? "Logout" : undefined}
          className={`mt-4 flex items-center ${isCompact ? "justify-center p-3" : "gap-2 px-3 py-2.5"} rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-red-100 hover:text-red-600 transition-colors`}
        >
          <LogOut className={isCompact ? "h-6 w-6" : "h-5 w-5"} /> {!isCompact && "Logout"}
        </button>

      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-8">
          {isAdmin && (
            <div className="flex-1">
              <CommandPalette />
            </div>
          )}

          {/* Right side items */}
          <div className="ml-auto flex items-center gap-4">
            {/* Interactive User profile block */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 border-l border-border pl-4 outline-none hover:opacity-85 transition-opacity text-left cursor-pointer">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold border border-primary/20 shrink-0">
                    {auth.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold leading-tight text-foreground">
                      {auth.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isAdmin ? "Administrator" : "Employee"}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[400px] mt-2 rounded-xl p-3 shadow-lg">
                <DropdownMenuLabel className="font-normal border-b border-border pb-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold border border-primary/20 shrink-0 text-lg">
                      {auth.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-[15px] font-bold leading-none text-foreground">{auth.name}</p>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {auth.role === "admin" ? "Administrator" : "Team Member"}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  <div className="px-2 py-1.5 col-span-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mt-1">
                    Profile & Info
                  </div>
                  <DropdownMenuItem onClick={() => openProfile("Personal Profile")} className="cursor-pointer gap-2.5 py-2.5 text-sm rounded-lg hover:bg-slate-50">
                    <User className="h-4 w-4 text-blue-500" />
                    <span>Personal Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openProfile("Employment Details")} className="cursor-pointer gap-2.5 py-2.5 text-sm rounded-lg hover:bg-slate-50">
                    <UserSquare className="h-4 w-4 text-indigo-500" />
                    <span>Employee Details</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openProfile("Academic Background")} className="cursor-pointer gap-2.5 py-2.5 text-sm rounded-lg hover:bg-slate-50">
                    <GraduationCap className="h-4 w-4 text-purple-500" />
                    <span>Academic Details</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openProfile("Family Information")} className="cursor-pointer gap-2.5 py-2.5 text-sm rounded-lg hover:bg-slate-50">
                    <Users className="h-4 w-4 text-pink-500" />
                    <span>Family Info</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openProfile("Contact Information")} className="cursor-pointer gap-2.5 py-2.5 text-sm rounded-lg hover:bg-slate-50">
                    <Phone className="h-4 w-4 text-emerald-500" />
                    <span>Contact</span>
                  </DropdownMenuItem>

                  <div className="px-2 py-1.5 col-span-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mt-2">
                    Work & Docs
                  </div>
                  <DropdownMenuItem onClick={() => openProfile("Reporting Structure")} className="cursor-pointer gap-2.5 py-2.5 text-sm rounded-lg hover:bg-slate-50">
                    <Network className="h-4 w-4 text-amber-500" />
                    <span>Reporting Structure</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openProfile("Career History")} className="cursor-pointer gap-2.5 py-2.5 text-sm rounded-lg hover:bg-slate-50">
                    <Briefcase className="h-4 w-4 text-rose-500" />
                    <span>Career</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openProfile("Documents Center")} className="cursor-pointer gap-2.5 py-2.5 text-sm rounded-lg hover:bg-slate-50">
                    <FolderOpen className="h-4 w-4 text-cyan-500" />
                    <span>Documents Center</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openProfile("Verification Details")} className="cursor-pointer gap-2.5 py-2.5 text-sm rounded-lg hover:bg-slate-50">
                    <ShieldCheck className="h-4 w-4 text-teal-500" />
                    <span>Verification Details</span>
                  </DropdownMenuItem>

                  <div className="px-2 py-1.5 col-span-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mt-2">
                    System
                  </div>
                  <DropdownMenuItem onClick={() => openProfile("Quick Actions")} className="cursor-pointer gap-2.5 py-2.5 text-sm rounded-lg hover:bg-slate-50">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span>Quick Actions</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate({ to: "/crm/settings" })}
                    className="cursor-pointer gap-2.5 py-2.5 text-sm rounded-lg hover:bg-slate-50"
                  >
                    <Settings className="h-4 w-4 text-slate-500" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer gap-2 py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg justify-center font-medium"
                >
                  <LogOut className="h-4 w-4 text-red-600" />
                  <span>Log out securely</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>

        <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border/50">
          Designed and deployed by Jatin Jangid
        </footer>
      </div>

      <EmployeeProfileModal
        employee={selectedEmployee}
        open={!!selectedEmployee}
        initialScrollToId={profileSection}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedEmployee(null);
            setProfileSection(null);
          }
        }}
        onAssignTask={() => {
          setSelectedEmployee(null);
          navigate({ to: "/crm/employees" });
        }}
        onApproveLeave={() => {
          setSelectedEmployee(null);
          navigate({ to: "/crm/employees" });
        }}
      />
    </div>
  );
}
