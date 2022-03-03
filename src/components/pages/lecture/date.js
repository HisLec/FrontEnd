import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from '../../modules/calendar/lecture_daily_calendar';
import DetailCalendar from '../../modules/calendar/read_calendar';
import ContentPagination from "react-js-pagination";
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import ReactLoading from "react-loading";

import "../../../assets/css/layout.css";
import "../../../assets/css/lecture.css";
import '../../../assets/css/table.css';
import '../../../assets/css/feedback.css';

function LectureDate(prop) {
    const [selectedLecture, setSelectedLecture] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [selectedInst, setSelectedInst] = useState(null);
    const [selectedFeedback, setSelectedFeedback] = useState(null)
    const [calendarInfo, setcalendarInfo] = useState(null)
    const [page, setPage] = useState(1);
    // eslint-disable-next-line no-unused-vars
    const [feedbackPage, setfeedbackPage] = useState(1);
    // eslint-disable-next-line no-unused-vars
    const [feedbackPostsPerPage, setfeedbackPostsPerPage] = useState(10);
    const [lectureInfo, setlectureInfo] = useState(null);
    const [lectureLoading, setlectureLoading] = useState(true);
    const [calendarInfoByLecture, setcalendarInfoByLecture] = useState(null);

    // eslint-disable-next-line no-unused-vars
    const [postsPerPage, setpostsPerPage] = useState(10);
    // const [lectureData, setlectureData] = useState(null); // read할때 사용할 변수
    const [feedbackInfo, setfeedbackInfo] = useState(null);

    const [feedbackFile, setFeedbackFile] = useState(null);
    const [feedbackFileLoading, setFeedbackFileLoading] = useState(false);

    const [settingInfo, setsettingInfo] = useState(null);

    const today = new Date();

    useEffect(() => {
        let today = new Date();

        let year = today.getFullYear(); // 년도
        let month = today.getMonth() + 1;  // 월
        if(month<10)
            month="0"+month
        var date = year+"-"+month;

        readMainCalendar(date)
        readFeedback();
        readLecture("");
        readSettingInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    useEffect(() => {
        setSelectedLecture(null);
    }, [page])

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

    const readMainCalendar = async(date) => {
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'calendar/main',{
                params:{
                    date: date,
                    token: window.sessionStorage.getItem('token'),
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        setcalendarInfo(response.data)
    }

    const readCalendarByLecture = async(date, id) => {
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'calendar/lecture', {
                params: {
                    date: date,
                    lecture_id: id,
                    token: window.sessionStorage.getItem('token'),
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        setcalendarInfoByLecture(response.data)
    }

    const readLecture = async(date) => {
        setlectureLoading(true);
        if(date === "") {
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'lecture/date/empty', {
                    params: {
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );
            setlectureInfo(response.data);
            readFeedbackFile(null);
        } else {
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'lecture/date/'+date, {
                    params: {
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );
            setlectureInfo(response.data);
            readFeedbackFile(date);
        }
        setlectureLoading(false);
    }

    const readFeedback = async () => {
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'visiting_log/feedback/instructor', {
                params: {
                    token: window.sessionStorage.getItem('token'),
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        setfeedbackInfo(response.data);
    }


    function feedbackClick(fb) {
        if(selectedFeedback === null)
            setSelectedFeedback(fb)
        else
            setSelectedFeedback(null)
    }

    function clickLecture(data) {
        if (selectedLecture === null || selectedLecture !== data) {
            let today = new Date();
            let year = today.getFullYear();
            let month = today.getMonth() + 1;
            if(month<10)
                month="0"+month
            var date = year+"-"+month;

            setSelectedLecture(data);
            readCalendarByLecture(date, data.id);
            readFeedbackFileByLecture(data.id);
        }
        else
            setSelectedLecture(null);
    }

    // function clickInstructor(e) {
    //     if (selectedInst === null || e.target.attributes.getNamedItem('value').value != selectedInst)
    //         setSelectedInst(e.target.attributes.getNamedItem('value').value);
    //     else
    //         setSelectedInst(null);
    // }

    const handlePageChange = (page) => {
        setPage(page);
    };

    function currentPosts(tmp) {
        var indexOfLast = page * postsPerPage;
        var indexOfFirst = indexOfLast - postsPerPage;

        let currentPosts = 0;
        currentPosts = lectureInfo.slice(indexOfFirst, indexOfLast);
        return currentPosts;
    }

    function feedbackCurrentPosts(tmp) {
        var indexOfLast = page * postsPerPage;
        var indexOfFirst = indexOfLast - postsPerPage;

        let currentPosts = 0;
        currentPosts = feedbackInfo.slice(indexOfFirst, indexOfLast);
        return currentPosts;
    }

    function applicationCheck () {
        if(window.sessionStorage.getItem('token') !== null && window.sessionStorage.getItem('expires_at') >= today.getTime()){
            alert("사용자 권한으로만 사용할 수 있는 기능입니다.");
        }else{
            alert("로그인 후 사용하실 수 있는 기능입니다. 상단에 로그인 버튼을 눌러주세요.");
        }
    }

    const readFeedbackFile = async (date) => {
        setFeedbackFileLoading(true);

        var categoryData = [];

        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'visiting_log/feedback/file/date', {
                params: {
                    instructor_id: selectedInst,
                    token: window.sessionStorage.getItem('token'),
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );

        for(var i=0; i < response.data.length; i+= 4){
            var dataUnit = [];
            for(var j=i; j<i+4 && j< response.data.length; j++){
                dataUnit.push(response.data[j]);
            }
            categoryData.push(dataUnit);
        }

        setFeedbackFile(categoryData);
        setFeedbackFileLoading(false);
    }

    const readFeedbackFileByLecture = async (id) => {
        setFeedbackFileLoading(true);

        var categoryData = [];

        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'visiting_log/feedback/file/lecture', {
                params: {
                    lecture_id: id,
                    token: window.sessionStorage.getItem('token'),
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );

        for(var i=0; i < response.data.length; i+= 4){
            var dataUnit = [];
            for(var j=i; j<i+4 && j< response.data.length; j++){
                dataUnit.push(response.data[j]);
            }
            categoryData.push(dataUnit);
        }

        setFeedbackFile(categoryData);
        setFeedbackFileLoading(false);
    }

    return (
        <div>
            <div className="main-image">
                <img className="page-background" src={process.env.REACT_APP_DEFAULT_URL+"image/lecture_page_daily.jpeg"} alt="lecture page"
                onError={(e) => {
                    e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage.jpeg';
                }}/>
                <div className="page-info">
                    <h2 className="white_color">강의 둘러보기</h2>
                    <p>
                        {settingInfo !== null ?
                        settingInfo.find(element => element.key === "lecture_page_phrase").value.split("<br/>").map( (item, i) => <div key={i}>{item}</div>) :
                        ""
                        }
                    </p>
                </div>
            </div>
            <div className="content-wrapper">
            <div className="left-navbar">
                <span>
                    <Link className="sub-title" to={process.env.REACT_APP_DEFAULT_URL+"lecture/subject"}>주제별</Link>
                </span>
                <span>
                    <Link className="sub-title" to={process.env.REACT_APP_DEFAULT_URL+"lecture/instructor"}>강사별</Link>
                </span>
                <span>
                    <Link className="sub-title active" to={process.env.REACT_APP_DEFAULT_URL+"lecture/date"}>일자별</Link>
                </span>
            </div>
            <div className="right-content">
            <div className="ml25">
                <Calendar readLecture={readLecture} readMainCalendar={readMainCalendar} calendarData={calendarInfo} path={window.location.href.replace(process.env.REACT_APP_DEFAULT_WHOLE_URL, "/")}/>
            </div>

            <div className="table-wrapper">
                <div className="subject-table-row">
                    <div className="th">강사명</div>
                    <div className="th">강의명</div>
                    <div className="th date">기간</div>
                    <div className="th location">강의 지역</div>
                </div>
                {lectureLoading === false && lectureInfo !== null && lectureInfo.length > 0 ?
                currentPosts(lectureInfo).map((data, index) => (
                    <div key={index} className={selectedLecture === data ? "subject-table-row selected-subject": "subject-table-row"} onClick = {() => {clickLecture(data)}}>
                        <div className="td">{data.instructor_name}</div>
                        <div className="td">{data.name}</div>
                        <div className="td date">{data.date !== null && data.date.length !== 0? data.date: "추후 협의"}</div>
                        <div className="td location">{data.region}</div>
                    </div>
                )):
                lectureLoading === true?
                <div className="lecture-loading"><ReactLoading type="spin" color="rgb(5 88 156 / 47%)" className="lecture-loading-data" width="50px"/></div>:
                <div className="lecture-no-data">선택하신 날짜에 강의가 없습니다.</div>
                }
            </div>
            <ContentPagination
                activePage={page}
                itemsCountPerPage={postsPerPage}
                totalItemsCount={lectureInfo !== null ? lectureInfo.length : 0}
                pageRangeDisplayed={5}
                prevPageText={"‹"}
                nextPageText={"›"}
                onChange={handlePageChange}
            />

            {selectedLecture !== null?
                <div className="show-daily-detail">
                    <div className="detail-title">
                        <h2>{selectedLecture.name}</h2>
                        <span>{selectedLecture.instructor_name}</span>
                        <span className="lecture-detail-date">강의가능기간: {selectedLecture.date !== null && selectedLecture.date.length !== 0? selectedLecture.date: "추후 협의"}</span>
                    </div>
                    <div className="detail-content">
                        <div className="detail-sub-info">
                            <span>강의 가능 지역</span>
                            <span>: {selectedLecture.region} </span>
                            <span>강의 주제 카테고리</span>
                            <span>: {selectedLecture.topic} </span>
                            {selectedLecture.sample_url !== null && selectedLecture.sample_url !== "null" && selectedLecture.sample_url !== "" ?<span>샘플강의보기</span>:null}
                            {selectedLecture.sample_url !== null && selectedLecture.sample_url !== "null" && selectedLecture.sample_url !== "" ? <span>: <a href={selectedLecture.sample_url}>{selectedLecture.sample_url}</a></span>:null}
                        </div>
                        <p>
                            {selectedLecture.intro !== null && selectedLecture.intro !== "null" && selectedLecture.intro !== ""? selectedLecture.intro.split("<br/>").map( (item, i) => <div key={i}>{item}</div>):""}
                        </p>

                        <div className="detail-instructor">
                            <img className="detail-inst-image" src={process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+selectedLecture.instructor_image} alt="lecture page" />
                            <div className="detail-inst-info mb30">
                                <h3 className="mb15">{selectedLecture.instructor_name} {selectedLecture.instructor_position}</h3>
                                <p className="mb15 fs13">
                                {selectedLecture.instructor_intro !== null ? selectedLecture.instructor_intro.split("\n").map( (item, i) => <div key={i}>{item}</div>):""}
                                </p>
                                <p className="fs13">
                                {selectedLecture.instructor_memo !== null ? selectedLecture.instructor_memo.split("\n").map( (item, i) => <div key={i}>{item}</div>):""}
                                </p>
                            </div>
                        </div>
                        {
                            selectedLecture.date !== null && selectedLecture.date.length !== 0?
                                <DetailCalendar readMainCalendar={readCalendarByLecture} calendarData={calendarInfoByLecture} path="/lecture/subject" clickedLecture={selectedLecture}/>
                                :null

                        }
                        {
                            window.sessionStorage.getItem('token') !== null && parseInt(window.sessionStorage.getItem("status")) === 0 && window.sessionStorage.getItem('expires_at') >= today.getTime()?
                            <Link
                            to={{
                                pathname: process.env.REACT_APP_DEFAULT_URL+"lecture/application",
                                state: {
                                    lecture: selectedLecture
                                }
                            }}
                            className="mt20 go-form"
                            >신청 하러 가기</Link>:
                            <Link onClick={applicationCheck} className="mt20 go-form">신청 하러 가기</Link>
                        }
                    </div>

                </div>:null
            }

            <div className="feedback-wrapper">
                <h2 className="main-title mb30">강의 후기({feedbackInfo !== null ? feedbackInfo.length : 0})</h2>
                <Swiper
                            spaceBetween={30}
                            effect={'fade'}
                            centeredSlides={true}
                            loop={true} loopFillGroupWithBlank={true}
                            pagination={{
                                "clickable": true
                            }}
                            navigation={true}
                            className="mySwiper">
                                {feedbackFileLoading === false && feedbackFile !== null?
                                    feedbackFile.map((data, index) => (
                                        <SwiperSlide key = {index}>
                                            <div className="feedback-gallery">
                                                {data.map((dataUnit, index2) => (
                                                    <img key={index2} className="" src={process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+dataUnit} alt="lecture page" 
                                                    onError={(e) => {
                                                        e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage2.png';
                                                    }}/>
                                                ))}
                                            </div>
                                        </SwiperSlide>
                                    ))
                                    : feedbackFileLoading === false?
                                    null:
                                    <ReactLoading type="spin" color="#05589c" />
                                }
                </Swiper>
                <div className="feedback-table">
                    { feedbackInfo !== null && feedbackInfo.length !== 0?
                        feedbackCurrentPosts(feedbackInfo).map((feedback, index) =>
                        <div key={feedback.id} className="feedback-row" onClick = {() => {feedbackClick(feedback.id)}}>
                            <span className="feedback-title feedback-info mr15">{feedback.lecture_name} _ {feedback.instructor_name} {feedback.position_name}</span>
                            <span className="feedback-info mr15">작성자명: {feedback.church_name}</span>
                            <div className="mb10">
                                <span className="mr15">강사 
                                {
                                    [1, 2, 3, 4, 5].map((data, index) =>
                                        <img key={index} style={{marginBottom:0, marginTop:'-3px'}} className="rating_star" src={data <= feedback.lecture_star? process.env.REACT_APP_DEFAULT_URL+'image/yellow_star.png': process.env.REACT_APP_DEFAULT_URL+'image/white_star.png'} alt="white_star"/>
                                    )
                                }
                                </span>

                                <span>강의 
                                {
                                    [1, 2, 3, 4, 5].map((data, index) =>
                                        <img key={index} style={{marginBottom:0, marginTop:'-3px'}} className="rating_star" src={data <= feedback.instructor_star? process.env.REACT_APP_DEFAULT_URL+'image/yellow_star.png': process.env.REACT_APP_DEFAULT_URL+'image/white_star.png'} alt="white_star"/>
                                    )
                                }
                                </span>
                            </div>
                            <p className={selectedFeedback === feedback.id ? "feedback-full-content" : "feedback-content"}>{feedback.content}</p>
                        </div>
                        )
                        :
                        <div className="no-content">피드백이 없습니다.</div>
                    }
                </div>
                <ContentPagination
                    activePage={feedbackPage}
                    itemsCountPerPage={feedbackPostsPerPage}
                    totalItemsCount={feedbackInfo !== null ? feedbackInfo.length : 0}
                    pageRangeDisplayed={5}
                    prevPageText={"‹"}
                    nextPageText={"›"}
                    onChange={handlePageChange}
                />
            </div>
        </div>
            </div>
        </div>
    );
}

export default LectureDate;
