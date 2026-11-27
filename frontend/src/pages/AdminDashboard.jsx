
import { useEffect, useState } from "react";

import {
    Users,
    BookOpen,
    GraduationCap,
    MessageSquare,
    Clock,
    RefreshCw,
    CheckCircle,
    LoaderCircle,
    CalendarDays,
    Mail
} from "lucide-react";

import api from "../services/api";

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch admin dashboard data
    const fetchDashboardStats = async () => {
        try {
            setLoading(true);

            const response = await api.get("/admin/dashboard");

            setStats(response.data.data);
            setError("");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load dashboard statistics"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    // Format date
    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    // Loading
    if (loading) {
        return (
            <div className="container py-5 text-center">
                <LoaderCircle size={32} className="mb-3" />
                <h5>Loading Admin Dashboard...</h5>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    {error}
                </div>

                <button
                    className="btn btn-primary"
                    onClick={fetchDashboardStats}
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Statistics Cards
    const statCards = [
        {
            title: "Total Students",
            value: stats.total_students,
            icon: Users,
            color: "text-primary",
            bg: "bg-primary-subtle"
        },
        {
            title: "Total Courses",
            value: stats.total_courses,
            icon: BookOpen,
            color: "text-success",
            bg: "bg-success-subtle"
        },
        {
            title: "Total Enrollments",
            value: stats.total_enrollments,
            icon: GraduationCap,
            color: "text-info",
            bg: "bg-info-subtle"
        },
        {
            title: "Contact Messages",
            value: stats.total_contact_messages,
            icon: MessageSquare,
            color: "text-warning",
            bg: "bg-warning-subtle"
        },
        {
            title: "Pending Messages",
            value: stats.pending_messages,
            icon: Clock,
            color: "text-warning",
            bg: "bg-warning-subtle"
        },
        {
            title: "In Progress",
            value: stats.in_progress_messages,
            icon: RefreshCw,
            color: "text-primary",
            bg: "bg-primary-subtle"
        },
        {
            title: "Resolved Messages",
            value: stats.resolved_messages,
            icon: CheckCircle,
            color: "text-success",
            bg: "bg-success-subtle"
        }
    ];

    return (
        <div className="container py-5">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

                <div>
                    <h2 className="fw-bold mb-1">
                        Admin Dashboard
                    </h2>

                    <p className="text-muted mb-0">
                        Welcome to SkillSphere administration panel.
                    </p>
                </div>

                <button
                    className="btn btn-outline-primary"
                    onClick={fetchDashboardStats}
                >
                    <RefreshCw size={16} className="me-2" />
                    Refresh
                </button>

            </div>

            {/* Statistics Cards */}
            <div className="row g-4 mb-5">

                {statCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            className="col-12 col-sm-6 col-lg-4"
                            key={card.title}
                        >
                            <div className="card border-0 shadow-sm h-100">

                                <div className="card-body p-4">

                                    <div className="d-flex justify-content-between align-items-center">

                                        <div>
                                            <p className="text-muted mb-2">
                                                {card.title}
                                            </p>

                                            <h3 className="fw-bold mb-0">
                                                {card.value}
                                            </h3>
                                        </div>

                                        <div
                                            className={`${card.bg} rounded-3 p-3`}
                                        >
                                            <Icon
                                                size={28}
                                                className={card.color}
                                            />
                                        </div>

                                    </div>

                                </div>

                            </div>
                        </div>
                    );
                })}

            </div>



            {/* Monthly Enrollment Chart */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">

                    <div className="mb-4">
                        <h5 className="fw-bold mb-1">
                            Monthly Enrollment Growth
                        </h5>

                        <p className="text-muted small mb-0">
                            Student enrollments over the last 6 months
                        </p>
                    </div>

                    {(() => {
                        const monthlyData = stats.monthly_enrollments || [];

                        const maxValue = Math.max(
                            ...monthlyData.map((item) => Number(item.total)),
                            1
                        );

                        return (
                            <div
                                className="d-flex align-items-end justify-content-around gap-3"
                                style={{ height: "260px" }}
                            >
                                {monthlyData.map((item, index) => {
                                    const percentage =
                                        (Number(item.total) / maxValue) * 100;

                                    return (
                                        <div
                                            key={`${item.year}-${item.month}`}
                                            className="d-flex flex-column align-items-center justify-content-end flex-fill h-100"
                                        >
                                            <span className="fw-bold mb-2">
                                                {item.total}
                                            </span>

                                            <div
                                                className="w-100 d-flex align-items-end justify-content-center"
                                                style={{ height: "190px" }}
                                            >
                                                <div
                                                    className="bg-primary rounded-top"
                                                    style={{
                                                        width: "55%",
                                                        height: item.total > 0
                                                            ? `${Math.max(percentage, 4)}%`
                                                            : "0%",
                                                        minHeight: item.total > 0
                                                            ? "8px"
                                                            : "0",
                                                        transition: "height 0.4s ease"
                                                    }}
                                                    title={`${item.month} ${item.year}: ${item.total} enrollments`}
                                                />
                                            </div>

                                            <span className="text-muted small mt-2">
                                                {item.month}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })()}

                </div>
            </div>




{/* Contact Messages Status Chart */}
<div className="card border-0 shadow-sm mb-4">
    <div className="card-body p-4">

        <div className="mb-4">
            <h5 className="fw-bold mb-1">
                Contact Messages Overview
            </h5>

            <p className="text-muted small mb-0">
                Support message status distribution
            </p>
        </div>

        {(() => {
            const total = stats.total_contact_messages || 0;

            const statuses = [
                {
                    label: "Pending",
                    value: stats.pending_messages,
                    color: "bg-warning"
                },
                {
                    label: "In Progress",
                    value: stats.in_progress_messages,
                    color: "bg-primary"
                },
                {
                    label: "Resolved",
                    value: stats.resolved_messages,
                    color: "bg-success"
                }
            ];

            return (
                <>
                    <h3 className="fw-bold mb-4">
                        {total}
                        <span className="text-muted fs-6 fw-normal ms-2">
                            Total Messages
                        </span>
                    </h3>

                    {statuses.map((item) => {
                        const percentage = total > 0
                            ? (item.value / total) * 100
                            : 0;

                        return (
                            <div key={item.label} className="mb-4">

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="fw-semibold">
                                        {item.label}
                                    </span>

                                    <span className="text-muted">
                                        {item.value} ({percentage.toFixed(1)}%)
                                    </span>
                                </div>

                                <div
                                    className="progress"
                                    style={{ height: "12px" }}
                                >
                                    <div
                                        className={`progress-bar ${item.color}`}
                                        role="progressbar"
                                        style={{ width: `${percentage}%` }}
                                        aria-valuenow={percentage}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    />
                                </div>

                            </div>
                        );
                    })}
                </>
            );
        })()}

    </div>
</div>




            {/* Recent Students */}
            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body p-4">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <div>
                            <h5 className="fw-bold mb-1">
                                <Users
                                    size={20}
                                    className="text-primary me-2"
                                />
                                Recent Students
                            </h5>

                            <p className="text-muted small mb-0">
                                Latest registered students
                            </p>
                        </div>

                        <span className="badge bg-primary-subtle text-primary">
                            {stats.recent_students?.length || 0} Students
                        </span>

                    </div>

                    {stats.recent_students?.length > 0 ? (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Student Name</th>
                                        <th>Email Address</th>
                                        <th>Registration Date</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {stats.recent_students.map((student) => (

                                        <tr key={student.id}>

                                            <td>
                                                #{student.id}
                                            </td>

                                            <td>
                                                <div className="d-flex align-items-center gap-2">

                                                    <div
                                                        className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold"
                                                        style={{
                                                            width: "36px",
                                                            height: "36px"
                                                        }}
                                                    >
                                                        {student.name?.charAt(0).toUpperCase()}
                                                    </div>

                                                    <span className="fw-semibold">
                                                        {student.name}
                                                    </span>

                                                </div>
                                            </td>

                                            <td>
                                                <Mail
                                                    size={15}
                                                    className="text-muted me-2"
                                                />
                                                {student.email}
                                            </td>

                                            <td>
                                                <CalendarDays
                                                    size={15}
                                                    className="text-muted me-2"
                                                />
                                                {formatDate(student.created_at)}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    ) : (

                        <p className="text-muted text-center py-4 mb-0">
                            No students found.
                        </p>

                    )}

                </div>

            </div>

            {/* Recent Enrollments */}
            <div className="card border-0 shadow-sm">

                <div className="card-body p-4">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <div>
                            <h5 className="fw-bold mb-1">
                                <GraduationCap
                                    size={22}
                                    className="text-success me-2"
                                />
                                Recent Enrollments
                            </h5>

                            <p className="text-muted small mb-0">
                                Latest student course enrollments
                            </p>
                        </div>

                        <span className="badge bg-success-subtle text-success">
                            {stats.recent_enrollments?.length || 0} Enrollments
                        </span>

                    </div>

                    {stats.recent_enrollments?.length > 0 ? (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Student</th>
                                        <th>Course</th>
                                        <th>Enrollment Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {stats.recent_enrollments.map((enrollment) => (

                                        <tr key={enrollment.id}>

                                            <td>
                                                #{enrollment.id}
                                            </td>

                                            <td>
                                                <div className="fw-semibold">
                                                    {enrollment.user?.name || "Unknown"}
                                                </div>

                                                <small className="text-muted">
                                                    {enrollment.user?.email}
                                                </small>
                                            </td>

                                            <td>
                                                <span className="fw-medium">
                                                    {enrollment.course?.title || "Course unavailable"}
                                                </span>
                                            </td>

                                            <td>
                                                <CalendarDays
                                                    size={15}
                                                    className="text-muted me-2"
                                                />
                                                {formatDate(
                                                    enrollment.enrolled_at ||
                                                    enrollment.created_at
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${
                                                        enrollment.status === "active"
                                                            ? "bg-success-subtle text-success"
                                                            : "bg-secondary-subtle text-secondary"
                                                    }`}
                                                >
                                                    {enrollment.status}
                                                </span>
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    ) : (

                        <p className="text-muted text-center py-4 mb-0">
                            No enrollments found.
                        </p>

                    )}

                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;
