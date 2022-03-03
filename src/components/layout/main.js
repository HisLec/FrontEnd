import React from "react";
import { Route, Switch, Redirect} from "react-router-dom";
import MainFooter from '../modules/footer/main_footer';

import MainMenu from "../modules/menu/main";
import Home from "../pages/home";

class MainLayout extends React.Component {

  render() {
    return (
        <div>
            <MainMenu menu = {this.props.menu} {...this.props}/>
            <Switch>
                    <Route exact path={process.env.REACT_APP_DEFAULT_URL} component= {Home} />
                    <Route><Redirect to={process.env.REACT_APP_DEFAULT_URL} /></Route>
            </Switch>
            <MainFooter/>
        </div>
    );
  }
}

export default MainLayout;