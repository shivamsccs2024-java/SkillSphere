
import { useEffect, useState } from "react";
import { X, UserRound, Mail, CalendarDays, BookOpen } from "lucide-react";
import api from "../../services/api";

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const [updatingStudentId, setUpdatingStudentId] = useState(null);
  const [studentProgress, setStudentProgress] = useState(null);
  const [progressLoading, setProgressLoading] = useState(false);

  // Student Details Modal States
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  // Fetch Students
  const fetchStudents = async (page = 1, searchValue = search) => {
    try {
      setLoading(true);

      const response = await api.get("/admin/students", {
        params: {
          page,
          search: searchValue || undefined,
        },
      });

      const result = response.data.data;

      setStudents(result.data);

      setPagination({
        current_page: result.current_page,
        last_page: result.last_page,
        total: result.total,
      });

    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  // View Student Details

  const handleViewStudent = async (studentId) => {
    try {
        setShowStudentModal(true);
        setDetailsLoading(true);
        setSelectedStudent(null);
        setStudentProgress(null);
        setDetailsError("");

        const response = await api.get(
            `/admin/students/${studentId}`
        );

        setSelectedStudent(response.data.data);

        // Fetch learning progress separately
        setProgressLoading(true);

        try {
            const progressResponse = await api.get(
                `/admin/students/${studentId}/progress`
            );

            setStudentProgress(progressResponse.data.data);

        } catch (progressError) {
            console.error(
                "Failed to fetch learning progress:",
                progressError
            );
        } finally {
            setProgressLoading(false);
        }

    } catch (error) {
        console.error("Failed to fetch student details:", error);

        setDetailsError(
            error.response?.data?.message ||
            "Unable to load student details."
        );

    } finally {
        setDetailsLoading(false);
    }
};




const handleToggleStatus = async (student) => {
  const newStatus = !student.is_active;

  const action = newStatus ? "activate" : "deactivate";

  const confirmed = window.confirm(
      `Are you sure you want to ${action} ${student.name}'s account?`
  );

  if (!confirmed) return;

  try {
      setUpdatingStudentId(student.id);

      const response = await api.patch(
          `/admin/students/${student.id}/status`,
          {
              is_active: newStatus
          }
      );

      const updatedStudent = response.data.data;

      // Update student table
      setStudents((prevStudents) =>
          prevStudents.map((item) =>
              item.id === student.id
                  ? { ...item, is_active: updatedStudent.is_active }
                  : item
          )
      );

      // Update open modal if it belongs to this student
      setSelectedStudent((prev) =>
          prev?.id === student.id
              ? { ...prev, is_active: updatedStudent.is_active }
              : prev
      );

      alert(response.data.message);

  } catch (error) {
      console.error("Status update failed:", error);

      alert(
          error.response?.data?.message ||
          "Unable to update student status."
      );
  } finally {
      setUpdatingStudentId(null);
  }
};


  // Close Modal
  const closeStudentModal = () => {
    setShowStudentModal(false);
    setSelectedStudent(null);
    setDetailsError("");
  };

  // Initial API Call
  useEffect(() => {
    fetchStudents(1, "");
  }, []);

  // Search Students
  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);
    fetchStudents(1, value);
  };

  return (
    <div className="container-fluid py-4">

      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Student Management</h2>
          <p className="text-muted mb-0">
            Manage all registered students
          </p>
        </div>

        <span className="badge bg-primary fs-6">
          Total Students: {pagination.total}
        </span>
      </div>

      {/* Students Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">

          {/* Search */}
          <div className="row mb-4">
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or email..."
                value={search}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2">Loading students...</p>
            </div>
          ) : (

            /* Students Table */
            <div className="table-responsive">
              <table className="table table-hover align-middle">

                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Registered Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {students.length > 0 ? (

                    students.map((student) => (
                      
                      <tr key={student.id}>

                      <td>{student.id}</td>

                      <td className="fw-semibold">
                        {student.name}
                      </td>

                      <td>{student.email}</td>

                      <td>
                        {new Date(student.created_at).toLocaleDateString("en-IN")}
                      </td>

                      {/* Account Status */}
                      <td>
                        {student.is_active ? (
                          <span className="badge bg-success">
                            Active
                          </span>
                        ) : (
                          <span className="badge bg-danger">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="d-flex gap-2">

                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleViewStudent(student.id)}
                          >
                            View
                          </button>

                          <button
                            className={`btn btn-sm ${
                              student.is_active
                                ? "btn-outline-danger"
                                : "btn-outline-success"
                            }`}
                            disabled={updatingStudentId === student.id}
                            onClick={() => handleToggleStatus(student)}
                          >
                            {updatingStudentId === student.id
                              ? "Updating..."
                              : student.is_active
                                ? "Deactivate"
                                : "Activate"}
                          </button>

                        </div>
                      </td>

                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-4"
                      >
                        No students found
                      </td>
                    </tr>

                  )}
                </tbody>

              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.last_page > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">

              <span className="text-muted">
                Page {pagination.current_page} of {pagination.last_page}
              </span>

              <div className="d-flex gap-2">

                <button
                  className="btn btn-outline-primary btn-sm"
                  disabled={pagination.current_page === 1}
                  onClick={() =>
                    fetchStudents(pagination.current_page - 1)
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
                    fetchStudents(pagination.current_page + 1)
                  }
                >
                  Next
                </button>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* Student Details Modal */}
      {showStudentModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1060,
          }}
          onClick={closeStudentModal}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 shadow">

              {/* Modal Header */}
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  Student Details
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={closeStudentModal}
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body">

                {detailsLoading ? (

                  <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                    <p className="mt-2 text-muted">
                      Loading student details...
                    </p>
                  </div>

                ) : detailsError ? (

                  <div className="alert alert-danger mb-0">
                    {detailsError}
                  </div>

                ) : selectedStudent && (


          <>
            {/* Student Profile */}
            <div className="text-center mb-4">

              <div
                className="rounded-circle bg-primary bg-opacity-10 text-primary mx-auto d-flex align-items-center justify-content-center"
                style={{
                  width: "80px",
                  height: "80px",
                }}
              >
                <UserRound size={38} />
              </div>

              <h5 className="fw-bold mt-3 mb-1">
                {selectedStudent.name}
              </h5>

              <p className="text-muted mb-2">
                {selectedStudent.email}
              </p>

              <span className="badge bg-info">
                Student
              </span>

              <span
                className={`badge ms-2 ${
                  selectedStudent.is_active
                    ? "bg-success"
                    : "bg-danger"
                }`}
              >
                {selectedStudent.is_active ? "Active" : "Inactive"}
              </span>

            </div>

            <hr />

            {/* Student Information */}
            <div className="row g-4">

              <div className="col-6">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <UserRound size={17} className="text-primary" />
                  <small className="text-muted">Student ID</small>
                </div>

                <h6>{selectedStudent.id}</h6>
              </div>

              <div className="col-6">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <UserRound size={17} className="text-primary" />
                  <small className="text-muted">Role</small>
                </div>

                <h6>{selectedStudent.role}</h6>
              </div>

              <div className="col-6">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <BookOpen size={17} className="text-primary" />
                  <small className="text-muted">Enrolled Courses</small>
                </div>

                <h6>{selectedStudent.enrollments_count ?? 0}</h6>
              </div>

              <div className="col-6">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <CalendarDays size={17} className="text-primary" />
                  <small className="text-muted">Registered Date</small>
                </div>

                <h6>
                  {selectedStudent.created_at
                    ? new Date(selectedStudent.created_at).toLocaleDateString("en-IN")
                    : "N/A"}
                </h6>
              </div>

            </div>

            {/* Enrolled Courses */}
            <hr className="my-4" />

            <div>
              <h6 className="fw-bold mb-3">
                <BookOpen size={18} className="text-primary me-2" />
                Enrolled Courses
                <span className="badge bg-primary ms-2">
                  {selectedStudent.enrollments_count ?? 0}
                </span>
              </h6>

              {selectedStudent.enrollments?.length > 0 ? (
                <div className="d-flex flex-column gap-2">

                  {selectedStudent.enrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="border rounded-3 p-3"
                    >
                      <div className="d-flex justify-content-between align-items-start">

                        <div>
                          <h6 className="fw-semibold mb-1">
                            {enrollment.course?.title || "Course unavailable"}
                          </h6>

                          <small className="text-muted">
                            {enrollment.course?.category || "N/A"}
                            {" • "}
                            {enrollment.course?.level || "N/A"}
                          </small>
                        </div>

                        <span className="badge bg-success">
                          Enrolled
                        </span>

                      </div>
                    </div>
                  ))}

                </div>
              ) : (
                <div className="text-center text-muted border rounded-3 p-3">
                  This student has not enrolled in any courses yet.
                </div>
              )}
            </div>



{/* Student Learning Progress */}
<hr className="my-4" />

<div>
    <h6 className="fw-bold mb-3">
        <BookOpen size={18} className="text-primary me-2" />
        Learning Progress
    </h6>

    {progressLoading ? (
        <div className="text-center py-3">
            <div className="spinner-border spinner-border-sm text-primary"></div>
            <p className="text-muted mt-2 mb-0">
                Loading learning progress...
            </p>
        </div>
    ) : studentProgress ? (
        <>
            {/* Progress Summary */}
            <div className="row g-3 mb-4">

                <div className="col-6">
                    <div className="bg-light rounded-3 p-3">
                        <h4 className="fw-bold mb-1">
                            {studentProgress.summary.total_courses}
                        </h4>
                        <small className="text-muted">
                            Total Courses
                        </small>
                    </div>
                </div>

                <div className="col-6">
                    <div className="bg-light rounded-3 p-3">
                        <h4 className="fw-bold text-success mb-1">
                            {studentProgress.summary.completed_courses}
                        </h4>
                        <small className="text-muted">
                            Completed
                        </small>
                    </div>
                </div>

                <div className="col-6">
                    <div className="bg-light rounded-3 p-3">
                        <h4 className="fw-bold text-primary mb-1">
                            {studentProgress.summary.in_progress_courses}
                        </h4>
                        <small className="text-muted">
                            In Progress
                        </small>
                    </div>
                </div>

                <div className="col-6">
                    <div className="bg-light rounded-3 p-3">
                        <h4 className="fw-bold text-secondary mb-1">
                            {studentProgress.summary.not_started_courses}
                        </h4>
                        <small className="text-muted">
                            Not Started
                        </small>
                    </div>
                </div>

            </div>

            {/* Overall Progress */}
            <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                    <h6 className="fw-semibold mb-0">
                        Overall Progress
                    </h6>

                    <strong>
                        {studentProgress.summary.overall_progress}%
                    </strong>
                </div>

                <div
                    className="progress"
                    style={{ height: "10px" }}
                >
                    <div
                        className="progress-bar bg-primary"
                        role="progressbar"
                        style={{
                            width: `${studentProgress.summary.overall_progress}%`
                        }}
                    ></div>
                </div>
            </div>

            {/* Individual Course Progress */}
            <h6 className="fw-bold mb-3">
                Course-wise Progress
            </h6>

            {studentProgress.courses.length > 0 ? (
                <div className="d-flex flex-column gap-3">

                    {studentProgress.courses.map((course) => (
                        <div
                            key={course.enrollment_id}
                            className="border rounded-3 p-3"
                        >
                            <div className="d-flex justify-content-between align-items-start mb-2">

                                <div>
                                    <h6 className="fw-semibold mb-1">
                                        {course.course?.title || "Course unavailable"}
                                    </h6>

                                    <small className="text-muted">
                                        {course.course?.category || "N/A"}
                                    </small>
                                </div>

                                <span
                                    className={`badge ${
                                        course.status === "completed"
                                            ? "bg-success"
                                            : course.status === "in_progress"
                                                ? "bg-primary"
                                                : "bg-secondary"
                                    }`}
                                >
                                    {course.status.replace("_", " ")}
                                </span>

                            </div>

                            <div className="d-flex justify-content-between mb-2">
                                <small className="text-muted">
                                    Course Progress
                                </small>

                                <small className="fw-bold">
                                    {course.progress_percentage}%
                                </small>
                            </div>

                            <div
                                className="progress"
                                style={{ height: "8px" }}
                            >
                                <div
                                    className={`progress-bar ${
                                        course.status === "completed"
                                            ? "bg-success"
                                            : "bg-primary"
                                    }`}
                                    style={{
                                        width: `${course.progress_percentage}%`
                                    }}
                                ></div>
                            </div>

                        </div>
                    ))}

                </div>
            ) : (
                <p className="text-muted text-center py-3">
                    No enrolled courses available.
                </p>
            )}
        </>
    ) : (
        <p className="text-muted text-center py-3">
            Learning progress is currently unavailable.
        </p>
    )}
</div>

          </>


                )}

              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={closeStudentModal}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminStudents;
