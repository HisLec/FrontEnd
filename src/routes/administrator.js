import React from "react";
import { Route, Switch, Redirect} from "react-router-dom";

import AdminLayout from "../components/layout/admin";
import MainLayout from "../components/layout/main";
import CommonLayout from "../components/layout/common";

const header = [{name: "강의보기", url: "lecture/subject"}, {name: "공지사항", url: "notice"}, {name: "사이트 관리", url: "admin/main"}];

class Administrator extends React.Component {

  render() {
    return (
      <Switch>
          <Route exact path={process.env.REACT_APP_DEFAULT_URL} render={() => <MainLayout menu = {header} {...this.props}/>} />
          <Route exact path={process.env.REACT_APP_DEFAULT_URL+"lecture/subject"} render={() => <CommonLayout menu = {header} {...this.props}/>}/>
          <Route exact path={process.env.REACT_APP_DEFAULT_URL+"lecture/instructor"} render={() => <CommonLayout menu = {header} {...this.props}/>} />
          <Route exact path={process.env.REACT_APP_DEFAULT_URL+"lecture/date"} render={() => <CommonLayout menu = {header} {...this.props}/>}/>
          <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/lecture"} component= {AdminLayout} />
          <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/church_temp"} component= {AdminLayout} />
          <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/church"} component= {AdminLayout} />
          <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/instructor"} component= {AdminLayout} />
          <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/main"} component= {AdminLayout} />
          <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/users"} component= {AdminLayout} />
          <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/feedback"} component= {AdminLayout} />
          <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/category"} component= {AdminLayout} />
          <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/administrator"} component= {AdminLayout} />
          <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/phrase"} component= {AdminLayout} />
          <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/contact"} component= {AdminLayout} />
          <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/academy_date"} component= {AdminLayout} />
          <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/visit_diary"} component= {AdminLayout} />
          <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/statistics"} component= {AdminLayout} />
          <Route exact path={process.env.REACT_APP_DEFAULT_URL+"notice"} render={() => <CommonLayout menu = {header} {...this.props}/>}/>
          <Route><Redirect to={process.env.REACT_APP_DEFAULT_URL} /></Route>
        </Switch>
    );
  }
}

export default Administrator;