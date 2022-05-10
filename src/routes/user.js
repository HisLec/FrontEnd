import React from "react";
import { Route, Switch } from "react-router-dom";

import MainLayout from "../components/layout/main";
import CommonLayout from "../components/layout/common";
import NotFound from "../components/pages/notFound";

const header = [
  { url: "lecture/subject", name: "강의보기" },
  { url: "notice", name: "공지사항" },
  { url: "mypage/apply", name: "마이페이지" },
];
// const header = [{url: "lecture/subject",name:"강의보기"}, {url: "notice",name:"공지사항"}];

class User extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path={process.env.REACT_APP_DEFAULT_URL} render={() => <MainLayout menu={header} {...this.props} />} />
        <Route exact path={process.env.REACT_APP_DEFAULT_URL + "lecture/subject"} render={() => <CommonLayout menu={header} {...this.props} />} />
        <Route exact path={process.env.REACT_APP_DEFAULT_URL + "lecture/instructor"} render={() => <CommonLayout menu={header} {...this.props} />} />
        <Route exact path={process.env.REACT_APP_DEFAULT_URL + "lecture/date"} render={() => <CommonLayout menu={header} {...this.props} />} />
        <Route exact path={process.env.REACT_APP_DEFAULT_URL + "lecture/application"} render={() => <CommonLayout menu={header} {...this.props} />} />
        <Route exact path={process.env.REACT_APP_DEFAULT_URL + "mypage/apply"} render={() => <CommonLayout menu={header} {...this.props} />} />
        <Route exact path={process.env.REACT_APP_DEFAULT_URL + "mypage/finish"} render={() => <CommonLayout menu={header} {...this.props} />} />
        <Route exact path={process.env.REACT_APP_DEFAULT_URL + "mypage/take"} render={() => <CommonLayout menu={header} {...this.props} />} />
        <Route exact path={process.env.REACT_APP_DEFAULT_URL + "notice"} render={() => <CommonLayout menu={header} {...this.props} />} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

export default User;
