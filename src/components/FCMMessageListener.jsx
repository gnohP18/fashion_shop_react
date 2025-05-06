import React, { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { onForegroundMessage } from "../firebase/firebase";

const FCMMessageListener = ({ onNotificationReceived }) => {
  const toast = useRef(null);

  useEffect(() => {
    const unsubscribe = onForegroundMessage((payload) => {
      const { title, body } = payload.notification || {};

      toast.current?.show({
        severity: "info",
        summary: title || "Thông báo",
        detail: body || "",
        life: 5000,
      });

      if (onNotificationReceived) {
        onNotificationReceived();
      }
    });

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return <Toast ref={toast} position="top-right" />;
};

export default FCMMessageListener;
