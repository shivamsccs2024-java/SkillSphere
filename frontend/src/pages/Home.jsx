
import {
    ArrowRight,
    PlayCircle,
    Users,
    Star,
    Code2,
    Server,
    Palette,
    Database,
    Award,
  BookOpenCheck,
  Headphones,
  TrendingUp
  } from "lucide-react";
  
  import { Link } from "react-router-dom";
  import courses from "../data/courses";
  import CourseCard from "../components/CourseCard";
  import testimonials from "../data/testimonials";
  import TestimonialCard from "../components/TestimonialCard";
  

  const categories = [

    {
        id: 1,
        title: "Web Development",
        description: "Build modern and responsive websites.",
        courses: "12 Courses",
        icon: Code2,
        color: "blue"
      },
      {
        id: 2,
        title: "Backend Development",
        description: "Learn server-side programming and APIs.",
        courses: "10 Courses",
        icon: Server,
        color: "purple"
      },
      {
        id: 3,
        title: "UI/UX Design",
        description: "Create beautiful user experiences.",
        courses: "8 Courses",
        icon: Palette,
        color: "orange"
      },
      {
        id: 4,
        title: "Data Science",
        description: "Explore data, analytics and Python.",
        courses: "9 Courses",
        icon: Database,
        color: "green"
      },
    
  ];



const benefits = [
    {
      id: 1,
      title: "Expert Instructors",
      description: "Learn from experienced professionals and industry experts.",
      icon: Award,
      color: "purple"
    },
    {
      id: 2,
      title: "Flexible Learning",
      description: "Learn anytime and anywhere at your own comfortable pace.",
      icon: BookOpenCheck,
      color: "blue"
    },
    {
      id: 3,
      title: "Practical Projects",
      description: "Build real-world projects and improve your practical skills.",
      icon: TrendingUp,
      color: "green"
    },
    {
      id: 4,
      title: "Career Support",
      description: "Get guidance and support to move towards your dream career.",
      icon: Headphones,
      color: "orange"
    }
  ];
  

  function Home() {
    return (
      <>
        <section className="hero-section">
          <div className="container">
            <div className="row align-items-center">
  
              {/* Left Content */}
              <div className="col-lg-6">
                <span className="hero-badge">
                  <Star size={15} />
                  Learn Without Limits
                </span>
  
                <h1 className="hero-title">
                  Build Your Skills.
                  <span> Shape Your Future.</span>
                </h1>
  
                <p className="hero-description">
                  Discover industry-focused courses, learn from
                  experienced instructors, and take the next step
                  towards your dream career with SkillSphere.
                </p>
  
                <div className="hero-buttons">
                  <Link to="/courses" className="primary-btn">
                    Explore Courses
                    <ArrowRight size={18} />
                  </Link>
  
                  <Link to="/roadmap" className="secondary-btn">
                    <PlayCircle size={19} />
                    Explore Roadmap
                  </Link>
                </div>
  
                <div className="hero-stats">
                  <div>
                    <h4>5K+</h4>
                    <p>Active Learners</p>
                  </div>
  
                  <div>
                    <h4>50+</h4>
                    <p>Expert Courses</p>
                  </div>
  
                  <div>
                    <h4>95%</h4>
                    <p>Success Rate</p>
                  </div>
                </div>
              </div>
  
              {/* Right Content */}
              <div className="col-lg-6">
                <div className="hero-visual">
                  <div className="hero-image-placeholder">
                    <div className="learning-card">
                      <div className="learning-icon">
                        <Users size={30} />
                      </div>
  
                      <h4>Start Learning Today!</h4>
                      <p>Your journey to success starts here.</p>
  
                      <div className="learning-progress">
                        <span></span>
                      </div>
  
                      <small>Keep growing every day 🚀</small>
                    </div>
                  </div>
                </div>
              </div>
  
            </div>
          </div>
        </section>



{/* POPULAR CATEGORIES SECTION */}

<section className="categories-section">
  <div className="container">

    <div className="section-heading text-center">
      <span>EXPLORE CATEGORIES</span>

      <h2>
        Explore Our Popular
        <span> Learning Categories</span>
      </h2>

      <p>
        Choose your learning path and develop skills
        that help you achieve your career goals.
      </p>
    </div>

    <div className="row g-4">

      {categories.map((category) => {
        const Icon = category.icon;

        return (
          <div className="col-md-6 col-lg-3" key={category.id}>
            <div className="category-card">

              <div className={`category-icon ${category.color}`}>
                <Icon size={30} />
              </div>

              <h4>{category.title}</h4>

              <p>{category.description}</p>

              <div className="category-footer">
                <span>{category.courses}</span>

                <Link to="/courses">
                  <ArrowRight size={19} />
                </Link>
              </div>

            </div>
          </div>
        );
      })}

    </div>
  </div>
</section>



{/* FEATURED COURSES SECTION */}

<section className="featured-section">
  <div className="container">

    <div className="featured-heading">

      <div>
        <span className="section-label">
          TOP COURSES
        </span>

        <h2>
          Our Featured <span>Courses</span>
        </h2>

        <p>
          Learn new skills with our most popular
          industry-focused courses.
        </p>
      </div>

      <Link to="/courses" className="view-all-btn">
        View All Courses
        <ArrowRight size={18} />
      </Link>

    </div>

    <div className="row g-4">

      {courses.map((course) => (
        <div className="col-md-6 col-lg-3" key={course.id}>
          <CourseCard course={course} />
        </div>
      ))}

    </div>

  </div>
</section>



{/* WHY CHOOSE SKILLSPHERE */}

<section className="benefits-section">
  <div className="container">

    <div className="section-heading text-center">
      <span>WHY CHOOSE US</span>

      <h2>
        Why Learn With <span>SkillSphere?</span>
      </h2>

      <p>
        Everything you need to learn new skills and
        build a successful career.
      </p>
    </div>

    <div className="row g-4">

      {benefits.map((benefit) => {
        const Icon = benefit.icon;

        return (
          <div className="col-md-6 col-lg-3" key={benefit.id}>
            <div className="benefit-card">

              <div className={`benefit-icon ${benefit.color}`}>
                <Icon size={30} />
              </div>

              <h4>{benefit.title}</h4>

              <p>{benefit.description}</p>

            </div>
          </div>
        );
      })}

    </div>
  </div>
</section>



{/* TESTIMONIALS SECTION */}

<section className="testimonials-section">
  <div className="container">

    <div className="section-heading text-center">
      <span>STUDENT TESTIMONIALS</span>

      <h2>
        What Our Students <span>Say About Us</span>
      </h2>

      <p>
        Hear from learners who have improved their
        skills with SkillSphere.
      </p>
    </div>

    <div className="row g-4">

      {testimonials.map((testimonial) => (
        <div className="col-md-6 col-lg-4" key={testimonial.id}>
          <TestimonialCard testimonial={testimonial} />
        </div>
      ))}

    </div>

  </div>
</section>



{/* CALL TO ACTION SECTION */}

<section className="cta-section">
  <div className="container">

    <div className="cta-content">

      <span className="cta-badge">
        START LEARNING TODAY
      </span>

      <h2>
        Ready to Start Your
        <span> Learning Journey?</span>
      </h2>

      <p>
        Join SkillSphere and take the next step towards
        your dream career. Learn new skills and achieve
        your goals with us.
      </p>

      <Link to="/courses" className="cta-button">
        Explore Courses
        <ArrowRight size={19} />
      </Link>

      <div className="cta-note">
        Learn. Grow. Achieve.
      </div>

    </div>

  </div>
</section>




      </>
    );
  }
  
  export default Home;
  