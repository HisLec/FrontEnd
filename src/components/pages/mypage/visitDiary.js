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
        if(window.confirm("??????????????? ?????????????????????????")) {
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
            process.env.REACT_APP_RESTAPI_HOST + 'visiting_log/application_form/'+selectedLecture.id, //[loginID]????????? ??? ??????
            params,{headers}).then(function(res) {
                alert("??????????????? ?????????????????????.")
                readApplicationForms();
                setSelectedLecture(null);
            });
        }
    };
    const deleteButton = async(data) => {
        console.log(selectedLecture);
        if(window.confirm("??????????????? ?????????????????????????")) {
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
                alert("????????? ?????????????????????.")
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
                    <h2>???????????????</h2>
                    <p style={{color:'black'}}>
                        {settingInfo !== null ?
                        settingInfo.find(element => element.key === "mypage_visit_phrase").value.split("<br/>").map( (item, i) => <div key={i}>{item}</div>) :
                        ""
                        }
                    </p>
                </div>
            </div>
            <div className="inst-title-header">
                <h2 style={{color:'white'}}>???????????????</h2>
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
                        <Link className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"mypage/profile"? "left-active":""} to={process.env.REACT_APP_DEFAULT_URL+"mypage/profile"}>??? ?????????</Link>
                    </span>
                    <span>
                        <Link className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"mypage/lecture"? "left-active":""} to={process.env.REACT_APP_DEFAULT_URL+"mypage/lecture"}>??? ?????????</Link>
                    </span>
                    <span>
                        <Link className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"mypage/contact"? "left-active":""} to={process.env.REACT_APP_DEFAULT_URL+"mypage/contact"}>?????? ??????</Link>
                    </span>
                    <span>
                    <Link className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL+"mypage/visitlog"? "left-active":""} to={process.env.REACT_APP_DEFAULT_URL+"mypage/visitlog"}>????????????</Link>
                    </span>
                </div>
                <div className="right-content">
                    <div className="table-wrapper">
                        <div className="table-row-visit">
                            <div className="th visit-index"></div>
                            <div className="th">????????? ?????????</div>
                            <div className="th visit-date">????????? ??????</div>
                            <div className="th">?????? ??????</div>
                        </div>
                        { applicationInfo !== null && applicationInfo.length >= 1?
                            currentPosts(applicationInfo).map((data, index) => 
                                <div key={index} className={selectedLecture !== null && selectedLecture.id === data.id ? "click-inst-row table-row-visit" : "table-row-visit"} onClick = {() => {selectButton(data)}}>
                                    <div className="td visit-index">{(index+1)+((page-1)*postsPerPage)}</div>
                                    <div className="td">{data.church_name}</div>
                                    <div className="td visit-date">{data.date}</div>
                                    {data.visit_reg_date !== null?
                                        <span className="td">????????? ??????</span>
                                        :<span className="td">????????? ?????????</span>
                                    }
                                </div>
                            )
                            :
                            <div className="no-content">???????????? ????????????.</div>
                        }
                    </div>
                    <Pagination 
                        activePage={page} 
                        itemsCountPerPage={postsPerPage} 
                        totalItemsCount={applicationInfo !== null ? applicationInfo.length : 0} 
                        pageRangeDisplayed={5} 
                        prevPageText={"???"} 
                        nextPageText={"???"} 
                        onChange={handlePageChange} 
                    />
                    {
                        selectedLecture !== null && selectedLecture.visit_reg_date !== null?
                            <div className="show-lecture-detail">
                                <p className="regular"><span className="bold">{selectedLecture.lecture_name}</span>??? ?????????????????????.</p>
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
                                <button className="feedback-submit" onClick={deleteButton}>????????????</button>
                            </div>
                        :selectedLecture !== null && selectedLecture.status === 2?
                            <div className="show-lecture-detail">
                                <p className="regular"><span className="bold">{selectedLecture.lecture_name}</span>??? ?????????????????????.</p>
                                <textarea className="feedback-textarea" placeholder="??? ?????????" onChange={(e) => {setVisitingLogContent(e.target.value); }}></textarea>
                                <RMIUploader
                                    isOpen={visible}
                                    hideModal={hideModal}
                                    onSelect={onSelect}
                                    onUpload={onUpload}
                                    onRemove={onRemove}
                                    dataSources={[]}
                                />
                                <button className="feedback-submit" onClick={() => insertVisitingLog()}>?????? ????????????</button>
                            </div>
                        :null
                    }
                </div>

            </div>
        </div>
    )
}

export default VisitDiary;