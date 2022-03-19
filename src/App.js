import React, { Component } from 'react';
import axios from 'axios';
import {Route, Switch, Redirect} from "react-router-dom";

import Administrator from './routes/administrator';
import Instructor from './routes/instructor';
import User from './routes/user';
import NotLogin from './routes/notLogin';

axios.interceptors.request.use(
  function (config) {
    const today = new Date();
    const path = window.location.href.replace(process.env.REACT_APP_DEFAULT_WHOLE_URL, "");
    // if((window.sessionStorage.getItem("token") == null || window.sessionStorage.getItem('expires_at') < today.getTime())&& !(window.location.href === process.env.REACT_APP_DEFAULT_WHOLE_URL || path === "lecture/subject" || path === "lecture/instructor" || path === "lecture/date" || path === "notice")){
    //   alert(path +"로그인 후 사용할 수 있습니다~:)");
    //   window.location.href = process.env.REACT_APP_DEFAULT_URL;
    // }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  });

class App extends Component {
    
    render() {
      const today = new Date();
        return (
            <Switch>
            {
                window.sessionStorage.getItem('token') !== null && parseInt(window.sessionStorage.getItem("status")) === 2 && window.sessionStorage.getItem('expires_at') >= today.getTime() ?
                    <Route path={process.env.REACT_APP_DEFAULT_URL} component= {Administrator} />
                :window.sessionStorage.getItem('token') !== null && parseInt(window.sessionStorage.getItem("status")) === 1 && window.sessionStorage.getItem('expires_at') >= today.getTime()?
                <Route path={process.env.REACT_APP_DEFAULT_URL} component= {Instructor} />
                :window.sessionStorage.getItem('token') !== null && parseInt(window.sessionStorage.getItem("status")) === 0 && window.sessionStorage.getItem('expires_at') >= today.getTime()?
                <Route path={process.env.REACT_APP_DEFAULT_URL} component= {User} />:
                <Route path={process.env.REACT_APP_DEFAULT_URL} component= {NotLogin} />
            }
                <Route><Redirect to={process.env.REACT_APP_DEFAULT_URL} /></Route>
            </Switch>
        );
    }
}

export default App;