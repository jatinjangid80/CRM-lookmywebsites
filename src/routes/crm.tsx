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
import logoImg from "../assets/lookmyholidays.jpeg";

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
  { to: "/crm/payments", label: "Payments", icon: CreditCard },
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
  const empSpecificNav = FULL_NAV.filter((n) => !["Employees", "Settings"].includes(n.label));

  if (auth.name.toLowerCase().includes("nikita")) {
    return FULL_NAV.filter((n) => ["Leads", "Tasks", "Settings"].includes(n.label));
  }
  if (auth.name.toLowerCase().includes("aman")) {
    return FULL_NAV.filter((n) => ["Vendors", "Payments", "Settings", "Tasks"].includes(n.label));
  }
  if (auth.name.toLowerCase().includes("deepak")) {
    return FULL_NAV.filter((n) => ["Visa", "Tasks", "Settings"].includes(n.label));
  }

  return empSpecificNav;
}

const MOCK_EMPLOYEE_DETAILS = [
  {
    id: "LMH-01",
    name: "suman yadav",
    avatar: "/avatars/suman.png",
    role: "HR & Admin Manager",
    email: "insurancesolutions58@gmail.com",
    phone: "+91 9887155570",
    joinDate: "2022-01-15",
    status: "Active",
    leads: 0,
    closedDeals: 0,
    revenue: 0,
    rating: 5.0,
    recentActivity: "Updated company HR policies.",
    description: "Oversees Human Resources and Administrative operations.",
  },
  {
    id: "LMH-02",
    name: "Nikita Bairwa",
    avatar: "/avatars/nikita.jpeg",
    role: "Sales Executive",
    email: "info.insurance58@gmail.com",
    phone: "+91 9783395483",
    joinDate: "2023-03-10",
    status: "Active",
    leads: 45,
    closedDeals: 20,
    revenue: 1200000,
    rating: 4.6,
    recentActivity: "Closed package for Dubai",
    description: "Driving sales and client acquisition.",
  },
  {
    id: "LMH-03",
    name: "Pushplata Kriplani",
    avatar: "/avatars/pushplata.png",
    role: "Executive",
    email: "resv@lookmyholidays.in",
    phone: "+91 9928795483",
    joinDate: "2022-06-25",
    status: "Active",
    leads: 30,
    closedDeals: 15,
    revenue: 850000,
    rating: 4.8,
    recentActivity: "Confirmed reservation for Manali trip",
    description: "Handles reservations and customer support.",
  },
  {
    id: "LMH-04",
    name: "AMAN SHARMA",
    avatar: "/avatars/aman.jpeg",
    role: "Accounts Manager",
    email: "accounts@lookmyholidays.in",
    phone: "+91 9660095483",
    joinDate: "2021-11-05",
    status: "Active",
    leads: 0,
    closedDeals: 0,
    revenue: 0,
    rating: 4.9,
    recentActivity: "Cleared monthly invoices",
    description: "Manages financial transactions and payroll.",
  },
  {
    id: "LMH-05",
    name: "Deepak Kumar",
    avatar: "/avatars/deepak.jpeg",
    role: "Visa Executive",
    email: "visa@lookmyholidays.in",
    phone: "+91 9636305562",
    joinDate: "2023-08-12",
    status: "Active",
    leads: 0,
    closedDeals: 0,
    revenue: 0,
    rating: 4.7,
    recentActivity: "Submitted Schengen visa files",
    description: "Specializes in international visa processing.",
  },
];

function CrmLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [auth, setAuth] = useState<AuthUser | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);

  const [appearance] = useLocalStorage("crm-appearance", {
    theme: "light",
    sidebarCompact: false,
    fontSize: "default",
    accentColor: "#f43f5e",
  });
  const isCompact = appearance.sidebarCompact;

  useEffect(() => {
    // Migration: Update Suman Yadav to Manvendra Singhal in localStorage
    try {
      const authStored = localStorage.getItem("crm_auth_v1");
      if (authStored) {
        const authObj = JSON.parse(authStored);
        if (authObj.name === "Suman Yadav" || authObj.avatar === "/avatars/suman.jpeg") {
          authObj.name = "Manvendra Singhal";
          authObj.avatar = "/avatars/manvendra.png";
          localStorage.setItem("crm_auth_v1", JSON.stringify(authObj));
        }
      }
      const employeesStored = localStorage.getItem("crm_employees_v3");
      if (employeesStored) {
        const employeesList = JSON.parse(employeesStored);
        let updated = false;
        const newList = employeesList.map((emp: any) => {
          if (
            emp.id === "LMH-01" &&
            (emp.name === "Suman Yadav" || emp.avatar === "/avatars/suman.jpeg")
          ) {
            updated = true;
            return {
              ...emp,
              name: "Manvendra Singhal",
              avatar: "/avatars/manvendra.png",
              description: "Oversees Human Resources and Administrative operations.",
            };
          }
          return emp;
        });
        if (updated) {
          localStorage.setItem("crm_employees_v3", JSON.stringify(newList));
        }
      }
      const detailsStored = localStorage.getItem("crm_employee_details_v2");
      if (detailsStored) {
        const detailsObj = JSON.parse(detailsStored);
        let updatedDetails = false;
        for (const empId in detailsObj) {
          const emp = detailsObj[empId];
          if (emp.manager === "Suman Yadav (LMH-01)") {
            emp.manager = "Manvendra Singhal (LMH-01)";
            updatedDetails = true;
          }
          if (emp.reportingManager === "Suman Yadav (LMH-01)") {
            emp.reportingManager = "Manvendra Singhal (LMH-01)";
            updatedDetails = true;
          }
          if (emp.teamLead === "Suman Yadav") {
            emp.teamLead = empId === "LMH-01" ? "Self" : "Manvendra Singhal";
            updatedDetails = true;
          }
          if (empId === "LMH-01") {
            if (emp.personalEmail === "suman.yadav@gmail.com") {
              emp.personalEmail = "manvendra.singhal@gmail.com";
              updatedDetails = true;
            }
          }
        }
        if (updatedDetails) {
          localStorage.setItem("crm_employee_details_v2", JSON.stringify(detailsObj));
        }
      }
    } catch (e) {
      console.error("Migration error:", e);
    }

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

  const openProfile = () => {
    if (!auth) return;
    try {
      const stored = localStorage.getItem("crm_employees_v3");
      const list = stored ? JSON.parse(stored) : MOCK_EMPLOYEE_DETAILS;
      const found = list.find(
        (e: any) => e.name.toLowerCase() === auth.name.toLowerCase() || e.id === auth.empId,
      );
      if (found) {
        setSelectedEmployee(found);
      } else {
        setSelectedEmployee({
          id: auth.empId || "LMH-01",
          name: auth.name,
          avatar: auth.avatar || "https://i.pravatar.cc/80",
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
    } catch {
      setSelectedEmployee({
        id: auth.empId || "LMH-01",
        name: auth.name,
        avatar: auth.avatar || "https://i.pravatar.cc/80",
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
              className="h-12 w-auto mix-blend-multiply dark:mix-blend-normal dark:bg-white dark:p-1.5 dark:rounded-xl transition-all"
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
                className={`flex items-center ${isCompact ? "justify-center p-3" : "gap-3 px-3 py-2.5"} rounded-lg text-sm font-medium transition-colors ${
                  active
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

        {!isCompact && (
          <div className="mt-2 rounded-2xl border border-sidebar-border bg-sidebar-accent p-3 text-xs">
            <p className="font-semibold">Need help?</p>
            <p className="mt-1 text-sidebar-accent-foreground/70">Contact your support desk.</p>
          </div>
        )}
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
              <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{auth.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {auth.role === "admin" ? "Administrator" : "Team Member"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate({ to: "/crm/settings" })}
                  className="cursor-pointer gap-2 py-2"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer gap-2 py-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="h-4 w-4 text-red-600" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>

      <EmployeeProfileModal
        employee={selectedEmployee}
        open={!!selectedEmployee}
        onOpenChange={(open) => !open && setSelectedEmployee(null)}
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
