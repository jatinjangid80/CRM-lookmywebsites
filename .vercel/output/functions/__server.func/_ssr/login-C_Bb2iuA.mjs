import { i as __toESM } from "../_runtime.mjs";
import { t as lookmyholidays_default } from "./lookmyholidays-BFBoVuwX.mjs";
import { n as getAuth, r as login } from "./auth-B0Z-CWJL.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { St as CircleAlert, i as User, lt as Eye, o as UserCheck, ut as EyeOff, x as Shield, z as Lock } from "../_libs/lucide-react.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-C_Bb2iuA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const navigate = useNavigate();
	const [role, setRole] = (0, import_react.useState)("admin");
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPass, setShowPass] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [dynamicHints, setDynamicHints] = (0, import_react.useState)([]);
	const loadDynamicHints = () => {
		try {
			const raw = localStorage.getItem("crm_employees_v3");
			if (raw) setDynamicHints(JSON.parse(raw).filter((emp) => emp.username && emp.password).map((emp) => ({
				label: emp.name,
				username: emp.username,
				password: emp.password
			})));
		} catch (e) {
			console.error(e);
		}
	};
	(0, import_react.useEffect)(() => {
		loadDynamicHints();
		const onStorage = (e) => {
			if (e.key === "crm_employees_v3") loadDynamicHints();
		};
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);
	(0, import_react.useEffect)(() => {
		loadDynamicHints();
	}, [role]);
	(0, import_react.useEffect)(() => {
		if (getAuth()) navigate({ to: "/crm" });
	}, [navigate]);
	function handleLogin(e) {
		e.preventDefault();
		setError("");
		setLoading(true);
		setTimeout(() => {
			const user = login(username, password);
			if (!user) {
				setError("Invalid username or password. Please try again.");
				setLoading(false);
				return;
			}
			if (user.role !== role) {
				setError(role === "admin" ? "This account is an Employee account. Please select Employee role." : "This account is an Admin account. Please select Admin role.");
				setLoading(false);
				return;
			}
			navigate({ to: "/crm" });
		}, 600);
	}
	const hintUsers = role === "admin" ? [{
		label: "Admin (Manvendra Singhal)",
		username: "admin",
		password: "admin123"
	}] : dynamicHints.length > 0 ? dynamicHints : [
		{
			label: "Nikita Bairwa",
			username: "nikita",
			password: "emp123"
		},
		{
			label: "Pushplata Kriplani",
			username: "pushplata",
			password: "emp123"
		},
		{
			label: "AMAN SHARMA",
			username: "aman",
			password: "emp123"
		},
		{
			label: "Deepak Kumar",
			username: "deepak",
			password: "emp123"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen overflow-hidden bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden lg:flex lg:w-[52%] flex-col justify-between p-12 text-white",
			style: { background: "var(--gradient-brand)" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: lookmyholidays_default,
						alt: "LookMyHolidays",
						className: "h-12 w-auto rounded-xl mix-blend-multiply"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-display text-5xl font-extrabold leading-tight",
							children: [
								"Grand Journeys",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "opacity-75",
									children: "CRM Portal"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-md text-lg opacity-85",
							children: "Manage leads, bookings, visa applications, tasks, and your team — all in one place."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-3 pt-2",
							children: [
								"Lead Management",
								"Task Assignment",
								"Visa Tracking",
								"Employee Portal",
								"Analytics",
								"Folders"
							].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur",
								children: f
							}, f))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-6 border-t border-white/20 pt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-4",
						children: [
							{
								n: "10k+",
								l: "Happy Travellers"
							},
							{
								n: "5k+",
								l: "Tours Completed"
							},
							{
								n: "100+",
								l: "Destinations"
							}
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl font-extrabold",
							children: s.n
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs opacity-75",
							children: s.l
						})] }, s.l))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm font-medium text-white/80",
						children: ["Created by ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-white",
							children: "jatin jangid"
						})]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col items-center justify-center p-6 sm:p-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-8 flex items-center gap-2 lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: lookmyholidays_default,
					alt: "LookMyHolidays",
					className: "h-10 w-auto rounded-xl mix-blend-multiply"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl font-bold",
						children: "Welcome back"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Sign in to your CRM account to continue."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex rounded-2xl border border-border bg-secondary/40 p-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setRole("admin");
								setError("");
								setUsername("");
								setPassword("");
							},
							className: `flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${role === "admin" ? "bg-card shadow-md text-foreground" : "text-muted-foreground hover:text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4 text-primary" }), "Admin"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setRole("employee");
								setError("");
								setUsername("");
								setPassword("");
							},
							className: `flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${role === "employee" ? "bg-card shadow-md text-foreground" : "text-muted-foreground hover:text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4 text-primary" }), "Employee"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleLogin,
						className: "mt-6 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1.5 block text-sm font-semibold",
								children: "Username"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "login-username",
									placeholder: role === "admin" ? "admin" : "e.g. riya",
									value: username,
									onChange: (e) => {
										setUsername(e.target.value);
										setError("");
									},
									className: "pl-9 rounded-xl",
									autoComplete: "username",
									autoFocus: true
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1.5 block text-sm font-semibold",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "login-password",
										type: showPass ? "text" : "password",
										placeholder: "••••••••",
										value: password,
										onChange: (e) => {
											setPassword(e.target.value);
											setError("");
										},
										className: "pl-9 pr-10 rounded-xl",
										autoComplete: "current-password"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowPass((p) => !p),
										className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
										tabIndex: -1,
										children: showPass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
									})
								]
							})] }),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-in fade-in duration-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mt-0.5 h-4 w-4 shrink-0" }), error]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								id: "login-submit-btn",
								type: "submit",
								disabled: loading || !username.trim() || !password,
								className: "mt-2 w-full gap-2 rounded-xl py-5 text-sm font-semibold",
								style: { background: "var(--gradient-brand)" },
								children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" }), "Signing in…"]
								}) : "Sign In"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 rounded-2xl border border-border bg-secondary/40 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: role === "employee" ? "Employee Credentials" : "Admin Credentials"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: loadDynamicHints,
									className: "text-[10px] text-primary font-semibold hover:underline",
									children: "↻ Refresh"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: hintUsers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground text-center py-2",
									children: "No employee credentials set yet. Go to an employee profile → \"Set Login Credentials\"."
								}) : hintUsers.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setUsername(u.username);
										setPassword(u.password);
										setError("");
									},
									className: "flex w-full items-center justify-between rounded-xl border border-border bg-card px-3 py-2 text-xs hover:border-primary/50 hover:bg-primary/5 transition-all",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: u.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground font-mono",
										children: [
											u.username,
											" / ",
											u.password
										]
									})]
								}, u.username))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs text-muted-foreground",
								children: "Click any row to auto-fill credentials."
							})
						]
					})
				]
			})]
		})]
	});
}
//#endregion
export { LoginPage as component };
