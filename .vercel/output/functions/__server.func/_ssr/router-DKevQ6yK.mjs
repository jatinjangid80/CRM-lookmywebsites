import { i as __toESM } from "../_runtime.mjs";
import { t as lookmyholidays_default } from "./lookmyholidays-BFBoVuwX.mjs";
import { n as getAuth } from "./auth-B0Z-CWJL.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as leads } from "./mock-data-4__fbKqF.mjs";
import { t as GoogleOAuthProvider } from "../_libs/react-oauth__google.mjs";
import { n as Route$15 } from "./crm.employees-B3X2ArRi.mjs";
import { t as Route$16 } from "./crm.packages-CdSm2AnR.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DKevQ6yK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DwNF6QU6.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/crm",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go to CRM"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$14 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "LookMyHolidays CRM" },
			{
				name: "description",
				content: "LookMyHolidays CRM Portal"
			},
			{
				name: "author",
				content: "LookMyHolidays"
			},
			{
				property: "og:title",
				content: "LookMyHolidays CRM"
			},
			{
				property: "og:description",
				content: "LookMyHolidays CRM Portal"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:site",
				content: ""
			}
		],
		links: [{
			rel: "icon",
			type: "image/jpeg",
			href: lookmyholidays_default
		}, {
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$14.useRouteContext();
	(0, import_react.useEffect)(() => {
		try {
			if (!window.localStorage.getItem("crm_data_cleared_v1")) {
				[
					"crm_bookings",
					"crm_leads_v2",
					"crm_customers_v2",
					"crm_employees_v3",
					"crm_tasks_v1",
					"crm_leaves_v1",
					"crm_attendance_v2",
					"crm_vendors_v2",
					"crm_packages",
					"crm_visa_apps_v2",
					"crm_visa_requirements"
				].forEach((key) => window.localStorage.removeItem(key));
				window.localStorage.setItem("crm_data_cleared_v1", "true");
				window.location.reload();
				return;
			}
			const stored = window.localStorage.getItem("crm-appearance");
			if (stored) {
				const appearance = JSON.parse(stored);
				const root = window.document.documentElement;
				root.classList.remove("light", "dark");
				if (appearance.theme === "system") {
					if ((window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") === "dark") root.classList.add("dark");
				} else if (appearance.theme === "dark") root.classList.add("dark");
				if (appearance.fontSize === "small") root.style.fontSize = "14px";
				else if (appearance.fontSize === "large") root.style.fontSize = "18px";
				else root.style.fontSize = "16px";
				const colorMap = {
					"#f43f5e": "0.6 0.2 20",
					"#3b82f6": "0.6 0.15 250",
					"#10b981": "0.65 0.15 150",
					"#8b5cf6": "0.6 0.18 290",
					"#f59e0b": "0.7 0.2 45",
					"#06b6d4": "0.7 0.12 210"
				};
				if (appearance.accentColor && colorMap[appearance.accentColor]) root.style.setProperty("--primary", `oklch(${colorMap[appearance.accentColor]})`);
				else root.style.removeProperty("--primary");
			}
		} catch (e) {
			console.error("Error applying appearance settings:", e);
		}
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleOAuthProvider, {
		clientId: "",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
			client: queryClient,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
				position: "top-right",
				closeButton: true,
				richColors: true
			})]
		})
	});
}
var $$splitComponentImporter$13 = () => import("./login-C_Bb2iuA.mjs");
var Route$13 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./crm-CSPef-cB.mjs");
var Route$12 = createFileRoute("/crm")({
	head: () => ({ meta: [{ title: "CRM — LookMyHolidays" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./routes-DTEZEvkE.mjs");
var Route$11 = createFileRoute("/")({
	beforeLoad: () => {
		throw redirect({ to: getAuth() ? "/crm" : "/login" });
	},
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./crm.index-DLLctKun.mjs");
var Route$10 = createFileRoute("/crm/")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var AVATARS$1 = [
	"",
	"",
	"",
	"",
	"",
	"",
	""
];
leads.map((l, i) => ({
	...l,
	avatar: AVATARS$1[i % AVATARS$1.length],
	notes: ""
}));
var $$splitComponentImporter$9 = () => import("./crm.visa-DjgMEPOU.mjs");
var Route$9 = createFileRoute("/crm/visa")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./crm.vendors-zFp1nEsM.mjs");
var Route$8 = createFileRoute("/crm/vendors")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./crm.tasks-CXarnG6i.mjs");
var Route$7 = createFileRoute("/crm/tasks")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./crm.settings-B2VZxGzK.mjs");
var Route$6 = createFileRoute("/crm/settings")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./crm.reports-B6YgHfWZ.mjs");
var Route$5 = createFileRoute("/crm/reports")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./crm.payments-up_KTtZK.mjs");
var Route$4 = createFileRoute("/crm/payments")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./crm.leads-BASTXIsQ.mjs");
var Route$3 = createFileRoute("/crm/leads")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var AVATARS = [""];
leads.map((l, i) => ({
	...l,
	avatar: AVATARS[i % AVATARS.length],
	notes: ""
}));
var $$splitComponentImporter$2 = () => import("./crm.documents-DY-lh4lc.mjs");
var Route$2 = createFileRoute("/crm/documents")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
/** Read a File as a base64 data URL (async) */
var $$splitComponentImporter$1 = () => import("./crm.customers-CwmLYrGK.mjs");
var Route$1 = createFileRoute("/crm/customers")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./crm.bookings-CpxoEPaa.mjs");
var Route = createFileRoute("/crm/bookings")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var LoginRoute = Route$13.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$14
});
var CrmRoute = Route$12.update({
	id: "/crm",
	path: "/crm",
	getParentRoute: () => Route$14
});
var IndexRoute = Route$11.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$14
});
var CrmIndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => CrmRoute
});
var CrmVisaRoute = Route$9.update({
	id: "/visa",
	path: "/visa",
	getParentRoute: () => CrmRoute
});
var CrmVendorsRoute = Route$8.update({
	id: "/vendors",
	path: "/vendors",
	getParentRoute: () => CrmRoute
});
var CrmTasksRoute = Route$7.update({
	id: "/tasks",
	path: "/tasks",
	getParentRoute: () => CrmRoute
});
var CrmSettingsRoute = Route$6.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => CrmRoute
});
var CrmReportsRoute = Route$5.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => CrmRoute
});
var CrmPaymentsRoute = Route$4.update({
	id: "/payments",
	path: "/payments",
	getParentRoute: () => CrmRoute
});
var CrmPackagesRoute = Route$16.update({
	id: "/packages",
	path: "/packages",
	getParentRoute: () => CrmRoute
});
var CrmLeadsRoute = Route$3.update({
	id: "/leads",
	path: "/leads",
	getParentRoute: () => CrmRoute
});
var CrmEmployeesRoute = Route$15.update({
	id: "/employees",
	path: "/employees",
	getParentRoute: () => CrmRoute
});
var CrmDocumentsRoute = Route$2.update({
	id: "/documents",
	path: "/documents",
	getParentRoute: () => CrmRoute
});
var CrmCustomersRoute = Route$1.update({
	id: "/customers",
	path: "/customers",
	getParentRoute: () => CrmRoute
});
var CrmRouteChildren = {
	CrmBookingsRoute: Route.update({
		id: "/bookings",
		path: "/bookings",
		getParentRoute: () => CrmRoute
	}),
	CrmCustomersRoute,
	CrmDocumentsRoute,
	CrmEmployeesRoute,
	CrmLeadsRoute,
	CrmPackagesRoute,
	CrmPaymentsRoute,
	CrmReportsRoute,
	CrmSettingsRoute,
	CrmTasksRoute,
	CrmVendorsRoute,
	CrmVisaRoute,
	CrmIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	CrmRoute: CrmRoute._addFileChildren(CrmRouteChildren),
	LoginRoute
};
var routeTree = Route$14._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
