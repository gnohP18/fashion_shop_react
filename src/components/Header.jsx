import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import {
  STORAGE_AUTH_ACCESS_KEY,
  STORAGE_AUTH_REFRESH_KEY,
} from "../constants/authentication";
import { setAccessToken } from "../utils/auth";

const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const menuRef = useRef(null);

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
        setAccessToken(STORAGE_AUTH_ACCESS_KEY, "");
        setAccessToken(STORAGE_AUTH_REFRESH_KEY, "");
        navigate("/login");
      },
    },
  ];

  return (
    <header className="surface-0 shadow-2 w-full flex align-items-center justify-content-between px-4 h-4rem surface-border">
      <Button
        icon="pi pi-bars"
        className="p-button-text p-button-plain p-button-sm"
        onClick={onToggleSidebar}
      />

      <div className="relative">
        <Avatar
          icon="pi pi-user"
          size="medium"
          shape="circle"
          className="cursor-pointer"
          onClick={(e) => menuRef.current.toggle(e)}
        />
        <Menu model={items} popup ref={menuRef} />
      </div>
    </header>
  );
};

export default Header;
