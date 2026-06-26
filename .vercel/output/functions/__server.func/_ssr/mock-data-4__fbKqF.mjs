//#region node_modules/.nitro/vite/services/ssr/assets/mock-data-4__fbKqF.js
var leads = [];
var bookings = [];
var revenueByMonth = [];
function formatINR(n) {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0
	}).format(n);
}
//#endregion
export { revenueByMonth as i, formatINR as n, leads as r, bookings as t };
