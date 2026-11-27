
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle,
  TrendingUp,
  Clock,
  ArrowRight
} from "lucide-react";

import api from "../services/api";
import { useAppContext } from "../context/AppContext";

function Dashboard() {

  const { user } = useAppContext();

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingCourse, setUpdatingCourse] = useState(null);


  // Dashboard API Integration
  
  const [stats, setStats] = useState({
    total_enrolled: 0,
    completed_courses: 0,
    in_progress_courses: 0,
    average_progress: 0,
});

useEffect(() => {
  const fetchStats = async () => {
      try {
          const response = await api.get("/dashboard/stats");
          setStats(response.data.data);
      } catch (error) {
          console.error("Dashboard stats error:", error);
      }
  };

  fetchStats();
}, []);

  // Fetch enrolled courses from Laravel
  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/my-courses");

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.data;

        if (!Array.isArray(data)) {
          throw new Error("Invalid enrolled courses response.");
        }

        // Convert enrollment records into course cards
        const formattedCourses = data.map((item) => {
          const course = item.course ?? item;

          const courseProgress =
            item.progress?.progress_percentage ??
            item.course_progress?.progress_percentage ??
            item.progress_percentage ??
            0;

          return {
            ...course,
            progress: Number(courseProgress),
          };
        });

        setEnrolledCourses(formattedCourses);
      } catch (err) {
        console.error("Failed to fetch enrolled courses:", err);

        setError(
          err.response?.data?.message ||
          err.message ||
          "Unable to load your courses."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);



  // Update course progress through Laravel API
  const updateProgress = async (courseId) => {
    const course = enrolledCourses.find(
      (item) => item.id === courseId
    );

    if (!course || course.progress >= 100) return;

    const newProgress = Math.min(course.progress + 25, 100);

    try {
      setUpdatingCourse(courseId);

      await api.put(`/my-courses/${courseId}/progress`, {
        progress_percentage: newProgress,
      });

      setEnrolledCourses((previousCourses) =>
        previousCourses.map((item) =>
          item.id === courseId
            ? { ...item, progress: newProgress }
            : item
        )
      );
      // Refresh dashboard statistics
      const statsResponse = await api.get("/dashboard/stats");
      setStats(statsResponse.data.data);

    } catch (err) {
      console.error("Progress update failed:", err);

      alert(
        err.response?.data?.message ||
        "Unable to update course progress."
      );
    } finally {
      setUpdatingCourse(null);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="container">

        {/* Dashboard Heading */}
        <div className="dashboard-heading">
          <div>
            <span>STUDENT DASHBOARD</span>
            <h1>Welcome Back, {user?.name || "Learner"}! 👋</h1>
            <p>Continue your learning journey with SkillSphere.</p>
          </div>

          <Link to="/courses" className="dashboard-explore-btn">
            Explore Courses <ArrowRight size={18} />
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-5">
            <h4>Loading your dashboard...</h4>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Statistics */}
            <div className="row g-4 dashboard-stats">

              <div className="col-md-4">
                <div className="stat-card">
                  <div className="stat-icon purple">
                    <BookOpen size={25} />
                  </div>
                  <h3>{enrolledCourses.length}</h3>
                  <p>Enrolled Courses</p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="stat-card">
                  <div className="stat-icon green">
                    <CheckCircle size={25} />
                  </div>
                  <h3>{stats.completed_courses}</h3>
                  <p>Completed Courses</p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="stat-card">
                  <div className="stat-icon blue">
                    <TrendingUp size={25} />
                  </div>
                  <h3>{stats.average_progress}%</h3>
                  <p>Overall Progress</p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="stat-card">
                  <div className="stat-icon blue">
                    <TrendingUp size={25} />
                  </div>
                  <h3>{stats.in_progress_courses}</h3>
                  <p>In Progress Courses</p>
                </div>
              </div>

            </div>

            {/* My Courses */}
            <section className="my-courses-section">

              <div className="my-courses-heading">
                <div>
                  <h2>My Enrolled Courses</h2>
                  <p>Track your learning progress.</p>
                </div>

                <span>{enrolledCourses.length} Courses</span>
              </div>

              {enrolledCourses.length > 0 ? (
                <div className="row g-4">

                  {enrolledCourses.map((course) => {
                    const courseProgress = course.progress;

                    return (
                      <div
                        className="col-md-6 col-lg-4"
                        key={course.id}
                      >
                        <div className="dashboard-course-card">

                          <img
                            src={course.image}
                            alt={course.title}
                          />

                          <div className="dashboard-course-content">

                            <span>{course.category}</span>

                            <h4>{course.title}</h4>

                            <p>
                              <Clock size={16} />
                              {course.duration}
                            </p>

                            <div className="progress-heading">
                              <span>Course Progress</span>
                              <strong>{courseProgress}%</strong>
                            </div>

                            <div className="progress-track">
                              <div
                                className="progress-fill"
                                style={{
                                  width: `${courseProgress}%`
                                }}
                              ></div>
                            </div>

                            <button
                              className="progress-update-btn"
                              onClick={() => updateProgress(course.id)}
                              disabled={
                                courseProgress >= 100 ||
                                updatingCourse === course.id
                              }
                            >
                              {updatingCourse === course.id
                                ? "Updating..."
                                : courseProgress >= 100
                                  ? "Course Completed"
                                  : "Update Progress (+25%)"}
                            </button>

                            <Link
                              to={`/courses/${course.id}`}
                              className="continue-link"
                            >
                              View Course <ArrowRight size={17} />
                            </Link>

                          </div>
                        </div>
                      </div>
                    );
                  })}

                </div>
              ) : (
                <div className="dashboard-empty">
                  <BookOpen size={45} />
                  <h3>No Enrolled Courses Yet</h3>
                  <p>
                    Explore our courses and start learning today.
                  </p>

                  <Link to="/courses" className="primary-btn">
                    Explore Courses
                  </Link>
                </div>
              )}

            </section>
          </>
        )}

      </div>
    </div>
  );
}

export default Dashboard;
