import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './assets/reset.css'
import 'babel-polyfill'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
//该语句能够让网站离线访问以及缓存，但是网站必须是https，否则出错
//registerServiceWorker();
