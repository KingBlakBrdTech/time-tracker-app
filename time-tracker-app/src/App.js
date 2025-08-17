import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import Timesheet from './pages/Timesheet';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/Dashboard" element={<Dashboard currentPageName="Dashboard" />} />
          <Route path="/Timesheet" element={<Timesheet currentPageName="Timesheet" />} />
          <Route path="/AdminDashboard" element={<AdminDashboard currentPageName="Admin Dashboard" />} />
          <Route path="/" element={<Dashboard currentPageName="Dashboard" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;