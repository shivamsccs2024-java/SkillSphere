
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedLayout from "./components/ProtectedLayout";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Dashboard from "./pages/Dashboard";
import Roadmap from "./pages/Roadmap";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminContactMessages from "./pages/AdminContactMessages";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminCourses from "./pages/admin/AdminCourses";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin/contact-messages" element={<AdminContactMessages />}/>
            <Route path="/admin/dashboard" element={<AdminDashboard />}/>
            <Route path="/admin/students" element={<AdminStudents />}/>
            <Route path="/admin/courses" element={<AdminCourses />}/>
          </Route>

          {/* Not Found */}
          <Route path="*" element={<Home />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
