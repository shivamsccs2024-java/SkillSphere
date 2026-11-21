
import { Link } from "react-router-dom";
import {
    GraduationCap,
    Mail,
    MapPin,
    Phone,
    Globe,
    MessageCircle,
    Camera,
    Users
  } from "lucide-react";

function Footer() {
  return (
    <footer className="footer-section">

      <div className="container">
        <div className="row g-4 py-5">

          {/* Brand */}
          <div className="col-lg-4 col-md-6">

            <Link to="/" className="footer-brand">
              <GraduationCap size={28} />
              Skill<span>Sphere</span>
            </Link>

            <p className="footer-description mt-3">
              Empowering learners with the skills and knowledge
              they need to build a successful career.
            </p>

            <div className="social-links d-flex gap-3 mt-4">
  <a href="https://facebook.com" aria-label="Facebook">
    <Globe size={18} />
  </a>

  <a href="https://instagram.com" aria-label="Instagram">
    <Camera size={18} />
  </a>

  <a href="https://linkedin.com" aria-label="LinkedIn">
    <Users size={18} />
  </a>

  <a href="https://twitter.com" aria-label="Twitter">
    <MessageCircle size={18} />
  </a>
</div>

          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h5>Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/roadmap">Roadmap</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-lg-3 col-md-6">
            <h5>Learning Paths</h5>
            <ul className="footer-links">
              <li><Link to="/roadmap">Frontend Development</Link></li>
              <li><Link to="/roadmap">Backend Development</Link></li>
              <li><Link to="/roadmap">Full Stack Development</Link></li>
              <li><Link to="/roadmap">Java Development</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6">
            <h5>Get in Touch</h5>

            <div className="footer-contact">
              <p><Mail size={17} /> support@skillsphere.com</p>
              <p><Phone size={17} /> +91 98765 43210</p>
              <p><MapPin size={17} /> Chennai, India</p>
            </div>

            <Link to="/contact" className="footer-contact-btn">
              Contact Us
            </Link>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2026 SkillSphere. All rights reserved.</p>
          <p>Learn. Grow. Achieve.</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
