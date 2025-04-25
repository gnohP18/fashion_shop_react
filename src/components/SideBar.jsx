import { Menu } from "primereact/menu";
import { useLocation, useNavigate } from "react-router-dom";

const SideBar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "text-bold" : "");

  const items = [
    {
      label: "Trang chủ",
      icon: "pi pi-home",
      command: () => navigate("/"),
    },
    {
      label: "Quản lý sản phẩm",
      items: [
        {
          label: "Sản phẩm",
          icon: "pi pi-box",
          command: () => navigate("/products"),
        },
        {
          label: "Danh mục",
          icon: "pi pi-tags",
          command: () => navigate("/categories"),
        },
      ],
    },
    {
      label: "Quản lý đơn hàng",
      items: [
        {
          label: "Đặt hàng",
          icon: "pi pi-shopping-cart",
          command: () => navigate("/orders"),
        },
      ],
    },

    {
      label: "Quản lý người dùng",
      items: [
        {
          label: "Người dùng",
          icon: "pi pi-users",
          command: () => navigate("/users"),
        },
      ],
    },

    {
      label: "Cài đặt",
      items: [
        {
          label: "Thông tin hệ thống",
          icon: "pi pi-cog",
          command: () => navigate("/settings/basic"),
        },
      ],
    },
  ];

  return (
    <div
      className={`h-full overflow-hidden ${
        collapsed ? "w-2rem" : "w-16rem"
      } transition-all transition-duration-300`}
    >
      <Menu
        model={items}
        className="w-full h-full border-none bg-primary text-white"
      />
    </div>
  );
};

export default SideBar;
