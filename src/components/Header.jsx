import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import {
  STORAGE_AUTH_ACCESS_KEY,
  STORAGE_AUTH_REFRESH_KEY,
} from "../constants/authentication";
import { setAccessToken, setRefreshToken } from "../utils/auth";
import { EmptyUrl } from "../constants/common";
import { Badge } from "primereact/badge";
import { OverlayPanel } from "primereact/overlaypanel";
import {
  fetchNotifications,
  getUnreadNotifications,
  markAsRead,
} from "../services/notification";
import { logoutAsync } from "../services/auth";
import FCMMessageListener from "./FCMMessageListener";
import { formatDateVN } from "../utils/common";

const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasLoaded = useRef(false);
  const menuRef = useRef(null);
  const overlayRef = useRef(null);
  const profile = useSelector((state) => state.personalProfile.data);
  const [notifications, setNotifications] = useState([]);
  const [lastKey, setLastKey] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  const items = [
    {
      label: "Hồ sơ",
      icon: "pi pi-user",
      command: () => {
        console.log("Hồ sơ");
      },
    },
    {
      label: "Đăng xuất",
      icon: "pi pi-sign-out",
      command: () => {
        dispatch(logout());
        logoutAsync().then(() => {
          setAccessToken("", STORAGE_AUTH_ACCESS_KEY);
          setRefreshToken("", STORAGE_AUTH_REFRESH_KEY);
          hasLoaded.current = false;
          navigate("/login");
        });
      },
    },
  ];

  const loadNotifications = async () => {
    const newNotifications = await fetchNotifications(profile.id, lastKey, 10);

    if (newNotifications.length > 0) {
      setNotifications((prev) => [...prev, ...newNotifications]);
      setLastKey(newNotifications[newNotifications.length - 1].id);
    } else {
      setHasMore(false);
    }
  };

  const onNotificationReceived = async () => {
    setHasNewNotification(true);
  };

  const updateMarkAsRead = (notificationId) => {
    const updateArr = [
      ...notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, ...{ IsRead: true } }
          : notification
      ),
    ];
    setNotifications(updateArr);
  };

  useEffect(() => {
    if (profile && profile.id && !hasLoaded.current) {
      getUnreadNotifications(profile.id).then((res) => {
        setHasNewNotification(res);
        hasLoaded.current = true;
      });
    }
  }, [profile]);

  return (
    <header className="surface-0 shadow-2 w-full flex align-items-center justify-content-between px-4 surface-border py-2">
      <FCMMessageListener onNotificationReceived={onNotificationReceived} />
      <Button
        icon="pi pi-bars"
        className="p-button-text p-button-plain p-button-sm"
        onClick={onToggleSidebar}
      />

      <div className="relative flex align-items-center gap-2">
        <i
          className="pi pi-bell p-overlay-badge mx-2"
          onClick={(e) => {
            fetchNotifications(profile.id, null, 10).then((res) => {
              setNotifications(res);
              overlayRef.current?.toggle(e);
              setHasNewNotification(false);
            });
          }}
        >
          {hasNewNotification && <Badge severity="info" />}
        </i>

        <OverlayPanel
          ref={overlayRef}
          style={{ width: "350px" }}
          className="overflow-hidden flex flex-column gap-2"
        >
          {notifications.length === 0 && (
            <div className="text-center text-gray-500 p-4">
              Không có thông báo nào.
            </div>
          )}
          <div
            style={{ maxHeight: "450px", overflowY: "auto" }}
            className="gap-2 flex flex-column"
          >
            {notifications.map((notification, idx) => (
              <div
                key={idx}
                onClick={() => {
                  markAsRead(profile.id, notification.id);
                  updateMarkAsRead(notification.id);
                }}
                style={{
                  backgroundColor: notification.IsRead ? "white" : "#d9fce2",
                }}
                className="border-round-md p-1"
              >
                <p className="my-1 font-bold text-black">
                  {notification.Title}
                </p>
                <span className="text-sm text-gray-600 py-1">
                  {notification.Body}
                </span>
                <div className="text-xs pt-1 text-right text-gray-400">
                  {formatDateVN(notification.CreatedAt)}
                </div>
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="pt-2">
              <Button
                onClick={loadNotifications}
                label="Tải thêm"
                className="w-full"
              />
            </div>
          )}
        </OverlayPanel>

        <Avatar
          icon="pi pi-user"
          size="medium"
          shape="circle"
          className="cursor-pointer"
          image={profile?.imageUrl ?? EmptyUrl}
          onClick={(e) => menuRef.current.toggle(e)}
        />
        <Menu model={items} popup ref={menuRef} />
      </div>
    </header>
  );
};

export default Header;
