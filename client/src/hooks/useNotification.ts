import  { useContext, useEffect, useState } from 'react';
import { messaging, getToken, onMessage } from '../firebase';
import { NotificationContext } from '../context/NotificationContext';

export const useNotification = () =>{
     const [token, setToken] = useState(null);
  const [notification, setNotification] = useState(null);
const openNotification = useContext(NotificationContext);

  useEffect(() => {
    // Request permission to receive notifications
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        // Get FCM registration token for this device/browser
        if(token) return;
        getToken(messaging, { vapidKey: import.meta.env.VITE_VAPID_KEY })
          .then((currentToken) => {
            if (currentToken) {
              // @ts-ignore
              setToken(currentToken);
            } else {
              console.log('No registration token available. Request permission to generate one.');
            }
          })
          .catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
          });
      } else {
        console.log('Notification permission denied');
      }
    });

    // Listen for foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("payload", payload);
      //@ts-ignore
      openNotification && openNotification(payload?.notification?.title, payload?.notification?.body, "success");
      //@ts-ignore
      setNotification({...payload?.notification, ...payload?.data});

    });

    return () => unsubscribe();
  }, []);

  return {token, notification};
}