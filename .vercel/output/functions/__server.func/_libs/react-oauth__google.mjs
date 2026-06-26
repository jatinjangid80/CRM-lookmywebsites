import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "./@floating-ui/react-dom+[...].mjs";
//#region node_modules/@react-oauth/google/dist/index.esm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useLoadGsiScript(options = {}) {
	const { nonce, locale, onScriptLoadSuccess, onScriptLoadError } = options;
	const [scriptLoadedSuccessfully, setScriptLoadedSuccessfully] = (0, import_react.useState)(false);
	const onScriptLoadSuccessRef = (0, import_react.useRef)(onScriptLoadSuccess);
	onScriptLoadSuccessRef.current = onScriptLoadSuccess;
	const onScriptLoadErrorRef = (0, import_react.useRef)(onScriptLoadError);
	onScriptLoadErrorRef.current = onScriptLoadError;
	(0, import_react.useEffect)(() => {
		const scriptTag = document.createElement("script");
		scriptTag.src = "https://accounts.google.com/gsi/client";
		if (locale) scriptTag.src += `?hl=${locale}`;
		scriptTag.async = true;
		scriptTag.defer = true;
		scriptTag.nonce = nonce;
		scriptTag.onload = () => {
			var _a;
			setScriptLoadedSuccessfully(true);
			(_a = onScriptLoadSuccessRef.current) === null || _a === void 0 || _a.call(onScriptLoadSuccessRef);
		};
		scriptTag.onerror = () => {
			var _a;
			setScriptLoadedSuccessfully(false);
			(_a = onScriptLoadErrorRef.current) === null || _a === void 0 || _a.call(onScriptLoadErrorRef);
		};
		document.body.appendChild(scriptTag);
		return () => {
			document.body.removeChild(scriptTag);
		};
	}, [nonce]);
	return scriptLoadedSuccessfully;
}
var GoogleOAuthContext = (0, import_react.createContext)(null);
function GoogleOAuthProvider({ clientId, nonce, locale, onScriptLoadSuccess, onScriptLoadError, children }) {
	const scriptLoadedSuccessfully = useLoadGsiScript({
		nonce,
		onScriptLoadSuccess,
		onScriptLoadError,
		locale
	});
	const contextValue = (0, import_react.useMemo)(() => ({
		locale,
		clientId,
		scriptLoadedSuccessfully
	}), [clientId, scriptLoadedSuccessfully]);
	return import_react.createElement(GoogleOAuthContext.Provider, { value: contextValue }, children);
}
function useGoogleOAuth() {
	const context = (0, import_react.useContext)(GoogleOAuthContext);
	if (!context) throw new Error("Google OAuth components must be used within GoogleOAuthProvider");
	return context;
}
function useGoogleLogin({ flow = "implicit", scope = "", onSuccess, onError, onNonOAuthError, overrideScope, state, ...props }) {
	const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();
	const clientRef = (0, import_react.useRef)();
	const onSuccessRef = (0, import_react.useRef)(onSuccess);
	onSuccessRef.current = onSuccess;
	const onErrorRef = (0, import_react.useRef)(onError);
	onErrorRef.current = onError;
	const onNonOAuthErrorRef = (0, import_react.useRef)(onNonOAuthError);
	onNonOAuthErrorRef.current = onNonOAuthError;
	(0, import_react.useEffect)(() => {
		var _a, _b;
		if (!scriptLoadedSuccessfully) return;
		const clientMethod = flow === "implicit" ? "initTokenClient" : "initCodeClient";
		clientRef.current = (_b = (_a = window === null || window === void 0 ? void 0 : window.google) === null || _a === void 0 ? void 0 : _a.accounts) === null || _b === void 0 ? void 0 : _b.oauth2[clientMethod]({
			client_id: clientId,
			scope: overrideScope ? scope : `openid profile email ${scope}`,
			callback: (response) => {
				var _a, _b;
				if (response.error) return (_a = onErrorRef.current) === null || _a === void 0 ? void 0 : _a.call(onErrorRef, response);
				(_b = onSuccessRef.current) === null || _b === void 0 || _b.call(onSuccessRef, response);
			},
			error_callback: (nonOAuthError) => {
				var _a;
				(_a = onNonOAuthErrorRef.current) === null || _a === void 0 || _a.call(onNonOAuthErrorRef, nonOAuthError);
			},
			state,
			...props
		});
	}, [
		clientId,
		scriptLoadedSuccessfully,
		flow,
		scope,
		state
	]);
	const loginImplicitFlow = (0, import_react.useCallback)((overrideConfig) => {
		var _a;
		return (_a = clientRef.current) === null || _a === void 0 ? void 0 : _a.requestAccessToken(overrideConfig);
	}, []);
	const loginAuthCodeFlow = (0, import_react.useCallback)(() => {
		var _a;
		return (_a = clientRef.current) === null || _a === void 0 ? void 0 : _a.requestCode();
	}, []);
	return flow === "implicit" ? loginImplicitFlow : loginAuthCodeFlow;
}
//#endregion
export { useGoogleLogin as n, GoogleOAuthProvider as t };
