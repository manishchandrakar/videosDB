import { IconType } from "react-icons";
import {
  HiOutlineHome,
  HiOutlineCloudArrowUp,
  HiOutlineUsers,
} from "react-icons/hi2";

export interface AdminNavItem {
  href: string;
  label: string;
  exact: boolean;
  icon: IconType;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    exact: true,
    icon: HiOutlineHome,
  },
  {
    href: "/admin/upload",
    label: "Upload Video",
    exact: false,
    icon: HiOutlineCloudArrowUp,
  },
  {
    href: "/admin/users",
    label: "Users",
    exact: false,
    icon: HiOutlineUsers,
  },
];