
import { Star, Quote } from "lucide-react";

function TestimonialCard({ testimonial }) {
  return (
    <div className="testimonial-card">

      <div className="testimonial-quote">
        <Quote size={30} />
      </div>

      <div className="testimonial-rating">
        {[...Array(testimonial.rating)].map((_, index) => (
          <Star
            key={index}
            size={17}
            fill="#F59E0B"
            color="#F59E0B"
          />
        ))}
      </div>

      <p className="testimonial-message">
        "{testimonial.message}"
      </p>

      <div className="testimonial-user">

        <img
          src={testimonial.image}
          alt={testimonial.name}
        />

        <div>
          <h5>{testimonial.name}</h5>
          <span>{testimonial.role}</span>
        </div>

      </div>

    </div>
  );
}

export default TestimonialCard;
