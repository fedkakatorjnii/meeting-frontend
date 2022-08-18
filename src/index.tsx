import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { RootContext, store } from '@common';
import { App } from './app';

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <RootContext.Provider value={store}>
        <App />
      </RootContext.Provider>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('app'),
);
