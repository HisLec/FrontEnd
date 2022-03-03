import React, { useState, useEffect} from 'react';
import ContentPagination from "react-js-pagination";
import Calendar from '../../modules/calendar/read_calendar';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import axios from 'axios';
import ReactLoading from "react-loading";
// import SwiperCore, {
//     EffectFade, Autoplay, Navigation, Pagination
//   } from 'swiper/core';

  import "swiper/swiper.min.css";
  import "swiper/components/effect-fade/effect-fade.min.css"
  import "swiper/components/navigation/navigation.min.css"
  import "swiper/components/pagination/pagination.min.css"

import "../../../assets/css/layout.css";
import "../../../assets/css/lecture.css";
import '../../../assets/css/table.css';
import '../../../assets/css/feedback.css';

function LectureSubject(props) {
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [categoryData, setCategoryData] = useState(null);
    const [selectedCategoryData, setSelectedCategoryData] = useState([]);
    const [categoryLoading, setCategoryLoading] = useState(null);
    const [lectureLoading, setLectureLoading] = useState(null);
    const [lectureData, setLectureData] = useState(null);
    const [lectureDetail, setLectureDetail] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [lectureDetailLoading, setLectureDetailLoading] = useState(null);
    const [calendarInfo, setcalendarInfo] = useState(null)
    const [clickedLecture, setclickedLecture] = useState(null)
    const [page, setPage] = useState(1);
    // eslint-disable-next-line no-unused-vars
    const [postsPerPage, setpostsPerPage] = useState(10);
    // eslint-disable-next-line no-unused-vars
    const [feedbackPage, setfeedbackPage] = useState(1);
    // eslint-disable-next-line no-unused-vars
    const [feedbackPostsPerPage, setfeedbackPostsPerPage] = useState(10);
    const [feedbackInfo, setfeedbackInfo] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [avgLectureStar, setavgLectureStar] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const [avgInstructorStar, setavgInstructorStar] = useState(0);
    const [feedbackFile, setFeedbackFile] = useState(null);
    const [feedbackFileLoading, setFeedbackFileLoading] = useState(false);
    // const [academyDates, setacademyDates] = useState(null);
    const [settingInfo, setsettingInfo] = useState(null);

    const today = new Date();


    const readSettingInfo = async () => {
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'setting', {
                params: {
                    token: window.sessionStorage.getItem('token') ,
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        setsettingInfo(response.data)

    }

    function feedbackClick(fb) {
        if(selectedFeedback === null)
            setSelectedFeedback(fb)
        else
            setSelectedFeedback(null)
    }

    function lectureClick(id, lecture) {
        setclickedLecture(lecture);
        setcalendarInfo(null)
        readLectureDetail(lecture.id);

        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        if(month<10)
            month="0"+month
        var date = year+"-"+month;

        if (selectedLecture === id) {
            readFeedback();
            setSelectedLecture(null);
        }
        else{
            setSelectedLecture(id);
            readFeedbackByLecture(lecture.id);
            readMainCalendar(date, lecture.id)
        }
    }

    const readFeedback = async () => {
        var subject = "";
        var isSubjectNull = false;
        for(var i=0; i< selectedCategoryData.length; i++){
            if(selectedCategoryData[i] === true){
                subject += categoryData[parseInt(i/8)][i-(8*parseInt(i/8))].id;
                subject += ",";
                isSubjectNull = true;
            }
        }
        if(isSubjectNull) {
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'visiting_log/feedback/topic', {
                    params: {
                        topic: subject,
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );
            setfeedbackInfo(response.data);
        } else {
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'visiting_log/feedback/topic', {
                    params: {
                        token: window.sessionStorage.getItem('token') ,
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );
            setfeedbackInfo(response.data);
        }
    }

    const readFeedbackFile = async () => {
        setFeedbackFileLoading(true);

        var subject = "";
        var isSubjectNull = false;
        for(var i=0; i< selectedCategoryData.length; i++){
            if(selectedCategoryData[i] === true){
                subject += categoryData[parseInt(i/8)][i-(8*parseInt(i/8))].id;
                subject += ",";
                isSubjectNull = true;
            }
        }
        var feedbackImage = [];
        var dataUnit = [];
        if(isSubjectNull) {
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'visiting_log/feedback/file/topic', {
                    params: {
                        topic: subject,
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );

            // eslint-disable-next-line no-redeclare
            for(let i=0; i < response.data.length; i+= 4){
                dataUnit = [];
                for(var j=i; j<i+4 && j< response.data.length; j++){
                    dataUnit.push(response.data[j]);
                }
                feedbackImage.push(dataUnit);
            }
        } else {
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'visiting_log/feedback/file/topic', {
                    params: {
                        token: window.sessionStorage.getItem('token') ,
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );

            for(let i=0; i < response.data.length; i+= 4){
                dataUnit = [];
                // eslint-disable-next-line no-redeclare
                for(var j=i; j<i+4 && j< response.data.length; j++){
                    dataUnit.push(response.data[j]);
                }
                feedbackImage.push(dataUnit);
            }
        }

        setFeedbackFile(feedbackImage);
            setFeedbackFileLoading(false);
    }


    const readFeedbackByLecture = async (lecture_id) => {
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'visiting_log/feedback/lecture', {
                params: {
                    lecture_id: lecture_id,
                    token: window.sessionStorage.getItem('token'),
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        setfeedbackInfo(response.data);
        var lecture_star = 0;
        var instructor_star = 0;
        if(response.data.length > 0) {
            response.data.forEach(data => {
                lecture_star += data.lecture_star;
                instructor_star += data.instructor_star;
            });
            lecture_star /= response.data.length;
            instructor_star /= response.data.length;
        }
        setavgLectureStar(Math.round(lecture_star * 100) / 100);
        setavgInstructorStar(Math.round(instructor_star * 100) / 100);
    }

    const readLectureDetail = async (id) => {
        setLectureDetailLoading(true);
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'lecture/detail/' + id, {
                params: {
                    token: window.sessionStorage.getItem('token') ,
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        setLectureDetail(response.data);
        setLectureDetailLoading(false);
    }

    const readCategory = async () => {
        setCategoryLoading(true);
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'lecture/category', {
                params: {
                    token: window.sessionStorage.getItem('token') ,
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        var categoryData = [];

        for(var i=0; i < response.data.length; i+= 8){
            var dataUnit = [];
            for(var j=i; j<i+8 && j< response.data.length; j++){
                dataUnit.push(response.data[j]);
            }
            categoryData.push(dataUnit);
        }
        setSelectedCategoryData(Array(response.data.length).fill(false));
        setCategoryData(categoryData);

        setCategoryLoading(false);
    }

    function selectCategory (topic) {
        let newArr = selectedCategoryData.map((item, index) => {
            if (topic === index) {
                return !item;
            } else {
                return item;
            }
        });
        setSelectedCategoryData(newArr);
    }

    const readMainCalendar = async(date, id) => {
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
        setcalendarInfo(response.data)
    }

    const readLecture = async () => {
        setLectureLoading(true);
        setSelectedLecture(null);
        var subject = "";
        var isSubjectNull = false;
        for(var i=0; i< selectedCategoryData.length; i++){
            if(selectedCategoryData[i] === true){
                subject += categoryData[parseInt(i/8)][i-(8*parseInt(i/8))].id;
                subject += ",";
                isSubjectNull = true;
            }
        }
        if(isSubjectNull) {

            subject = subject.slice(0, -1);
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'lecture/subject',
                {
                    params: {
                        subject: subject,
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );
            setLectureData(response.data);

            setLectureLoading(false);
        }else{
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'lecture/subject', {
                    params: {
                        token: window.sessionStorage.getItem('token') ,
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );
            setLectureData(response.data);

            setLectureLoading(false);
        }
    }

    useEffect(() => {
        readCategory();
        readLecture();
        readFeedback();
        readFeedbackFile();
        readSettingInfo();
        document.getElementsByClassName("swiper-button-next")[0].click();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        readLecture();
        readFeedback();
        readFeedbackFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategoryData]);

    useEffect(() => {
        setSelectedLecture(null);
    }, [page])

    const handlePageChange = (page) => {
        setPage(page);
    };

    function currentPosts(tmp) {
        var indexOfLast = page * postsPerPage;
        var indexOfFirst = indexOfLast - postsPerPage;

        let currentPosts = 0;
        currentPosts = lectureData.slice(indexOfFirst, indexOfLast);
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


    return (
        <div>
            <div className="main-image">
                <img className="page-background" src={process.env.REACT_APP_DEFAULT_URL+'image/lecture_page_subject.jpg'} alt="lecture page" />
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
                        <Link className="sub-title active" to={process.env.REACT_APP_DEFAULT_URL+"lecture/subject"}>주제별</Link>
                    </span>
                    <span>
                        <Link className="sub-title" to={process.env.REACT_APP_DEFAULT_URL+"lecture/instructor"}>강사별</Link>
                    </span>
                    <span>
                        <Link className="sub-title" to={process.env.REACT_APP_DEFAULT_URL+"lecture/date"}>일자별</Link>
                    </span>
                </div>
                <div className="right-content">
                    <div className="subject-carousel">
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
                        {categoryLoading === false ?
                    categoryData.map((data, index) => (
                        <SwiperSlide key = {index}>
                            <div className="subject-wrapper">
                                {data.map((dataUnit, index2) => (
                                    <div key={index2} className={selectedCategoryData[(index*8)+index2] === false? "subject ": "subject selected-subject"} onClick = {() => {selectCategory((index*8)+index2)}}>{dataUnit.name}</div>
                                ))}
                            </div>
                        </SwiperSlide>
                    ))
                    : <ReactLoading type="spin" color="#05589c" />
                }
                    </Swiper>
                    </div>
                    <div className="table-wrapper">
                        <div className="subject-table-row">
                            <div className="th">강사명</div>
                            <div className="th">강의명</div>
                            <div className="th date">기간</div>
                            <div className="th location">강의 지역</div>
                        </div>
                        {lectureLoading === false && lectureData !== null && lectureData.length > 0 ?
                        currentPosts(lectureData).map((data, index) => (
                            <div key={index} className={selectedLecture === index+(page-1)*postsPerPage ? "subject-table-row selected-subject": "subject-table-row"} onClick = {() => {lectureClick(index+(page-1)*postsPerPage, data)}}>
                                <div className="td">{data.instructor_name}</div>
                                <div className="td">{data.name}</div>
                                <div className="td date">{data.date !== null && data.date.length !== 0? data.date: "추후협의"}</div>
                                <div className="td location">{data.region}</div>
                            </div>
                        )):
                        lectureLoading === true?
                        <div className="lecture-loading"><ReactLoading type="spin" color="rgb(5 88 156 / 47%)" className="lecture-loading-data" width="50px"/></div>:
                        <div className="lecture-no-data">선택하신 주제에 해당하는 강의가 없습니다.</div>
                        }
                    </div>
                    <ContentPagination
                        activePage={page}
                        itemsCountPerPage={postsPerPage}
                        totalItemsCount={lectureData !== null ? lectureData.length : 0}
                        pageRangeDisplayed={5}
                        prevPageText={"‹"}
                        nextPageText={"›"}
                        onChange={handlePageChange}
                    />
                    {/* 강의별 상세 내용 박스 */}
                    {selectedLecture !== null?
                    <div className="show-lecture-detail">
                        <div className="detail-title">
                            <h2>{lectureData[selectedLecture].name}</h2>
                            <span>{lectureData[selectedLecture].instructor_name} </span>
                            <span className="lecture-detail-date">강의가능기간: {lectureData[selectedLecture].date !== null && lectureData[selectedLecture].date.length !== 0? lectureData[selectedLecture].date : "추후협의"}</span>
                        </div>
                        <div className="detail-content">
                            <div className="detail-sub-info">
                                <span>강의 가능 지역</span>
                                <span>: {lectureData[selectedLecture].region} </span>
                                <span>강의 주제</span>
                                <span>: {lectureDetail !== null ? lectureDetail[0].topic : ""}</span>
                                {lectureData[selectedLecture].sample_url !== null && lectureData[selectedLecture].sample_url !== "null" && lectureData[selectedLecture].sample_url !== "" ? <span>샘플강의보기</span>:null}
                                {lectureData[selectedLecture].sample_url !== null && lectureData[selectedLecture].sample_url !== "null" && lectureData[selectedLecture].sample_url !== "" ? <span>: <a href={lectureData[selectedLecture].sample_url !== null ? lectureData[selectedLecture].sample_url : ""}>{lectureData[selectedLecture].sample_url}</a></span>:null}
                            </div>
                            <p>
                                {lectureData[selectedLecture].intro !== null && lectureData[selectedLecture].intro !== "null" && lectureData[selectedLecture].intro !== ""? lectureData[selectedLecture].intro.split("<br/>").map( (item, i) => <div key={i}>{item}</div>):""}
                            </p>

                            <div className="detail-instructor">
                                <img className="detail-inst-image" src={process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+lectureData[selectedLecture].instructor_image} alt="lecture page" />
                                <div className="detail-inst-info">
                                    {/* <h3 className="mb15">{lectureData[selectedLecture].instructor_name.split("<br/>").map( (item, i) => <div key={i}>{item}</div>)} {lectureData[selectedLecture].instructor_position}</h3> */}
                                    <h3 className="mb15">{lectureData[selectedLecture].instructor_name} {lectureData[selectedLecture].instructor_position}</h3>
                                    <p className="mb15 fs13">
                                    {lectureData[selectedLecture].instructor_intro.split("\n").map( (item, i) => <div key={i}>{item}</div>)}
                                    </p>
                                    <p className="fs13">
                                    {lectureData[selectedLecture].instructor_memo.split("\n").map( (item, i) => <div key={i}>{item}</div>)}
                                    </p>
                                </div>
                            </div>
                            {
                                lectureData[selectedLecture].date !== null && lectureData[selectedLecture].date.length !== 0?
                                <Calendar readMainCalendar={readMainCalendar} calendarData={calendarInfo} path={window.location.href.replace(process.env.REACT_APP_DEFAULT_WHOLE_URL, "/")} clickedLecture={clickedLecture}/>:
                                null
                            }
                            {
                                window.sessionStorage.getItem('token') !== null && parseInt(window.sessionStorage.getItem("status")) === 0 && window.sessionStorage.getItem('expires_at') >= today.getTime()?
                                <Link
                                to={{
                                    pathname: process.env.REACT_APP_DEFAULT_URL+"lecture/application",
                                    state: {
                                        lecture: lectureData[selectedLecture]
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
                                        <SwiperSlide key = {index} slot= {index === 0? "container-start": ""}>
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
                                <span className="feedback-title feedback-info">{feedback.lecture_name} _ {feedback.instructor_name} {feedback.position_name}</span>
                                <span className="feedback-info">작성자명: {feedback.church_name}</span>
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
                                <p className={selectedFeedback === feedback.id ? "feedback-full-content" : "feedback-content"}>{feedback.content.value}</p>
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

export default LectureSubject;
