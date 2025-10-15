import "../style/navbar.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Calendar, House, LogIn, LogOut, BadgePlus } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    const loginTime = localStorage.getItem("loginTime");
    const sessionActive = sessionStorage.getItem("sessionActive");

    if (!token || !loginTime || !sessionActive) {
      setIsLoggedIn(false);
      localStorage.removeItem("token");
      localStorage.removeItem("loginTime");
      return;
    }

    const now = Date.now();
    const hours24 = 24 * 60 * 60 * 1000;
    if (now - parseInt(loginTime) > hours24) {
      setIsLoggedIn(false);
      localStorage.removeItem("token");
      localStorage.removeItem("loginTime");
      sessionStorage.removeItem("sessionActive");
      return;
    }

    setIsLoggedIn(true);
  };

  useEffect(() => {
    checkLoginStatus();

    // Lyssna på storage-event för att uppdatera navbar live
    const handleStorageChange = () => {
      checkLoginStatus();
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    sessionStorage.removeItem("sessionActive");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button title="Hem" onClick={() => navigate("/")}>
          <House />
        </button>
        <button title="Skapa Task" onClick={() => navigate("/tasklist")}>
          <BadgePlus />
        </button>
        <button title="Kalender" onClick={() => navigate("/calender")}>
          <Calendar />
        </button>
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          <button title="Logga ut" onClick={handleLogout}>
            <LogOut />
          </button>
        ) : (
          <button title="Logga in" onClick={() => navigate("/login")}>
            <LogIn />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
