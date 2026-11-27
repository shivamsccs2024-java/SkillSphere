
import { useEffect, useRef, useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  Briefcase,
  BookOpen,
  Edit3,
  Save,
  X,
  Camera,
  Trash2
} from "lucide-react";

import api from "../services/api";

function Profile() {
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    bio: "",
    avatar: null,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    bio: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const response = await api.get("/profile");
        const data = response.data.data ?? response.data;

        const profileData = {
          name: data.name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          role: data.career_title ?? "",
          bio: data.bio ?? "",
          avatar: data.avatar ?? null,
        };

        setProfile(profileData);
        setFormData(profileData);

      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(
          err.response?.data?.message ||
          "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save profile
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await api.put("/profile", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        career_title: formData.role,
        bio: formData.bio,
      });

      const data = response.data.data ?? response.data;

      const updatedProfile = {
        name: data.name ?? formData.name,
        email: data.email ?? formData.email,
        phone: data.phone ?? formData.phone,
        role: data.career_title ?? formData.role,
        bio: data.bio ?? formData.bio,
        avatar: data.avatar ?? profile.avatar,
      };

      setProfile(updatedProfile);
      setFormData(updatedProfile);
      setEditMode(false);

      alert("Profile updated successfully!");

    } catch (err) {
      console.error("Profile update error:", err);

      const message =
        err.response?.data?.message ||
        "Unable to update profile.";

      setError(message);
      alert(message);

    } finally {
      setSaving(false);
    }
  };

  // Select image
  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select JPG, PNG or WEBP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be below 2 MB.");
      e.target.value = "";
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      setUploading(true);
      setError("");

      const uploadData = new FormData();
      uploadData.append("avatar", file);

      const response = await api.post(
        "/profile/avatar",
        uploadData
      );

      const data = response.data.data ?? response.data;

      const updatedAvatar = data.avatar ?? null;

      setProfile((prev) => ({
        ...prev,
        avatar: updatedAvatar,
      }));

      setPreview(null);

      URL.revokeObjectURL(localPreview);

      alert("Profile photo uploaded successfully!");

    } catch (err) {
      console.error("Avatar upload error:", err);

      setPreview(null);
      URL.revokeObjectURL(localPreview);

      const message =
        err.response?.data?.message ||
        "Unable to upload profile photo.";

      setError(message);
      alert(message);

    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Remove profile photo
  const handleRemoveAvatar = async () => {
    if (!profile.avatar) return;

    const confirmed = window.confirm(
      "Are you sure you want to remove your profile photo?"
    );

    if (!confirmed) return;

    try {
      setUploading(true);
      setError("");

      await api.delete("/profile/avatar");

      setProfile((prev) => ({
        ...prev,
        avatar: null,
      }));

      setPreview(null);

      alert("Profile photo removed successfully!");

    } catch (err) {
      console.error("Avatar remove error:", err);

      const message =
        err.response?.data?.message ||
        "Unable to remove profile photo.";

      setError(message);
      alert(message);

    } finally {
      setUploading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      role: profile.role,
      bio: profile.bio,
    });

    setEditMode(false);
    setError("");
  };

  // Initials
  const initials = profile.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Loading
  if (loading) {
    return (
      <main className="profile-page">
        <div className="container text-center py-5">
          <h4>Loading your profile...</h4>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="container">

        {/* PAGE HEADING */}

        <div className="profile-heading">
          <div>
            <span>MY ACCOUNT</span>
            <h1>My Profile</h1>
            <p>
              Manage your personal information and learning profile.
            </p>
          </div>

          {!editMode && (
            <button
              className="profile-edit-btn"
              onClick={() => {
                setFormData({
                  name: profile.name,
                  email: profile.email,
                  phone: profile.phone,
                  role: profile.role,
                  bio: profile.bio,
                });
                setEditMode(true);
              }}
            >
              <Edit3 size={17} />
              Edit Profile
            </button>
          )}
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <div className="row g-4">

          {/* PROFILE CARD */}

          <div className="col-lg-4">
            <div className="profile-summary-card">

              <div className="profile-avatar">
                {preview || profile.avatar ? (
                  <img
                    src={preview || profile.avatar}
                    alt="Profile"
                    className="profile-avatar-image"
                  />
                ) : (
                  initials || <UserRound size={45} />
                )}
              </div>

              <h3>{profile.name}</h3>
              <p>{profile.role || "Learner"}</p>

              {/* AVATAR ACTIONS */}

              <div className="d-flex justify-content-center gap-2 flex-wrap mt-3">

                <button
                  type="button"
                  className="profile-edit-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Camera size={16} />
                  {uploading ? "Uploading..." : "Change Photo"}
                </button>

                {profile.avatar && (
                  <button
                    type="button"
                    className="profile-cancel-btn"
                    onClick={handleRemoveAvatar}
                    disabled={uploading}
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={handleImageSelect}
                />

              </div>

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
                <span>{profile.role || "Not provided"}</span>
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
                      disabled={!editMode || saving}
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
                      disabled={!editMode || saving}
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
                      disabled={!editMode || saving}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Learning Goal</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      disabled={!editMode || saving}
                    >
                      <option value="">Select Learning Goal</option>
                      <option value="Frontend Developer">
                        Frontend Developer
                      </option>
                      <option value="Backend Developer">
                        Backend Developer
                      </option>
                      <option value="Full Stack Developer">
                        Full Stack Developer
                      </option>
                      <option value="UI/UX Designer">
                        UI/UX Designer
                      </option>
                      <option value="Data Scientist">
                        Data Scientist
                      </option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label>About Me</label>
                    <textarea
                      name="bio"
                      rows="4"
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!editMode || saving}
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
                      disabled={saving}
                    >
                      <X size={17} />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="profile-save-btn"
                      disabled={saving}
                    >
                      <Save size={17} />
                      {saving ? "Saving..." : "Save Changes"}
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
