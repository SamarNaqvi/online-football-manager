import React, { useEffect, useState } from 'react';
import { messaging, getToken, onMessage } from './firebase';

function App() {
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Request permission to receive notifications
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        // Get FCM registration token for this device/browser
        if(token) return;
        getToken(messaging, { vapidKey: import.meta.env.VITE_VAPID_KEY })
          .then((currentToken) => {
            if (currentToken) {
              setToken(currentToken);
          
              console.log('FCM token:', currentToken);
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
      console.log('Message received. ', payload);
      setNotification(payload.notification);
      // Optionally show custom UI notification 
    });

    return () => unsubscribe();
  }, []);

  // Send this token to your backend to store it and use for notifications

  return (
    <div>
      <h1>FCM Push Notifications</h1>
      <p>Your device token (send this to backend):</p>
      <textarea rows={5} style={{width: 400}} value={token || 'Loading...'} readOnly />
      {notification && (
        <div style={{marginTop: 20, padding: 10, border: '1px solid #ccc'}}>
          <h3>New Notification</h3>
          <p><b>{notification.title}</b></p>
          <p>{notification.body}</p>
        </div>
      )}
    </div>
  );
}

export default App;
