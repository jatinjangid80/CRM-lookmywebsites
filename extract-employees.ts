import { INITIAL_EMPLOYEE_DETAILS } from "./src/lib/employee-profile-defaults.ts";
export type Role =
  | "Operations Manager"
  | "Travel Consultant"
  | "Visa Executive"
  | "Accounts"
  | "Marketing"
  | "Sales Executive"
  | "Executive"
  | "HR & Admin Manager"
  | "Accounts Manager"
  | "Ceo Founder"
  | "Insurance Sales"
  | "Web Design Internship";

export type AccessRole = "Admin" | "Manager" | "Employee";
export interface Employee {
  id: string;
  name: string;
  avatar: string;
  role: Role | string;
  email: string;
  phone: string;
  joinDate: string;
  status: "Active" | "On Leave" | "Ex-Employee";
  leads: number;
  closedDeals: number;
  revenue: number;
  rating: number;
  recentActivity: string;
  description: string;
  department?: string;
  accessRole?: AccessRole;
  profile_details?: any;
  notes?: { text: string; createdAt: string }[];
}

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "LMH-01",
    name: "Manvendra Singhal",
    avatar: "",
    role: "Ceo Founder",
    email: "bookings@lookmyholidays.in",
    phone: "9413095483",
    joinDate: "2008-06-01",
    status: "Active",
    leads: 0,
    closedDeals: 0,
    revenue: 0,
    rating: 5.0,
    recentActivity: "Updated company HR policies.",
    description: "CEO Founder of LookMyHolidays.",
    department: "Management",
    accessRole: "Admin",
    profile_details: INITIAL_EMPLOYEE_DETAILS["LMH-01"],
  },
  {
    id: "LMH-02",
    name: "Suman Yadav",
    avatar: "",
    role: "HR & Admin Manager",
    email: "insurancesolutions58@gmail.com",
    phone: "9887155570",
    joinDate: "2017-01-09",
    status: "Active",
    leads: 0,
    closedDeals: 0,
    revenue: 0,
    rating: 5.0,
    recentActivity: "Handled monthly operation logs.",
    description: "Sales & Marketing",
    department: "Insurance & Travel",
    accessRole: "Manager",
    profile_details: INITIAL_EMPLOYEE_DETAILS["LMH-02"],
  },
  {
    id: "LMH-04",
    name: "Nikita Birwa",
    avatar: "",
    role: "Insurance Sales",
    email: "info.insurance58@gmail.com",
    phone: "9783395483",
    joinDate: "2025-11-19",
    status: "Active",
    leads: 45,
    closedDeals: 20,
    revenue: 1200000,
    rating: 4.6,
    recentActivity: "Logged new insurance query.",
    description: "Telecaller Sales & Marketing",
    department: "Insurance",
    accessRole: "Employee",
    profile_details: INITIAL_EMPLOYEE_DETAILS["LMH-04"],
  },
  {
    id: "LMH-03",
    name: "Aman Sharma",
    avatar: "",
    role: "Accounts Manager",
    email: "Accounts@lookmyholidays.in",
    phone: "9660095483",
    joinDate: "2026-01-01",
    status: "Active",
    leads: 0,
    closedDeals: 0,
    revenue: 0,
    rating: 5.0,
    recentActivity: "Processed tax records.",
    description: "",
    department: "Accounting",
    accessRole: "Manager",
    profile_details: INITIAL_EMPLOYEE_DETAILS["LMH-03"],
  },
  {
    id: "LMH-05",
    name: "Pushplata Kriplani",
    avatar: "",
    role: "Sales Executive",
    email: "resv@lookmyholidays.in",
    phone: "9928795483",
    joinDate: "2025-12-22",
    status: "Active",
    leads: 32,
    closedDeals: 15,
    revenue: 850000,
    rating: 4.8,
    recentActivity: "Sent out quotations.",
    description: "Sales & Marketing",
    department: "Travel",
    accessRole: "Employee",
    profile_details: INITIAL_EMPLOYEE_DETAILS["LMH-05"],
  },
  {
    id: "LMH-06",
    name: "Deepak Yogi",
    avatar: "",
    role: "Executive",
    email: "visa@lookmyholidays.in",
    phone: "9636305562",
    joinDate: "2026-05-21",
    status: "Active",
    leads: 60,
    closedDeals: 40,
    revenue: 800000,
    rating: 4.7,
    recentActivity: "Updated visa requirements checklist.",
    description: "Sales & Marketing",
    department: "Visa Exctive",
    accessRole: "Employee",
    profile_details: INITIAL_EMPLOYEE_DETAILS["LMH-06"],
  },
  {
    id: "LMH-07",
    name: "Jatin Jangid",
    avatar: "",
    role: "Web Design Internship",
    email: "NA",
    phone: "NA",
    joinDate: "2026-06-18",
    status: "Active",
    leads: 0,
    closedDeals: 0,
    revenue: 0,
    rating: 5.0,
    recentActivity: "Designed fresh layouts.",
    description: "",
    department: "Internship",
    accessRole: "Employee",
    profile_details: INITIAL_EMPLOYEE_DETAILS["LMH-07"],
  },
];
