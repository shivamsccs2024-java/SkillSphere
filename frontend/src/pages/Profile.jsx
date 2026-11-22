
import { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  Briefcase,
  BookOpen,
  Edit3,
  Save,
  X
} from "lucide-react";

function Profile() {

  const [profile, setProfile] = useState(() =>
    JSON.parse(localStorage.getItem("ss_user") || "null") || {
      name: "Siva Kumar",
      email: "siva@example.com",
      phone: "",
      role: "Frontend Developer",
      bio: "Passionate learner interested in web development and modern technologies."
    }
  );

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    setProfile(formData);

    localStorage.setItem(
      "ss_user",
      JSON.stringify(formData)
    );

    setEditMode(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditMode(false);
  };

  const initials = profile.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="profile-page">

      <div className="container">

        {/* PAGE HEADING */}

        <div className="profile-heading">
          <div>
            <span>MY ACCOUNT</span>
            <h1>My Profile</h1>
            <p>Manage your personal information and learning profile.</p>
          </div>

          {!editMode && (
            <button
              className="profile-edit-btn"
              onClick={() => {
                setFormData(profile);
                setEditMode(true);
              }}
            >
              <Edit3 size={17} />
              Edit Profile
            </button>
          )}
        </div>

        <div className="row g-4">

          {/* PROFILE CARD */}

          <div className="col-lg-4">

            <div className="profile-summary-card">

              <div className="profile-avatar">
                {initials || <UserRound size={45} />}
              </div>

              <h3>{profile.name}</h3>

              <p>{profile.role}</p>

              <div className="profile-summary-divider"></div>

              <div className="profile-summary-item">
                <Mail size={18} />
                <span>{profile.email}</span>
              </div>

              <div className="profile-summary-item">
                <Phone size={18} />
                <span>{profile.phone || "Not provided"}</span>
              </div>

              <div className="profile-summary-item">
                <Briefcase size={18} />
                <span>{profile.role}</span>
              </div>

            </div>

          </div>

          {/* PROFILE INFORMATION */}

          <div className="col-lg-8">

            <div className="profile-form-card">

              <div className="profile-form-heading">
                <div>
                  <h3>Personal Information</h3>
                  <p>Update your personal details.</p>
                </div>

                <UserRound size={25} />
              </div>

              <form onSubmit={handleSave}>

                <div className="row g-4">

                  <div className="col-md-6">
                    <label>Full Name</label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Email Address</label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Phone Number</label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Learning Goal</label>

                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      disabled={!editMode}
                    >
                      <option>Frontend Developer</option>
                      <option>Backend Developer</option>
                      <option>Full Stack Developer</option>
                      <option>UI/UX Designer</option>
                      <option>Data Scientist</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label>About Me</label>

                    <textarea
                      name="bio"
                      rows="4"
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                </div>

                {editMode && (
                  <div className="profile-form-actions">

                    <button
                      type="button"
                      className="profile-cancel-btn"
                      onClick={handleCancel}
                    >
                      <X size={17} />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="profile-save-btn"
                    >
                      <Save size={17} />
                      Save Changes
                    </button>

                  </div>
                )}

              </form>

            </div>

          </div>

        </div>

        {/* LEARNING INFORMATION */}

        <div className="profile-learning-card">

          <div className="profile-learning-icon">
            <BookOpen size={27} />
          </div>

          <div>
            <h4>Your Learning Journey</h4>
            <p>
              Continue exploring courses and building
              new skills with SkillSphere.
            </p>
          </div>

        </div>

      </div>

    </main>
  );
}

export default Profile;
