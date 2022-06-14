import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home, Signup, Login } from './pages';

export const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="signup" element={<Signup />} />
    <Route path="login" element={<Login />} />
  </Routes>
);
