
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import courses from "../data/courses";
import CourseCard from "../components/CourseCard";

function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");

  const categories = [
    "All",
    ...new Set(courses.map((course) => course.category))
  ];

  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        course.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "lowToHigh") {
        return a.price - b.price;
      }

      if (sortBy === "highToLow") {
        return b.price - a.price;
      }

      return 0;
    });

  return (
    <main className="courses-page">

      <section className="courses-hero">
        <div className="container text-center">
          <span>EXPLORE OUR COURSES</span>

          <h1>
            Discover Your Next
            <span> Learning Journey</span>
          </h1>

          <p>
            Explore industry-focused courses and build
            the skills needed for your dream career.
          </p>
        </div>
      </section>

      <section className="courses-list-section">
        <div className="container">

          <div className="courses-toolbar">

            <div className="courses-search">
              <Search size={20} />

              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="courses-filters">

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
                <option value="popular">Popular</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>

            </div>
          </div>

          <div className="courses-results">
            <h3>All Courses</h3>
            <span>{filteredCourses.length} Courses Found</span>
          </div>

          <div className="row g-4">

            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div className="col-md-6 col-lg-3" key={course.id}>
                  <CourseCard course={course} />
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="no-courses">
                  <SlidersHorizontal size={35} />
                  <h4>No Courses Found</h4>
                  <p>Try changing your search or category filter.</p>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

    </main>
  );
}

export default Courses;
