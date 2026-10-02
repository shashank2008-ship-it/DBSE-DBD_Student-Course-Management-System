-- Student Portal Pro: MySQL 8.0.16+; each statement marker separates a driver query.
-- Setup uses DB_NAME from .env; Workbench: CREATE DATABASE student_portal_pro; USE student_portal_pro;
CREATE DATABASE student_portal_pro;
USE student_portal_pro;
CREATE TABLE IF NOT EXISTS students (
 id VARCHAR(50) PRIMARY KEY, roll_number VARCHAR(50) UNIQUE NOT NULL,
 full_name VARCHAR(150) NOT NULL,email VARCHAR(150) UNIQUE NOT NULL,password_hash VARCHAR(255) NOT NULL,
 phone VARCHAR(30) DEFAULT '',department VARCHAR(100) DEFAULT 'Computer Science & Engineering',
 program VARCHAR(150) DEFAULT 'B.Tech in Computer Science & Engineering',year_level VARCHAR(50) DEFAULT '2nd Year',
 semester VARCHAR(50) DEFAULT 'Trimester 2026',current_gpa DECIMAL(4,2) DEFAULT 0,semester_gpa DECIMAL(4,2) DEFAULT 0,
 total_credits INT DEFAULT 160,completed_credits INT DEFAULT 0,attendance_rate DECIMAL(5,2) DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 CHECK(current_gpa BETWEEN 0 AND 10),CHECK(total_credits>0)
) ENGINE=InnoDB;
-- @statement
CREATE TABLE IF NOT EXISTS admins (
 id VARCHAR(50) PRIMARY KEY,username VARCHAR(50) UNIQUE NOT NULL,full_name VARCHAR(150) NOT NULL,
 email VARCHAR(150) UNIQUE NOT NULL,password_hash VARCHAR(255) NOT NULL,role VARCHAR(30) DEFAULT 'admin',
 department VARCHAR(100) DEFAULT 'Academic Administration',phone VARCHAR(30) DEFAULT ''
) ENGINE=InnoDB;
-- @statement
CREATE TABLE IF NOT EXISTS courses (
 id VARCHAR(50) PRIMARY KEY,course_code VARCHAR(30) UNIQUE NOT NULL,course_name VARCHAR(200) NOT NULL,
 department VARCHAR(100) DEFAULT 'Computer Science & Engineering',credits INT NOT NULL,
 semester VARCHAR(50) DEFAULT 'Trimester 2026',course_type VARCHAR(30) DEFAULT 'Core',
 available_seats INT NOT NULL DEFAULT 30,total_seats INT NOT NULL DEFAULT 30,classroom VARCHAR(100) DEFAULT '',
 schedule VARCHAR(150) NOT NULL,description TEXT,prerequisites VARCHAR(255) DEFAULT 'None',
 INDEX idx_course_department(department),CHECK(credits BETWEEN 1 AND 6),CHECK(total_seats>0)
) ENGINE=InnoDB;
-- @statement
CREATE TABLE IF NOT EXISTS faculty (
 id VARCHAR(50) PRIMARY KEY,faculty_id VARCHAR(50) UNIQUE NOT NULL,full_name VARCHAR(150) NOT NULL,
 designation VARCHAR(100) DEFAULT 'Assistant Professor',department VARCHAR(100) DEFAULT 'Computer Science & Engineering',
 email VARCHAR(150) UNIQUE NOT NULL,phone VARCHAR(30) DEFAULT '',office VARCHAR(100) DEFAULT '',qualification VARCHAR(200) DEFAULT '',
 courses_taught VARCHAR(255) DEFAULT '',avatar_initials VARCHAR(10) DEFAULT ''
) ENGINE=InnoDB;
-- @statement
CREATE TABLE IF NOT EXISTS course_sections (
 id VARCHAR(50) PRIMARY KEY,course_id VARCHAR(50) NOT NULL,section_number INT NOT NULL,section_name VARCHAR(50) NOT NULL,
 faculty_id VARCHAR(50),faculty_name VARCHAR(150) NOT NULL,faculty_email VARCHAR(150) DEFAULT '',classroom VARCHAR(100) NOT NULL,
 schedule VARCHAR(150) NOT NULL,total_seats INT NOT NULL DEFAULT 30,
 UNIQUE KEY uq_course_section(course_id,section_number),FOREIGN KEY(course_id) REFERENCES courses(id),
 FOREIGN KEY(faculty_id) REFERENCES faculty(id),CHECK(total_seats>0)
) ENGINE=InnoDB;
-- @statement
CREATE TABLE IF NOT EXISTS course_syllabus (
 id INT AUTO_INCREMENT PRIMARY KEY,course_id VARCHAR(50) NOT NULL,week_range VARCHAR(50) NOT NULL,topic TEXT NOT NULL,
 FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB;
-- @statement
CREATE TABLE IF NOT EXISTS course_outcomes (
 id INT AUTO_INCREMENT PRIMARY KEY,course_id VARCHAR(50) NOT NULL,outcome_text TEXT NOT NULL,
 FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB;
-- @statement
CREATE TABLE IF NOT EXISTS course_assessments (
 id INT AUTO_INCREMENT PRIMARY KEY,course_id VARCHAR(50) NOT NULL,component VARCHAR(100) NOT NULL,weight VARCHAR(20) NOT NULL,
 FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB;
-- @statement
CREATE TABLE IF NOT EXISTS course_prerequisites (
 course_id VARCHAR(50) NOT NULL,prerequisite_id VARCHAR(50) NOT NULL,PRIMARY KEY(course_id,prerequisite_id),
 FOREIGN KEY(course_id) REFERENCES courses(id),FOREIGN KEY(prerequisite_id) REFERENCES courses(id),CHECK(course_id<>prerequisite_id)
) ENGINE=InnoDB;
-- @statement
CREATE TABLE IF NOT EXISTS enrollments (
 id INT AUTO_INCREMENT PRIMARY KEY,student_id VARCHAR(50) NOT NULL,course_id VARCHAR(50) NOT NULL,section_id VARCHAR(50) NOT NULL,
 enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,status ENUM('Enrolled','Dropped','Completed') DEFAULT 'Enrolled',
 UNIQUE KEY unique_student_course(student_id,course_id),INDEX idx_section_status(section_id,status),
 FOREIGN KEY(student_id) REFERENCES students(id),FOREIGN KEY(course_id) REFERENCES courses(id),FOREIGN KEY(section_id) REFERENCES course_sections(id)
) ENGINE=InnoDB;
-- @statement
CREATE TABLE IF NOT EXISTS grades (
 id INT AUTO_INCREMENT PRIMARY KEY,student_id VARCHAR(50) NOT NULL,course_id VARCHAR(50) NOT NULL,
 internal_marks DECIMAL(5,2) DEFAULT 0,max_internal DECIMAL(5,2) DEFAULT 30,
 midterm_marks DECIMAL(5,2) DEFAULT 0,max_midterm DECIMAL(5,2) DEFAULT 20,
 final_marks DECIMAL(5,2) DEFAULT 0,max_final DECIMAL(5,2) DEFAULT 50,
 total_marks DECIMAL(5,2) DEFAULT 0,grade VARCHAR(5) DEFAULT 'F',grade_points DECIMAL(4,2) DEFAULT 0,
 semester VARCHAR(50) DEFAULT 'Trimester 2026',status VARCHAR(30) DEFAULT 'Published',
 UNIQUE KEY uq_student_grade(student_id,course_id),FOREIGN KEY(student_id) REFERENCES students(id),FOREIGN KEY(course_id) REFERENCES courses(id),
 CHECK(internal_marks BETWEEN 0 AND 30),CHECK(midterm_marks BETWEEN 0 AND 20),CHECK(final_marks BETWEEN 0 AND 50),CHECK(grade_points BETWEEN 0 AND 10)
) ENGINE=InnoDB;
-- @statement
CREATE TABLE IF NOT EXISTS attendance (
 id INT AUTO_INCREMENT PRIMARY KEY,student_id VARCHAR(50) NOT NULL,course_id VARCHAR(50) NOT NULL,
 session_date DATE NOT NULL,present BOOLEAN NOT NULL,UNIQUE KEY uq_attendance(student_id,course_id,session_date),
 FOREIGN KEY(student_id) REFERENCES students(id),FOREIGN KEY(course_id) REFERENCES courses(id)
) ENGINE=InnoDB;
-- @statement
CREATE TABLE IF NOT EXISTS timetable (
 id INT AUTO_INCREMENT PRIMARY KEY,student_id VARCHAR(50) NOT NULL,course_id VARCHAR(50) NOT NULL,section_id VARCHAR(50) NOT NULL,
 day_of_week VARCHAR(15) NOT NULL,time_slot VARCHAR(50) NOT NULL,start_minutes INT NOT NULL,end_minutes INT NOT NULL,
 classroom VARCHAR(100) NOT NULL,course_type VARCHAR(30) NOT NULL,
 UNIQUE KEY uq_student_course_day(student_id,course_id,day_of_week),FOREIGN KEY(student_id) REFERENCES students(id),
 FOREIGN KEY(course_id) REFERENCES courses(id),FOREIGN KEY(section_id) REFERENCES course_sections(id),CHECK(start_minutes<end_minutes)
) ENGINE=InnoDB;
-- @statement
CREATE TABLE IF NOT EXISTS waitlist (
 id INT AUTO_INCREMENT PRIMARY KEY,student_id VARCHAR(50) NOT NULL,course_id VARCHAR(50) NOT NULL,section_id VARCHAR(50) NOT NULL,
 status ENUM('Waiting','Promoted','Cancelled') DEFAULT 'Waiting',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_waitlist(student_id,course_id),INDEX idx_waitlist_section(section_id,status,id),
 FOREIGN KEY(student_id) REFERENCES students(id),FOREIGN KEY(course_id) REFERENCES courses(id),FOREIGN KEY(section_id) REFERENCES course_sections(id)
) ENGINE=InnoDB;
-- @statement
CREATE TABLE IF NOT EXISTS notifications (
 id VARCHAR(50) PRIMARY KEY,student_id VARCHAR(50) NOT NULL,title VARCHAR(200) NOT NULL,message TEXT NOT NULL,
 category VARCHAR(50) DEFAULT 'general',is_read BOOLEAN DEFAULT FALSE,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 INDEX idx_notifications_student(student_id,is_read),FOREIGN KEY(student_id) REFERENCES students(id)
) ENGINE=InnoDB;
-- @statement
CREATE TABLE IF NOT EXISTS enrollment_audit_log (
 log_id INT AUTO_INCREMENT PRIMARY KEY,student_id VARCHAR(50) NOT NULL,course_id VARCHAR(50) NOT NULL,
 action_type VARCHAR(30) NOT NULL,log_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,remarks VARCHAR(255) DEFAULT '',
 INDEX idx_audit_student(student_id,log_id)
) ENGINE=InnoDB;
-- @statement
CREATE OR REPLACE VIEW v_student_academic_summary AS
SELECT s.id AS student_id,s.roll_number,s.full_name,s.department,
 COALESCE(e.total_enrolled_courses,0) AS total_enrolled_courses,COALESCE(e.current_semester_credits,0) AS current_semester_credits,
 COALESCE(g.average_marks_obtained,0) AS average_marks_obtained,COALESCE(g.current_gpa,0) AS current_gpa,
 COALESCE(g.completed_credits,0) AS completed_credits,COALESCE(sg.semester_gpa,0) AS semester_gpa,COALESCE(a.attendance_rate,0) AS attendance_rate
FROM students s
LEFT JOIN (SELECT e.student_id,COUNT(*) AS total_enrolled_courses,SUM(c.credits) AS current_semester_credits FROM enrollments e JOIN courses c ON c.id=e.course_id WHERE e.status='Enrolled' GROUP BY e.student_id) e ON e.student_id=s.id
LEFT JOIN (SELECT g.student_id,AVG(g.total_marks) AS average_marks_obtained,SUM(g.grade_points*c.credits)/NULLIF(SUM(c.credits),0) AS current_gpa,SUM(CASE WHEN g.grade_points>0 THEN c.credits ELSE 0 END) AS completed_credits FROM grades g JOIN courses c ON c.id=g.course_id WHERE g.status='Published' GROUP BY g.student_id) g ON g.student_id=s.id
LEFT JOIN (SELECT g.student_id,SUM(g.grade_points*c.credits)/NULLIF(SUM(c.credits),0) AS semester_gpa FROM grades g JOIN courses c ON c.id=g.course_id JOIN students ss ON ss.id=g.student_id WHERE g.status='Published' AND g.semester=ss.semester GROUP BY g.student_id) sg ON sg.student_id=s.id
LEFT JOIN (SELECT student_id,AVG(present)*100 AS attendance_rate FROM attendance GROUP BY student_id) a ON a.student_id=s.id;
-- @statement
CREATE OR REPLACE VIEW v_course_enrollment_stats AS SELECT c.id AS course_id,c.course_code,c.course_name,c.credits,COALESCE(cap.total_seats,0) AS total_seats,COALESCE(e.filled_seats,0) AS filled_seats,COALESCE(cap.total_seats,0)-COALESCE(e.filled_seats,0) AS available_seats,ROUND(COALESCE(e.filled_seats,0)*100/NULLIF(cap.total_seats,0),1) AS occupancy_percentage FROM courses c LEFT JOIN (SELECT course_id,SUM(total_seats) AS total_seats FROM course_sections GROUP BY course_id) cap ON cap.course_id=c.id LEFT JOIN (SELECT course_id,COUNT(*) AS filled_seats FROM enrollments WHERE status='Enrolled' GROUP BY course_id)e ON e.course_id=c.id;
-- @statement
DROP TRIGGER IF EXISTS tr_enrollment_insert;
-- @statement
CREATE TRIGGER tr_enrollment_insert AFTER INSERT ON enrollments FOR EACH ROW INSERT INTO enrollment_audit_log(student_id,course_id,action_type,remarks) VALUES(NEW.student_id,NEW.course_id,UPPER(NEW.status),CONCAT('Section ',NEW.section_id));
-- @statement
DROP TRIGGER IF EXISTS tr_enrollment_update;
-- @statement
CREATE TRIGGER tr_enrollment_update AFTER UPDATE ON enrollments FOR EACH ROW BEGIN IF OLD.status<>NEW.status OR OLD.section_id<>NEW.section_id THEN INSERT INTO enrollment_audit_log(student_id,course_id,action_type,remarks) VALUES(NEW.student_id,NEW.course_id,IF(OLD.section_id<>NEW.section_id AND OLD.status=NEW.status,'SWITCHED',UPPER(NEW.status)),CONCAT('Section ',OLD.section_id,' -> ',NEW.section_id)); END IF; END;
-- @statement
DROP PROCEDURE IF EXISTS sp_student_transcript;
-- @statement
CREATE PROCEDURE sp_student_transcript(IN p_student VARCHAR(50)) BEGIN SELECT c.course_code,c.course_name,c.credits,g.internal_marks,g.midterm_marks,g.final_marks,g.total_marks,g.grade,g.grade_points,g.semester FROM grades g JOIN courses c ON c.id=g.course_id WHERE g.student_id=p_student AND g.status='Published' ORDER BY c.course_code; END;
-- @statement
DROP FUNCTION IF EXISTS fn_calculate_student_avg;
-- @statement
CREATE FUNCTION fn_calculate_student_avg(p_student VARCHAR(50)) RETURNS DECIMAL(5,2) READS SQL DATA BEGIN DECLARE result DECIMAL(5,2); SELECT COALESCE(AVG(total_marks),0) INTO result FROM grades WHERE student_id=p_student AND status='Published'; RETURN result; END;

-- @statement
CREATE TABLE IF NOT EXISTS academic_clusters (
 id VARCHAR(50) PRIMARY KEY,code VARCHAR(20) NOT NULL,name VARCHAR(100) NOT NULL,semester VARCHAR(50) NOT NULL,
 description VARCHAR(255) DEFAULT '',UNIQUE KEY uq_cluster_term(code,semester)
) ENGINE=InnoDB;
-- @statement
CREATE TABLE IF NOT EXISTS cluster_groups (
 id VARCHAR(50) PRIMARY KEY,cluster_id VARCHAR(50) NOT NULL,name VARCHAR(50) NOT NULL,
 FOREIGN KEY(cluster_id) REFERENCES academic_clusters(id),UNIQUE KEY uq_cluster_group(cluster_id,name)
) ENGINE=InnoDB;
-- @statement
CREATE TABLE IF NOT EXISTS section_clusters (
 section_id VARCHAR(50) PRIMARY KEY,group_id VARCHAR(50) NOT NULL,
 FOREIGN KEY(section_id) REFERENCES course_sections(id),FOREIGN KEY(group_id) REFERENCES cluster_groups(id)
) ENGINE=InnoDB;
-- @statement
CREATE TABLE IF NOT EXISTS student_cluster_choices (
 student_id VARCHAR(50) NOT NULL,semester VARCHAR(50) NOT NULL,cluster_id VARCHAR(50) NOT NULL,
 locked BOOLEAN DEFAULT FALSE,chosen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(student_id,semester),FOREIGN KEY(student_id) REFERENCES students(id),FOREIGN KEY(cluster_id) REFERENCES academic_clusters(id)
) ENGINE=InnoDB;
-- @statement
CREATE TABLE IF NOT EXISTS cgpa_overrides (
 student_id VARCHAR(50) PRIMARY KEY,value DECIMAL(4,2) NOT NULL,reason VARCHAR(255) NOT NULL,
 admin_id VARCHAR(50) NOT NULL,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 FOREIGN KEY(student_id) REFERENCES students(id),FOREIGN KEY(admin_id) REFERENCES admins(id),CHECK(value BETWEEN 0 AND 10)
) ENGINE=InnoDB;
-- @statement
CREATE TABLE IF NOT EXISTS academic_audit (
 id INT AUTO_INCREMENT PRIMARY KEY,student_id VARCHAR(50),admin_id VARCHAR(50),action VARCHAR(40) NOT NULL,
 old_value VARCHAR(255),new_value VARCHAR(255),reason VARCHAR(255),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- @statement
CREATE OR REPLACE VIEW v_student_rankings AS SELECT v.student_id,DENSE_RANK() OVER(PARTITION BY v.department ORDER BY COALESCE(o.value,v.current_gpa) DESC) AS department_rank,DENSE_RANK() OVER(ORDER BY COALESCE(o.value,v.current_gpa) DESC) AS institute_rank FROM v_student_academic_summary v LEFT JOIN cgpa_overrides o ON o.student_id=v.student_id;