import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from "react-js-pagination";
import "../../../assets/css/Contact.css";
import "../../../assets/css/table.css";

import { Link } from 'react-router-dom';
import CommonCalendar from '../../modules/calendar/read_calendar';

const Contact = (props) => {
    const [contactDate, setContactDate] = useState('');
    const [contactStartDate, setContactStartDate] = useState('');
    const [contactEndDate, setContactEndDate] = useState('');
    const [contactMemo, setContactMemo] = useState('');

    const [applicationInfo, setapplicationInfo] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [clickComplete, setClickComplete] = useState(null);
    const [calendarInfo, setcalendarInfo] = useState(null)
    const [page, setPage] = useState(1);
    // eslint-disable-next-line no-unused-vars
    const [postsPerPage, setpostsPerPage] = useState(10);
    const [settingInfo, setsettingInfo] = useState(null);

    useEffect(() => {
        let today = new Date();

        let year = today.getFullYear(); // 년도
        let month = today.getMonth() + 1;  // 월
        if(month<10)
            month="0"+month
        var date = year+"-"+month;

        readApplicationForms();
        readMainCalendar(date);
        readSettingInfo();
        // alert(window.location.href.replace(process.env.REACT_APP_DEFAULT_WHOLE_URL, "/"));
    }, []);


    const readSettingInfo = async () => {
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'setting', {
                params: {
                    token: window.sessionStorage.getItem('token'),
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        setsettingInfo(response.data)        
    }

    const readApplicationForms = async() => {
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'application/read', {
                params: {
                    user_id: window.sessionStorage.getItem('id'),
                    token: window.sessionStorage.getItem('token') ,
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );

        setapplicationInfo(response.data);
    }

    const finishContact = async() => {
        if(window.confirm("날짜를 확정하시겠습니까?")) {
            axios(
                {
                    url: process.env.REACT_APP_RESTAPI_HOST+'application/complete',
                    method: 'put',
                    data: {
                        selectDate: contactDate,
                        contact_start_date: contactStartDate,
                        contact_end_date: contactEndDate,
                        contact_memo: contactMemo,
                        application_form_id: selectedContact.id,
                        lecture_id: selectedContact.lecture_id,
                        status: 2,
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            ).then(function(res) {
                readApplicationForms()
                alert("컨택이 완료되었습니다.")
                setSelectedContact(null)
                setClickComplete(null)
            })
        }
        
    }

    const readMainCalendar = async(date) => {
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'calendar/main', {
                params: {
                    date: date,
                    user_id: window.sessionStorage.getItem('id'),
                    token: window.sessionStorage.getItem('token'),
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        setcalendarInfo(response.data)
    }


    const contactStart = async (status) => {
        if(window.confirm("신청자와 컨택을 시작하시겠습니까?")) {
            axios(
                {
                    url: process.env.REACT_APP_RESTAPI_HOST+'application/status',
                    method: 'put',
                    data: {
                        application_form_id: selectedContact.id,
                        status: status,
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            ).then(function(res) {
                readApplicationForms();
                setSelectedContact({
                    ...selectedContact,
                    status: status
                })
            })
        }
        
    }

    const completeContact = async()=> {
        if(!clickComplete)
            setClickComplete(1);
        else
            setClickComplete(null);
    }

    const cancelContact = async() => {
        if(window.confirm("컨택을 취소하시겠습니까?")) {
            axios(
                {
                    url: process.env.REACT_APP_RESTAPI_HOST+'application/status',
                    method: 'put',
                    data: {
                        application_form_id: selectedContact.id,
                        status: -1,
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            ).then(function(res) {
                readApplicationForms();
                setSelectedContact({
                    ...selectedContact,
                    status: -1
                })
                alert("컨택이 취소되었습니다.")
            })
            
        }
    }

    // const contactEditDate = () => {
    //     if(!clickComplete)
    //         setClickComplete(1);
    //     else
    //         setClickComplete(null);
    // }


    function clickContact(application) {
        if(selectedContact === null || application !== selectedContact) {
            if(application.date === null)   setContactDate("")
            else setContactDate(application.date)
            if(application.contact_start_date === null)   setContactStartDate("")
            else setContactStartDate(application.contact_start_date)
            if(application.contact_end_date === null)   setContactEndDate("")
            else setContactEndDate(application.contact_end_date)
            if(application.memo === null)   setContactMemo("")
            else setContactMemo(application.memo)
              
            setSelectedContact(application);
            setClickComplete(null)
        }
        else
            setSelectedContact(null);
    }

    const backBtnClick = () => {
        setClickComplete(null)
        if(selectedContact.date === null)   setContactDate("")
        else setContactDate(selectedContact.date)
        if(selectedContact.contact_start_date === null)   setContactStartDate("")
        else setContactStartDate(selectedContact.contact_start_date)
        if(selectedContact.contact_end_date === null)   setContactEndDate("")
        else setContactEndDate(selectedContact.contact_end_date)
        if(selectedContact.memo === null)   setContactMemo("")
        else setContactMemo(selectedContact.memo)
            
    }

    const handlePageChange = (page) => { 
        setPage(page); 
    };

    function currentPosts(tmp) {
        var indexOfLast = page * postsPerPage;
        var indexOfFirst = indexOfLast - postsPerPage;

        let currentPosts = 0;
        currentPosts = applicationInfo.slice(indexOfFirst, indexOfLast);
        return currentPosts;
    }

    return (
        <div>
            <div className="mypage-image">
                <img className="page-background" src={process.env.REACT_APP_DEFAULT_URL+'image/application.jpeg'} alt="lecture page" />
                <div className="page-info">
                    <h2>마이페이지</h2>
                    <p style={{color:'black'}}>
                        {settingInfo !== null ?
                        settingInfo.find(element => element.key === "mypage_contact_phrase").value.split("<br/>").map( (item, i) => <div key={i}>{item}</div>) :
                        ""
                        }
                    </p>
                </div>
            </div>
            <div className="inst-title-header">
                <h2 style={{color:'white'}}>마이페이지</h2>
                <p>
                    {settingInfo !== null ?
                    settingInfo.find(element => element.key === "mypage_contact_phrase").value.split("<br/>").map( (item, i) => <div key={i}>{item}</div>) :
                    ""
                    }
                </p>
            </div>
            <div className="content-wrapper">
                <div className="left-navbar">
                    <span>
                        <Link className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"mypage/profile"? "left-active":""} to={process.env.REACT_APP_DEFAULT_URL+"mypage/profile"}>내 프로필</Link>
                    </span>
                    <span>
                        <Link className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"mypage/lecture"? "left-active":""} to={process.env.REACT_APP_DEFAULT_URL+"mypage/lecture"}>내 강의함</Link>
                    </span>
                    <span>
                        <Link className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"mypage/contact"? "left-active":""} to={process.env.REACT_APP_DEFAULT_URL+"mypage/contact"}>컨택 일정</Link>
                    </span>
                    <span>
                    <Link className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"mypage/visitlog"? "left-active":""} to={process.env.REACT_APP_DEFAULT_URL+"mypage/visitlog"}>방문일지</Link>
                    </span>
                </div>
                <div className="right-content">
                    <CommonCalendar readMainCalendar={readMainCalendar} calendarData={calendarInfo} path={window.location.href.replace(process.env.REACT_APP_DEFAULT_WHOLE_URL, "/")}/>
                    <div className="mt20 table-wrapper">
                        <div className="table-row-contact">
                            <div className="th contact-index"></div>
                            <div className="th">교회명</div>
                            <div className="th">강의명</div>
                            <div className="th contact-date">희망 날짜</div>
                            <div className="th">진행 상황</div>
                        </div>
                        { applicationInfo !== null && applicationInfo.length > 0 ?
                            currentPosts(applicationInfo).map((data, index) => 
                                <div key={index} className={selectedContact !== null && selectedContact.id === data.id ? "click-inst-row table-row-contact" : "table-row-contact"} onClick = {() => {clickContact(data)}}>
                                    <div className="td">{(index+1)+((page-1)*postsPerPage)}</div>
                                    <div className="td">{data.church_name}</div>
                                    <div className="td">{data.lecture_name}</div>
                                    <div className="td location">{data.date !== null? data.date: "추후협의"}</div>
                                    {data.status === 0 ?
                                        <div className="td"><span className="contact-ing" style={{color:'#ff0000b8', border:'1px solid #ff0000b8'}}>신규(미확인)</span></div>
                                        : data.status === 1 ?
                                        <div className="td"><span className="contact-ing">진행중</span></div>
                                        : data.isVisiting > 0 ?
                                        <div className="td contact-ok">강의완료</div>
                                        : data.status === 2 ?
                                        <div className="td contact-ok">일정확정됨</div>:
                                        <div className="td contact-cancel">취소됨</div>
                                    }
                                </div>
                            )
                            :
                            <div className="no-content">신청서가 없습니다.</div>
                        }
                    </div>
                    <Pagination 
                        activePage={page} 
                        itemsCountPerPage={postsPerPage} 
                        totalItemsCount={applicationInfo !== null ? applicationInfo.length : 0} 
                        pageRangeDisplayed={5} 
                        prevPageText={"‹"} 
                        nextPageText={"›"} 
                        onChange={handlePageChange} 
                    />


                    {selectedContact ?
                    <div
                        className={selectedContact ? "show-lecture-detail" : "no-detail"}
                    >
                        <h2 className="mb20">{selectedContact.lecture_name}</h2>
                        <hr className="bold-hr mb25"/>
                        {selectedContact.status !== 0 &&
                        <div className="mb8">
                            <span className="form-title">신청자 이메일</span>
                            <span>{selectedContact.user_email}</span>
                            <hr className="m20"/>
                        </div>
                        }
                        <div className="mb8" style={{fontWeight:'bold'}}>
                            <span className="form-title">교회명</span>
                            <span>{selectedContact.church_name}</span>
                        </div>
                        <div className="mb8">
                            <span className="form-title">주소</span>
                            <span>{selectedContact.addr1}</span>
                        </div>
                        {selectedContact.status !== 0 &&
                        <span>
                            <div className="mb8">
                                <span className="form-title">대표 연락처</span>
                                <span>{selectedContact.phone}</span>
                            </div>
                            <div>
                                <span className="form-title">대표 이메일</span>
                                <span>{selectedContact.email}</span>
                            </div>
                        </span>
                        }
                        <hr className="m20"/>
                        {selectedContact.status !== 0 &&
                        <span>
                            <div className="mb8" style={{fontWeight:'bold'}}>
                                <span className="form-title">담당자 이름</span>
                                <span>{selectedContact.admin_name}</span>
                            </div>
                            <div style={{fontWeight:'bold'}}>
                                <span className="form-title" >담당자 연락처</span>
                                <span>{selectedContact.admin_phone}</span>
                            </div>
                            <hr className="m20"/>
                        </span>
                        }
                        <div className="mb8">
                            <span className="form-title">강의 대상</span>
                            <span>{selectedContact.attendee_target}</span>
                        </div>
                        <div className="mb8">
                            <span className="form-title">청강자 수</span>
                            <span>{selectedContact.attendee_number}</span>
                        </div>
                        <div className="mb8">
                            <span className="form-title">원하는 날짜</span>
                            {clickComplete ? <input className="form-input" name="date" type="date" value={contactDate} onChange={(e)=>setContactDate(e.target.value)}/> : <span>{selectedContact.date !== null? selectedContact.date:"추후협의"}</span>}
                        </div>
                        <div className="mb35">
                            <span className="form-title">원하는 시간대</span>
                            {clickComplete ?
                            <span><input className="form-input" type="time" value={contactStartDate} onChange={(e)=>setContactStartDate(e.target.value)}/> ~ <input className="form-input" type="time" value={contactEndDate} onChange={(e)=>setContactEndDate(e.target.value)}/></span> 
                            :selectedContact.status === 2 ?
                            <span>{selectedContact.contact_start_date} ~ {selectedContact.contact_end_date}</span>    
                            :selectedContact.date !== null? 
                            <span>{selectedContact.timezone}</span>:
                            "추후 협의"
                            }
                        </div>
                        
                        {/* {selectedContact.date !== null? 
                            <div className="mb35">
                            <span className="form-title">원하는 시간대</span>
                            {clickComplete ? 
                            
                            :selectedContact.status === 2 ?
                            <span>{selectedContact.contact_start_date} ~ {selectedContact.contact_end_date}</span>    
                            :<span>{selectedContact.timezone}</span>}
                        </div>:null
                        } */}
                        <hr className="bold-hr mb35"/>
                        <div className="mb25 form-grid">
                            <span className="form-title">요청사항</span>
                            {clickComplete ? <span><textarea className="form-textarea" type="date" value={contactMemo.replaceAll("<br/>", "\n")} onChange={(e)=>setContactMemo(e.target.value)}/></span> : <span>{selectedContact.memo.split("<br/>").map( (item, i) => <div key={i}>{item}</div>)}</span>}
                        </div>
                        {/* <Link to="/application" className="go-form">컨택 진행하기</Link> */}
                        {/* {clickComplete ?
                        <div className="form-btn-wrapper">
                            <button className="form-btn mr15" onClick={()=>setClickComplete(null)}>뒤로가기</button>
                            <button className="form-btn" onClick={finishContact}>컨택 내용 저장</button>
                        </div>
                        :
                        <div className="form-btn-wrapper">
                            <button className="form-btn mr15" onClick={cancelContact}>컨택 취소하기</button>
                            <button className="form-btn" onClick={completeContact}>컨택 수락하기</button>
                        </div>} */}
                        {selectedContact.status === 0 ?
                        <div className="form-btn-wrapper">
                            <button className="form-btn mr15" onClick= {() => {contactStart(1)}}>연락처 확인하기</button>
                            {/* <button className="form-btn" onClick={cancelContact}>컨택 취소하기</button> */}
                        </div>
                        :selectedContact.status === -1 ?
                        <div></div>
                        :selectedContact.status === 2 && clickComplete ?
                        <div className="form-btn-wrapper">
                            <button className="form-btn mr15" onClick= {finishContact}>날짜 수정 완료</button>
                            <button className="form-btn" onClick= {() => {backBtnClick()}}>뒤로가기</button>
                        </div>
                        :selectedContact.status === 2 ?
                        <div className="form-btn-wrapper">
                            <button className="form-btn mr15" onClick= {completeContact}>날짜 수정하기</button>
                            <button className="form-btn" onClick={cancelContact}>컨택 취소하기</button>
                        </div>
                        :selectedContact.status === 1 && clickComplete ?
                        <div className="form-btn-wrapper">
                            <button className="form-btn mr15" onClick={finishContact}>컨택 내용 저장하기</button>
                            <button className="form-btn" onClick= {() => {backBtnClick()}}>뒤로가기</button>
                        </div>
                        :
                        <div className="form-btn-wrapper">
                            <button className="form-btn mr15" onClick={completeContact}>날짜 확정하기</button>
                            <button className="form-btn" onClick={cancelContact}>컨택 취소하기</button>
                        </div>
                        }
                    </div>
                    :
                    null
                    }
                </div>

            </div>
        </div>
    )
}

export default Contact;
