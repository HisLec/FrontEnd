import React from "react";
import { Route, Switch,Redirect} from "react-router-dom";

import MainLayout from "../components/layout/main";
import CommonLayout from "../components/layout/common";

const header = [{url: "lecture/subject",name:"강의보기"}, {url: "notice",name:"공지사항"}];
class NotLogin extends React.Component {
  render() {
    return (
        <Switch>
            <Route exact path={process.env.REACT_APP_DEFAULT_URL} render={() => <MainLayout menu = {header} {...this.props}/>} />
            <Route exact path={process.env.REACT_APP_DEFAULT_URL+"lecture/subject"} render={() => <CommonLayout menu = {header} {...this.props}/>} />
            <Route exact path={process.env.REACT_APP_DEFAULT_URL+"lecture/instructor"} render={() => <CommonLayout menu = {header} {...this.props}/>} />
            <Route exact path={process.env.REACT_APP_DEFAULT_URL+"lecture/date"} render={() => <CommonLayout menu = {header} {...this.props}/>} />
            <Route exact path={process.env.REACT_APP_DEFAULT_URL+"notice"} render={() => <CommonLayout menu = {header} {...this.props}/>} />
            <Route><Redirect to={process.env.REACT_APP_DEFAULT_URL} /></Route>
        </Switch>
    );
  }
}

export default NotLogin;