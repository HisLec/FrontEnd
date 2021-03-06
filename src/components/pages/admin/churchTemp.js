
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

        if(window.confirm("?????? ????????? ?????????????????????????")) {
            const response = await axios.post(
            process.env.REACT_APP_RESTAPI_HOST + 'church/confirmChurchTemp',
            params,
            ).then(function(res) {
                alert("?????? ????????? ?????????????????????.");
                readChurchTempData();
                setSelectedChurchTemp(null);
            });
        }
    }

    const rejectTemp = () => {
        var value = false;
        if(selectedChurchTemp.church_id === 0){ //church_status??? ?????? ?????? 0 ??? ??????!!
            value = window.confirm("????????? ??? ?????? ??????????????? ???????????? ?????? ??? ??? ???????????? ????????? ?????? ????????? ???????????????. ?????? ????????? ?????????????????????????")
        }else {
            value = window.confirm("??? ????????? ?????? ?????? ????????? ?????????????????????????")
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
                alert("????????? ?????? ?????? ????????? ?????????????????????.");
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

        if(window.confirm("????????? ????????? ?????????????????????????")) {
            const response = await axios.post(
            process.env.REACT_APP_RESTAPI_HOST + 'church/temp',
            params,
            ).then(function(res) {
                alert("????????? ????????? ?????????????????????.");
                readChurchTempData();
                setSelectedChurchTemp(null);
            });
        }
    }

    return (
    <div>
        <p className="admin-title-header">?????? ??????</p>
        <div className="admin-content-wrapper">
            <div className="table-wrapper mt0 relative">
                <p className="table-name mb40">
                    ?????? ?????? ????????????
                    <GreyButton class="right mr10" name="?????? ?????? ????????????" click={exportToCSV}/>
                </p>
                <div className="mb20">
                    <input className="p48 mr15" type="text" placeholder="?????????, ??????, ????????? ???????????? ????????? ??????" value={keyword || ""} onChange={searchKeywordChanged}/>
                    <GreyButton name="??????" click={readChurchTempData}/>
                </div>
                {selectedChurchTemp !== null ?
                <div className="mb50 church-info-wrapper">
                    <div className="original original-info">
                        <p className="original-title">?????? ??????</p>
                        <div className="p25">
                            <div className="church-padding">
                                <span className="add-church-title">?????????</span>
                                <span>{selectedChurchTemp.name}</span>
                            </div>
                            <div className="church-padding mb8">
                                <span className="add-church-title">?????? ??????</span>
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
                                <span className="add-church-title">?????? ??????</span>
                                <span>{selectedChurchTemp.pastor}</span>
                            </div>
                            <div className="church-padding">
                                <span className="add-church-title">?????? ?????????</span>
                                <span>{selectedChurchTemp.phone}</span>
                            </div>
                            <div className="church-padding">
                                <span className="add-church-title">?????? ?????????</span>
                                <span>{selectedChurchTemp.email}</span>
                            </div>
                        </div>
                    </div>
                    <div className="change-info">
                        <p className="change-title">????????? ??????</p>
                        <div className="p25">
                            <div className="church-flex">
                            <span className="add-church-title">?????????</span>
                                <span>{selectedChurchTemp.new_name === null ? "?????? ?????? ??????": selectedChurchTemp.new_name}</span>
                            </div>
                            <div className="church-flex">
                                <span className="add-church-title">?????? ??????</span>
                                <span>{selectedChurchTemp.new_addr1=== null ? "?????? ?????? ??????": selectedChurchTemp.new_addr1}</span>
                            </div>
                            <div className="church-flex mb8">
                                <span className="add-church-title"></span>
                                <span>{selectedChurchTemp.new_addr2=== null ? "?????? ?????? ??????": selectedChurchTemp.new_addr2}</span>
                            </div>
                            <div className="church-flex mb8">
                                <span className="add-church-title"></span>
                                <span>{selectedChurchTemp.new_zip_code=== null ? "?????? ?????? ??????": selectedChurchTemp.new_zip_code}</span>
                            </div>
                            <div className="church-flex">
                                <span className="add-church-title">?????? ??????</span>
                                <span>{selectedChurchTemp.new_pastor === null ? "?????? ?????? ??????": selectedChurchTemp.new_pastor}</span>
                            </div>
                            <div className="church-flex">
                                <span className="add-church-title">?????? ?????????</span>
                                <span>{selectedChurchTemp.new_phone === null ? "?????? ?????? ??????": selectedChurchTemp.new_phone}</span>
                            </div>
                            <div className="church-flex">
                                <span className="add-church-title">?????? ?????????</span>
                                <span>{selectedChurchTemp.new_email === null ? "?????? ?????? ??????": selectedChurchTemp.new_email}</span>
                            </div>
                            {selectedChurchTemp.status === 0 && selectedChurchTemp.church_id === 0 ?
                            <div className="button-wrapper">
                                <GreyButton class="mr10" name="????????? ?????? ??????" click={acceptNewChurch}/>
                                <GreyButton name="?????? ?????? ??????" click = {rejectTemp}/>
                            </div>:
                            <div className="button-wrapper">
                                <GreyButton class="mr10" name="?????? ?????? ??????" click = {acceptTemp}/>
                                <GreyButton name="?????? ?????? ??????" click = {rejectTemp}/>
                            </div>
                            }
                            
                            {/* <div>
                                <span className="add-church-title">?????????</span>
                                <input className="p4" type="text"/>
                            </div>
                            <div>
                                <span className="add-church-title">??????</span>
                                <input className="p4" type="text"/>
                            </div>
                            <div>
                                <span className="add-church-title">???????????? ?????????</span>
                                <input className="p4" type="text"/>
                            </div>
                            <div>
                                <span className="add-church-title"></span>
                                <input className="p4" type="text" placeholder="???????????? ??????"/>
                            </div>
                            <div>
                                <span className="add-church-title">?????? ??????</span>
                                <input className="p4" type="text"/>
                            </div>
                            <hr className="lecture-hr"/>
                            <div>
                                <span className="add-church-title">?????? ?????? ??????</span>
                                <input className="p4" type="text"/>
                            </div>
                            <div>
                                <span className="add-church-title">????????? ??????</span>
                                <input className="p4" type="text"/>
                            </div>
                            <div>
                                <span className="add-church-title">????????? ?????????</span>
                                <input className="p4" type="text"/>
                            </div>
                            <div>
                                <span className="add-church-title">?????? ??????</span>
                                <input className="p4" type="text" placeholder="??????"/>
                            </div>
                            <div className="mb8">
                                <span className="add-church-title"></span>
                                <input className="p4 mr15" placeholder="??? * ???" type="text"/>
                                <input className="p4" placeholder="??? * ??? * ???" type="text"/>
                            </div>
                            <div className="mb8">
                                <span className="add-church-title"></span>
                                <input className="p4" placeholder="????????????" type="text"/>
                            </div>
                            <div className="mb8">
                                <span className="add-church-title"></span>
                                <input className="p4" type="text"/>
                            </div>
                            <div>
                                <span className="add-church-title"></span>
                                <input className="p4" placeholder="???????????? ??????" type="text"/>
                            </div>
                            <hr className="lecture-hr"/>
                            <div>
                                <span className="add-church-title">?????? ?????????</span>
                                <input className="p4" type="text"/>
                            </div>
                            <div>
                                <span className="add-church-title">?????? ?????????</span>
                                <input className="p4" type="text"/>
                            </div>
                            <div>
                                <span className="add-church-title">?????? ????????????</span>
                                <input className="p4" type="text"/>
                            </div>
                            <div>
                                <span className="add-church-title">?????? ?????? ??????</span>
                                <input className="p4" type="text"/>
                            </div>
                            <div className="church-grid">
                                <span className="add-church-title">?????? ??????</span>
                                <textarea className="h180 p4"></textarea>
                            </div> */}
                        </div>
                    </div>
                </div>:
                null}

                <div className="mt50 table-row-church">
                    <span className="th">?????? ??????</span>
                    <span className="th">?????? ??????</span>
                    <span className="th church-location">?????? ??????</span>
                    <span className="th church-writer">?????????</span>
                    <span className="th church-date">????????????</span>
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
                    <div className="no-content">??????????????? ????????? ?????? ????????? ????????????.</div>
                }
            </div>
            <Pagination
                activePage={page}
                itemsCountPerPage={postsPerPage}
                totalItemsCount={churchTempData !== null ? churchTempData.length : 0}
                pageRangeDisplayed={5}
                prevPageText={"???"}
                nextPageText={"???"}
                onChange={handlePageChange}
            />
        </div>
    </div>
    );
}

export default AdminChurchTemp;
