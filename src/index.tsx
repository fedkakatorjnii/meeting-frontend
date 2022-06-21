import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { App } from './app';
import { RootContext, store } from './context';

const Root = () => (
  <StrictMode>
    <RootContext.Provider value={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RootContext.Provider>
  </StrictMode>
);

ReactDOM.render(<Root />, document.getElementById('app'));
