import React from 'react';
import { Link } from 'react-router-dom';

export const Home = () => (
  <div>
    <h1>Стартовая страница</h1>
    <nav>
      <Link to="/signup">Рыгыстрация</Link>
      <Link to="/login">Вход</Link>
    </nav>
  </div>
);
