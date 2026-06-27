/* ─── Auth types ─── */
export type UserRole = "admin" | "manager" | "employee";

export interface AuthUser {
  role: UserRole;
  name: string;
  empId?: string;   // set for employees
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
      avatar: "/avatars/manvendra.png",
    },
  },
  {
    username: "admin2",
    password: "admin123",
    user: {
      role: "admin",
      name: "System Admin",
      empId: "LMH-00",
      avatar: "https://i.pravatar.cc/80?img=11",
    },
  },
  {
    username: "manvendra",
    password: "admin123",
    user: {
      role: "admin",
      name: "Manvendra Singhal",
      empId: "LMH-01",
      avatar: "/avatars/manvendra.png",
    },
  },
  {
    username: "nikita",
    password: "emp123",
    user: {
      role: "employee",
      name: "Nikita Bairwa",
      empId: "LMH-02",
      avatar: "/avatars/nikita.jpeg",
    },
  },
  {
    username: "pushplata",
    password: "emp123",
    user: {
      role: "employee",
      name: "Pushplata Kriplani",
      empId: "LMH-03",
      avatar: "/avatars/pushplata.png",
    },
  },
  {
    username: "aman",
    password: "emp123",
    user: {
      role: "employee",
      name: "AMAN SHARMA",
      empId: "LMH-04",
      avatar: "/avatars/aman.jpeg",
    },
  },
  {
    username: "deepak",
    password: "emp123",
    user: {
      role: "employee",
      name: "Deepak Kumar",
      empId: "LMH-05",
      avatar: "/avatars/deepak.jpeg",
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

export function login(username: string, password: string): AuthUser | null {
  const match = MOCK_USERS.find(
    (u) =>
      u.username.toLowerCase() === username.trim().toLowerCase() &&
      u.password === password
  );
  if (match) {
    setAuth(match.user);
    return match.user;
  }

  // Check dynamic employees from localStorage
  try {
    const raw = localStorage.getItem("crm_employees_v3");
    if (raw) {
      const list = JSON.parse(raw);
      const dynamicMatch = list.find(
        (emp: any) =>
          emp.username &&
          emp.username.toLowerCase() === username.trim().toLowerCase() &&
          emp.password === password
      );
      if (dynamicMatch) {
        const accessRole = dynamicMatch.accessRole ? dynamicMatch.accessRole.toLowerCase() : (dynamicMatch.role === "HR & Admin Manager" || dynamicMatch.role === "admin" ? "admin" : "employee");
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
    console.error("Error reading crm_employees_v3 for login", e);
  }

  return null;
}
