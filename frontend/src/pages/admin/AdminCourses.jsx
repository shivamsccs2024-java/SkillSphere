
import { useEffect, useState } from "react";
import {
  Search,
  BookOpen,
  RefreshCw,
  Plus,
  X,
} from "lucide-react";
import api from "../../services/api";

function AdminCourses() {
  // Course List States
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Pagination
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  // Add Course Modal States
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Initial Form Data
  const initialFormData = {
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    price: "",
    duration: "",
    image: "",
    instructor: "",
    what_you_learn: "",
    curriculum: "",
    is_active: true,
  };

  const [formData, setFormData] = useState(initialFormData);

  // Fetch Courses
  const fetchCourses = async (
    page = 1,
    searchValue = search,
    categoryValue = category,
    levelValue = level
  ) => {
    try {
      setLoading(true);

      const response = await api.get("/admin/courses", {
        params: {
          page,
          search: searchValue || undefined,
          category: categoryValue || undefined,
          level: levelValue || undefined,
        },
      });

      const result = response.data.data;

      setCourses(result.data);

      setPagination({
        current_page: result.current_page,
        last_page: result.last_page,
        total: result.total,
      });

    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial API Call
  useEffect(() => {
    fetchCourses(1, "", "", "");
  }, []);

  // Search Courses
  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);
    fetchCourses(1, value, category, level);
  };

  // Category Filter
  const handleCategoryChange = (e) => {
    const value = e.target.value;

    setCategory(value);
    fetchCourses(1, search, value, level);
  };

  // Level Filter
  const handleLevelChange = (e) => {
    const value = e.target.value;

    setLevel(value);
    fetchCourses(1, search, category, value);
  };

  // Reset Filters
  const handleReset = () => {
    setSearch("");
    setCategory("");
    setLevel("");

    fetchCourses(1, "", "", "");
  };

  // Open Add Course Modal
  const handleOpenAddModal = () => {
    setFormData(initialFormData);
    setFormError("");
    setShowCourseModal(true);
  };

  const handleViewCourse = async (courseId) => {
    try {
      setSelectedCourse(null);
      setShowViewModal(true);
  
      const response = await api.get(`/courses/${courseId}`);
  
      setSelectedCourse(response.data.data);
  
    } catch (error) {
      console.error("Failed to fetch course details:", error);
  
      alert(
        error.response?.data?.message ||
        "Unable to load course details."
      );
  
      setShowViewModal(false);
    }
  };

  // Close Modal
  const handleCloseModal = () => {
    if (saving) return;

    setShowCourseModal(false);
    setFormError("");
  };

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Create Course
  const handleCreateCourse = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setFormError("");

      // Parse Curriculum JSON
      let curriculumData = [];

      if (formData.curriculum.trim()) {
        curriculumData = JSON.parse(formData.curriculum);

        if (!Array.isArray(curriculumData)) {
          throw new Error("Curriculum must be a JSON array.");
        }
      }

      // Prepare Payload
      const payload = {
        title: formData.title.trim(),
        description: formData.description,
        category: formData.category.trim(),
        level: formData.level,
        price: Number(formData.price),
        duration: formData.duration,
        image: formData.image,
        instructor: formData.instructor,

        what_you_learn: formData.what_you_learn
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        curriculum: curriculumData,
        is_active: formData.is_active,
      };

      // POST API
      const response = await api.post(
        "/admin/courses",
        payload
      );

      alert(response.data.message);

      // Close and Reset
      setShowCourseModal(false);
      setFormData(initialFormData);

      // Refresh Course List
      await fetchCourses(1, search, category, level);

    } catch (error) {
      console.error("Course creation failed:", error);

      const validationErrors = error.response?.data?.errors;

      if (validationErrors) {
        setFormError(
          Object.values(validationErrors).flat().join("\n")
        );
      } else {
        setFormError(
          error.message || "Unable to create course."
        );
      }

    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid py-4">

      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">

        <div>
          <h2 className="fw-bold">Course Management</h2>

          <p className="text-muted mb-0">
            Manage all available courses
          </p>
        </div>

        <div className="d-flex align-items-center gap-3">

          <span className="badge bg-primary fs-6">
            Total Courses: {pagination.total}
          </span>

          <button
            className="btn btn-primary"
            onClick={handleOpenAddModal}
          >
            <Plus size={18} className="me-1" />
            Add Course
          </button>

        </div>
      </div>

      {/* Course Table */}
      <div className="card border-0 shadow-sm">

        <div className="card-body">

          {/* Search and Filters */}
          <div className="row g-3 mb-4">

            <div className="col-md-4">
              <div className="input-group">

                <span className="input-group-text bg-white">
                  <Search size={18} />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search course or instructor..."
                  value={search}
                  onChange={handleSearch}
                />

              </div>
            </div>

            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Filter by category..."
                value={category}
                onChange={handleCategoryChange}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={level}
                onChange={handleLevelChange}
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={handleReset}
              >
                <RefreshCw size={15} className="me-1" />
                Reset
              </button>
            </div>

          </div>

          {/* Loading */}
          {loading ? (

            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>

              <p className="mt-2">
                Loading courses...
              </p>
            </div>

          ) : (

            /* Courses Table */
            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Course</th>
                    <th>Category</th>
                    <th>Level</th>
                    <th>Instructor</th>
                    <th>Price</th>
                    <th>Students</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {courses.length > 0 ? (

                    courses.map((course) => (

                      <tr key={course.id}>

                        <td>{course.id}</td>

                        <td>
                          <div className="d-flex align-items-center gap-2">

                            {course.image ? (
                              <img
                                src={course.image}
                                alt={course.title}
                                style={{
                                  width: "45px",
                                  height: "45px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                            ) : (
                              <div
                                className="bg-primary bg-opacity-10 text-primary rounded d-flex align-items-center justify-content-center"
                                style={{
                                  width: "45px",
                                  height: "45px",
                                  flexShrink: 0,
                                }}
                              >
                                <BookOpen size={22} />
                              </div>
                            )}

                            <span className="fw-semibold">
                              {course.title}
                            </span>

                          </div>
                        </td>

                        <td>{course.category}</td>

                        <td>
                          <span className="badge bg-info text-dark">
                            {course.level}
                          </span>
                        </td>

                        <td>
                          {course.instructor || "N/A"}
                        </td>

                        <td>₹{course.price}</td>

                        <td>{course.students_count}</td>

                        <td>
                          {course.is_active ? (
                            <span className="badge bg-success">
                              Active
                            </span>
                          ) : (
                            <span className="badge bg-danger">
                              Inactive
                            </span>
                          )}
                        </td>

                        <td>
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleViewCourse(course.id)}
                            >
                            View
                            </button>
                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        No courses found
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          )}

          {/* Pagination */}
          {!loading && pagination.last_page > 1 && (

            <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">

              <span className="text-muted">
                Page {pagination.current_page} of {pagination.last_page}
              </span>

              <div className="d-flex gap-2">

                <button
                  className="btn btn-outline-primary btn-sm"
                  disabled={pagination.current_page === 1}
                  onClick={() =>
                    fetchCourses(
                      pagination.current_page - 1
                    )
                  }
                >
                  Previous
                </button>

                <button
                  className="btn btn-outline-primary btn-sm"
                  disabled={
                    pagination.current_page === pagination.last_page
                  }
                  onClick={() =>
                    fetchCourses(
                      pagination.current_page + 1
                    )
                  }
                >
                  Next
                </button>

              </div>

            </div>

          )}

        </div>
      </div>

      {/* View Course Modal */}
{showViewModal && (
  <div
    className="modal d-block"
    tabIndex="-1"
    style={{
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 1055,
      overflowY: "auto",
    }}
    onClick={() => setShowViewModal(false)}
  >
    <div
      className="modal-dialog modal-lg modal-dialog-centered"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-content border-0 shadow">

        {/* Header */}
        <div className="modal-header">
          <h5 className="modal-title fw-bold">
            Course Details
          </h5>

          <button
            type="button"
            className="btn-close"
            onClick={() => setShowViewModal(false)}
          />
        </div>

        {/* Body */}
        <div className="modal-body">

          {!selectedCourse ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
              <p className="mt-2">Loading course details...</p>
            </div>
          ) : (
            <>
              {/* Course Information */}
              <div className="d-flex gap-3 align-items-start mb-4">

                {selectedCourse.image ? (
                  <img
                    src={selectedCourse.image}
                    alt={selectedCourse.title}
                    style={{
                      width: "120px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                ) : (
                  <div
                    className="bg-primary bg-opacity-10 text-primary rounded d-flex align-items-center justify-content-center"
                    style={{
                      width: "120px",
                      height: "100px",
                    }}
                  >
                    <BookOpen size={35} />
                  </div>
                )}

                <div>
                  <h5 className="fw-bold">
                    {selectedCourse.title}
                  </h5>

                  <p className="text-muted mb-2">
                    {selectedCourse.description || "No description available"}
                  </p>

                  <span className={`badge ${
                    selectedCourse.is_active
                      ? "bg-success"
                      : "bg-danger"
                  }`}>
                    {selectedCourse.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

              </div>

              <hr />

              {/* Basic Information */}
              <h6 className="fw-bold mb-3">
                Basic Information
              </h6>

              <div className="row g-3 mb-4">

                <div className="col-md-6">
                  <small className="text-muted">Course ID</small>
                  <h6>{selectedCourse.id}</h6>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">Category</small>
                  <h6>{selectedCourse.category}</h6>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">Level</small>
                  <h6>{selectedCourse.level}</h6>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">Price</small>
                  <h6>₹{selectedCourse.price}</h6>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">Duration</small>
                  <h6>{selectedCourse.duration || "N/A"}</h6>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">Instructor</small>
                  <h6>{selectedCourse.instructor || "N/A"}</h6>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">Students</small>
                  <h6>{selectedCourse.students_count ?? 0}</h6>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">Rating</small>
                  <h6>{selectedCourse.rating ?? 0} / 5</h6>
                </div>

              </div>

              <hr />

              {/* What You Will Learn */}
              <h6 className="fw-bold mb-3">
                What You Will Learn
              </h6>

              {selectedCourse.what_you_learn?.length > 0 ? (
                <ul className="list-group mb-4">
                  {selectedCourse.what_you_learn.map((item, index) => (
                    <li
                      key={index}
                      className="list-group-item"
                    >
                      <BookOpen
                        size={16}
                        className="text-primary me-2"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No learning points available.</p>
              )}

              <hr />

              {/* Curriculum */}
              <h6 className="fw-bold mb-3">
                Course Curriculum
              </h6>

              {selectedCourse.curriculum?.length > 0 ? (
                selectedCourse.curriculum.map((module, index) => (
                  <div
                    key={index}
                    className="border rounded-3 p-3 mb-3"
                  >
                    <h6 className="fw-semibold">
                      {index + 1}. {module.title}
                    </h6>

                    {module.lessons?.length > 0 ? (
                      <ul className="mb-0">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <li key={lessonIndex}>
                            {lesson}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <small className="text-muted">
                        No lessons available.
                      </small>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted">
                  No curriculum available.
                </p>
              )}

            </>
          )}

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setShowViewModal(false)}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  </div>
)}

      {/* Add Course Modal */}
      {showCourseModal && (

        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          onClick={handleCloseModal}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1060,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            overflowY: "auto",
            padding: "20px 12px",
          }}
        >

          <div
            className="modal-dialog modal-lg modal-dialog-scrollable"
            role="document"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              height: "calc(100% - 40px)",
              minHeight: "300px",
            }}
          >

            <div
              className="modal-content border-0 shadow"
              style={{
                height: "100%",
                maxHeight: "100%",
              }}
            >

              {/* Modal Header */}
              <div className="modal-header flex-shrink-0">

                <div>
                  <h5 className="modal-title fw-bold">
                    Add New Course
                  </h5>

                  <small className="text-muted">
                    Enter the course information below
                  </small>
                </div>

                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  disabled={saving}
                  aria-label="Close"
                />

              </div>

              {/* Course Form */}
              <form
                onSubmit={handleCreateCourse}
                className="d-flex flex-column flex-grow-1"
                style={{
                  minHeight: 0,
                  overflow: "hidden",
                }}
              >

                {/* Scrollable Form Body */}
                <div
                  className="modal-body"
                  style={{
                    overflowY: "auto",
                    flex: "1 1 auto",
                    minHeight: 0,
                  }}
                >

                  {/* Error Message */}
                  {formError && (
                    <div className="alert alert-danger">
                      {formError.split("\n").map((message, index) => (
                        <div key={index}>{message}</div>
                      ))}
                    </div>
                  )}

                  <div className="row g-3">

                    {/* Title */}
                    <div className="col-md-12">
                      <label className="form-label fw-semibold">
                        Course Title *
                      </label>

                      <input
                        type="text"
                        name="title"
                        className="form-control"
                        placeholder="Enter course title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="col-md-12">
                      <label className="form-label fw-semibold">
                        Description
                      </label>

                      <textarea
                        name="description"
                        className="form-control"
                        rows="3"
                        placeholder="Enter course description"
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Category */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Category *
                      </label>

                      <input
                        type="text"
                        name="category"
                        className="form-control"
                        placeholder="e.g. Programming"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Level */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Level *
                      </label>

                      <select
                        name="level"
                        className="form-select"
                        value={formData.level}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    {/* Price */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Price (₹) *
                      </label>

                      <input
                        type="number"
                        name="price"
                        className="form-control"
                        placeholder="Enter course price"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Duration */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Duration
                      </label>

                      <input
                        type="text"
                        name="duration"
                        className="form-control"
                        placeholder="e.g. 8 Weeks"
                        value={formData.duration}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Instructor */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Instructor
                      </label>

                      <input
                        type="text"
                        name="instructor"
                        className="form-control"
                        placeholder="Enter instructor name"
                        value={formData.instructor}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Image */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Image URL
                      </label>

                      <input
                        type="text"
                        name="image"
                        className="form-control"
                        placeholder="https://example.com/image.jpg"
                        value={formData.image}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* What You Will Learn */}
                    <div className="col-md-12">
                      <label className="form-label fw-semibold">
                        What You Will Learn
                      </label>

                      <textarea
                        name="what_you_learn"
                        className="form-control"
                        rows="4"
                        placeholder={`Enter one learning point per line
Laravel Basics
REST API Development
Authentication`}
                        value={formData.what_you_learn}
                        onChange={handleInputChange}
                      />

                      <small className="text-muted">
                        Enter each learning point on a separate line.
                      </small>
                    </div>

                    {/* Curriculum */}
                    <div className="col-md-12">
                      <label className="form-label fw-semibold">
                        Curriculum (JSON)
                      </label>

                      <textarea
                        name="curriculum"
                        className="form-control"
                        rows="5"
                        placeholder={`[
  {
    "title": "Introduction",
    "lessons": ["Lesson 1", "Lesson 2"]
  }
]`}
                        value={formData.curriculum}
                        onChange={handleInputChange}
                      />

                      <small className="text-muted">
                        Enter a valid JSON array.
                      </small>
                    </div>

                    {/* Active Status */}
                    <div className="col-md-12">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          name="is_active"
                          className="form-check-input"
                          id="courseActive"
                          checked={formData.is_active}
                          onChange={handleInputChange}
                        />

                        <label
                          className="form-check-label"
                          htmlFor="courseActive"
                        >
                          Active Course
                        </label>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Fixed Modal Footer */}
                <div className="modal-footer flex-shrink-0 bg-white">

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCloseModal}
                    disabled={saving}
                  >
                    <X size={16} className="me-1" />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Plus size={17} className="me-1" />
                        Create Course
                      </>
                    )}
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminCourses;
