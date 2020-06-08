import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import store from './store';
import './App.css';
import WebEnrollForm from './containers/WebEnrollForm';

function App() {
  return (
    <Provider store={store}>  
      <div className="App">
        <WebEnrollForm />
      </div>
    </Provider>
  );
}

export default App;
