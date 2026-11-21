
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle
} from "lucide-react";

function Contact() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const messages = JSON.parse(
      localStorage.getItem("ss_messages") || "[]"
    );

    const newMessage = {
      id: Date.now(),
      ...formData,
      date: new Date().toISOString()
    };

    localStorage.setItem(
      "ss_messages",
      JSON.stringify([...messages, newMessage])
    );

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });

    setSubmitted(true);
  };

  return (
    <main className="contact-page">

      {/* HERO SECTION */}

      <section className="contact-hero">
        <div className="container text-center">

          <span>GET IN TOUCH</span>

          <h1>
            We'd Love to
            <span> Hear From You</span>
          </h1>

          <p>
            Have questions or need assistance?
            Our team is here to help you.
          </p>

        </div>
      </section>

      {/* CONTACT CONTENT */}

      <section className="contact-content">
        <div className="container">

          <div className="row g-4">

            {/* CONTACT INFORMATION */}

            <div className="col-lg-5">

              <div className="contact-info-card">

                <h2>Contact Information</h2>

                <p className="contact-info-description">
                  Reach out to us anytime. We are happy
                  to help you with your learning journey.
                </p>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <Mail size={21} />
                  </div>

                  <div>
                    <h5>Email Us</h5>
                    <p>support@skillsphere.com</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <Phone size={21} />
                  </div>

                  <div>
                    <h5>Call Us</h5>
                    <p>+91 98765 43210</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <MapPin size={21} />
                  </div>

                  <div>
                    <h5>Our Location</h5>
                    <p>Chennai, India</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <Clock size={21} />
                  </div>

                  <div>
                    <h5>Working Hours</h5>
                    <p>Monday - Saturday, 9 AM - 6 PM</p>
                  </div>
                </div>

                <div className="contact-info-bottom">
                  <MessageCircle size={35} />
                  <p>
                    We're always ready to support
                    your learning journey!
                  </p>
                </div>

              </div>

            </div>

            {/* CONTACT FORM */}

            <div className="col-lg-7">

              <div className="contact-form-card">

                <h2>Send Us a Message</h2>

                <p>Fill out the form and we'll get back to you.</p>

                {submitted && (
                  <div className="contact-success">
                    Your message has been submitted successfully!
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  <div className="row g-4">

                    <div className="col-md-6">
                      <label>Your Name</label>

                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label>Email Address</label>

                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label>Subject</label>

                      <input
                        type="text"
                        name="subject"
                        placeholder="Enter message subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label>Your Message</label>

                      <textarea
                        name="message"
                        rows="6"
                        placeholder="Write your message here..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">

                      <button
                        type="submit"
                        className="contact-submit-btn"
                      >
                        Send Message
                        <Send size={18} />
                      </button>

                    </div>

                  </div>

                </form>

              </div>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}

export default Contact;
