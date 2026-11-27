
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAppContext } from "../context/AppContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.password_confirmation
      );

      navigate("/dashboard");
    } catch (err) {
      console.error("Registration failed:", err);

      const validationErrors = err.response?.data?.errors;

      setError(
        validationErrors
          ? Object.values(validationErrors).flat().join(" ")
          : err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">

          <div className="card border-0 shadow-sm p-4 p-md-5">

            <div className="text-center mb-4">
              <UserPlus size={40} color="#4F46E5" />

              <h2 className="fw-bold mt-3">Create Account</h2>

              <p className="text-muted">
                Join SkillSphere and start learning today.
              </p>
            </div>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label">Full Name</label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email Address</label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>

                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm Password</label>

                <input
                  type="password"
                  name="password_confirmation"
                  className="form-control"
                  placeholder="Confirm your password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  minLength={8}
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-btn w-100"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Register"}
              </button>

            </form>

            <p className="text-center mt-4 mb-0">
              Already have an account?{" "}
              <Link to="/login">Login</Link>
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
