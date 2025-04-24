import { Menu } from "primereact/menu";
import { useLocation, useNavigate } from "react-router-dom";

const SideBar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "text-bold" : "");

  const items = [
    {
      label: "Dashboard",
      icon: "pi pi-home",
      path: "/",
    },
    {
      label: "Products",
      icon: "pi pi-box",
      path: "/products",
    },
    {
      label: "Users",
      icon: "pi pi-users",
      path: "/users",
    },
    {
      label: "Orders",
      icon: "pi pi-shopping-cart",
      path: "/orders",
    },
  ];
  const menuItems = items.map((item) => ({
    ...item,
    className: isActive(item.path),
    command: () => navigate(item.path),
  }));

  return (
    <div
      className={`h-full overflow-hidden ${
        collapsed ? "w-2rem" : "w-16rem"
      } transition-all transition-duration-300`}
    >
      <Menu
        model={menuItems}
        className="w-full h-full border-none bg-primary text-white"
      />
    </div>
  );
};

export default SideBar;
