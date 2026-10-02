import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Helper to format course row and its related tables
// Helper to format course row and its related tables
const buildCourseObject = (courseRow, syllabusRows = [], outcomeRows = [], assessmentRows = [], sectionRows = []) => {
  const courseSections = sectionRows
    .filter((s) => s.course_id === courseRow.id)
    .map((s) => ({
      id: s.id,
      courseId: s.course_id,
      sectionNumber: s.section_number,
      sectionName: s.cluster_code ? `${s.cluster_code} · ${s.group_name}` : s.section_name,
      clusterId:s.cluster_id,clusterName:s.cluster_name,groupId:s.group_id,groupName:s.group_name,
      facultyId: s.faculty_id,
      facultyName: s.faculty_name,
      facultyEmail: s.faculty_email,
      classroom: s.classroom,
      schedule: s.schedule,
      totalSeats: s.total_seats || 30,
      filledSeats: Number(s.filled_seats || 0),
      availableSeats: Number(s.available_seats !== undefined ? s.available_seats : (s.total_seats - (s.filled_seats || 0))),
      occupancyPercentage: Math.round(((Number(s.filled_seats || 0)) / (s.total_seats || 30)) * 100),
      isFull: (s.available_seats !== undefined ? Number(s.available_seats) : (s.total_seats - (s.filled_seats || 0))) <= 0
    }));

  return {
    id: courseRow.id,
    courseCode: courseRow.course_code,
    courseName: courseRow.course_name,
    department: courseRow.department,
    credits: courseRow.credits,
    semester: courseRow.semester,
    courseType: courseRow.course_type,
    availableSeats: courseRow.available_seats,
    totalSeats: courseRow.total_seats,
    classroom: courseRow.classroom,
    schedule: courseRow.schedule,
    description: courseRow.description,
    prerequisites: courseRow.prerequisites,
    sections: courseSections,
    syllabus: syllabusRows
      .filter((s) => s.course_id === courseRow.id)
      .map((s) => ({ week: s.week_range, topic: s.topic })),
    learningOutcomes: outcomeRows
      .filter((o) => o.course_id === courseRow.id)
      .map((o) => o.outcome_text),
    assessmentDetails: assessmentRows
      .filter((a) => a.course_id === courseRow.id)
      .map((a) => ({ component: a.component, weight: a.weight }))
  };
};

// GET /api/courses
router.get('/', async (req, res) => {
  try {
    const [courses] = await pool.execute(`
      SELECT c.*, 
             (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id AND e.status = 'Enrolled') AS actual_enrolled,
             (SELECT SUM(total_seats) FROM course_sections WHERE course_id=c.id) - (SELECT COUNT(*) FROM enrollments e WHERE e.course_id=c.id AND e.status='Enrolled') AS live_available_seats, (SELECT SUM(total_seats) FROM course_sections WHERE course_id=c.id) AS live_total_seats,
             s.filled_seats, s.occupancy_percentage 
      FROM courses c
      LEFT JOIN v_course_enrollment_stats s ON c.id = s.course_id
      ORDER BY c.course_code ASC
    `);
    const [syllabus] = await pool.execute(`SELECT * FROM course_syllabus ORDER BY id ASC`);
    const [outcomes] = await pool.execute(`SELECT * FROM course_outcomes ORDER BY id ASC`);
    const [assessments] = await pool.execute(`SELECT * FROM course_assessments ORDER BY id ASC`);
    const [sections] = await pool.execute(`
      SELECT cs.*,g.cluster_id,g.name group_name,g.id group_id,cl.code cluster_code,cl.name cluster_name, 
             (SELECT COUNT(*) FROM enrollments e WHERE e.section_id = cs.id AND e.status = 'Enrolled') AS filled_seats,
             GREATEST(0, cs.total_seats - (SELECT COUNT(*) FROM enrollments e WHERE e.section_id = cs.id AND e.status = 'Enrolled')) AS available_seats
      FROM course_sections cs LEFT JOIN section_clusters m ON m.section_id=cs.id LEFT JOIN cluster_groups g ON g.id=m.group_id LEFT JOIN academic_clusters cl ON cl.id=g.cluster_id
      ORDER BY cs.section_number ASC
    `);

    const formattedCourses = courses.map((c) => {
      const liveSeats = c.live_available_seats !== undefined ? Number(c.live_available_seats) : c.available_seats;
      const obj = buildCourseObject({ ...c, total_seats: Number(c.live_total_seats), available_seats: liveSeats }, syllabus, outcomes, assessments, sections);
      obj.filledSeats = c.actual_enrolled !== undefined ? Number(c.actual_enrolled) : (c.total_seats - liveSeats);
      obj.occupancyPercentage = Math.round((obj.filledSeats / obj.totalSeats) * 100);
      return obj;
    });

    res.json({ success: true, count: formattedCourses.length, courses: formattedCourses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch courses.', error: error.message });
  }
});

// GET /api/courses/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [courses] = await pool.execute(`
      SELECT c.*, 
             (SELECT SUM(total_seats) FROM course_sections WHERE course_id=c.id) - (SELECT COUNT(*) FROM enrollments e WHERE e.course_id=c.id AND e.status='Enrolled') AS live_available_seats, (SELECT SUM(total_seats) FROM course_sections WHERE course_id=c.id) AS live_total_seats
      FROM courses c 
      WHERE c.id = ? OR c.course_code = ?
    `, [id, id]);

    if (courses.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const course = courses[0];
    const liveSeats = course.live_available_seats !== undefined ? Number(course.live_available_seats) : course.available_seats;
    const [syllabus] = await pool.execute(`SELECT * FROM course_syllabus WHERE course_id = ? ORDER BY id ASC`, [course.id]);
    const [outcomes] = await pool.execute(`SELECT * FROM course_outcomes WHERE course_id = ? ORDER BY id ASC`, [course.id]);
    const [assessments] = await pool.execute(`SELECT * FROM course_assessments WHERE course_id = ? ORDER BY id ASC`, [course.id]);
    const [sections] = await pool.execute(`
      SELECT cs.*,g.cluster_id,g.name group_name,g.id group_id,cl.code cluster_code,cl.name cluster_name, 
             (SELECT COUNT(*) FROM enrollments e WHERE e.section_id = cs.id AND e.status = 'Enrolled') AS filled_seats,
             GREATEST(0, cs.total_seats - (SELECT COUNT(*) FROM enrollments e WHERE e.section_id = cs.id AND e.status = 'Enrolled')) AS available_seats
      FROM course_sections cs LEFT JOIN section_clusters m ON m.section_id=cs.id LEFT JOIN cluster_groups g ON g.id=m.group_id LEFT JOIN academic_clusters cl ON cl.id=g.cluster_id
      WHERE cs.course_id = ?
      ORDER BY cs.section_number ASC
    `, [course.id]);

    res.json({
      success: true,
      course: buildCourseObject({ ...course, total_seats: Number(course.live_total_seats), available_seats: liveSeats }, syllabus, outcomes, assessments, sections)
    });
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch course details.', error: error.message });
  }
});

export default router;
