import { Link } from "react-router";
import DarkSwitch from "@/components/shared/main/DarkSwitch";
import busIcon from "@/assets/bus-icon.png";

export default function Navbar() {
  return (
    <div className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
      <div className="container px-8 py-4 mx-auto xl:px-0">
        <nav className="relative flex flex-wrap items-center justify-between mx-auto lg:justify-between max-w-screen-xl">
          {/* Logo */}
          <img src={busIcon} alt="Bus_Icon" className="w-4 h-4" />
          <Link to="/dashboard">
            <span className="flex items-center space-x-2 text-2xl font-semibold dark:text-white">
              <span>
                <img src="" alt="" className="w-8" />
              </span>
              <span>Bus Locator</span>
            </span>
          </Link>

          {/* Get Started and Darkmode */}
          <div className="flex items-center gap-3 nav__item mr-2 lg:flex ml-auto lg:ml-0 lg:order-2">
            <DarkSwitch />
          </div>
        </nav>
      </div>
    </div>
  );
}
