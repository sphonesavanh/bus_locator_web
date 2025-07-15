import { Link } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");

    // Reset context state
    setUser({ username: "", isLoggedIn: false });

    // Redirect to login page
    navigate("/");
  };

  return (
    <section id="sidebar" className="w-60 bg-blue-500 max-h-full">
      {/* Sidebar Content */}
      <div className="w-64 bg-blue-500 p-4 space-y-4 text-white">
        <Link
          to="/dashboard"
          className="block p-2 rounded bg-white text-yellow-500"
        >
          Dashboard
        </Link>
        <Link
          to="/tracking"
          className="block p-2 rounded bg-white text-yellow-500"
        >
          Tracking
        </Link>
        <Link
          to="/route"
          className="block p-2 rounded bg-white text-yellow-500"
        >
          Route
        </Link>
        <Link to="/bus" className="block p-2 rounded bg-white text-yellow-500">
          Bus
        </Link>
        <Link
          to="/bus-stop"
          className="block p-2 rounded bg-white text-yellow-500"
        >
          BusStop
        </Link>
        <Link
          to="/driver"
          className="block p-2 rounded bg-white text-yellow-500"
        >
          Driver
        </Link>
        <Link
          to="/schedule"
          className="block p-2 rounded bg-white text-yellow-500"
        >
          Schedule
        </Link>
        <Link
          to="/lost-and-found"
          className="block p-2 rounded bg-white text-yellow-500"
        >
          Lost&Found
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="hidden md:block p-2 bg-gray-800 text-white rounded mt-4"
      >
        ອອກຈາກລະບົບ
      </button>
    </section>
  );
};

export default SideBar;
