import React, { Component } from 'react';
//注意BrowseRouter需要服务端配合服务端重定向到首页，否则刷新找不到页面,HashRouter没有这个问题
import {HashRouter as Router,Route,Switch,Redirect} from 'react-router-dom'
import AuthorizedRoute from './routes/AuthorizedRoute'
import store from './store/store'
import {Provider} from 'react-redux'

//异步加载组件,注意上面不要再import
import asyncComponent from './components/_publicComponents/AsyncComponent/AsyncComponent'
const AsyncLogin = asyncComponent(()=>import('./pages/login/login'));
const AsyncLayout = asyncComponent(()=>import('./pages/Layouts/layouts'));

class App extends Component {
  render() {
    return (
        <Provider store={store}>
          <Router>
            <Switch>
              {/*登录组件*/}
              <Route  path="/login" component={AsyncLogin}/>
              {/*需要身份认证的路由(里面是主要内容),Layout是里面的子路由，外层由layout组件包裹(导航条),这里app属性注意*/}
              <AuthorizedRoute path="/app" component={AsyncLayout}/>
              {/*当访问其他路径时也被定向到首页*/}
              <Redirect to="/app" />
            </Switch>
          </Router>
        </Provider>
    );
  }
}

export default App;
