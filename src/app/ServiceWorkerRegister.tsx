// "use client";

// import { useEffect } from "react";

// export default function ServiceWorkerRegister(): null {
//   useEffect(() => {
//     if ("serviceWorker" in navigator) {
//       navigator.serviceWorker
//         .register("/sw.js")
//         .then(() => {
//           console.log("Service Worker registered");
//         })
//         .catch((err) => {
//           console.error("SW registration failed:", err);
//         });
//     }
//   }, []);

//   return null;
// }



"use client";

import { useEffect, useState } from "react";
import PushPermissionModal from "@/components/model/PushPermissionModal";
import { useAppSelector } from "@/store/hooks";

export default function ServiceWorkerRegister() {
  const [showModal, setShowModal] = useState(false);
  const { user, isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check if browser supports SW
    if (!("serviceWorker" in navigator)) return;

    // Wait for auth init
    if (!isInitialized) return;

    // Check if user is logged in
    if (!user) return;

    // Check localStorage preference
    const permissionStatus = localStorage.getItem("notification_permission_status");

    // If already granted/denied explicitly via our modal, don't show
    if (permissionStatus === "granted" || permissionStatus === "denied") {
      // Just register silently if granted
      if (permissionStatus === "granted") {
        registerSw();
      }
      return;
    }

    // Check browser native permission
    if (Notification.permission === "granted") {
      registerSw();
      localStorage.setItem("notification_permission_status", "granted");
      return;
    }

    // If default (not asked yet) show modal
    if (Notification.permission === "default") {
      setShowModal(true);
    }
  }, [user, isInitialized]);

  const registerSw = () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registered with scope:", registration.scope);
      })
      .catch((err) => {
        console.error("SW registration failed:", err);
      });
  };

  const handleAccept = async () => {
    // 1. Request Permission
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      // 2. Register SW
      registerSw();
      // 3. Save Preference
      localStorage.setItem("notification_permission_status", "granted");
      console.log("Notification permission granted.");
    } else {
      localStorage.setItem("notification_permission_status", "denied");
      console.log("Notification permission denied.");
    }

    // 4. Close Modal
    setShowModal(false);
  };

  const handleClose = () => {
    // User clicked 'Maybe Later' or 'X'
    // We can choose to ask again later (session based) or never.
    // Requirement: "If user clicks Cross -> close modal". 
    // Requirement: "Once accepted -> NEVER show again".
    // Doesn't say "Once closed never show again".
    // But usually good UX is not to spam. Let's set a temporary 'later' flag or just state? 
    // For now, just close modal. It will show again on refresh if not set in localStorage.

    // To implement "Show again on next login/refresh unless accepted/denied explicitly", 
    // we don't set the localStorage 'denied' flag here unless we want to permanently block.
    // But user might want to block permanently? 
    // Let's assume 'Close' means 'Not now'.
    setShowModal(false);

    // If we want to prevent it for this session/forever:
    localStorage.setItem("notification_permission_status", "denied"); // Assuming strict "Close = No"
  };

  return (
    <PushPermissionModal
      open={showModal}
      onAccept={handleAccept}
      onClose={handleClose}
    />
  );
}