
import { NavLink, Link } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Map,
  UserRound,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/", icon: GraduationCap },
    { name: "Courses", path: "/courses", icon: BookOpen },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Roadmap", path: "/roadmap", icon: Map },
    { name: "Contact", path: "/contact", icon: UserRound }
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container">

        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2" onClick={closeMenu}>
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

          </ul>

          {/* Profile Button */}
          <Link
            to="/profile"
            className="profile-btn d-flex align-items-center gap-2"
            onClick={closeMenu}
          >
            <UserRound size={18} />
            My Profile
          </Link>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
