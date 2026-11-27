
import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import api from "../services/api";
import CourseCard from "../components/CourseCard";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");

  // Fetch courses from Laravel API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/courses");

        // Supports both { data: [...] } and direct array responses
        const courseData = Array.isArray(response.data)
          ? response.data
          : response.data?.data;

        if (!Array.isArray(courseData)) {
          throw new Error("Invalid courses response from API.");
        }

        setCourses(courseData);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError(
          err.response?.data?.message ||
          err.message ||
          "Unable to load courses. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Get unique categories from API courses
  const categories = [
    "All",
    ...new Set(courses.map((course) => course.category).filter(Boolean)),
  ];

  // Search, category filter and sorting
  const filteredCourses = courses
    .filter((course) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        course.title?.toLowerCase().includes(search) ||
        course.instructor?.toLowerCase().includes(search) ||
        course.category?.toLowerCase().includes(search);

      const matchesCategory =
        selectedCategory === "All" ||
        course.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "lowToHigh") {
        return Number(a.price) - Number(b.price);
      }

      if (sortBy === "highToLow") {
        return Number(b.price) - Number(a.price);
      }

      if (sortBy === "rating") {
        return Number(b.rating) - Number(a.rating);
      }

      return Number(b.students_count || 0) - Number(a.students_count || 0);
    });

  return (
    <main className="courses-page">
      <section className="courses-header">
        <div className="container">
          <h1>Explore Our Courses</h1>
          <p>
            Discover courses to improve your skills and achieve your career goals.
          </p>
        </div>
      </section>

      <section className="courses-section">
        <div className="container">

          {/* Search and Filters */}
          <div className="courses-toolbar">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-box">
              <SlidersHorizontal size={18} />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Top Rated</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="courses-message">
              <p>Loading courses...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="courses-message error-message">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          )}

          {/* Courses */}
          {!loading && !error && (
            <>
              <div className="courses-result">
                <p>
                  Showing <strong>{filteredCourses.length}</strong> courses
                </p>
              </div>

              {filteredCourses.length > 0 ? (
                <div className="courses-grid">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="courses-message">
                  <h3>No courses found</h3>
                  <p>Try changing your search or category filter.</p>
                </div>
              )}
            </>
          )}

        </div>
      </section>
    </main>
  );
}

export default Courses;
