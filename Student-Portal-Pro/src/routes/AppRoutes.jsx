
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import { useApp } from '../context/AppContext';

import Clusters from '../pages/Clusters';
import AdminClusters from '../pages/admin/AdminClusters';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Courses from '../pages/Courses';
import CourseDetails from '../pages/CourseDetails';
import MyCourses from '../pages/MyCourses';
import Timetable from '../pages/Timetable';
import Grades from '../pages/Grades';
import Profile from '../pages/Profile';
import Planner from '../pages/Planner';
import AcademicOperations from '../pages/admin/AcademicOperations';
import Notifications from '../pages/Notifications';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminStudents from '../pages/admin/AdminStudents';
import AdminEnrollments from '../pages/admin/AdminEnrollments';
import AdminFaculty from '../pages/admin/AdminFaculty';

const AppRoutes = () => {
  const { isAdmin } = useApp();

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login initialMode="login" />} />
      <Route path="/register" element={<Login initialMode="register" />} />

      {/* Protected Portal Layout */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Core Student Routes */}
        <Route path="/dashboard" element={isAdmin ? <Navigate to="/admin" replace /> : <Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/grades" element={<Grades />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/clusters" element={<Clusters />} />
        <Route path="/admin/clusters" element={<ProtectedRoute adminOnly><AdminClusters /></ProtectedRoute>} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* Administrative Routes */}
        <Route path="/admin/operations" element={<ProtectedRoute adminOnly><AcademicOperations /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute adminOnly><AdminStudents /></ProtectedRoute>} />
        <Route path="/admin/enrollments" element={<ProtectedRoute adminOnly><AdminEnrollments /></ProtectedRoute>} />
        <Route path="/admin/faculty" element={<ProtectedRoute adminOnly><AdminFaculty /></ProtectedRoute>} />
      </Route>

      {/* Root redirect */}
      <Route path="/" element={<Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />} />

      {/* Fallback 404 */}
      <Route path="*" element={<Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />} />
    </Routes>
  );
};

export default AppRoutes;
