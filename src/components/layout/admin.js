import React from "react";
import { Route, Switch, Redirect} from "react-router-dom";

import AdminMenu from "../modules/menu/admin";
import Footer from "../modules/footer/footer";
import AdminLecture from "../pages/admin/lecture";
import AdminMain from "../pages/admin/main";
import AdminChurch from "../pages/admin/church";
import AdminChurchTemp from "../pages/admin/churchTemp";
import AdminInstructor from "../pages/admin/instructor";
import AdminUsers from "../pages/admin/users";
import AdminFeedback from '../pages/admin/feedback';
import AdminAdministrator from '../pages/admin/administrator';
import AdminPhrase from '../pages/admin/phrase';
import AdminContact from "../pages/admin/contact";
import AdminAcademyDate from "../pages/admin/academyDate";
import AdminCategory from "../pages/admin/category";
import AdminVisitDiary from "../pages/admin/visitDiary";
import AdminStatistics from "../pages/admin/statistics";

class AdminLayout extends React.Component {

  render() {
    return (
        <div>
            <AdminMenu {...this.props}/>
            <div id="right-content">
                <Switch>
                  <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/administrator"} component= {AdminAdministrator} />
                    <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/lecture"} component= {AdminLecture} />
                    <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/church_temp"} component= {AdminChurchTemp} />
                    <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/church"} component= {AdminChurch} />
                    <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/instructor"} component= {AdminInstructor} />
                    <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/main"} component= {AdminMain} />
                    <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/users"} component= {AdminUsers} />
                    <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/feedback"} component= {AdminFeedback} />
                    <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/visit_diary"} component= {AdminVisitDiary} />
                    <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/phrase"} component= {AdminPhrase} />
                    <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/contact"} component= {AdminContact} />
                    <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/academy_date"} component= {AdminAcademyDate} />
                    <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/category"} component= {AdminCategory} />
                    <Route exact path={process.env.REACT_APP_DEFAULT_URL+"admin/statistics"} component= {AdminStatistics} />
                    <Route><Redirect to={process.env.REACT_APP_DEFAULT_URL} /></Route>
                </Switch>
            </div>
            <Footer/>
            
        </div>
    );
  }
}

export default AdminLayout;