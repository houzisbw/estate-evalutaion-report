import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './assets/reset.css'
import 'babel-polyfill'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
