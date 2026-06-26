import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-local-storage-C6y5r3WN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useLocalStorage(key, initialValue) {
	const [storedValue, setStoredValue] = (0, import_react.useState)(() => {
		try {
			if (typeof window === "undefined") return initialValue;
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error("Error reading from localStorage", error);
			return initialValue;
		}
	});
	(0, import_react.useEffect)(() => {
		try {
			if (typeof window !== "undefined") {
				window.localStorage.setItem(key, JSON.stringify(storedValue));
				window.dispatchEvent(new CustomEvent("local-storage", { detail: {
					key,
					newValue: storedValue
				} }));
			}
		} catch (error) {
			console.error("Error setting localStorage", error);
		}
	}, [key, storedValue]);
	(0, import_react.useEffect)(() => {
		const handleStorageChange = (e) => {
			if (e.key === key && e.newValue) setStoredValue(JSON.parse(e.newValue));
		};
		const handleCustomChange = (e) => {
			if (e.detail.key === key) setStoredValue(e.detail.newValue);
		};
		window.addEventListener("storage", handleStorageChange);
		window.addEventListener("local-storage", handleCustomChange);
		return () => {
			window.removeEventListener("storage", handleStorageChange);
			window.removeEventListener("local-storage", handleCustomChange);
		};
	}, [key]);
	return [storedValue, setStoredValue];
}
//#endregion
export { useLocalStorage as t };
