import './index.css';

import React from "react";
import { createRoot } from 'react-dom/client';
//wire up our Redux store to our React application
//by wrapping our App component in a Provider component
import { Provider } from 'react-redux';
//import the store that we created in src\store\index.js
import { store } from './store';
import App from './App';

const el = document.getElementById('root');
const root = createRoot(el);

root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
