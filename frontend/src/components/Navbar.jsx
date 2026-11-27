
import { NavLink, Link, useNavigate } from "react-router-dom";

import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Map,
  UserRound,
  Menu,
  X,
  LogOut,
  MessageSquare,
  ChevronDown,
  Users
} from "lucide-react";

import { useState } from "react";
import { useAppContext } from "../context/AppContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAppContext();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";

  const navLinks = [
    { name: "Home", path: "/", icon: GraduationCap },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Courses", path: "/courses", icon: BookOpen },
    { name: "Roadmap", path: "/roadmap", icon: Map },
    { name: "Contact", path: "/contact", icon: UserRound }
  ];

  const closeMenu = () => {
    setMenuOpen(false);
    setAdminMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate("/");
  };


  const adminLinks = [
    {
      name: "Admin Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Students",
      path: "/admin/students",
      icon: Users
    },
    {
      name: "Admin Courses",
      path: "/admin/courses",
      icon: BookOpen
    },
    {
      name: "Admin Messages",
      path: "/admin/contact-messages",
      icon: MessageSquare
    }
  ];
  

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container">

        {/* Logo */}
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center gap-2"
          onClick={closeMenu}
        >
          <div className="brand-icon">
            <GraduationCap size={25} color="white" />
          </div>

          <span className="fw-bold fs-4">
            Skill<span className="brand-text">Sphere</span>
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        {/* Navigation Links */}
        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>

          <ul className="navbar-nav mx-auto gap-lg-3">

            {/* Normal Navigation Links */}
            {navLinks.map((link) => (
              <li className="nav-item" key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.path === "/"}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}

            {/* Admin Dropdown */}
            {isAuthenticated && isAdmin && (
              <li className="nav-item admin-dropdown">

                <button
                  type="button"
                  className="nav-link admin-dropdown-toggle"
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  aria-expanded={adminMenuOpen}
                >
                  Admin
                  <ChevronDown
                    size={16}
                    className={adminMenuOpen ? "rotate-chevron" : ""}
                  />
                </button>

                {adminMenuOpen && (
                  <ul className="admin-dropdown-menu">

                    {adminLinks.map((link) => {
                      const Icon = link.icon;

                      return (
                        <li key={link.path}>
                          <NavLink
                            to={link.path}
                            onClick={closeMenu}
                            className={({ isActive }) =>
                              `dropdown-item d-flex align-items-center gap-2 ${
                                isActive ? "active" : ""
                              }`
                            }
                          >
                            <Icon size={17} />
                            {link.name}
                          </NavLink>
                        </li>
                      );
                    })}

                  </ul>
                )}

              </li>
            )}

          </ul>

          {/* Authentication Buttons */}
          <div className="d-flex align-items-center gap-2 navbar-auth">

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="profile-btn d-flex align-items-center gap-2"
                  onClick={closeMenu}
                >
                  <UserRound size={18} />
                  {user?.name || "My Profile"}
                </Link>

                <button
                  type="button"
                  className="btn btn-outline-danger d-flex align-items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-primary"
                  onClick={closeMenu}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn btn-primary"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
