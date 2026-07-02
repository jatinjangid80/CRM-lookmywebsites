/* ─── Auth types ─── */
import { supabase } from "./supabase";
export type UserRole = "admin" | "manager" | "employee";

export interface AuthUser {
  role: UserRole;
  name: string;
  empId?: string; // set for employees
  avatar?: string;
  email?: string;
  phone?: string;
  password?: string;
}

/* ─── Mock credentials ─── */
export interface MockCredential {
  username: string;
  password: string;
  user: AuthUser;
}

export const MOCK_USERS: MockCredential[] = [
  {
    username: "admin",
    password: "admin123",
    user: {
      role: "admin",
      name: "Manvendra Singhal",
      empId: "LMH-01",
      avatar: "",
      email: "bookings@lookmyholidays.in",
      phone: "9413095483",
    },
  },
  {
    username: "manvendra",
    password: "admin123",
    user: {
      role: "admin",
      name: "Manvendra Singhal",
      empId: "LMH-01",
      avatar: "",
      email: "bookings@lookmyholidays.in",
      phone: "9413095483",
    },
  },
  {
    username: "suman",
    password: "emp123",
    user: {
      role: "manager",
      name: "Suman Yadav",
      empId: "LMH-02",
      avatar: "",
      email: "insurancesolutions58@gmail.com",
      phone: "9887155570",
    },
  },
  {
    username: "nikita",
    password: "emp123",
    user: {
      role: "employee",
      name: "Nikita Birwa",
      empId: "LMH-04",
      avatar: "",
      email: "info.insurance58@gmail.com",
      phone: "9783395483",
    },
  },
  {
    username: "aman",
    password: "emp123",
    user: {
      role: "manager",
      name: "Aman Sharma",
      empId: "LMH-03",
      avatar: "",
      email: "Accounts@lookmyholidays.in",
      phone: "9660095483",
    },
  },
  {
    username: "pushplata",
    password: "emp123",
    user: {
      role: "employee",
      name: "Pushplata Kriplani",
      empId: "LMH-05",
      avatar: "",
      email: "resv@lookmyholidays.in",
      phone: "9928795483",
    },
  },
  {
    username: "deepak",
    password: "emp123",
    user: {
      role: "employee",
      name: "Deepak Yogi",
      empId: "LMH-06",
      avatar: "",
      email: "visa@lookmyholidays.in",
      phone: "9636305562",
    },
  },
  {
    username: "jatin",
    password: "emp123",
    user: {
      role: "employee",
      name: "Jatin Jangid",
      empId: "LMH-07",
      avatar: "",
      email: "NA",
      phone: "NA",
    },
  },
];

/* ─── Storage key ─── */
const AUTH_KEY = "crm_auth_v1";

/* ─── Helpers ─── */
export function getAuth(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setAuth(user: AuthUser): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
  localStorage.removeItem(AUTH_KEY);
}

export async function login(username: string, password: string): Promise<AuthUser | null> {
  const match = MOCK_USERS.find(
    (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password,
  );
  if (match) {
    setAuth(match.user);
    return match.user;
  }

  // Check dynamic employees from Supabase
  try {
    const { data } = await supabase.from("employees").select("*");
    if (data) {
      const dynamicMatch = data.find(
        (emp: any) =>
          emp.profile_details?.username &&
          emp.profile_details.username.toLowerCase() === username.trim().toLowerCase() &&
          emp.profile_details.password === password,
      );
      if (dynamicMatch) {
        const accessRole = dynamicMatch.accessRole
          ? dynamicMatch.accessRole.toLowerCase()
          : dynamicMatch.role === "HR & Admin Manager" || dynamicMatch.role === "admin"
            ? "admin"
            : "employee";
        const user: AuthUser = {
          role: accessRole as UserRole,
          name: dynamicMatch.name,
          empId: dynamicMatch.id,
          avatar: dynamicMatch.avatar || "",
          email: dynamicMatch.email,
          phone: dynamicMatch.phone,
        };
        setAuth(user);
        return user;
      }
    }
  } catch (e) {
    console.error("Error reading employees from Supabase for login", e);
  }

  return null;
}
