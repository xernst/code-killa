import type { CapacitorConfig } from "@capacitor/cli";

// promptdojo — capacitor 7 shell over the static next.js export.
// the web bundle lives at ../out/ (next export) and is shipped offline
// inside the app binary. do NOT set server.url in production — apple
// app review §4.7 requires zero remote js loads on launch.
const config: CapacitorConfig = {
  appId: "dev.promptdojo.app",
  appName: "promptdojo",
  webDir: "../out",
  // bundledWebRuntime removed in Capacitor 6+; no longer a valid config key.

  // server config intentionally omitted in prod. for local dev against
  // a running `next dev`, uncomment the block below and set your LAN ip:
  // server: {
  //   url: "http://192.168.1.10:3000",
  //   cleartext: true,
  // },

  plugins: {
    SplashScreen: {
      // launchAutoHide=false lets iap.ts call warmPyodide() during splash,
      // hiding the 4-8s cold-boot pyodide delay before the user sees a tap target.
      // hide() is called manually after warmup completes.
      launchAutoHide: false,
      launchShowDuration: 0,
      backgroundColor: "#0a0a0a", // ink-950
      androidScaleType: "CENTER_CROP",
      androidSplashResourceName: "splash",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },

  ios: {
    // automatic lets the webview manage its own safe-area insets, so notches
    // + dynamic island + home indicator are handled by the platform instead
    // of fighting our css. critical for the lesson rail + bottom step nav.
    contentInset: "automatic",
    backgroundColor: "#0a0a0a",
    // disable the 3d-touch link preview menu — looks broken inside an in-app webview
    // and conflicts with our own long-press handlers on code blocks.
    allowsLinkPreview: false,
    limitsNavigationsToAppBoundDomains: true,
    scheme: "promptdojo",
    scrollEnabled: true,
    handleApplicationNotifications: false,
  },

  android: {
    backgroundColor: "#0a0a0a",
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    // disable the long-press text-selection magnifier — same rationale as ios allowsLinkPreview.
    initialFocus: false,
  },
};

export default config;
