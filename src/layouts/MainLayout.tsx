import type React from "react";
import { useState, useEffect } from "react";
import "../index.css";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  Route,
  Bus,
  Map,
  MapPinOff,
  User,
  Calendar,
  Search,
} from "lucide-react";
import LogoutButton from "@/components/shared/main/LogoutButton";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const isSidebarOpen = true;
  const [adminName, setAdminName] = useState("Admin");

  const location = useLocation();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/admin/profile", {
          credentials: "include", // important if using cookies
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setAdminName(data.username || "Admin");
      } catch (err) {
        console.error("Failed to fetch admin:", err);
      }
    };
    fetchAdmin();
  }, []);

  return (
    <div className="flex h-screen w-full bg-[#f1f1f1]">
      {/* Navbar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#023047] text-white transition-all duration-300 ease-in-out lg:static ${
          isSidebarOpen ? "w-58" : "w-0 lg:w-16"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Bus className="h-6 w-6" />
            <span
              className={`font-bold text-xl ${!isSidebarOpen && "lg:hidden"}`}
            >
              Bus Locator
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="px-2">
            <NavItem
              href="/dashboard"
              icon={<LayoutDashboard className="h-5 w-5" />}
              label="ໜ້າຫຼັກ"
              collapsed={!isSidebarOpen}
              active={location.pathname === "/dashboard"}
            />
            <NavItem
              href="/tracking"
              icon={<MapPin className="h-5 w-5" />}
              label="ຕິດຕາມ"
              collapsed={!isSidebarOpen}
              active={location.pathname === "/tracking"}
            />
            <NavItem
              href="/route"
              icon={<Route className="h-5 w-5" />}
              label="ເສັ້ນທາງ"
              collapsed={!isSidebarOpen}
              active={location.pathname === "/route"}
            />
            <NavItem
              href="/bus"
              icon={<Bus className="h-5 w-5" />}
              label="ລົດເມ"
              collapsed={!isSidebarOpen}
              active={location.pathname === "/bus"}
            />
            <NavItem
              href="/bus-type"
              icon={<Bus className="h-5 w-5" />}
              label="ປະເພດລົດເມ"
              collapsed={!isSidebarOpen}
              active={location.pathname === "/bus-type"}
            />
            <NavItem
              href="/bus-stop"
              icon={<MapPinOff className="h-5 w-5" />}
              label="ປ້າຍລົດເມ"
              collapsed={!isSidebarOpen}
              active={location.pathname === "/bus-stop"}
            />
            <NavItem
              href="/driver"
              icon={<User className="h-5 w-5" />}
              label="ຄົນຂັບ"
              collapsed={!isSidebarOpen}
              active={location.pathname === "/driver"}
            />
            <NavItem
              href="/trip"
              icon={<Map className="h-5 w-5" />}
              label="ຖ້ຽວລົດເມ"
              collapsed={!isSidebarOpen}
              active={location.pathname === "/trip"}
            />
            <NavItem
              href="/schedule"
              icon={<Calendar className="h-5 w-5" />}
              label="ຕາຕະລາງລົດເມ"
              collapsed={!isSidebarOpen}
              active={location.pathname === "/schedule"}
            />
            <NavItem
              href="/users"
              icon={<User className="h-5 w-5" />}
              label="ຜູ້ໃຊ້ງານ"
              collapsed={!isSidebarOpen}
              active={location.pathname === "/users"}
            />
            <NavItem
              href="/lost-and-found"
              icon={<Search className="h-5 w-5" />}
              label="ແຈ້ງເຄື່ອງເສຍ"
              collapsed={!isSidebarOpen}
              active={location.pathname === "/lost-and-found"}
            />
          </ul>
        </nav>

        {/* Logout Button */}
        <div>
          <button>
            <LogoutButton isSidebarOpen={true} />
            <span className={`${!isSidebarOpen && "lg:hidden"}`}></span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <header className="flex h-16 items-center justify-between bg-[#219EBC] px-4 shadow">
          {/* Title / Left space (optional) */}
          <div></div>

          {/* Profile Card (Static "Admin") */}
          <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-1 shadow text-gray-800 text-sm font-medium">
            <span className="inline-block">👤</span>
            <span>{adminName}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active: boolean;
}

function NavItem({ href, icon, label, collapsed, active }: NavItemProps) {
  return (
    <li>
      <Link
        to={href}
        className={`flex items-center gap-2 rounded-md px-3 py-3 my-2 text-white transition-colors
    ${active ? "bg-[#219EBC] font-semibold" : "hover:bg-[#219EBC]"}`}
      >
        {icon}
        <span className={`${collapsed && "lg:hidden"}`}>{label}</span>
      </Link>
    </li>
  );
}
