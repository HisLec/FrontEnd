import React, {useEffect, useState} from "react";
import { GoogleLogin,GoogleLogout } from 'react-google-login';
import axios from 'axios';
import '../../../assets/css/header.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-regular-svg-icons'

function AdminMenu(props) {
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

        setLoading(false);
        window.location.reload();
        });
    }

    const failLogin = async () => {
        alert("로그인에 실패했습니다.");
    }
    return (
        <div>
            <div id="admin-main-nav">
            {loading ? null:
                    window.sessionStorage.getItem('email') && window.sessionStorage.getItem('expires_at') >= today.getTime()?    
                    <GoogleLogout
                    clientId={process.env.REACT_APP_GOOGLE_LOGIN}
                    buttonText="Logout"
                    render={renderProps => (<button className="admin-main-btn2 mr40" onClick={renderProps.onClick} disabled={renderProps.disabled}>로그아웃</button>)}
                    onLogoutSuccess={logout}
                    >
                    </GoogleLogout>: <GoogleLogin
                    clientId= {process.env.REACT_APP_GOOGLE_LOGIN}
                    render={renderProps => (<button className="admin-main-btn2 mr40" onClick={renderProps.onClick} disabled={renderProps.disabled}>로그인</button>
                    )}
                    buttonText="Login"
                    onSuccess={responseGoogle}
                    onFailure={failLogin}
                    cookiePolicy={'single_host_origin'}
                    />
                }
            <Link to={process.env.REACT_APP_DEFAULT_URL} className="admin-main-btn1">강의 보러 가기</Link>
            </div>
            <div id="admin-left-nav">
                <img className="logo" src={process.env.REACT_APP_DEFAULT_URL+"image/black_logo.png"} alt="logo"/>
                <ul>
                    <Link to={process.env.REACT_APP_DEFAULT_URL+"admin/main"} className="admin-nav"><li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/main"? "active":""}>메인 페이지 관리</li></Link>
                    <Link to={process.env.REACT_APP_DEFAULT_URL+"admin/administrator"} className="admin-nav"><li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/administrator"? "active":""}>관리자 관리</li></Link>
                    <Link to={process.env.REACT_APP_DEFAULT_URL+"admin/instructor"} className="admin-nav"><li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/instructor"? "active":""}>강사 관리</li></Link>
                    <Link to={process.env.REACT_APP_DEFAULT_URL+"admin/users"} className="admin-nav"><li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/users"? "active":""}>사용자 관리</li></Link>
                    <Link to={process.env.REACT_APP_DEFAULT_URL+"admin/lecture"} className="admin-nav"><li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/lecture"? "active":""}>강의 관리</li></Link>
                    <Link to={process.env.REACT_APP_DEFAULT_URL+"admin/church"} className="admin-nav"><li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/church"? "active":""}>교회 관리</li></Link>
                    <ul className="admin-sub-ul">
                        <Link to={process.env.REACT_APP_DEFAULT_URL+"admin/church_temp"} className="admin-nav"><li className={props.history.location.pathname === "/admin/church_temp"? "active":""}>변경 사항</li></Link>
                    </ul>
                    <Link to={process.env.REACT_APP_DEFAULT_URL+"admin/academy_date"} className="admin-nav"><li className={props.history.location.pathname === "admin/academy_date"? "active":""}>학사일정 관리</li></Link>
                    <li>기타</li>
                    <ul className="admin-sub-ul">
                        <Link to={process.env.REACT_APP_DEFAULT_URL+"admin/contact"} className="admin-nav"><li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/contact"? "active":""}>컨택 내역 관리</li></Link>
                        <Link to={process.env.REACT_APP_DEFAULT_URL+"admin/phrase"} className="admin-nav"><li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/phrase"? "active":""}>문구 관리</li></Link>
                        <Link to={process.env.REACT_APP_DEFAULT_URL+"admin/feedback"} className="admin-nav"><li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/feedback"? "active":""}>피드백 관리</li></Link>
                        <Link to={process.env.REACT_APP_DEFAULT_URL+"admin/visit_diary"} className="admin-nav"><li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/visit_diary"? "active":""}>방문일지 관리</li></Link>
                        <Link to={process.env.REACT_APP_DEFAULT_URL+"admin/category"} className="admin-nav"><li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/category"? "active":""}>강의 주제 관리</li></Link>
                    </ul>
                    <Link to={process.env.REACT_APP_DEFAULT_URL+"admin/statistics"} className="admin-nav"><li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/statistics"? "active":""}>통계</li></Link>
                </ul>
                <div className="admin-profile">
                    <FontAwesomeIcon className="user-icon" icon={faUserCircle} /><span className="mt7">{window.sessionStorage.getItem('email') !== null? window.sessionStorage.getItem('email').split("@")[0]: null} 회원님</span>
                </div>
            </div>
            <div id="admin-navbar-mobile">
            <div onClick = {() => {switchDrawer()}}><img alt="로고" className="drawer-toggle-common" src={process.env.REACT_APP_DEFAULT_URL+"image/mobile_drawer.png"}/></div>
            <img alt="로고" width="110px" src={process.env.REACT_APP_DEFAULT_URL+"image/logo_black.png"}/>
            <div></div>
        </div>
        {
            drawerOpen !== false?
            <div className="drawer-wrapper">
                <div className="drawer-content">
                    <div className="drawer-left">
                        <ul>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL}>홈</Link></li>
                            <li className={submenuOpen === "lecture"? "active":""} onClick = {() => {setSubmenuOpen("lecture")}}>강의 보기</li>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/main"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"admin/main"}>메인 페이지 관리</Link></li>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/administrator"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"admin/administrator"}>관리자 관리</Link></li>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/instructor"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"admin/instructor"}>강사 관리</Link></li>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/users"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"admin/users"}>사용자 관리</Link></li>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/lecture"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"admin/lecture"}>강의 관리</Link></li>
                            <li className={submenuOpen === "lecture"? "active":""} onClick = {() => {setSubmenuOpen("church")}}>교회 관리</li>
                            <li className={submenuOpen === "etc"? "active":""} onClick = {() => {setSubmenuOpen("etc")}}>기타</li>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/academy_date"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"admin/academy_date"}>학사일정 관리</Link></li>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/statistics"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"admin/statistics"}>통계</Link></li>
                        </ul>
                        <ul>
                            {
                                window.sessionStorage.getItem('email') !== null?
                                <li className="login-name">{window.sessionStorage.getItem('email') !== null? window.sessionStorage.getItem('email').split("@")[0]: null} 님</li>:
                                <li className="login-name">로그인이 필요합니다.</li>
                            }
                            {loading ? null:
                                window.sessionStorage.getItem('email') && window.sessionStorage.getItem('expires_at') >= today.getTime()?    
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
                        submenuOpen === "church"? 
                        <ul>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/church"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"admin/church"}>교회 관리</Link></li>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/church_temp"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"admin/church_temp"}>변경 사항 관리</Link></li>
                        </ul>:
                        submenuOpen === "etc"? 
                        <ul>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/contact"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"admin/contact"}>컨택 내역 관리</Link></li>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/phrase"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"admin/phrase"}>문구 관리</Link></li>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/category"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"admin/category"}>강의 주제 관리</Link></li>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/feedback"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"admin/feedback"}>피드백 관리</Link></li>
                            <li className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"admin/visit_diary"? "active":""}><Link className="drawer-link" to={process.env.REACT_APP_DEFAULT_URL+"admin/visit_diary"}>방문일지 관리</Link></li>
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

export default AdminMenu;
