import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {Link} from 'react-router-dom';
import CourseCard from '../components/CourseCard';

const Courses = () => {
  const { courses,currentUser } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Sync URL search param if present
  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  // Unique filter lists derived dynamically from active courses
  const departments = ['All', ...Array.from(new Set(courses.map((c) => c.department)))];
  const semesters = ['All', ...Array.from(new Set(courses.map((c) => c.semester)))];
  const courseTypes = ['All', ...Array.from(new Set(courses.map((c) => c.courseType)))];

  // Filter logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'All' || course.department === selectedDept;
    const matchesSemester = selectedSemester === 'All' || course.semester === selectedSemester;
    const matchesType = selectedType === 'All' || course.courseType === selectedType;

    return matchesSearch && matchesDept && matchesSemester && matchesType;
  });

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedDept('All');
    setSelectedSemester('All');
    setSelectedType('All');
    setSearchParams({});
  };

  const isFiltered =
    searchTerm !== '' ||
    selectedDept !== 'All' ||
    selectedSemester !== 'All' ||
    selectedType !== 'All';

  return (
    <div>
      <div className="cluster-notice">{currentUser.clusterId?<><strong>{currentUser.clusterName}</strong><span>Showing section choices in your selected cluster.</span></>:<><strong>Choose your academic cluster first</strong><Link to="/clusters" className="btn btn-primary btn-sm">Select cluster</Link></>}</div>
      <div className="catalog-header-bar">
        <h1>Course Catalog & Elective Directory</h1>
        <p>Explore accredited modules, verify real-time class capacity, review syllabi, and secure enrollments.</p>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar-card">
        <div className="filter-row-top">
          <div className="search-input-catalog input-with-icon">
            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search by code (CS-301), title, or keywords..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-dropdown-group">
            <select
              className="filter-select"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              aria-label="Department Filter"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              aria-label="Semester Filter"
            >
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  {sem === 'All' ? 'All Semesters' : sem}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Course Type Filter"
            >
              {courseTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'All' ? 'All Course Types' : `${type} Courses`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-row-bottom">
          <div>
            Showing <strong>{filteredCourses.length}</strong> of <strong>{courses.length}</strong> academic courses
          </div>

          {isFiltered && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={clearAllFilters}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Clear Active Filters
            </button>
          )}
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h3 className="empty-state-title">No Courses Match Your Filter Criteria</h3>
          <p className="empty-state-desc">
            Try adjusting your search keywords, department selections, or course types.
          </p>
          <button type="button" className="btn btn-primary btn-sm" onClick={clearAllFilters}>
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="courses-grid-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
