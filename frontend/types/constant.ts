import { IconType } from "react-icons";
import { HiOutlineVideoCamera } from "react-icons/hi";
import {
  HiOutlineHome,
  HiOutlineCloudArrowUp,
  HiOutlineUsers,
  HiOutlineMegaphone,
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
  {
    href: "/admin/ads",
    label: "Ads",
    exact: false,
    icon: HiOutlineMegaphone,
  },
];

export const NAV_ITEMS = [
  {
    href: '/mini-admin',
    label: 'My Videos',
    icon: HiOutlineVideoCamera,
  },
  {
    href: '/mini-admin/upload',
    label: 'Upload Video',
    icon: HiOutlineCloudArrowUp,
  },
];


export const FOOTER_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Disclaimer', href: '/disclaimer' },
];