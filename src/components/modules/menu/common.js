import React, {useState, useEffect} from "react";
import { GoogleLogin,GoogleLogout } from 'react-google-login';
import axios from 'axios';
import '../../../assets/css/header.css';
import { Link } from 'react-router-dom';

function CommonMenu(props) {
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
        if(parseInt(res.data.status) !== -1){
        window.sessionStorage.setItem('email', response.profileObj.email);
        window.sessionStorage.setItem('name', response.profileObj.name);
        window.sessionStorage.setItem('token', response.tokenObj.id_token);
        window.sessionStorage.setItem('expires_at', response.tokenObj.expires_at);
        window.sessionStorage.setItem('status', res.data.status);
        window.sessionStorage.setItem('id', res.data.id);

        //window.location.href ='';
        }else{
        alert("로그인 할 수 없습니다. 관리자에게 문의해주세요.");
        }
        setLoading(false);
        window.location.reload();
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
        window.sessionStorage.removeItem('id')
        setLoading(false);
        window.location.reload();
        });
    }

    const failLogin = async () => {
        alert("로그인에 실패했습니다.");
    }
    return (
    <div>
        <div id="common-navbar">
            <div className="nav-logo">
                <Link to={process.env.REACT_APP_DEFAULT_URL}><img width="110px" alt="logo" src={process.env.REACT_APP_DEFAULT_URL+"image/black_logo.png"}/></Link>
            </div>
            <div className="nav-title-wrapper">
                {props.menu !== null ?
                    props.menu.map((data, index) => (
                        <Link key={index} to={process.env.REACT_APP_DEFAULT_URL+data.url} className="nav-title">{data.name}</Link>
                    ))
                    : null
                }
                {loading ? null:
                    window.sessionStorage.getItem('email') !== null && window.sessionStorage.getItem('expires_at') >= today.getTime()?    
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
        <div id="common-navbar-mobile">
            <div onClick = {() => {switchDrawer()}}><img alt="logo" className="drawer-toggle-common" src={process.env.REACT_APP_DEFAULT_URL+"image/mobile_drawer.png"}/></div>
            <img alt="logo" width="110px" src={process.env.REACT_APP_DEFAULT_URL+"image/logo_black.png"}/>
            <div></div>
        </div>
        {
            drawerOpen !== false?
            <div className="drawer-wrapper">
                <div className="drawer-content">
                    <div className="drawer-left">
                        <ul>
                        {props.menu !== null ?
                            props.menu.map((data, index) => 
                                
                                    data.url === "lecture/subject"?
                                    <li className={submenuOpen === "lecture"? "active":""} onClick = {() => {setSubmenuOpen("lecture")}}>강의 보기</li>:
                                    data.url === "mypage/profile"?
                                    <li className={submenuOpen === "mypage/profile"? "active":""} onClick = {() => {setSubmenuOpen("mypage")}}>마이 페이지</li>:
                                    <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+data.url? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+data.url}>{data.name}</Link></li>

                            ):null
                        }

                            {/* <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL}>홈</Link></li>
                            <li className={submenuOpen === "lecture"? "active":""} onClick = {() => {setSubmenuOpen("lecture")}}>강의 보기</li>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/main"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"admin/main"}>관리 페이지 보기</Link></li>
                            <li className={submenuOpen === "mypage"? "active":""} onClick = {() => {setSubmenuOpen("mypage")}}>마이 페이지</li> */}
                        </ul> 
                        <ul>
                            {
                                window.sessionStorage.getItem('email') !== null?
                                <li className="login-name">{window.sessionStorage.getItem('email').split("@")[0]} 님</li>:
                                <li className="login-name">로그인이 필요합니다.</li>
                            }
                            {loading ? null:
                                window.sessionStorage.getItem('email') !== null && window.sessionStorage.getItem('expires_at') >= today.getTime()?    
                                <GoogleLogout
                                clientId={process.env.REACT_APP_GOOGLE_LOGIN}
                                buttonText="Logout"
                                render={renderProps => (<li className="nav-title pointer" onClick={renderProps.onClick} disabled={renderProps.disabled}>로그아웃</li>)}
                                onLogoutSuccess={logout}
                                >
                                </GoogleLogout>: <GoogleLogin
                                clientId= {process.env.REACT_APP_GOOGLE_LOGIN}
                                render={renderProps => (<li className="nav-title pointer" onClick={renderProps.onClick} disabled={renderProps.disabled}>로그인</li>
                                )}
                                buttonText="Login"
                                onSuccess={responseGoogle}
                                onFailure={failLogin}
                                cookiePolicy={'single_host_origin'}
                                />
                            }
                        </ul>
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
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"mypage/profile"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"mypage/profile"}>프로필</Link></li>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"mypage/lecture"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"mypage/lecture"}>내 강의</Link></li>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"mypage/contact"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"mypage/contact"}>컨택일지</Link></li>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"mypage/visitlog"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"mypage/visitlog"}>방문일지</Link></li>
                        </ul>:
                        <ul></ul>
                        }
                    </div>
                </div>
            </div>:
            <div></div>
        }
        {/* <div className="main-image">
            <img className="page-background" src={backgroundUrl} alt="lecture page" />
            <div className="page-info">
                <h2>신청서 작성하기</h2>
                <p>신청을 통해 듣고 싶은 강의를 우리 교회에서!</p>
            </div>
        </div> */}
        {/* <div className="content-wrapper">
            <div className="left-navbar">
                <span className="left-active">
                    내용1
                </span>
                <span>
                    내용2
                </span>
                <span>
                    내용3
                </span>
                <span>
                    내용4
                </span>
            </div>
            <div className="right-content">
                right content 입니다
            </div>

        </div>
        */}
    </div>        
    );
}

export default CommonMenu;

