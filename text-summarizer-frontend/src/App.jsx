import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CreateNewPasswordPage from './pages/CreateNewPasswordPage';
import PrivateRoute from './components/PrivateRoute';
import SummaryApp from './SummaryApp'; // Now SummaryApp is separated for clarity

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resetPassword" element={<ResetPasswordPage />} />
        <Route path="/createnewpassword" element={<CreateNewPasswordPage />} />

        {/* ✅ Protected route */}
        <Route
          path="/app"
          element={
            <PrivateRoute>
              <SummaryApp />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
