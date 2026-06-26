//#region node_modules/.nitro/vite/services/ssr/assets/auth-B0Z-CWJL.js
var MOCK_USERS = [
	{
		username: "admin",
		password: "admin123",
		user: {
			role: "admin",
			name: "Manvendra Singhal",
			empId: "LMH-01",
			avatar: "/avatars/manvendra.png"
		}
	},
	{
		username: "admin2",
		password: "admin123",
		user: {
			role: "admin",
			name: "System Admin",
			empId: "LMH-00",
			avatar: "https://i.pravatar.cc/80?img=11"
		}
	},
	{
		username: "manvendra",
		password: "admin123",
		user: {
			role: "admin",
			name: "Manvendra Singhal",
			empId: "LMH-01",
			avatar: "/avatars/manvendra.png"
		}
	},
	{
		username: "nikita",
		password: "emp123",
		user: {
			role: "employee",
			name: "Nikita Bairwa",
			empId: "LMH-02",
			avatar: "/avatars/nikita.jpeg"
		}
	},
	{
		username: "pushplata",
		password: "emp123",
		user: {
			role: "employee",
			name: "Pushplata Kriplani",
			empId: "LMH-03",
			avatar: "/avatars/pushplata.png"
		}
	},
	{
		username: "aman",
		password: "emp123",
		user: {
			role: "employee",
			name: "AMAN SHARMA",
			empId: "LMH-04",
			avatar: "/avatars/aman.jpeg"
		}
	},
	{
		username: "deepak",
		password: "emp123",
		user: {
			role: "employee",
			name: "Deepak Kumar",
			empId: "LMH-05",
			avatar: "/avatars/deepak.jpeg"
		}
	}
];
var AUTH_KEY = "crm_auth_v1";
function getAuth() {
	try {
		const raw = localStorage.getItem(AUTH_KEY);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
function setAuth(user) {
	localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}
function clearAuth() {
	localStorage.removeItem(AUTH_KEY);
}
function login(username, password) {
	const match = MOCK_USERS.find((u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password);
	if (match) {
		setAuth(match.user);
		return match.user;
	}
	try {
		const raw = localStorage.getItem("crm_employees_v3");
		if (raw) {
			const dynamicMatch = JSON.parse(raw).find((emp) => emp.username && emp.username.toLowerCase() === username.trim().toLowerCase() && emp.password === password);
			if (dynamicMatch) {
				const user = {
					role: dynamicMatch.role === "HR & Admin Manager" || dynamicMatch.role === "admin" ? "admin" : "employee",
					name: dynamicMatch.name,
					empId: dynamicMatch.id,
					avatar: dynamicMatch.avatar || "",
					email: dynamicMatch.email,
					phone: dynamicMatch.phone
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
//#endregion
export { setAuth as i, getAuth as n, login as r, clearAuth as t };
