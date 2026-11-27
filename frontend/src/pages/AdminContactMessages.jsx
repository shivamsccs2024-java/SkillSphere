
import { useEffect, useState } from "react";

import {
    Trash2,
    RefreshCw,
    MessageSquare,
    Clock,
    CheckCircle,
    Search,
    LoaderCircle,
    Eye,
    X
} from "lucide-react";

import api from "../services/api";

function AdminContactMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [updatingId, setUpdatingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Search and Filter
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const messagesPerPage = 5;

    // Message Details Modal
    const [selectedMessage, setSelectedMessage] = useState(null);

    // Fetch Contact Messages
    const fetchMessages = async () => {
        try {
            setLoading(true);

            const response = await api.get("/admin/contact-messages");

            setMessages(response.data.data || []);
            setError("");
            setCurrentPage(1);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load contact messages"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    // Statistics
    const totalMessages = messages.length;

    const pendingCount = messages.filter(
        (message) => message.status === "pending"
    ).length;

    const inProgressCount = messages.filter(
        (message) => message.status === "in_progress"
    ).length;

    const resolvedCount = messages.filter(
        (message) => message.status === "resolved"
    ).length;

    // Search and Filter
    const filteredMessages = messages.filter((message) => {
        const search = searchTerm.toLowerCase().trim();

        const matchesSearch =
            message.name?.toLowerCase().includes(search) ||
            message.email?.toLowerCase().includes(search) ||
            message.subject?.toLowerCase().includes(search) ||
            message.message?.toLowerCase().includes(search);

        const matchesStatus =
            statusFilter === "all" ||
            message.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(
        filteredMessages.length / messagesPerPage
    );

    const indexOfLastMessage = currentPage * messagesPerPage;

    const indexOfFirstMessage =
        indexOfLastMessage - messagesPerPage;

    const currentMessages = filteredMessages.slice(
        indexOfFirstMessage,
        indexOfLastMessage
    );

    // Update Status
    const handleStatusChange = async (id, newStatus) => {
        try {
            setUpdatingId(id);

            await api.put(
                `/admin/contact-messages/${id}/status`,
                {
                    status: newStatus,
                }
            );

            setMessages((previousMessages) =>
                previousMessages.map((message) =>
                    message.id === id
                        ? { ...message, status: newStatus }
                        : message
                )
            );

            // Update selected modal message also
            setSelectedMessage((previous) =>
                previous?.id === id
                    ? { ...previous, status: newStatus }
                    : previous
            );

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to update message status"
            );
        } finally {
            setUpdatingId(null);
        }
    };

    // Delete Message
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this message?"
        );

        if (!confirmDelete) return;

        try {
            setDeletingId(id);

            await api.delete(
                `/admin/contact-messages/${id}`
            );

            const updatedMessages = messages.filter(
                (message) => message.id !== id
            );

            setMessages(updatedMessages);

            // Close modal if deleted message is currently open
            if (selectedMessage?.id === id) {
                setSelectedMessage(null);
            }

            // Adjust page after deletion
            const search = searchTerm.toLowerCase().trim();

            const remainingFilteredMessages = updatedMessages.filter(
                (message) => {
                    const matchesSearch =
                        message.name?.toLowerCase().includes(search) ||
                        message.email?.toLowerCase().includes(search) ||
                        message.subject?.toLowerCase().includes(search) ||
                        message.message?.toLowerCase().includes(search);

                    const matchesStatus =
                        statusFilter === "all" ||
                        message.status === statusFilter;

                    return matchesSearch && matchesStatus;
                }
            );

            const remainingPages = Math.ceil(
                remainingFilteredMessages.length / messagesPerPage
            );

            if (currentPage > remainingPages && remainingPages > 0) {
                setCurrentPage(remainingPages);
            } else if (remainingPages === 0) {
                setCurrentPage(1);
            }

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to delete contact message"
            );
        } finally {
            setDeletingId(null);
        }
    };

    // Status Colors
    const getStatusClass = (status) => {
        switch (status) {
            case "pending":
                return "bg-warning text-dark";

            case "in_progress":
                return "bg-primary text-white";

            case "resolved":
                return "bg-success text-white";

            default:
                return "bg-secondary text-white";
        }
    };

    // Status Display Name
    const getStatusName = (status) => {
        switch (status) {
            case "pending":
                return "Pending";

            case "in_progress":
                return "In Progress";

            case "resolved":
                return "Resolved";

            default:
                return status;
        }
    };

    // Loading Screen
    if (loading) {
        return (
            <div className="container py-5 text-center">
                <LoaderCircle size={30} className="mb-3" />
                <h5>Loading messages...</h5>
            </div>
        );
    }

    // Error Screen
    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    {error}
                </div>

                <button
                    className="btn btn-primary"
                    onClick={fetchMessages}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="container py-5">

            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

                <div>
                    <h2 className="fw-bold mb-1">
                        Contact Messages
                    </h2>

                    <p className="text-muted mb-0">
                        Manage student support messages
                    </p>
                </div>

                <button
                    className="btn btn-outline-primary"
                    onClick={fetchMessages}
                >
                    <RefreshCw size={16} className="me-2" />
                    Refresh
                </button>

            </div>

            {/* Statistics Cards */}
            <div className="row g-3 mb-4">

                {/* Total */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">

                                <div>
                                    <p className="text-muted mb-1">
                                        Total Messages
                                    </p>

                                    <h3 className="fw-bold mb-0">
                                        {totalMessages}
                                    </h3>
                                </div>

                                <MessageSquare
                                    size={30}
                                    className="text-primary"
                                />

                            </div>
                        </div>
                    </div>
                </div>

                {/* Pending */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">

                                <div>
                                    <p className="text-muted mb-1">
                                        Pending
                                    </p>

                                    <h3 className="fw-bold text-warning mb-0">
                                        {pendingCount}
                                    </h3>
                                </div>

                                <Clock
                                    size={30}
                                    className="text-warning"
                                />

                            </div>
                        </div>
                    </div>
                </div>

                {/* In Progress */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">

                                <div>
                                    <p className="text-muted mb-1">
                                        In Progress
                                    </p>

                                    <h3 className="fw-bold text-primary mb-0">
                                        {inProgressCount}
                                    </h3>
                                </div>

                                <RefreshCw
                                    size={30}
                                    className="text-primary"
                                />

                            </div>
                        </div>
                    </div>
                </div>

                {/* Resolved */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">

                                <div>
                                    <p className="text-muted mb-1">
                                        Resolved
                                    </p>

                                    <h3 className="fw-bold text-success mb-0">
                                        {resolvedCount}
                                    </h3>
                                </div>

                                <CheckCircle
                                    size={30}
                                    className="text-success"
                                />

                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Search and Filter */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">

                    <div className="row g-3">

                        {/* Search */}
                        <div className="col-md-8">
                            <div className="input-group">

                                <span className="input-group-text bg-white">
                                    <Search size={18} />
                                </span>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search name, email, subject..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />

                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>

                    </div>
                </div>
            </div>

            {/* Messages Table */}
            <div className="card border-0 shadow-sm">
                <div className="card-body">

                    {/* Table Header */}
                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">

                        <h5 className="fw-bold mb-0">
                            All Messages
                        </h5>

                        <span className="text-muted small">
                            Showing{" "}
                            {filteredMessages.length === 0
                                ? 0
                                : indexOfFirstMessage + 1}
                            {" - "}
                            {Math.min(
                                indexOfLastMessage,
                                filteredMessages.length
                            )}
                            {" of "}
                            {filteredMessages.length} messages
                        </span>

                    </div>

                    {filteredMessages.length === 0 ? (

                        <div className="text-center py-5">

                            <MessageSquare
                                size={40}
                                className="text-muted mb-3"
                            />

                            <h6>No messages found</h6>

                            <p className="text-muted mb-0">
                                Try changing your search or filter.
                            </p>

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle">

                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Subject</th>
                                        <th>Message</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {currentMessages.map((message) => (

                                        <tr key={message.id}>

                                            <td>{message.id}</td>

                                            <td>{message.name}</td>

                                            <td>{message.email}</td>

                                            <td>{message.subject}</td>

                                            <td style={{ minWidth: "200px" }}>
                                                {message.message}
                                            </td>

                                            {/* Status */}
                                            <td style={{ minWidth: "160px" }}>

                                                <select
                                                    className={`form-select form-select-sm ${getStatusClass(message.status)}`}
                                                    value={message.status}
                                                    disabled={updatingId === message.id}
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            message.id,
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="pending">
                                                        Pending
                                                    </option>

                                                    <option value="in_progress">
                                                        In Progress
                                                    </option>

                                                    <option value="resolved">
                                                        Resolved
                                                    </option>

                                                </select>

                                                {updatingId === message.id && (
                                                    <small className="text-muted">
                                                        Updating...
                                                    </small>
                                                )}

                                            </td>

                                            {/* Actions */}
                                            <td>
                                                <div className="d-flex gap-2">

                                                    {/* View */}
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        title="View message"
                                                        onClick={() =>
                                                            setSelectedMessage(message)
                                                        }
                                                    >
                                                        <Eye size={15} />
                                                        {" "}View
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        disabled={deletingId === message.id}
                                                        onClick={() =>
                                                            handleDelete(message.id)
                                                        }
                                                    >
                                                        <Trash2 size={15} />
                                                        {" "}

                                                        {deletingId === message.id
                                                            ? "Deleting..."
                                                            : "Delete"}
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (

                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4">

                            <small className="text-muted">
                                Showing {indexOfFirstMessage + 1} to{" "}
                                {Math.min(
                                    indexOfLastMessage,
                                    filteredMessages.length
                                )}{" "}
                                of {filteredMessages.length} messages
                            </small>

                            <div className="d-flex align-items-center gap-2 flex-wrap">

                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    disabled={currentPage === 1}
                                    onClick={() =>
                                        setCurrentPage((page) => page - 1)
                                    }
                                >
                                    Previous
                                </button>

                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1
                                ).map((page) => (
                                    <button
                                        key={page}
                                        className={`btn btn-sm ${
                                            currentPage === page
                                                ? "btn-primary"
                                                : "btn-outline-primary"
                                        }`}
                                        onClick={() =>
                                            setCurrentPage(page)
                                        }
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    disabled={currentPage === totalPages}
                                    onClick={() =>
                                        setCurrentPage((page) => page + 1)
                                    }
                                >
                                    Next
                                </button>

                            </div>

                        </div>

                    )}

                </div>
            </div>

            {/* Message Details Modal */}
            {selectedMessage && (

                <div
                    className="modal d-block"
                    tabIndex="-1"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setSelectedMessage(null)}
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1055
                    }}
                >

                    <div
                        className="modal-dialog modal-dialog-centered modal-lg"
                        role="document"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="modal-content border-0 shadow">

                            {/* Modal Header */}
                            <div className="modal-header">

                                <h5 className="modal-title fw-bold">
                                    <MessageSquare
                                        size={20}
                                        className="me-2 text-primary"
                                    />
                                    Contact Message Details
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={() => setSelectedMessage(null)}
                                />

                            </div>

                            {/* Modal Body */}
                            <div className="modal-body p-4">

                                <div className="row g-3">

                                    <div className="col-md-6">
                                        <label className="text-muted small">
                                            Message ID
                                        </label>

                                        <p className="fw-semibold">
                                            #{selectedMessage.id}
                                        </p>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="text-muted small">
                                            Student Name
                                        </label>

                                        <p className="fw-semibold">
                                            {selectedMessage.name}
                                        </p>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="text-muted small">
                                            Email Address
                                        </label>

                                        <p className="fw-semibold">
                                            {selectedMessage.email}
                                        </p>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="text-muted small">
                                            Subject
                                        </label>

                                        <p className="fw-semibold">
                                            {selectedMessage.subject}
                                        </p>
                                    </div>

                                    <div className="col-12">
                                        <label className="text-muted small">
                                            Full Message
                                        </label>

                                        <div className="bg-light rounded p-3">
                                            <p
                                                className="mb-0"
                                                style={{
                                                    whiteSpace: "pre-wrap",
                                                    overflowWrap: "anywhere"
                                                }}
                                            >
                                                {selectedMessage.message}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="text-muted small">
                                            Status
                                        </label>

                                        <div>
                                            <span
                                                className={`badge ${getStatusClass(selectedMessage.status)}`}
                                            >
                                                {getStatusName(selectedMessage.status)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="text-muted small">
                                            Submitted Date
                                        </label>

                                        <p className="fw-semibold">
                                            {selectedMessage.created_at
                                                ? new Date(
                                                    selectedMessage.created_at
                                                ).toLocaleString("en-IN")
                                                : "Not available"}
                                        </p>
                                    </div>

                                </div>

                            </div>

                            {/* Modal Footer */}
                            <div className="modal-footer">

                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedMessage(null)}
                                >
                                    <X size={16} className="me-1" />
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

export default AdminContactMessages;
