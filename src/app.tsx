import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { NotificationsContainer } from '@features/notifications';

import { ErrorPage, HomePage, SignIn, SignUp, StartPage } from './pages';

export const App: React.FC = () => (
  <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/start" element={<StartPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
    <NotificationsContainer />
  </>
);
