import React, {useState, useEffect} from "react";
import { GoogleLogin,GoogleLogout } from 'react-google-login';
import axios from 'axios';
import '../../../assets/css/header.css';
import { Link } from 'react-router-dom';

function MainMenu(props) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [submenuOpen, setSubmenuOpen] = useState(null);
    const [loading, setLoading] = useState(false);
    const today = new Date();

    useEffect(()=>{
        setDrawerOpen(false);
        setSubmenuOpen(null);
    },[props.history.location.pathname])

    function switchDrawer() {
        setDrawerOpen(!drawerOpen);
    }

    const responseGoogle = async (response) => {
        setLoading(true);
        const params = new URLSearchParams()
        params.append('token', response.tokenObj.id_token);
        params.append('email', response.profileObj.email);
        params.append('expire', response.tokenObj.expires_at);
        params.append('manageID', window.sessionStorage.getItem('id'));

        const res = await axios.post(
        process.env.REACT_APP_RESTAPI_HOST + 'user/login', params
        );
        if(res.data !== "fail"){
        window.sessionStorage.setItem('email', response.profileObj.email);
        window.sessionStorage.setItem('name', response.profileObj.name);
        window.sessionStorage.setItem('token', response.tokenObj.id_token);
        window.sessionStorage.setItem('expires_at', response.tokenObj.expires_at);
        window.sessionStorage.setItem('status', res.data.status);
        window.sessionStorage.setItem('id', res.data.id);
        
        window.location.reload();
        }else{
        alert("로그인 할 수 없습니다. 관리자에게 문의해주세요.");
        }
        setLoading(false);
    }

    const logout = async () => {
        setLoading(true);
        const params = new URLSearchParams()
        params.append('email', window.sessionStorage.getItem('email'));
        params.append('manageID', window.sessionStorage.getItem('id'));
        
        await axios.post(
        process.env.REACT_APP_RESTAPI_HOST + 'user/logout', params
        );

        const auth2 = window.gapi.auth2.getAuthInstance();
        auth2.signOut().then(function() {
        window.sessionStorage.removeItem('email');
        window.sessionStorage.removeItem('name');
        window.sessionStorage.removeItem('token');
        window.sessionStorage.removeItem('expires_at');

        setLoading(false);
        window.location.reload();
        });
    }
    const failLogin = async () => {
        alert("로그인에 실패했습니다.");
    }
    return (
    <div>
        <div id="main-navbar">
            <div className="nav-logo">
                <img width="110px" alt="logo" src={process.env.REACT_APP_DEFAULT_URL+"image/logo.png"} />
            </div>
            <div className="nav-title-wrapper">
                {props.menu !== null ?
                    props.menu.map((data, index) => (
                        <Link key={index} to={process.env.REACT_APP_DEFAULT_URL+data.url} className="nav-title">{data.name}</Link>
                    ))
                    : null
                }
                {/* <Link to={process.env.REACT_APP_DEFAULT_URL+"lecture/subject"} className="nav-title">강의보기</Link> */}
                {loading ? null:
                    window.sessionStorage.getItem("token") !== null && window.sessionStorage.getItem('expires_at') >= today.getTime()?    
                    <GoogleLogout
                    clientId={process.env.REACT_APP_GOOGLE_LOGIN}
                    buttonText="Logout"
                    render={renderProps => (<button className="nav-title" onClick={renderProps.onClick} disabled={renderProps.disabled}>로그아웃</button>)}
                    onLogoutSuccess={logout}
                    >
                    </GoogleLogout>: <GoogleLogin
                    clientId= {process.env.REACT_APP_GOOGLE_LOGIN}
                    render={renderProps => (<button className="nav-title" onClick={renderProps.onClick} disabled={renderProps.disabled}>로그인</button>
                    )}
                    buttonText="Login"
                    onSuccess={responseGoogle}
                    onFailure={failLogin}
                    cookiePolicy={'single_host_origin'}
                    />
                }
            </div>
        </div>
        <div id="main-navbar-mobile">
            <div onClick = {() => {switchDrawer()}}> <img alt="logo" className="drawer-toggle" src={process.env.REACT_APP_DEFAULT_URL+"image/mobile_drawer.png"}/></div>
            <img alt="logo" width="110px" src={process.env.REACT_APP_DEFAULT_URL+"image/logo_black.png"}/>
            <div></div>
        </div>
        {
            drawerOpen !== false?
            <div className="drawer-wrapper">
                <div className="drawer-content">
                    <div className="drawer-left">
                        <ul>
                        <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL}>홈</Link></li>
                            {props.menu !== null ?
                                props.menu.map((data, index) => 
                                    data.url === "lecture/subject"?
                                    <li className={submenuOpen === "lecture"? "active":""} onClick = {() => {setSubmenuOpen("lecture")}}>강의 보기</li>:
                                    data.url === "mypage/profile"?
                                    <li className={submenuOpen === "mypage/profile"? "active":""} onClick = {() => {setSubmenuOpen("mypage")}}>마이 페이지</li>:
                                    <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+data.url? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+data.url}>{data.name}</Link></li>
                                ):null
                            }
                        </ul>
                        {loading ? null:
                            window.sessionStorage.getItem("token") !== null && window.sessionStorage.getItem('expires_at') >= today.getTime()?    
                            <ul>
                                <li className="login-name">{window.sessionStorage.getItem('email').split("@")[0]} 님</li>
                                <li>
                                <GoogleLogout
                                className="nav-title"
                                clientId={process.env.REACT_APP_GOOGLE_LOGIN}
                                buttonText="Logout"
                                render={renderProps => (<button className="drawer-link active" onClick={renderProps.onClick} disabled={renderProps.disabled}>로그아웃</button>
                                    )}
                                onLogoutSuccess={logout}
                                >
                                </GoogleLogout>
                            </li></ul>: 
                            <ul>
                                <li> <GoogleLogin
                                clientId= {process.env.REACT_APP_GOOGLE_LOGIN}
                                render={renderProps => (<button className="drawer-link active" onClick={renderProps.onClick} disabled={renderProps.disabled}>Google로 로그인</button>
                                )}
                                buttonText="Login"
                                onSuccess={responseGoogle}
                                onFailure={responseGoogle}
                                cookiePolicy={'single_host_origin'}
                                /></li>
                            </ul>
                        }
                        
                    </div>
                    <div className="drawer-right">
                        {submenuOpen === "lecture"? 
                        <ul>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"lecture/subject"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"lecture/subject"}>주제별</Link></li>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"lecture/instructor"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"lecture/instructor"}>강사별</Link></li>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"lecture/date"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"lecture/date"}>날짜별</Link></li>
                        </ul>:
                        submenuOpen === "mypage"? 
                        <ul>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"mypage"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"mypage"}>사용자-마이페이지</Link></li>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"mypage/profile"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"mypage/profile"}>강사-프로필</Link></li>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"mypage/lecture"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"mypage/lecture"}>강사-내 강의</Link></li>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"mypage/contact"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"mypage/contact"}>강사-컨택일지</Link></li>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"mypage/visitlog"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"mypage/visitlog"}>강사-방문일지</Link></li>
                        </ul>:
                        <ul></ul>
                        }
                    </div>
                </div>
            </div>:
            <div></div>
        }
    </div>        
    );
}

export default MainMenu;

