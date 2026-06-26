import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-PwNqyxv_.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { t as useLocalStorage } from "./use-local-storage-C6y5r3WN.mjs";
import { C as Search, Ct as ChevronUp, Et as Check, St as ChevronsUpDown, T as Plus, Tt as ChevronDown, X as Globe, _ as Stamp, f as Trash2, ft as Download, gt as Clock, l as TriangleAlert, rt as FileText, vt as CircleX, y as SquarePen, yt as CircleCheck } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BvYONHWJ.mjs";
import { t as DeleteConfirmModal } from "./delete-confirm-modal-FSVFJr3i.mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/radix-ui__react-popover.mjs";
import { t as _e } from "../_libs/cmdk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm.visa-DjgMEPOU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Popover = Root2;
var PopoverTrigger = Trigger;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = Content2.displayName;
var Command$1 = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e, {
	ref,
	className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
	...props
}));
Command$1.displayName = _e.displayName;
var CommandInput = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "flex items-center border-b px-3",
	"cmdk-input-wrapper": "",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
		ref,
		className: cn("flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	})]
}));
CommandInput.displayName = _e.Input.displayName;
var CommandList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.List, {
	ref,
	className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
	...props
}));
CommandList.displayName = _e.List.displayName;
var CommandEmpty = import_react.forwardRef((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, {
	ref,
	className: "py-6 text-center text-sm",
	...props
}));
CommandEmpty.displayName = _e.Empty.displayName;
var CommandGroup = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
	ref,
	className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className),
	...props
}));
CommandGroup.displayName = _e.Group.displayName;
var CommandSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Separator, {
	ref,
	className: cn("-mx-1 h-px bg-border", className),
	...props
}));
CommandSeparator.displayName = _e.Separator.displayName;
var CommandItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
	ref,
	className: cn("relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className),
	...props
}));
CommandItem.displayName = _e.Item.displayName;
var CommandShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className),
		...props
	});
};
CommandShortcut.displayName = "CommandShortcut";
var BRAND_STYLE = { background: "var(--gradient-brand)" };
var APPS = [];
var INITIAL_REQUIREMENTS = [];
var STATUS_STYLE = {
	"Pending Documents": "bg-amber-100 text-amber-700",
	Submitted: "bg-blue-100 text-blue-700",
	"Under Review": "bg-violet-100 text-violet-700",
	Approved: "bg-emerald-100 text-emerald-700",
	Rejected: "bg-red-100 text-red-700"
};
var STATUS_ICON = {
	"Pending Documents": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }),
	Submitted: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }),
	"Under Review": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5" }),
	Approved: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }),
	Rejected: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3.5 w-3.5" })
};
var ALL_STATUSES = [
	"Pending Documents",
	"Submitted",
	"Under Review",
	"Approved",
	"Rejected"
];
var COUNTRY_CODES = {
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
	Zimbabwe: "zw"
};
var COUNTRIES_LIST = [
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
	"Zimbabwe"
];
var VISA_TYPES_LIST = [
	"Tourist – Visa on Arrival",
	"Schengen Tourist",
	"Free 30-day on Arrival",
	"Tourist e-Visa",
	"30-day Tourist Visa",
	"14-day Tourist Visa",
	"Business Visa",
	"Student Visa",
	"Transit Visa",
	"Multiple Entry Tourist Visa"
];
var CURRENCY_LIST = [
	"INR",
	"USD",
	"EUR",
	"AED",
	"SGD",
	"THB",
	"GBP",
	"IDR"
];
function VisaPage() {
	const [apps, setApps] = useLocalStorage("crm_visa_apps_v3", APPS);
	const [requirements, setRequirements] = useLocalStorage("crm_visa_requirements", INITIAL_REQUIREMENTS);
	const [activeSubTab, setActiveSubTab] = (0, import_react.useState)("applications");
	const [q, setQ] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("All");
	const [deleteTargetId, setDeleteTargetId] = (0, import_react.useState)(null);
	const [deleteAppTargetId, setDeleteAppTargetId] = (0, import_react.useState)(null);
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	const [appModalOpen, setAppModalOpen] = (0, import_react.useState)(false);
	const [appCustomer, setAppCustomer] = (0, import_react.useState)("");
	const [appCountry, setAppCountry] = (0, import_react.useState)("");
	const [appVisaType, setAppVisaType] = (0, import_react.useState)("");
	const [appAppliedOn, setAppAppliedOn] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [appTravelDate, setAppTravelDate] = (0, import_react.useState)("");
	const [appStatus, setAppStatus] = (0, import_react.useState)("Pending Documents");
	const [appEmbassyRef, setAppEmbassyRef] = (0, import_react.useState)("");
	const getFlagEmoji = (countryName) => {
		return {
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
			Malaysia: "🇲🇾"
		}[countryName] || "🏳️";
	};
	const getRandomAvatar = () => {
		const avatars = [
			"/avatars/aman.jpeg",
			"/avatars/deepak.jpeg",
			"/avatars/manvendra.png",
			"/avatars/nikita.jpeg",
			"/avatars/pushplata.png",
			"/avatars/suman.jpeg"
		];
		return avatars[Math.floor(Math.random() * avatars.length)];
	};
	const handleAddApplication = (e) => {
		e.preventDefault();
		if (!appCustomer || !appCountry || !appVisaType || !appTravelDate) return;
		const match = requirements.find((r) => r.country.toLowerCase() === appCountry.toLowerCase() && r.visaType.toLowerCase() === appVisaType.toLowerCase());
		const initialDocs = match ? match.docs.map((d) => ({
			name: d.name,
			received: false
		})) : [
			{
				name: "Passport copy (front & back)",
				received: false
			},
			{
				name: "Passport-size photo",
				received: false
			},
			{
				name: "Flight tickets",
				received: false
			},
			{
				name: "Hotel bookings",
				received: false
			}
		];
		const newApp = {
			id: `V-${2200 + Math.floor(Math.random() * 1e3)}`,
			customer: appCustomer,
			avatar: getRandomAvatar(),
			country: appCountry,
			flag: getFlagEmoji(appCountry),
			visaType: appVisaType,
			appliedOn: appAppliedOn || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			travelDate: appTravelDate,
			status: appStatus,
			embassyRef: appEmbassyRef || void 0,
			docs: initialDocs
		};
		setApps((prev) => [newApp, ...prev]);
		setAppModalOpen(false);
		setAppCustomer("");
		setAppCountry("");
		setAppVisaType("");
		setAppAppliedOn((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
		setAppTravelDate("");
		setAppStatus("Pending Documents");
		setAppEmbassyRef("");
	};
	const [reqFormMode, setReqFormMode] = (0, import_react.useState)("list");
	const [editingReq, setEditingReq] = (0, import_react.useState)(null);
	const [reqQ, setReqQ] = (0, import_react.useState)("");
	const [formCountry, setFormCountry] = (0, import_react.useState)("");
	const [countryOpen, setCountryOpen] = (0, import_react.useState)(false);
	const [formVisaType, setFormVisaType] = (0, import_react.useState)("");
	const [formDocs, setFormDocs] = (0, import_react.useState)([{
		name: "",
		shortName: ""
	}]);
	const [formUrls, setFormUrls] = (0, import_react.useState)([""]);
	const [formCurrency, setFormCurrency] = (0, import_react.useState)("INR");
	const [formVisaFees, setFormVisaFees] = (0, import_react.useState)("");
	const [formVfsFees, setFormVfsFees] = (0, import_react.useState)("");
	const [formOtherFees, setFormOtherFees] = (0, import_react.useState)("");
	const [formServiceFees, setFormServiceFees] = (0, import_react.useState)("");
	const [formConsulateFees, setFormConsulateFees] = (0, import_react.useState)("");
	const [formUrgentFees, setFormUrgentFees] = (0, import_react.useState)("");
	const [formUrgentFees2, setFormUrgentFees2] = (0, import_react.useState)("");
	const [formExtraName1, setFormExtraName1] = (0, import_react.useState)("");
	const [formExtraFees1, setFormExtraFees1] = (0, import_react.useState)("");
	const [formExtraName2, setFormExtraName2] = (0, import_react.useState)("");
	const [formExtraFees2, setFormExtraFees2] = (0, import_react.useState)("");
	const [formExtraName3, setFormExtraName3] = (0, import_react.useState)("");
	const [formExtraFees3, setFormExtraFees3] = (0, import_react.useState)("");
	const [formTimeRequired, setFormTimeRequired] = (0, import_react.useState)("");
	const [formRemark1, setFormRemark1] = (0, import_react.useState)("");
	const [formRemark2, setFormRemark2] = (0, import_react.useState)("");
	const [formRemark3, setFormRemark3] = (0, import_react.useState)("");
	const [formFiles, setFormFiles] = (0, import_react.useState)([]);
	const resetReqForm = () => {
		setFormCountry("");
		setFormVisaType("");
		setFormDocs([{
			name: "",
			shortName: ""
		}]);
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
	const handleOpenEditReq = (req) => {
		setEditingReq(req);
		setFormCountry(req.country);
		setFormVisaType(req.visaType);
		setFormDocs(req.docs.length > 0 ? req.docs : [{
			name: "",
			shortName: ""
		}]);
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
		setFormDocs([...formDocs, {
			name: "",
			shortName: ""
		}]);
	};
	const handleRemoveDocRow = (idx) => {
		if (formDocs.length > 1) setFormDocs(formDocs.filter((_, i) => i !== idx));
	};
	const handleDocChange = (idx, field, value) => {
		setFormDocs(formDocs.map((doc, i) => i === idx ? {
			name: doc.name,
			shortName: doc.shortName,
			[field]: value
		} : doc));
	};
	const handleAddUrlRow = () => {
		setFormUrls([...formUrls, ""]);
	};
	const handleRemoveUrlRow = (idx) => {
		if (formUrls.length > 1) setFormUrls(formUrls.filter((_, i) => i !== idx));
	};
	const handleUrlChange = (idx, value) => {
		setFormUrls(formUrls.map((url, i) => i === idx ? value : url));
	};
	const handleFileChange = (e) => {
		const files = e.target.files;
		if (!files) return;
		Array.from(files).forEach((file) => {
			const reader = new FileReader();
			reader.onload = (event) => {
				if (event.target?.result) setFormFiles((prev) => [...prev, {
					name: file.name,
					data: event.target?.result,
					size: file.size
				}]);
			};
			reader.readAsDataURL(file);
		});
	};
	const handleRemoveFile = (idx) => {
		setFormFiles(formFiles.filter((_, i) => i !== idx));
	};
	const handleSaveReq = (e) => {
		e.preventDefault();
		if (!formCountry || !formVisaType) return;
		const cleanDocs = formDocs.filter((d) => d.name.trim() !== "");
		const cleanUrls = formUrls.filter((u) => u.trim() !== "");
		const newReq = {
			id: editingReq ? editingReq.id : `REQ-${Math.floor(1e3 + Math.random() * 9e3)}`,
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
			supportFiles: formFiles
		};
		if (editingReq) setRequirements(requirements.map((r) => r.id === editingReq.id ? newReq : r));
		else setRequirements([newReq, ...requirements]);
		setReqFormMode("list");
		resetReqForm();
	};
	const handleDeleteReq = (id) => {
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
	const filteredApps = apps.filter((a) => (filter === "All" || a.status === filter) && (q === "" || a.customer.toLowerCase().includes(q.toLowerCase()) || a.country.toLowerCase().includes(q.toLowerCase())));
	const filteredReqs = requirements.filter((r) => reqQ === "" || r.country.toLowerCase().includes(reqQ.toLowerCase()) || r.visaType.toLowerCase().includes(reqQ.toLowerCase()));
	const counts = { All: apps.length };
	ALL_STATUSES.forEach((s) => {
		counts[s] = apps.filter((a) => a.status === s).length;
	});
	const toggleDoc = (appId, docName) => {
		setApps(apps.map((app) => {
			if (app.id === appId) return {
				...app,
				docs: app.docs.map((doc) => doc.name === docName ? {
					name: doc.name,
					received: !doc.received
				} : doc)
			};
			return app;
		}));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-fade-in",
		children: [
			activeSubTab === "requirements" && reqFormMode !== "list" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-w-4xl mx-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-border bg-card shadow-card overflow-hidden border-t-4 border-t-rose-500",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveReq,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-background border-b border-border px-6 py-4 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-[#1d1d1f] text-white text-[10px] font-mono px-2 py-0.5 rounded tracking-wide shrink-0 inline-flex items-center justify-center font-extrabold select-none",
									children: "VISA"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-sm font-bold text-foreground leading-tight",
									children: "Visa Document"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none",
									children: "Visa Document"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-6 space-y-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "border-b border-border pb-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-sm font-bold text-rose-500 tracking-wide",
											children: "Visa Information (Fees Per Person)"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-4 sm:grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1 flex flex-col justify-end",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "text-xs font-semibold text-muted-foreground flex items-center gap-1",
												children: ["Countries ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-rose-500",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
												open: countryOpen,
												onOpenChange: setCountryOpen,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
													asChild: true,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														variant: "outline",
														role: "combobox",
														"aria-expanded": countryOpen,
														className: `flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${!formCountry && "text-muted-foreground"}`,
														children: [formCountry ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2 overflow-hidden",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full bg-secondary",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
																	height: "20",
																	title: COUNTRY_CODES[formCountry],
																	src: `https://react-circle-flags.pages.dev/${COUNTRY_CODES[formCountry] || "un"}.svg`,
																	alt: ""
																})
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "truncate",
																children: formCountry
															})]
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-normal",
															children: "Select Country"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })]
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
													className: "w-[300px] p-0",
													align: "start",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Command$1, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandInput, {
														placeholder: "Search country...",
														className: "h-9 text-xs"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandEmpty, { children: "No country found." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, { children: COUNTRIES_LIST.map((country) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
														value: country,
														onSelect: (currentValue) => {
															const actualCountry = COUNTRIES_LIST.find((c) => c.toLowerCase() === currentValue.toLowerCase()) || country;
															setFormCountry(actualCountry === formCountry ? "" : actualCountry);
															setCountryOpen(false);
														},
														className: "flex items-center w-full gap-2 px-2 py-1.5 text-sm",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex flex-grow w-0 space-x-2 overflow-hidden items-center",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full bg-secondary",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
																	height: "20",
																	title: COUNTRY_CODES[country],
																	src: `https://react-circle-flags.pages.dev/${COUNTRY_CODES[country] || "un"}.svg`,
																	alt: ""
																})
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "overflow-hidden text-ellipsis whitespace-nowrap",
																children: country
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: `ml-auto h-4 w-4 shrink-0 ${formCountry === country ? "opacity-100" : "opacity-0"}` })]
													}, country)) })] })] })
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "text-xs font-semibold text-muted-foreground flex items-center gap-1",
												children: ["Visa Type ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-rose-500",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: formVisaType,
												required: true,
												onChange: (e) => setFormVisaType(e.target.value),
												className: "flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select Visa"
												}), VISA_TYPES_LIST.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: t,
													children: t
												}, t))]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-4 pt-2",
										children: [formDocs.map((doc, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid gap-4 sm:grid-cols-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														className: "text-xs font-semibold text-muted-foreground flex items-center gap-1",
														children: [
															"Document ",
															idx + 1,
															" ",
															idx === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-rose-500",
																children: "*"
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														placeholder: "Document",
														required: idx === 0,
														value: doc.name,
														onChange: (e) => handleDocChange(idx, "name", e.target.value),
														className: "h-9 text-xs rounded-lg"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														className: "text-xs font-semibold text-muted-foreground flex items-center gap-1",
														children: [
															"Short Name for auto mails ",
															idx + 1,
															" ",
															idx === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-rose-500",
																children: "*"
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex gap-2 items-center",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															placeholder: "Short Name for auto mails",
															required: idx === 0,
															value: doc.shortName,
															onChange: (e) => handleDocChange(idx, "shortName", e.target.value),
															className: "h-9 text-xs rounded-lg flex-1"
														}), formDocs.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															type: "button",
															variant: "ghost",
															size: "icon",
															className: "h-8 w-8 text-rose-500 hover:bg-rose-50 rounded-lg shrink-0",
															onClick: () => handleRemoveDocRow(idx),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
														})]
													})]
												})]
											})
										}, `form-doc-${idx}`)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: handleAddDocRow,
												className: "text-rose-500 hover:text-rose-600 text-xs font-semibold flex items-center gap-1 mt-1.5 transition-colors",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm",
													children: "⊕"
												}), "Add More"]
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-4 pt-2",
										children: [formUrls.map((url, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid gap-4 sm:grid-cols-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "text-xs font-semibold text-muted-foreground",
													children: ["Form Url ", idx + 1]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex gap-2 items-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														placeholder: "Form Url",
														value: url,
														onChange: (e) => handleUrlChange(idx, e.target.value),
														className: "h-9 text-xs rounded-lg flex-1"
													}), formUrls.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														type: "button",
														variant: "ghost",
														size: "icon",
														className: "h-8 w-8 text-rose-500 hover:bg-rose-50 rounded-lg shrink-0",
														onClick: () => handleRemoveUrlRow(idx),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
													})]
												})]
											})
										}, `url-${idx}`)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: handleAddUrlRow,
												className: "text-rose-500 hover:text-rose-600 text-xs font-semibold flex items-center gap-1 mt-1.5 transition-colors",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm",
													children: "⊕"
												}), "Add More"]
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-4 grid-cols-2 sm:grid-cols-6 border-t border-border pt-6",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-muted-foreground",
													children: "Currency"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
													value: formCurrency,
													onChange: (e) => setFormCurrency(e.target.value),
													className: "flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
													children: CURRENCY_LIST.map((curr) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: curr,
														children: curr
													}, curr))
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "text-xs font-semibold text-muted-foreground",
													children: ["Visa Fees ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-rose-500",
														children: "*"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													placeholder: "Visa Fees",
													required: true,
													value: formVisaFees,
													onChange: (e) => setFormVisaFees(e.target.value),
													className: "h-9 text-xs rounded-lg"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-muted-foreground",
													children: "VFS Fees"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													placeholder: "VFS Fees",
													value: formVfsFees,
													onChange: (e) => setFormVfsFees(e.target.value),
													className: "h-9 text-xs rounded-lg"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-muted-foreground",
													children: "Other Fees"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													placeholder: "Other Fees",
													value: formOtherFees,
													onChange: (e) => setFormOtherFees(e.target.value),
													className: "h-9 text-xs rounded-lg"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-muted-foreground",
													children: "Service Fees"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													placeholder: "Service Fees",
													value: formServiceFees,
													onChange: (e) => setFormServiceFees(e.target.value),
													className: "h-9 text-xs rounded-lg"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-muted-foreground",
													children: "Consulate Fees"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													placeholder: "Consulate Fees",
													value: formConsulateFees,
													onChange: (e) => setFormConsulateFees(e.target.value),
													className: "h-9 text-xs rounded-lg"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-4 grid-cols-2 sm:grid-cols-6",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-muted-foreground",
													children: "Urgent Fees"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													placeholder: "Urgent Fees",
													value: formUrgentFees,
													onChange: (e) => setFormUrgentFees(e.target.value),
													className: "h-9 text-xs rounded-lg"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-muted-foreground",
													children: "Urgent Fees 2"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													placeholder: "Urgent Fees 2",
													value: formUrgentFees2,
													onChange: (e) => setFormUrgentFees2(e.target.value),
													className: "h-9 text-xs rounded-lg"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-muted-foreground",
													children: "Extra Name 1"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													placeholder: "Extra Name",
													value: formExtraName1,
													onChange: (e) => setFormExtraName1(e.target.value),
													className: "h-9 text-xs rounded-lg"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-muted-foreground",
													children: "Extra Fees 1"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													placeholder: "Extra Fees",
													value: formExtraFees1,
													onChange: (e) => setFormExtraFees1(e.target.value),
													className: "h-9 text-xs rounded-lg"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-muted-foreground",
													children: "Extra Name 2"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													placeholder: "Extra Name",
													value: formExtraName2,
													onChange: (e) => setFormExtraName2(e.target.value),
													className: "h-9 text-xs rounded-lg"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-muted-foreground",
													children: "Extra Fees 2"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													placeholder: "Extra Fees",
													value: formExtraFees2,
													onChange: (e) => setFormExtraFees2(e.target.value),
													className: "h-9 text-xs rounded-lg"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-4 grid-cols-2 sm:grid-cols-6",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1 sm:col-span-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-muted-foreground",
													children: "Extra Name 3"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													placeholder: "Extra Name",
													value: formExtraName3,
													onChange: (e) => setFormExtraName3(e.target.value),
													className: "h-9 text-xs rounded-lg"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1 sm:col-span-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-muted-foreground",
													children: "Extra Fees 3"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													placeholder: "Extra Fees",
													value: formExtraFees3,
													onChange: (e) => setFormExtraFees3(e.target.value),
													className: "h-9 text-xs rounded-lg"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1 sm:col-span-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-muted-foreground",
													children: "Time Required"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													placeholder: "Time Required",
													value: formTimeRequired,
													onChange: (e) => setFormTimeRequired(e.target.value),
													className: "h-9 text-xs rounded-lg"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1 sm:col-span-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-muted-foreground",
													children: "Remark 1"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													placeholder: "Remark",
													value: formRemark1,
													onChange: (e) => setFormRemark1(e.target.value),
													className: "h-9 text-xs rounded-lg"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-4 sm:grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-xs font-semibold text-muted-foreground",
												children: "Remark 2"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Remark",
												value: formRemark2,
												onChange: (e) => setFormRemark2(e.target.value),
												className: "h-9 text-xs rounded-lg"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-xs font-semibold text-muted-foreground",
												children: "Remark 3"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Remark",
												value: formRemark3,
												onChange: (e) => setFormRemark3(e.target.value),
												className: "h-9 text-xs rounded-lg"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 border-t border-border/50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3 mb-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "file",
													id: "req-support-files-inline",
													multiple: true,
													className: "hidden",
													onChange: handleFileChange
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													type: "button",
													onClick: () => document.getElementById("req-support-files-inline")?.click(),
													variant: "outline",
													className: "h-9 text-xs border border-border bg-background hover:bg-secondary rounded-lg gap-1.5",
													children: "Choose Files"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted-foreground",
													children: formFiles.length > 0 ? `${formFiles.length} file(s) selected` : "No file chosen"
												})
											]
										}), formFiles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2",
											children: formFiles.map((file, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between p-3 border border-border rounded-lg bg-secondary/20",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 overflow-hidden",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-rose-500 shrink-0" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs font-medium truncate",
															children: file.name
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-[10px] text-muted-foreground shrink-0",
															children: [
																"(",
																Math.round(file.size / 1024),
																" KB)"
															]
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													type: "button",
													variant: "ghost",
													size: "icon",
													className: "h-6 w-6 text-muted-foreground hover:text-rose-500 shrink-0",
													onClick: () => handleRemoveFile(idx),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4" })
												})]
											}, file.name))
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-secondary/10 border-t border-border px-6 py-4 flex gap-2 justify-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "rounded-lg text-xs font-semibold px-6 bg-rose-500 hover:bg-rose-600 text-white shadow-sm h-9",
									children: "Save"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setReqFormMode("list"),
									className: "rounded-lg text-xs font-semibold px-6 border border-border bg-background hover:bg-secondary h-9",
									children: "Cancel"
								})]
							})
						]
					})
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-bold",
						children: "Visa Management"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Track applications, document checklists, and setup country-wise requirements."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: activeSubTab === "applications" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setAppModalOpen(true),
							className: "gap-2 rounded-xl",
							style: BRAND_STYLE,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New Application"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: handleOpenAddReq,
							className: "gap-2 rounded-xl",
							style: { background: "var(--gradient-brand)" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New Visa Setup"]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 overflow-x-auto border-b border-border pb-px scrollbar-hide",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveSubTab("applications"),
						className: `whitespace-nowrap px-5 py-2.5 text-sm font-semibold transition-colors border-b-2 ${activeSubTab === "applications" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`,
						children: [
							"📄 Applications Checklist (",
							apps.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveSubTab("requirements"),
						className: `whitespace-nowrap px-5 py-2.5 text-sm font-semibold transition-colors border-b-2 ${activeSubTab === "requirements" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`,
						children: [
							"⚙️ Visa Requirements Setup (",
							requirements.length,
							")"
						]
					})]
				}),
				activeSubTab === "applications" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 grid-cols-2 sm:grid-cols-5",
						children: [
							{
								label: "Pending Docs",
								count: counts["Pending Documents"],
								color: "text-amber-600",
								bg: "bg-amber-50"
							},
							{
								label: "Submitted",
								count: counts["Submitted"],
								color: "text-blue-600",
								bg: "bg-blue-50"
							},
							{
								label: "Under Review",
								count: counts["Under Review"],
								color: "text-violet-600",
								bg: "bg-violet-50"
							},
							{
								label: "Approved",
								count: counts["Approved"],
								color: "text-emerald-600",
								bg: "bg-emerald-50"
							},
							{
								label: "Rejected",
								count: counts["Rejected"],
								color: "text-red-600",
								bg: "bg-red-50"
							}
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `rounded-2xl border border-border bg-card p-4 shadow-card hover:shadow-md transition-shadow`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: s.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `mt-1 font-display text-3xl font-bold ${s.color}`,
								children: s.count
							})]
						}, s.label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative max-w-xs flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "Search customer or country...",
								className: "pl-9 rounded-xl"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: ["All", ...ALL_STATUSES].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setFilter(s),
								className: `rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${filter === s ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-foreground hover:bg-secondary/80"}`,
								children: [
									s,
									" ",
									counts[s] !== void 0 ? `(${counts[s]})` : ""
								]
							}, s))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: filteredApps.map((app) => {
							const docsReceived = app.docs.filter((d) => d.received).length;
							const isOpen = expanded === app.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "overflow-hidden rounded-2xl border border-border bg-card shadow-card hover:shadow-md transition-shadow",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-4 px-5 py-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: app.avatar,
											alt: app.customer,
											className: "h-10 w-10 rounded-full object-cover border border-border"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold",
													children: app.customer
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted-foreground",
													children: app.id
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-0.5 text-sm text-muted-foreground",
												children: [
													app.flag,
													" ",
													app.country,
													" · ",
													app.visaType
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "hidden text-xs text-muted-foreground sm:block",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												"Applied:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-foreground",
													children: app.appliedOn
												})
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												"Travel:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-foreground",
													children: app.travelDate
												})
											] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "hidden w-28 sm:block",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mb-1 text-xs text-muted-foreground",
												children: [
													"Docs ",
													docsReceived,
													"/",
													app.docs.length
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-1.5 w-full overflow-hidden rounded-full bg-secondary",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-full rounded-full bg-primary transition-all",
													style: Object.assign({}, { width: `${Math.round(docsReceived / app.docs.length * 100)}%` })
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[app.status]}`,
											children: [
												STATUS_ICON[app.status],
												" ",
												app.status
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setExpanded(isOpen ? null : app.id),
											className: "rounded-lg p-2 hover:bg-secondary transition-colors",
											children: isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
										})
									]
								}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "border-t border-border bg-secondary/35 px-5 py-5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-6 md:grid-cols-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
													children: "Application Details"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-2.5 text-sm",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex justify-between gap-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-muted-foreground",
																children: "Visa Type:"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-semibold text-right",
																children: app.visaType
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex justify-between border-t border-border pt-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-muted-foreground",
																children: "Applied On:"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-semibold",
																children: app.appliedOn
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex justify-between border-t border-border pt-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-muted-foreground",
																children: "Travel Date:"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-semibold",
																children: app.travelDate
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex justify-between border-t border-border pt-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-muted-foreground",
																children: "Embassy Ref:"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-mono text-xs",
																children: app.embassyRef || "N/A"
															})]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "border-t border-border pt-3",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														variant: "destructive",
														size: "sm",
														className: "w-full gap-2 rounded-xl text-xs font-semibold",
														onClick: () => setDeleteAppTargetId(app.id),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " Delete Application"]
													})
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "md:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, { className: "h-3.5 w-3.5" }), " Document Checklist"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid gap-2 sm:grid-cols-2",
												children: app.docs.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => toggleDoc(app.id, doc.name),
													className: `flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-colors text-left ${doc.received ? "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50" : "border-border bg-background hover:bg-secondary/50"}`,
													children: [doc.received ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 shrink-0 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-4 shrink-0 rounded-full border-2 border-border transition-colors" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: doc.received ? "text-foreground" : "text-muted-foreground",
														children: doc.name
													})]
												}, doc.name))
											})]
										})]
									})
								})]
							}, app.id);
						})
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative max-w-xs flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: reqQ,
							onChange: (e) => setReqQ(e.target.value),
							placeholder: "Search country or visa type...",
							className: "pl-9 rounded-xl"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground ml-auto",
						children: [filteredReqs.length, " configurations setup"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-2xl border border-border bg-card shadow-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground border-b border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3.5",
										children: "Country"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3.5",
										children: "Visa Type"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3.5",
										children: "Required Documents"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3.5",
										children: "Form Links"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3.5",
										children: "Basic Visa Fee"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3.5",
										children: "Time Required"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3.5 text-right",
										children: "Actions"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-border",
								children: filteredReqs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 7,
									className: "px-5 py-12 text-center text-muted-foreground",
									children: "No visa requirements setup. Click \"New Visa Setup\" to create one."
								}) }) : filteredReqs.map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-secondary/20 transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-5 py-4 font-semibold text-foreground flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-4 w-4 text-primary shrink-0" }), req.country]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-4 font-medium text-muted-foreground",
											children: req.visaType
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-xs font-semibold border border-blue-100",
												children: [req.docs.length, " Documents"]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-4",
											children: (() => {
												const totalForms = req.formUrls.length + (req.supportFiles?.length || 0);
												if (totalForms === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground/60",
													children: "—"
												});
												if (totalForms === 1) if (req.formUrls.length === 1) {
													const url = req.formUrls[0];
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
														href: url.startsWith("http") ? url : `https://${url}`,
														target: "_blank",
														rel: "noreferrer",
														className: "inline-flex items-center gap-1 text-primary hover:underline font-medium text-xs",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3 w-3" }), " Download Form (1)"]
													});
												} else {
													const file = req.supportFiles[0];
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														onClick: (e) => {
															e.stopPropagation();
															const link = document.createElement("a");
															link.href = file.data;
															link.download = file.name;
															document.body.appendChild(link);
															link.click();
															document.body.removeChild(link);
														},
														className: "inline-flex items-center gap-1 text-primary hover:underline font-medium text-xs cursor-pointer bg-transparent border-none p-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3 w-3" }), " Download Form (1)"]
													});
												}
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
													asChild: true,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														className: "inline-flex items-center gap-1 text-primary hover:underline font-medium text-xs",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3 w-3" }),
															" Download Forms (",
															totalForms,
															")"
														]
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
													className: "w-64 p-3 text-sm",
													align: "start",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-3",
														children: [req.formUrls.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider",
															children: "Web Links"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "space-y-1",
															children: req.formUrls.map((url, i) => {
																return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
																	href: url.startsWith("http") ? url : `https://${url}`,
																	target: "_blank",
																	rel: "noreferrer",
																	className: "block text-primary hover:underline truncate",
																	children: url
																}, i);
															})
														})] }), req.supportFiles && req.supportFiles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider",
															children: "Files"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "space-y-1",
															children: req.supportFiles.map((file, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: (e) => {
																	e.stopPropagation();
																	const link = document.createElement("a");
																	link.href = file.data;
																	link.download = file.name;
																	document.body.appendChild(link);
																	link.click();
																	document.body.removeChild(link);
																},
																className: "block text-primary hover:underline truncate w-full text-left bg-transparent border-none p-0 cursor-pointer text-sm",
																children: file.name
															}, `file-${i}`))
														})] })]
													})
												})] });
											})()
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-4 font-semibold text-primary",
											children: req.visaFees > 0 ? `${req.currency} ${req.visaFees}` : "N/A"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-4 font-medium text-muted-foreground",
											children: req.timeRequired || "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-4 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-end gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													className: "h-8 w-8 text-muted-foreground hover:text-primary rounded-lg",
													onClick: () => handleOpenEditReq(req),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-4 w-4" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													className: "h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg",
													onClick: () => handleDeleteReq(req.id),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
												})]
											})
										})
									]
								}, req.id))
							})]
						})
					})
				})] })
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeleteConfirmModal, {
				isOpen: deleteTargetId !== null,
				onClose: () => setDeleteTargetId(null),
				onConfirm: confirmDelete,
				title: "Delete Visa Configuration",
				description: "Are you sure you want to delete this visa requirements configuration? This action cannot be undone."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeleteConfirmModal, {
				isOpen: deleteAppTargetId !== null,
				onClose: () => setDeleteAppTargetId(null),
				onConfirm: confirmDeleteApp,
				title: "Delete Visa Application",
				description: "Are you sure you want to delete this customer's visa application? All checklist progress will be lost."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: appModalOpen,
				onOpenChange: setAppModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-lg font-bold",
						children: "New Visa Application"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground mt-1",
						children: "Add a new visa application track for a customer."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleAddApplication,
						className: "space-y-4 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
								children: ["Customer Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "e.g. Ananya Verma",
								value: appCustomer,
								onChange: (e) => setAppCustomer(e.target.value),
								required: true,
								className: "rounded-xl bg-background border-border"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: ["Country ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-500",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: appCountry,
									onChange: (e) => setAppCountry(e.target.value),
									required: true,
									className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Select Country"
									}), COUNTRIES_LIST.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c,
										children: c
									}, c))]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: ["Visa Type ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-500",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: appVisaType,
									onChange: (e) => setAppVisaType(e.target.value),
									required: true,
									className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Select Visa Type"
									}), VISA_TYPES_LIST.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: t,
										children: t
									}, t))]
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "Applied On"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: appAppliedOn,
									onChange: (e) => setAppAppliedOn(e.target.value),
									className: "rounded-xl bg-background border-border"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: ["Travel Date ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-500",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: appTravelDate,
									onChange: (e) => setAppTravelDate(e.target.value),
									required: true,
									className: "rounded-xl bg-background border-border"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: appStatus,
									onChange: (e) => setAppStatus(e.target.value),
									className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Pending Documents",
											children: "Pending Documents"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Submitted",
											children: "Submitted"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Under Review",
											children: "Under Review"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Approved",
											children: "Approved"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Rejected",
											children: "Rejected"
										})
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "Embassy Ref #"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "e.g. SCH-IN-12345",
									value: appEmbassyRef,
									onChange: (e) => setAppEmbassyRef(e.target.value),
									className: "rounded-xl bg-background border-border"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "border-t border-border pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									className: "rounded-xl",
									onClick: () => setAppModalOpen(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "rounded-xl",
									style: BRAND_STYLE,
									children: "Add Application"
								})]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { VisaPage as component };
