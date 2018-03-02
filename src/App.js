import React, { Component } from 'react';
import {BrowserRouter as Router,Route,Switch,Redirect} from 'react-router-dom'
import Login from './pages/login/login'
import Layout from './pages/Layouts/layouts'
import AuthorizedRoute from './routes/AuthorizedRoute'
import store from './store/store'
import {Provider} from 'react-redux'
class App extends Component {
  render() {
    return (
        <Provider store={store}>
          <Router>
            <Switch>
              {/*登录组件*/}
              <Route  path="/login" component={Login}/>
              {/*需要身份认证的路由(里面是主要内容),Layout是里面的子路由，外层由layout组件包裹(导航条),这里app属性注意*/}
              <AuthorizedRoute path="/app" component={Layout}/>
              {/*当访问/时也被定向到登录页面*/}
              <Redirect to="/login" />
            </Switch>
          </Router>
        </Provider>
    );
  }
}

export default App;
