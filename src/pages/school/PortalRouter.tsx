import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PortalDashboard from './PortalDashboard';
import PortalCourses from './portal/Courses';
import PortalCourseSingle from './portal/CourseSingle';
import PortalProfile from './portal/Profile';
import NotFound from '../NotFound';

const PortalRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<PortalDashboard />} />
            <Route path="/courses" element={<PortalCourses />} />
            <Route path="/courses/:id" element={<PortalCourseSingle />} />
            <Route path="/profile" element={<PortalProfile />} />
            {/* Add other portal routes here e.g. assignments, profile */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default PortalRouter;
