
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAppContext } from "../context/AppContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAppContext();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      setLoading(true);
      setError("");

      await login(formData.email, formData.password);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);

      setError(
        err.response?.data?.message ||
        "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">

          <div className="card border-0 shadow-sm p-4 p-md-5">

            <div className="text-center mb-4">
              <LogIn size={40} color="#4F46E5" />

              <h2 className="fw-bold mt-3">Welcome Back!</h2>

              <p className="text-muted">
                Login to continue your learning journey.
              </p>
            </div>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-btn w-100"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

            </form>

            <p className="text-center mt-4 mb-0">
              Don't have an account?{" "}
              <Link to="/register">Register</Link>
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
