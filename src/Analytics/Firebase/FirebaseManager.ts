import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, logEvent, Analytics } from "firebase/analytics";
import { firebaseConfig } from "./config";

export class FirebaseAnalyticsManager {
  public static instance: FirebaseAnalyticsManager;
  public firebaseApp: FirebaseApp;
  public firebaseAnalytics: Analytics | null = null;

  public constructor() {
    try {
      this.firebaseApp = initializeApp(firebaseConfig);
      if (navigator.onLine) {
        this.firebaseAnalytics = getAnalytics(this.firebaseApp);
        console.log("Firebase Analytics initialized.");
      } else {
        console.warn("Offline: Firebase Analytics not initialized.");
      }
    } catch (error) {
      console.error("Error while initializing Firebase:", error);
    }
  }

  public static getInstance(): FirebaseAnalyticsManager {
    if (!FirebaseAnalyticsManager.instance) {
      FirebaseAnalyticsManager.instance = new FirebaseAnalyticsManager();
    }
    return FirebaseAnalyticsManager.instance;
  }

  public logEventWithPayload(eventName: string, payload: object): void {
    try {
      if (this.firebaseAnalytics) {
        logEvent(this.firebaseAnalytics, eventName, payload);
      }
      console.log(`Logging custom event: ${eventName}`, payload);
    } catch (error) {
      console.error("Error while logging custom event:", error);
    }
  }

  public logSessionStartWithPayload(payload: object): void {
    try {
      if (this.firebaseAnalytics) {
        logEvent(this.firebaseAnalytics, "session_start", payload);
      }
      console.log("Logging session start with data:", payload);
    } catch (error) {
      console.error("Error while logging session start:", error);
    }
  }

  public logDownloadProgressWithPayload(eventName: string, payload: object): void {
    try {
      if (this.firebaseAnalytics) {
        logEvent(this.firebaseAnalytics, eventName, payload);
      }
      console.log("Logging download progress for", eventName, "with data:", payload);
    } catch (error) {
      console.error("Error while logging download progress:", error);
    }
  }
}
