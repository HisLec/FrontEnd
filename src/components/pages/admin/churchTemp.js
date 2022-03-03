
import React, {useState, useEffect} from "react";
import Pagination from "react-js-pagination";
import axios from 'axios';
import XLSX from "xlsx";
import FileSaver from "file-saver";
import '../../../assets/css/table.css';
import '../../../assets/css/default.css';
import '../../../assets/css/admin_lecture.css';
import '../../../assets/css/admin_church.css';
import GreyButton from '../../modules/button/admin_grey_btn';

function AdminChurchTemp() {

    const [page, setPage] = useState(1);
    const postsPerPage = 10;
    const [churchTempData, setChurchTempData] = useState(null);
    const [selectedChurchTemp, setSelectedChurchTemp] = useState(null);
    const [keyword, setKeyword] = useState(null);

    function clickChurch(data) {
        if(selectedChurchTemp !== null && data.id === selectedChurchTemp.id) {
            setSelectedChurchTemp(null);
        } else {
            setSelectedChurchTemp(data);
        }
    }

    useEffect(() => {
        readChurchTempData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const readChurchTempData = async() => {
        if(keyword !== null){
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'church/temp',
                {
                    params: {
                        keyword: encodeURI(keyword),
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );
            setChurchTempData(response.data);
        }else {
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'church/temp', {
                    params: {
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );
            setChurchTempData(response.data);
        }
        setKeyword(null);
        setSelectedChurchTemp(null);
    }
    const searchKeywordChanged = e => {
        setKeyword(e.target.value);
    }

    const acceptTemp = async() => {
        var params = new URLSearchParams();
        params.append('user_id', window.sessionStorage.getItem('id'));
        params.append('id', selectedChurchTemp.id);
        params.append('new_name', selectedChurchTemp.new_name);
        params.append('new_district', selectedChurchTemp.new_district);
        params.append('new_zip_code', selectedChurchTemp.new_zip_code);
        params.append('new_addr1', selectedChurchTemp.new_addr1);
        params.append('new_addr2', selectedChurchTemp.new_addr2);
        params.append('new_pastor', selectedChurchTemp.new_pastor);
        params.append('new_email', selectedChurchTemp.new_email);
        params.append('new_phone', selectedChurchTemp.new_phone);
        params.append('token', window.sessionStorage.getItem('token'));
        params.append('manageID', window.sessionStorage.getItem('id'));

        if(window.confirm("교회 정보를 수정하시겠습니까?")) {
            const response = await axios.post(
            process.env.REACT_APP_RESTAPI_HOST + 'church/confirmChurchTemp',
            params,
            ).then(function(res) {
                alert("교회 정보가 수정되었습니다.");
                readChurchTempData();
                setSelectedChurchTemp(null);
            });
        }
    }

    const rejectTemp = () => {
        var value = false;
        if(selectedChurchTemp.church_id === 0){ //church_status로 변경 예정 0 인 경우!!
            value = window.confirm("등록된 적 없는 교회이므로 수락하지 않을 시 이 교회에서 신청한 모든 강의가 취소됩니다. 변경 사항을 거절하시겠습니까?")
        }else {
            value = window.confirm("이 교회에 대한 변경 사항을 거절하시겠습니까?")
        }
        if(value) {
            selectedChurchTemp.token = window.sessionStorage.getItem('token');
            selectedChurchTemp.manageID = window.sessionStorage.getItem('id');
            axios(
                {
                    url: process.env.REACT_APP_RESTAPI_HOST+'church/temp',
                    method: 'put',
                    data: selectedChurchTemp
                }
            ).then(function(res) {
                alert("교회에 대한 변경 사항이 삭제되었습니다.");
                readChurchTempData();
                setSelectedChurchTemp(null);
            }).catch(function(error) {
                console.log(error)
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
        currentPosts = churchTempData.slice(indexOfFirst, indexOfLast);
        return currentPosts;
    }

    const exportToCSV = () => {
        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const fileName = "churchTemp";
        const ws = XLSX.utils.json_to_sheet(churchTempData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    const acceptNewChurch = async() => {
        var params = new URLSearchParams();
        params.append('userId', window.sessionStorage.getItem('id'));
        params.append('name', selectedChurchTemp.new_name);
        params.append('city', selectedChurchTemp.new_city);
        params.append('district', selectedChurchTemp.new_district);
        params.append('zip_code', selectedChurchTemp.new_zip_code);
        params.append('addr1', selectedChurchTemp.new_addr1);
        params.append('addr2', selectedChurchTemp.new_addr2);
        params.append('phone', selectedChurchTemp.new_phone);
        params.append('email', selectedChurchTemp.new_email);
        params.append('pastor', selectedChurchTemp.new_pastor);
        params.append('writer_name', selectedChurchTemp.writer_name);
        params.append('application_form_id', selectedChurchTemp.application_form_id);
        params.append('id', selectedChurchTemp.id);
        params.append('church_temp_id', selectedChurchTemp.id);
        params.append('token', window.sessionStorage.getItem('token'));
        params.append('manageID', window.sessionStorage.getItem('id'));

        if(window.confirm("새로운 교회를 수락하시겠습니까?")) {
            const response = await axios.post(
            process.env.REACT_APP_RESTAPI_HOST + 'church/temp',
            params,
            ).then(function(res) {
                alert("새로운 교회가 수락되었습니다.");
                readChurchTempData();
                setSelectedChurchTemp(null);
            });
        }
    }

    return (
    <div>
        <p className="admin-title-header">교회 관리</p>
        <div className="admin-content-wrapper">
            <div className="table-wrapper mt0 relative">
                <p className="table-name mb40">
                    교회 정보 변경사항
                    <GreyButton class="right mr10" name="엑셀 파일 다운로드" click={exportToCSV}/>
                </p>
                <div className="mb20">
                    <input className="p48 mr15" type="text" placeholder="교회명, 주소, 사용자 이메일로 키워드 검색" value={keyword || ""} onChange={searchKeywordChanged}/>
                    <GreyButton name="검색" click={readChurchTempData}/>
                </div>
                {selectedChurchTemp !== null ?
                <div className="mb50 church-info-wrapper">
                    <div className="original original-info">
                        <p className="original-title">기존 정보</p>
                        <div className="p25">
                            <div className="church-padding">
                                <span className="add-church-title">교회명</span>
                                <span>{selectedChurchTemp.name}</span>
                            </div>
                            <div className="church-padding mb8">
                                <span className="add-church-title">주소 입력</span>
                                <span>{selectedChurchTemp.addr1}</span>
                            </div>
                            <div className="church-padding mb8">
                                <span className="add-church-title"></span>
                                <span>{selectedChurchTemp.addr2}</span>
                            </div>
                            <div className="church-padding mb8">
                                <span className="add-church-title"></span>
                                <span>{selectedChurchTemp.zip_code}</span>
                            </div>
                            <div className="church-padding">
                                <span className="add-church-title">담임 목사</span>
                                <span>{selectedChurchTemp.pastor}</span>
                            </div>
                            <div className="church-padding">
                                <span className="add-church-title">대표 연락처</span>
                                <span>{selectedChurchTemp.phone}</span>
                            </div>
                            <div className="church-padding">
                                <span className="add-church-title">대표 이메일</span>
                                <span>{selectedChurchTemp.email}</span>
                            </div>
                        </div>
                    </div>
                    <div className="change-info">
                        <p className="change-title">변경된 정보</p>
                        <div className="p25">
                            <div className="church-flex">
                            <span className="add-church-title">교회명</span>
                                <span>{selectedChurchTemp.new_name === null ? "변경 사항 없음": selectedChurchTemp.new_name}</span>
                            </div>
                            <div className="church-flex">
                                <span className="add-church-title">주소 입력</span>
                                <span>{selectedChurchTemp.new_addr1=== null ? "변경 사항 없음": selectedChurchTemp.new_addr1}</span>
                            </div>
                            <div className="church-flex mb8">
                                <span className="add-church-title"></span>
                                <span>{selectedChurchTemp.new_addr2=== null ? "변경 사항 없음": selectedChurchTemp.new_addr2}</span>
                            </div>
                            <div className="church-flex mb8">
                                <span className="add-church-title"></span>
                                <span>{selectedChurchTemp.new_zip_code=== null ? "변경 사항 없음": selectedChurchTemp.new_zip_code}</span>
                            </div>
                            <div className="church-flex">
                                <span className="add-church-title">담임 목사</span>
                                <span>{selectedChurchTemp.new_pastor === null ? "변경 사항 없음": selectedChurchTemp.new_pastor}</span>
                            </div>
                            <div className="church-flex">
                                <span className="add-church-title">대표 연락처</span>
                                <span>{selectedChurchTemp.new_phone === null ? "변경 사항 없음": selectedChurchTemp.new_phone}</span>
                            </div>
                            <div className="church-flex">
                                <span className="add-church-title">대표 이메일</span>
                                <span>{selectedChurchTemp.new_email === null ? "변경 사항 없음": selectedChurchTemp.new_email}</span>
                            </div>
                            {selectedChurchTemp.status === 0 && selectedChurchTemp.church_id === 0 ?
                            <div className="button-wrapper">
                                <GreyButton class="mr10" name="새로운 교회 수락" click={acceptNewChurch}/>
                                <GreyButton name="변경 내용 거절" click = {rejectTemp}/>
                            </div>:
                            <div className="button-wrapper">
                                <GreyButton class="mr10" name="변경 내용 수락" click = {acceptTemp}/>
                                <GreyButton name="변경 내용 거절" click = {rejectTemp}/>
                            </div>
                            }
                            
                            {/* <div>
                                <span className="add-church-title">교회명</span>
                                <input className="p4" type="text"/>
                            </div>
                            <div>
                                <span className="add-church-title">교단</span>
                                <input className="p4" type="text"/>
                            </div>
                            <div>
                                <span className="add-church-title">한동대와 연관성</span>
                                <input className="p4" type="text"/>
                            </div>
                            <div>
                                <span className="add-church-title"></span>
                                <input className="p4" type="text" placeholder="세부사항 입력"/>
                            </div>
                            <div>
                                <span className="add-church-title">교회 규모</span>
                                <input className="p4" type="text"/>
                            </div>
                            <hr className="lecture-hr"/>
                            <div>
                                <span className="add-church-title">담임 목사 성명</span>
                                <input className="p4" type="text"/>
                            </div>
                            <div>
                                <span className="add-church-title">실무자 성명</span>
                                <input className="p4" type="text"/>
                            </div>
                            <div>
                                <span className="add-church-title">실무자 연락처</span>
                                <input className="p4" type="text"/>
                            </div>
                            <div>
                                <span className="add-church-title">주소 입력</span>
                                <input className="p4" type="text" placeholder="국가"/>
                            </div>
                            <div className="mb8">
                                <span className="add-church-title"></span>
                                <input className="p4 mr15" placeholder="시 * 도" type="text"/>
                                <input className="p4" placeholder="시 * 군 * 구" type="text"/>
                            </div>
                            <div className="mb8">
                                <span className="add-church-title"></span>
                                <input className="p4" placeholder="우편번호" type="text"/>
                            </div>
                            <div className="mb8">
                                <span className="add-church-title"></span>
                                <input className="p4" type="text"/>
                            </div>
                            <div>
                                <span className="add-church-title"></span>
                                <input className="p4" placeholder="상세주소 입력" type="text"/>
                            </div>
                            <hr className="lecture-hr"/>
                            <div>
                                <span className="add-church-title">교회 연락처</span>
                                <input className="p4" type="text"/>
                            </div>
                            <div>
                                <span className="add-church-title">교회 이메일</span>
                                <input className="p4" type="text"/>
                            </div>
                            <div>
                                <span className="add-church-title">교회 홈페이지</span>
                                <input className="p4" type="text"/>
                            </div>
                            <div>
                                <span className="add-church-title">교회 팩스 번호</span>
                                <input className="p4" type="text"/>
                            </div>
                            <div className="church-grid">
                                <span className="add-church-title">메모 사항</span>
                                <textarea className="h180 p4"></textarea>
                            </div> */}
                        </div>
                    </div>
                </div>:
                null}

                <div className="mt50 table-row-church">
                    <span className="th">기존 교단</span>
                    <span className="th">기존 이름</span>
                    <span className="th church-location">기존 지역</span>
                    <span className="th church-writer">작성자</span>
                    <span className="th church-date">작성일자</span>
                </div>


                { churchTempData !== null && churchTempData.length !== 0 ?
                    currentPosts(churchTempData).map((data, index) =>
                        <div key={index}  className = {selectedChurchTemp !== null && selectedChurchTemp.id === data.id ? "click-inst-row table-row-church" : "table-row-church"} onClick = {() => {clickChurch(data)}}>
                            <span className="td admin-subject">{data.denomination}</span>
                            <span className="td">{data.new_name !== "" ? data.new_name : data.name !== "" ? data.name : ""}</span>
                            <span className="td">{data.new_addr1 !== "" ? data.new_addr1 : data.addr1 !== "" ? data.addr1 : ""}</span>
                            <span className="td admin-date">{data.admin_name}</span>
                            <span className="td admin-loc">{data.reg_date}</span>
                        </div>
                    )
                    :
                    <div className="no-content">변경되거나 추가된 교회 정보가 없습니다.</div>
                }
            </div>
            <Pagination
                activePage={page}
                itemsCountPerPage={postsPerPage}
                totalItemsCount={churchTempData !== null ? churchTempData.length : 0}
                pageRangeDisplayed={5}
                prevPageText={"‹"}
                nextPageText={"›"}
                onChange={handlePageChange}
            />
        </div>
    </div>
    );
}

export default AdminChurchTemp;
