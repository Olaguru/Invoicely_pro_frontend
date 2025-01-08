// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './Components/Signup/Signup';
import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import CreateInvoice from './Components/Create/Create';
import ProtectedRoute from './Components/ProtectedRoute.jsx'; // Import your ProtectedRoute component
import EditInvoice from './Components/Create/EditInvoice.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}

        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateInvoice />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditInvoice/>
            </ProtectedRoute>
          }
          />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
