import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { RMIUploader } from "react-multiple-image-uploader";
import { Swiper, SwiperSlide } from "swiper/react";
import ReactLoading from "react-loading";
import Pagination from "react-js-pagination";

import '../../../assets/css/table.css';
import '../../../assets/css/Contact.css';


const VisitDiary = (props) => {
    const [applicationInfo, setapplicationInfo] = useState(null);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [visitingLogFileData, setVisitingLogFileData] = useState([]);
    const [visitingLogContent, setVisitingLogContent] = useState(null)
    const [visible, setVisible] = useState(false);
    const [page, setPage] = useState(1);
    // eslint-disable-next-line no-unused-vars
    const [postsPerPage, setpostsPerPage] = useState(10);
    const [settingInfo, setsettingInfo] = useState(null);

    var visitingLogFile = [];

    useEffect(() => {
        readApplicationForms();
        readSettingInfo();
    },[]);

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

    const selectButton = async(data) => {
        if(selectedLecture === null || selectedLecture !== data) {
            if(data.visit_reg_date !== null){
                const response = await axios.get(
                    process.env.REACT_APP_RESTAPI_HOST + 'visiting_log/file/'+data.feedback_id, {
                        params: {
                            token: window.sessionStorage.getItem('token'),
                            manageID: window.sessionStorage.getItem('id')
                        }
                    }
                );
                setVisitingLogFileData(response.data);
            }
            setSelectedLecture(data);
        } else {
            setSelectedLecture(null);
        }
    }

    const readApplicationForms = async() => {
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'application/instructor/'+window.sessionStorage.getItem('id'), {
                params: {
                    token: window.sessionStorage.getItem('token'),
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        setapplicationInfo(response.data);
    }

    const hideModal = () => {
        setVisible(false);
    };
    const onUpload = (data) => {
        visitingLogFile = data;
    };
    const onSelect = (data) => {
    };
    const onRemove = (id) => {
    };

    const insertVisitingLog = async() => {
        if(window.confirm("방문일지를 저장하시겠습니까?")) {
            document.getElementsByClassName("ant-btn-icon-only")[1].click();
            //document.getElementsByClassName("ant-btn-icon-only")[1].click();
            //const blob = await fetch(base64).then(res => res.blob());

            const params = new FormData();
            const headers = {
                'Content-type': 'multipart/form-data; charset=UTF-8',
                'Accept': '*/*'
            }
            //var params = new URLSearchParams();
            params.append('content', visitingLogContent);

            for(var i=0; i<visitingLogFile.length; i++){
                params.append('file', visitingLogFile[i].file);
            }
            params.append('token', window.sessionStorage.getItem('token'));
            params.append('manageID', window.sessionStorage.getItem('id'));
            
            await axios.post(
            process.env.REACT_APP_RESTAPI_HOST + 'visiting_log/application_form/'+selectedLecture.id, //[loginID]로그인 후 변경
            params,{headers}).then(function(res) {
                alert("방문일지가 저장되었습니다.")
                readApplicationForms();
                setSelectedLecture(null);
            });
        }
    };
    const deleteButton = async(data) => {
        console.log(selectedLecture);
        if(window.confirm("방문일지를 삭제하시겠습니까?")) {
            axios(
                {
                    url: process.env.REACT_APP_RESTAPI_HOST+'visiting_log',
                    method: 'delete',
                    data: {
                        id: selectedLecture.feedback_id,
                        application_form_id: selectedLecture.id,
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            ).then(function(res) {
                alert("삭제가 완료되었습니다.")
                readApplicationForms();
                setSelectedLecture(null);
            })
        }
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
                        settingInfo.find(element => element.key === "mypage_visit_phrase").value.split("<br/>").map( (item, i) => <div key={i}>{item}</div>) :
                        ""
                        }
                    </p>
                </div>
            </div>
            <div className="inst-title-header">
                <h2 style={{color:'white'}}>마이페이지</h2>
                <p>
                    {settingInfo !== null ?
                    settingInfo.find(element => element.key === "mypage_visit_phrase").value.split("<br/>").map( (item, i) => <div key={i}>{item}</div>) :
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
                    <div className="table-wrapper">
                        <div className="table-row-visit">
                            <div className="th visit-index"></div>
                            <div className="th">방문한 교회명</div>
                            <div className="th visit-date">다녀온 날짜</div>
                            <div className="th">일지 작성</div>
                        </div>
                        { applicationInfo !== null && applicationInfo.length >= 1?
                            currentPosts(applicationInfo).map((data, index) => 
                                <div key={index} className={selectedLecture !== null && selectedLecture.id === data.id ? "click-inst-row table-row-visit" : "table-row-visit"} onClick = {() => {selectButton(data)}}>
                                    <div className="td visit-index">{(index+1)+((page-1)*postsPerPage)}</div>
                                    <div className="td">{data.church_name}</div>
                                    <div className="td visit-date">{data.date}</div>
                                    {data.visit_reg_date !== null?
                                        <span className="td">피드백 완료</span>
                                        :<span className="td">피드백 미완료</span>
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
                    {
                        selectedLecture !== null && selectedLecture.visit_reg_date !== null?
                            <div className="show-lecture-detail">
                                <p className="regular"><span className="bold">{selectedLecture.lecture_name}</span>를 강연하셨습니다.</p>
                                <p className="feedback-detail-content">{selectedLecture.visit_log.split("\n").map( (item, i) => <div key={i}>{item}</div>)}</p>
                                <div className="feedback-image-swiper-wrapper">
                                    <Swiper 
                                        spaceBetween={30} 
                                        effect={'fade'}
                                        centeredSlides={true} 
                                        loop={true} loopFillGroupWithBlank={true}
                                        pagination={{
                                            "clickable": true
                                        }} 
                                        navigation={true}
                                        className="feedback-swiper">
                                            {visitingLogFileData !== null ?
                                                visitingLogFileData.map((data, index) => (
                                                    <SwiperSlide key = {index}>
                                                        <div className="feedback-image-wrapper"><img src={process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+data} alt="uploadFile"/></div>
                                                    </SwiperSlide>
                                                ))
                                                : <ReactLoading type="spin" color="#05589c" />
                                            }
                                    </Swiper>
                                </div>
                                <button className="feedback-submit" onClick={deleteButton}>삭제하기</button>
                            </div>
                        :selectedLecture !== null && selectedLecture.status === 2?
                            <div className="show-lecture-detail">
                                <p className="regular"><span className="bold">{selectedLecture.lecture_name}</span>를 강연하셨습니다.</p>
                                <textarea className="feedback-textarea" placeholder="글 남기기" onChange={(e) => {setVisitingLogContent(e.target.value); }}></textarea>
                                <RMIUploader
                                    isOpen={visible}
                                    hideModal={hideModal}
                                    onSelect={onSelect}
                                    onUpload={onUpload}
                                    onRemove={onRemove}
                                    dataSources={[]}
                                />
                                <button className="feedback-submit" onClick={() => insertVisitingLog()}>작성 완료하기</button>
                            </div>
                        :null
                    }
                </div>

            </div>
        </div>
    )
}

export default VisitDiary;