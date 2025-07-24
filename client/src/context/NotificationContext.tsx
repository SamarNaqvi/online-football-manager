import React, { type ReactNode, useMemo } from "react";
import { notification } from "antd";
import type { NotificationPlacement } from "antd/es/notification/interface";

type OpenNotificationFn = (
  placement: NotificationPlacement,
  message: string,
  description: string,
) => void;

export const NotificationContext = React.createContext<OpenNotificationFn | null>(null);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (
    placement: NotificationPlacement,
    message: string,
    description: string,
    type:string="info",
  ) => {
    api[type]({
      message,
      description,
      placement,
      duration:10,
    });
  };

  // Memoize to avoid re-render and new function refs
  const contextValue = useMemo(() => openNotification, [api]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};
