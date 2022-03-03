import React, {useState, useEffect} from "react";
import axios from 'axios';
import XLSX from "xlsx";
import FileSaver from "file-saver";
import { Swiper, SwiperSlide } from "swiper/react";
import ReactLoading from "react-loading";
import { RMIUploader } from "react-multiple-image-uploader";
import Pagination from "react-js-pagination";
import '../../../assets/css/table.css';
import '../../../assets/css/default.css';
import '../../../assets/css/admin_feedback.css';
import GreyButton from '../../modules/button/admin_grey_btn';

function AdminVisitDiary() {
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [applicationInfo, setapplicationInfo] = useState(null);
    const [feedbackFileData, setFeedbackFileData] = useState(null);
    const [keyword, setKeyword] = useState(null);
    const [addButton, setAddButton] = useState(false);
    const [visitingLogContent, setVisitingLogContent] = useState(null)
    const [visible, setVisible] = useState(false);
    var visitingLogFile = [];
    const [page, setPage] = useState(1);
    const postsPerPage = 10;

    useEffect(() => {
        readApplicationForms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const readApplicationForms = async() => {
        if(keyword !== null){
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'application/visiting_log',
                {
                    params: {
                        keyword: encodeURI(keyword),
                        token:  window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );
            setapplicationInfo(response.data);
        }else {
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'application/visiting_log', {
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
                setFeedbackFileData(response.data);
            }
            setSelectedLecture(data);
        } else {
            setSelectedLecture(null);
        }
        
    }

    const deleteButton = async(data) => {
        var value = window.confirm("강사가 작성한 내용입니다. 삭제할까요?");
        if(value !== false){
            axios(
                {
                    url: process.env.REACT_APP_RESTAPI_HOST+'visiting_log',
                    method: 'delete',
                    data: {
                        id: selectedLecture.feedback_id,
                        token:  window.sessionStorage.getItem('token'),
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

    const hideModal = () => {
        setVisible(false);
    };
    const onUpload = (data) => {
        visitingLogFile = data;
    };
    const insertVisitingLog = async() => {
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
        params.append('token', window.sessionStorage.getItem('token'));
        params.append('manageID', window.sessionStorage.getItem('id'));

        for(var i=0; i<visitingLogFile.length; i++){
            params.append('file', visitingLogFile[i].file);
        }
        await axios.post(
        process.env.REACT_APP_RESTAPI_HOST + 'visiting_log/application_form/'+selectedLecture.id, //[loginID]로그인 후 변경
        params,{headers});
        readApplicationForms();
        setSelectedLecture(null);

    };

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
        const fileName = "visitDiary";
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
                    방문일지 관리
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
                                    <span className="th">강사명</span>
                                    <span className="th feedback-yn">작성여부</span>
                                </div>
                            { applicationInfo !== null ?
                                currentPosts(applicationInfo).map((data, index) => 
                                    <div key={index} className={selectedLecture !== null && selectedLecture.id === data.id ? "click-inst-row table-row-feedback" : "table-row-feedback"} onClick = {() => {selectButton(data)}}>
                                        <span className="td">{(index+1)+((page-1)*postsPerPage)}</span>
                                        <span className="td">{data.lecture_name}</span>
                                        <span className="td feedback-date">{data.date}</span>
                                        <span className="td">{data.inst_name}</span>
                                        {data.visit_reg_date !== null?
                                            <span className="td">완료</span>
                                            : <span className="td">미완료</span>
                                        }
                                    </div>
                                )
                                :
                                <div id="no-feedback-detail"><span>방문일지가 없습니다.</span></div>
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
                    </div>: selectedLecture !== null && addButton === true?
                        <div className="show-lecture-detail">
                            <p className="regular"><span className="bold">{selectedLecture.lecture_name}</span>를 강연하셨습니다.</p>
                            <textarea className="feedback-textarea" placeholder="글 남기기" onChange={(e) => {setVisitingLogContent(e.target.value); }}></textarea>
                            <RMIUploader
                                isOpen={visible}
                                hideModal={hideModal}
                                // onSelect={onSelect}
                                onUpload={onUpload}
                                // onRemove={onRemove}
                                dataSources={[]}
                            />
                            <button className="feedback-submit" onClick={() => insertVisitingLog()}>작성 완료하기</button>
                        </div>
                    :selectedLecture !== null ?
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
                        <button className="feedback-submit" onClick={() => {setAddButton(true)}}>방문일지 등록하기</button>
                    </div>:<div id="no-feedback-detail"><span>방문일지를 선택해주세요.</span></div>
                    }
                </div>
            </div>
        </div>
    )

}

export default AdminVisitDiary;