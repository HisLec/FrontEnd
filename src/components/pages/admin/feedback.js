import React, {useState, useEffect} from "react";
import axios from 'axios';
import { Swiper, SwiperSlide } from "swiper/react";
import ReactLoading from "react-loading";
import XLSX from "xlsx";
import Pagination from "react-js-pagination";
import FileSaver from "file-saver";

import { } from '@fortawesome/free-regular-svg-icons'

import '../../../assets/css/table.css';
import '../../../assets/css/default.css';
import '../../../assets/css/admin_feedback.css';
import GreyButton from '../../modules/button/admin_grey_btn';

function AdminFeedback() {
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [applicationInfo, setapplicationInfo] = useState(null);
    const [feedbackFileData, setFeedbackFileData] = useState(null);
    const [keyword, setKeyword] = useState(null);
    const [page, setPage] = useState(1);
    const postsPerPage = 10;

    useEffect(() => {
        readApplicationForms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const readApplicationForms = async() => {
        if(keyword !== null){
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'application/feedback',
                {
                    params: {
                        keyword: encodeURI(keyword),
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );
            setapplicationInfo(response.data);
        }else {
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'application/feedback', {
                    params: {
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );
            setapplicationInfo(response.data);
        }
        setKeyword(null);
        setSelectedLecture(null);
    }

    const selectButton = async(data) => {
        if(data.visit_reg_date !== null){
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'visiting_log/feedback/file/'+data.feedback_id, {
                    params: {
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );
            setFeedbackFileData(response.data);
        }
        setSelectedLecture(data);
    }

    const deleteButton = async(data) => {
        var value = window.confirm("사용자가 작성한 내용입니다. 삭제할까요?");
        if(value !== false){
            // const response = await axios.get(
            //     process.env.REACT_APP_RESTAPI_HOST + 'visiting_log/feedback/file/'+data.feedback_id
            // );
            axios(
                {
                    url: process.env.REACT_APP_RESTAPI_HOST+'visiting_log/feedback',
                    method: 'delete',
                    data: {
                        id: selectedLecture.feedback_id,
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
    const searchKeywordChanged = e => {
        setKeyword(e.target.value);
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

    const exportToCSV = () => {
        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const fileName = "feedback";
        const ws = XLSX.utils.json_to_sheet(applicationInfo);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    return (
        <div>
            <p className="admin-title-header">기타</p>
            <div className="admin-content-wrapper">
                <p className="table-name mb40">
                    피드백 관리
                    <GreyButton class="right" name="엑셀 파일 다운로드" click={exportToCSV}/>
                </p>
                <div id="feedback-flex-wrapper">
                    <div id="feedback-table">
                        <div className="feedback-search">
                            <input className="p48" type="text" placeholder="관리자명, 강사명, 강의명, 교회명, 주소, 사용자 이메일로 키워드 검색" value={keyword || ""} onChange={searchKeywordChanged}/>
                            <GreyButton name="검색" click={readApplicationForms}/>
                        </div>
                        <div className="table-wrapper">
                            <div>
                                <div className="mt50 table-row-feedback">
                                    <span className="th feedback-category">NO</span>
                                    <span className="th">강의명</span>
                                    <span className="th feedback-date">강연날짜</span>
                                    <span className="th">작성자</span>
                                    <span className="th feedback-yn">작성여부</span>
                                </div>
                            { applicationInfo !== null && applicationInfo.length > 0 ?
                                currentPosts(applicationInfo).map((data, index) => 
                                    <div key={index} className={selectedLecture !== null && selectedLecture.id === data.id ? "click-inst-row table-row-feedback" : "table-row-feedback"} onClick = {() => {selectButton(data)}}>
                                        <span className="td">{(index+1)+((page-1)*postsPerPage)}</span>
                                        <span className="td">{data.lecture_name}</span>
                                        <span className="td feedback-date">{data.date}</span>
                                        <span className="td">{data.church_name}</span>
                                        {data.visit_reg_date !== null?
                                            <span className="td">완료</span>
                                            : <span className="td">미완료</span>
                                        }
                                    </div>
                                )
                                :
                                <div id="no-feedback-detail"><span>피드백이 없습니다.</span></div>
                            }
                        </div>
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

                    </div>
                    {    selectedLecture !== null && selectedLecture.visit_reg_date !== null?
                        <div className="show-lecture-detail">
                        <div className="star-wrapper">
                            <span className="stars">강의 만족도</span>
                            <span>
                            {
                                [1, 2, 3, 4, 5].map((data, index) => 
                                    <img key={index} className="rating_star" src={data <= selectedLecture.lecture_star? process.env.REACT_APP_DEFAULT_URL+'image/yellow_star.png': process.env.REACT_APP_DEFAULT_URL+'image/white_star.png'} alt="white_star"/>
                                )
                            }
                            </span>
                            <span className="gap"> </span>
                            <span className="stars">강사 만족도</span>
                            <span>
                            {
                                [1, 2, 3, 4, 5].map((data, index) => 
                                    <img key={index} className="rating_star" src={data <= selectedLecture.instructor_star? process.env.REACT_APP_DEFAULT_URL+'image/yellow_star.png': process.env.REACT_APP_DEFAULT_URL+'image/white_star.png'} alt="white_star" />
                                )
                            }
                            </span>
                        </div>
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
                                {feedbackFileData !== null ?
                            feedbackFileData.map((data, index) => (
                                <SwiperSlide key = {index}>
                                    <div className="feedback-image-wrapper"><img src={process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+data} alt="uploadFile"/></div>
                                </SwiperSlide>
                            ))
                            : <ReactLoading type="spin" color="#05589c" />
                        }
                            </Swiper></div>
                        <button className="feedback-submit" onClick={deleteButton}>삭제하기</button>
                    </div>: selectedLecture !== null ?
                     <div className="show-lecture-detail">
                        <h2 className="mb20">{selectedLecture.lecture_name}</h2>
                        <hr className="bold-hr mb25"/>
                        <div className="mb8">
                            <span className="form-title">신청자명</span>
                            <span>{selectedLecture.admin_name}</span>
                        </div>
                        <div>
                            <span className="form-title">연락처</span>
                            <span>{selectedLecture.admin_phone}</span>
                        </div>
                        <hr className="m20"/>
                        <div className="mb8">
                            <span className="form-title">교회명</span>
                            <span>{selectedLecture.church_name}</span>
                        </div>
                        <div className="mb8">
                            <span className="form-title">주소</span>
                            <span>{selectedLecture.addr1} {selectedLecture.addr2}</span>
                        </div>
                        <div className="mb8">
                            <span className="form-title">교회 연락처</span>
                            <span>{selectedLecture.phone}</span>
                        </div>
                        <div>
                            <span className="form-title">교회 이메일</span>
                            <span>{selectedLecture.email}</span>
                        </div>
                        <hr className="m20"/>
                        <div className="mb8">
                            <span className="form-title">강의 대상</span>
                            <span>{selectedLecture.attendee_target}</span>
                        </div>
                        <div className="mb8">
                            <span className="form-title">청강자 수</span>
                            <span>{selectedLecture.attendee_number}</span>
                        </div>
                        <div className="mb8">
                            <span className="form-title">원하는 날짜</span>
                            <span>{selectedLecture.date}</span>
                        </div>
                        <div className="mb35">
                            <span className="form-title">원하는 시간대</span>
                            {selectedLecture.status === 2 ?
                            <span>{selectedLecture.contact_start_date} ~ {selectedLecture.contact_end_date}</span>:
                            <span>{selectedLecture.timezone}</span>}
                        </div>
                        <div className="mb25 form-grid">
                            <span className="form-title">요청사항</span>
                            <span>{selectedLecture.memo.split("<br/>").map( (item, i) => <div key={i}>{item}</div>)}</span>
                        </div>
                        <hr className="bold-hr mb35"/>
                    </div>:<div id="no-feedback-detail"><span>피드백을 선택해주세요.</span></div>
                    }

                    {/* 
                    피드백 생성
                    <div id="feedback-detail">                 
                        <div>
                            <button className="close-btn" onClick={closeDetail}>X</button>
                            <div className="feedback-stars mb15">
                                <span className="mr15">강사 만족도</span>
                                <span>
                                <FontAwesomeIcon className="star-icon" icon={faStar} />
                                <FontAwesomeIcon className="star-icon" icon={faStar} />
                                <FontAwesomeIcon className="star-icon" icon={faStar} />
                                <FontAwesomeIcon className="star-icon" icon={faStar} />
                                <FontAwesomeIcon className="star-icon" icon={faStar} />
                                </span>
                            </div>
                            <div className="feedback-stars">
                                <span className="mr15">강의 만족도</span>
                                <span>
                                <FontAwesomeIcon className="star-icon" icon={faStar} />
                                <FontAwesomeIcon className="star-icon" icon={faStar} />
                                <FontAwesomeIcon className="star-icon" icon={faStar} />
                                <FontAwesomeIcon className="star-icon" icon={faStar} />
                                <FontAwesomeIcon className="star-icon" icon={faStar} />
                                </span>    
                            </div>
                            <textarea className="star-textarea" placeholder="글 남기기"></textarea>
                            
                            <label className="add-picture-label" htmlFor="picture">
                                <FontAwesomeIcon className="mr10 camera-icon" icon={faCameraRetro} />
                                사진 첨부하기
                            </label>
                            <input style={{display:'none'}} type="file" name="picture" id="picture"/>
                            <div className="center">
                                <WhiteButton name="작성하기"/>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )

}

export default AdminFeedback;