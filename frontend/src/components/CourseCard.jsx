
import { Link } from "react-router-dom";
import { Star, Clock, Users, ArrowRight } from "lucide-react";

function CourseCard({ course }) {
  return (
    <div className="course-card">

      <div className="course-image">
        <img src={course.image} alt={course.title} />

        <span className="course-level">
          {course.level}
        </span>
      </div>

      <div className="course-content">

        <span className="course-category">
          {course.category}
        </span>

        <h4>{course.title}</h4>

        <p className="course-instructor">
          By {course.instructor}
        </p>

        <div className="course-info">
          <span>
            <Star size={15} fill="#F59E0B" color="#F59E0B" />
            {course.rating}
          </span>

          <span>
            <Users size={15} />
            {course.students}
          </span>

          <span>
            <Clock size={15} />
            {course.duration}
          </span>
        </div>

        <div className="course-bottom">

          <div className="course-price">
            <strong>₹{course.price}</strong>
            <del>₹{course.oldPrice}</del>
          </div>

          <Link to={`/courses/${course.id}`} className="course-link">
            <ArrowRight size={20} />
          </Link>

        </div>

      </div>
    </div>
  );
}

export default CourseCard;
