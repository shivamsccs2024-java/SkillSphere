
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Clock,
  Users,
  BookOpen,
  CheckCircle,
  PlayCircle
} from "lucide-react";

import courses from "../data/courses";

function CourseDetails() {
  const { id } = useParams();

  const course = courses.find(
    (item) => item.id === Number(id)
  );

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

  const enrollCourse = () => {
    const enrolled = JSON.parse(
      localStorage.getItem("ss_enrolled") || "[]"
    );

    if (!enrolled.includes(course.id)) {
      enrolled.push(course.id);
      localStorage.setItem(
        "ss_enrolled",
        JSON.stringify(enrolled)
      );
    }

    alert("Successfully enrolled in " + course.title);
  };

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
                  <Star size={17} fill="#F59E0B" color="#F59E0B" />
                  {course.rating}
                </span>

                <span>
                  <Users size={17} />
                  {course.students} Students
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

                <img src={course.image} alt={course.title} />

                <div className="details-price">
                  <strong>₹{course.price}</strong>
                  <del>₹{course.oldPrice}</del>
                </div>

                <button
                  className="primary-btn w-100"
                  onClick={enrollCourse}
                >
                  Enroll Now
                </button>

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

              <div className="details-content-card">
                <h2>What You'll Learn</h2>

                <div className="row g-3">
                  {course.learn?.map((item, index) => (
                    <div className="col-md-6" key={index}>
                      <div className="learn-item">
                        <CheckCircle size={19} />
                        <span>{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="details-content-card">
                <h2>Course Curriculum</h2>

                {course.curriculum?.map((item, index) => (
                  <div className="curriculum-item" key={index}>
                    <span>
                      <PlayCircle size={19} />
                      Module {index + 1}: {item}
                    </span>

                    <BookOpen size={17} />
                  </div>
                ))}
              </div>

            </div>

            <div className="col-lg-4">
              <div className="details-sidebar">
                <h4>Course Information</h4>

                <p>
                  <Clock size={18} />
                  Duration: {course.duration}
                </p>

                <p>
                  <Users size={18} />
                  Students: {course.students}
                </p>

                <p>
                  <Star size={18} />
                  Rating: {course.rating}/5
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
