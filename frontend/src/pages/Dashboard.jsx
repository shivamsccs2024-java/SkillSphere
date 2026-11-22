
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle,
  TrendingUp,
  Clock,
  ArrowRight
} from "lucide-react";

import courses from "../data/courses";

function Dashboard() {

  const [enrolledIds] = useState(() =>
    JSON.parse(localStorage.getItem("ss_enrolled") || "[]")
  );

  const [progress, setProgress] = useState(() =>
    JSON.parse(localStorage.getItem("ss_progress") || "{}")
  );

  const enrolledCourses = courses.filter((course) =>
    enrolledIds.includes(course.id)
  );

  const completedCourses = enrolledCourses.filter(
    (course) => (progress[course.id] || 0) >= 100
  ).length;

  const overallProgress = enrolledCourses.length
    ? Math.round(
        enrolledCourses.reduce(
          (total, course) => total + (progress[course.id] || 0),
          0
        ) / enrolledCourses.length
      )
    : 0;

  const updateProgress = (courseId) => {
    const currentProgress = progress[courseId] || 0;
    const newProgress = Math.min(currentProgress + 25, 100);

    const updatedProgress = {
      ...progress,
      [courseId]: newProgress
    };

    setProgress(updatedProgress);

    localStorage.setItem(
      "ss_progress",
      JSON.stringify(updatedProgress)
    );
  };

  return (
    <div className="dashboard-page">

      <div className="container">

        {/* Dashboard Heading */}

        <div className="dashboard-heading">
          <div>
            <span>STUDENT DASHBOARD</span>
            <h1>Welcome Back, Learner! 👋</h1>
            <p>Continue your learning journey with SkillSphere.</p>
          </div>

          <Link to="/courses" className="dashboard-explore-btn">
            Explore Courses <ArrowRight size={18} />
          </Link>
        </div>

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
              <h3>{completedCourses}</h3>
              <p>Completed Courses</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="stat-card">
              <div className="stat-icon blue">
                <TrendingUp size={25} />
              </div>
              <h3>{overallProgress}%</h3>
              <p>Overall Progress</p>
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
                const courseProgress = progress[course.id] || 0;

                return (
                  <div className="col-md-6 col-lg-4" key={course.id}>
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
                            style={{ width: `${courseProgress}%` }}
                          ></div>
                        </div>

                        <button
                          className="progress-update-btn"
                          onClick={() => updateProgress(course.id)}
                          disabled={courseProgress >= 100}
                        >
                          {courseProgress >= 100
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
              <p>Explore our courses and start learning today.</p>

              <Link to="/courses" className="primary-btn">
                Explore Courses
              </Link>
            </div>

          )}

        </section>

      </div>
    </div>
  );
}

export default Dashboard;
