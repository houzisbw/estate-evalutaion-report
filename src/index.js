import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'babel-polyfill'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
