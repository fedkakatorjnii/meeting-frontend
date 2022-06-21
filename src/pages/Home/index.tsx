import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
// import { RootContext } from '../../context';

export const Home = () => {
  // const store = useContext(RootContext);

  return (
    <div>
      <h1>Стартовая страница</h1>
      <nav>
        <Link to="/signup">Рыгыстрация</Link>
        <Link to="/login">Вход</Link>
      </nav>
    </div>
  );
};
