import { ref, query, orderByKey, endBefore, onValue, limitToLast, getDatabase, update, orderByChild, equalTo, get } from "firebase/database";
import { database } from "../firebase/firebase";

export const fetchNotifications = (userId, lastKey = null, limit = 10) => {
  const baseRef = ref(database, `notifications/${userId}`);
  let notificationQuery;

  if (lastKey) {
    notificationQuery = query(baseRef, orderByKey(), endBefore(lastKey), limitToLast(limit));
  } else {
    notificationQuery = query(baseRef, orderByKey(), limitToLast(limit));
  }

  return new Promise((resolve) => {
    onValue(notificationQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entries = Object.entries(data);
        const items = entries.map(([key, value]) => ({ id: key, ...value }));
        resolve(items.reverse());
      } else {
        resolve([]);
      }

    }, { onlyOnce: true });
  });
};

export const markAsRead = (userId, notificationId) => {
  const db = getDatabase();

  const notificationRef = ref(db, `notifications/${userId}/${notificationId}`);

  update(notificationRef, { IsRead: true });
};

export const getUnreadNotifications = async (userId) => {
  const db = getDatabase();

  const notificationsRef = ref(db, `notifications/${userId}`);

  const notificationQuery = query(notificationsRef, orderByChild('IsRead'), equalTo(false));

  const snapshot = await get(notificationQuery);

  return snapshot.exists()
}

