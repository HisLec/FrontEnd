import React from "react";
import { Route, Switch, Redirect} from "react-router-dom";

import CommonMenu from "../modules/menu/common";
import Home from "../pages/home";
import LectureSubject from "../pages/lecture/subject";
import LectureInstructor from "../pages/lecture/instructor";
import LectureDate from "../pages/lecture/date";
import LectureApplication from "../pages/lecture/application";
import MypageUser from "../pages/mypage/user";
import MypageUserContacted from "../pages/mypage/userContacted";
import MypageContact from "../pages/mypage/contact";
import MypageLecture from "../pages/mypage/lecture";
import MypageVisitlog from "../pages/mypage/visitDiary";
import MypageProfile from "../pages/mypage/profile";
import Footer from '../modules/footer/footer';
import Notice from "../pages/notice";


class CommonLayout extends React.Component {
  render() {
    return (
        <div>
            <CommonMenu menu = {this.header} {...this.props}/>
            <Switch>
                <Route exact path={process.env.REACT_APP_DEFAULT_URL} component= {Home} />
                <Route exact path={process.env.REACT_APP_DEFAULT_URL+"lecture/subject"} component= {LectureSubject} />
                <Route exact path={process.env.REACT_APP_DEFAULT_URL+"lecture/instructor"} component= {LectureInstructor} />
                <Route exact path={process.env.REACT_APP_DEFAULT_URL+"lecture/date"} component= {LectureDate} />
                <Route exact path={process.env.REACT_APP_DEFAULT_URL+"lecture/application"} component= {LectureApplication} />
                <Route exact path={process.env.REACT_APP_DEFAULT_URL+"mypage/apply"} component= {MypageUser} />
                <Route exact path={process.env.REACT_APP_DEFAULT_URL+"mypage/take"} component= {MypageUserContacted} />
                <Route exact path={process.env.REACT_APP_DEFAULT_URL+"mypage/lecture"} component= {MypageLecture} />
                <Route exact path={process.env.REACT_APP_DEFAULT_URL+"mypage/contact"} component= {MypageContact} />
                <Route exact path={process.env.REACT_APP_DEFAULT_URL+"mypage/visitlog"} component= {MypageVisitlog} />
                <Route exact path={process.env.REACT_APP_DEFAULT_URL+"mypage/profile"} component= {MypageProfile} />
                <Route exact path={process.env.REACT_APP_DEFAULT_URL+"notice"} component= {Notice} />
                <Route><Redirect to={process.env.REACT_APP_DEFAULT_URL} /></Route>
            </Switch>
            <Footer/>
            
        </div>
    );
  }
}

export default CommonLayout;