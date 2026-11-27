
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";import {
  Star,
  Clock,
  Users,
  BookOpen,
  CheckCircle,
  PlayCircle
} from "lucide-react";

import api from "../services/api";
import { useAppContext } from "../context/AppContext";

function CourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { isAuthenticated } = useAppContext();
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState("");
  const [enrollError, setEnrollError] = useState("");

  // Fetch selected course from Laravel API
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/courses/${id}`);

        const courseData = response.data?.data ?? response.data;

        if (!courseData || !courseData.id) {
          throw new Error("Course not found.");
        }

        setCourse(courseData);
      } catch (err) {
        console.error("Failed to fetch course:", err);

        setError(
          err.response?.data?.message ||
          err.message ||
          "Unable to load course details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // Enroll in course	
  const enrollCourse = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  
    try {
      setEnrolling(true);
      setEnrollMessage("");
      setEnrollError("");
  
      const response = await api.post(
        `/courses/${course.id}/enroll`
      );
  
      setEnrollMessage(
        response.data.message || "Successfully enrolled!"
      );
  
    } catch (error) {
      console.error("Enrollment failed:", error);
  
      setEnrollError(
        error.response?.data?.message ||
        "Unable to enroll. Please try again."
      );
    } finally {
      setEnrolling(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h3>Loading course details...</h3>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="container py-5 text-center">
        <h2>Unable to Load Course</h2>
        <p>{error}</p>

        <Link to="/courses" className="primary-btn">
          Back to Courses
        </Link>
      </div>
    );
  }

  // Course not found
  if (!course) {
    return (
      <div className="container py-5 text-center">
        <h2>Course Not Found</h2>

        <Link to="/courses" className="primary-btn">
          Back to Courses
        </Link>
      </div>
    );
  }

  const studentsCount = Number(
    course.students_count ?? course.students ?? 0
  );

  const learningPoints =
    course.what_you_learn ?? course.learn ?? [];

  const curriculum = course.curriculum ?? [];

  return (
    <div className="course-details-page">

      {/* Course Hero */}
      <section className="details-hero">
        <div className="container">
          <div className="row align-items-center g-5">

            <div className="col-lg-7">

              <Link to="/courses" className="back-link">
                ← Back to Courses
              </Link>

              <span className="details-category">
                {course.category}
              </span>

              <h1>{course.title}</h1>

              <p>{course.description}</p>

              <div className="details-meta">
                <span>
                  <Star
                    size={17}
                    fill="#F59E0B"
                    color="#F59E0B"
                  />
                  {course.rating ?? 0}
                </span>

                <span>
                  <Users size={17} />
                  {studentsCount.toLocaleString()} Students
                </span>

                <span>
                  <Clock size={17} />
                  {course.duration}
                </span>
              </div>

              <p className="details-instructor">
                Instructor: <strong>{course.instructor}</strong>
              </p>

            </div>

            <div className="col-lg-5">
              <div className="details-preview-card">

                <img
                  src={course.image}
                  alt={course.title}
                />

                <div className="details-price">
                  <strong>₹{course.price}</strong>

                  {course.oldPrice && (
                    <del>₹{course.oldPrice}</del>
                  )}
                </div>

                <button
  className="primary-btn w-100"
  onClick={enrollCourse}
  disabled={enrolling}
>
  {enrolling ? "Enrolling..." : "Enroll Now"}
</button>

{enrollMessage && (
  <div className="alert alert-success mt-3">
    {enrollMessage}
  </div>
)}

{enrollError && (
  <div className="alert alert-danger mt-3">
    {enrollError}
  </div>
)}

                <p className="enroll-note">
                  Start your learning journey today!
                </p>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section className="details-content-section">
        <div className="container">

          <div className="row g-5">

            <div className="col-lg-8">

              {/* What You'll Learn */}
              <div className="details-content-card">
                <h2>What You'll Learn</h2>

                <div className="row g-3">
                  {learningPoints.map((item, index) => (
                    <div className="col-md-6" key={index}>
                      <div className="learn-item">
                        <CheckCircle size={19} />
                        <span>{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Curriculum */}
              <div className="details-content-card">
                <h2>Course Curriculum</h2>

                {curriculum.map((item, index) => (
                  <div className="curriculum-item" key={index}>
                    <span>
                      <PlayCircle size={19} />

                      Module {index + 1}:{" "}
                      {typeof item === "string"
                        ? item
                        : item.title ?? item.name}
                    </span>

                    <BookOpen size={17} />
                  </div>
                ))}
              </div>

            </div>

            {/* Course Information */}
            <div className="col-lg-4">
              <div className="details-sidebar">
                <h4>Course Information</h4>

                <p>
                  <Clock size={18} />
                  Duration: {course.duration}
                </p>

                <p>
                  <Users size={18} />
                  Students: {studentsCount.toLocaleString()}
                </p>

                <p>
                  <Star size={18} />
                  Rating: {course.rating ?? 0}/5
                </p>

                <p>
                  <BookOpen size={18} />
                  Level: {course.level}
                </p>

              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

export default CourseDetails;
