// share.ts — @capacitor/share bridge for TweetThisStep.
// Returns false when running in the browser so callers fall back
// to web behavior (window.open with the X/Twitter intent URL).
// Native iOS/Android route through the OS share sheet.
import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";

export interface SharePayload {
  title: string;
  url: string;
  text?: string;
}

export async function nativeShare(payload: SharePayload): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    return false;
  }
  try {
    await Share.share({
      title: payload.title,
      url: payload.url,
      text: payload.text,
      dialogTitle: payload.title,
    });
    return true;
  } catch {
    return false;
  }
}
