import React, {useState,useEffect} from "react";
import axios from 'axios';
import XLSX from "xlsx";
import FileSaver from "file-saver";
import Postcode from '@actbase/react-daum-postcode';
import Pagination from "react-js-pagination";

import '../../../assets/css/table.css';
import '../../../assets/css/default.css';
import '../../../assets/css/admin_lecture.css';
import '../../../assets/css/admin_church.css';
import GreyButton from '../../modules/button/admin_grey_btn';
import BlueButton from '../../modules/button/blue_button';
import CommonModal from '../../modules/modal/common';

function AdminChurch() {
    const [keyword, setKeyword] = useState(null);
    const [ modalOpen, setModalOpen ] = useState(false);
    const [ isInsertModalOpen, setisInsertModalOpen ] = useState(false)
    const [clickedChurch, setclickedChurch] = useState(null);
    const [editChurch, seteditChurch] = useState(false);
    const [editChurchInfo, seteditChurchInfo] = useState({userId:window.sessionStorage.getItem('id'), name:"", region_id:"", nation:"", city:"", district:"", zip_code:"", addr1:"", addr2:"", phone:"", email:"", page_url:"", fax:"", size:"", denomination:"", pastor:"", admin_name:"", hgu_yn:"", hgu_memo:"", writer_name:"", memo:""})
    const [addChurchInfo, setaddChurchInfo] = useState({userId:window.sessionStorage.getItem('id') , name:"", region_id:"", nation:"대한민국", city:"", district:"", zip_code:"", addr1:"", addr2:"", phone:"", email:"", page_url:"", fax:"", size:"", denomination:"", pastor:"", admin_name:"", hgu_yn:"", hgu_memo:"", writer_name:"", memo:""})
    const [churchInfo, setchurchInfo] = useState(null)
    const [isPostModal, setPostModal] = useState(false);
    const [isPostCodeOpen, setisPostCodeOpen] = useState(false)
    const [page, setPage] = useState(1);
    const postsPerPage = 10;
    const [isShowDelete, setisShowDelete] = useState(false);
    // excel upload
    const [excelJSONData, setExcelJSONData] = useState(null);
    const [errorCount, seterrorCount] = useState(0);
    const excelFormat = {name:"교회 이름 (필수)", nation:"대한민국(필수)", city:"경북 (필수)", district:"포항시 북구 (필수)", zip_code:"우편번호 (필수)", addr1:"경북 포항시 북구 흥해읍 한동로 558 (필수)", addr2:"뉴턴홀 (필수)", phone:"교회 번호 (필수)", email:"교회 이메일", page_url:"교회 홈페이지 주소", fax:"교회 팩스 번호", size:"교회 규모(명)", denomination:"교단", pastor:"담임목사", admin_name:"교회 담당자 이름", hgu_yn:"한동대와 연관성 여부", hgu_memo:"한동대와 연관성 세부정보", memo:"비고"};

    useEffect(() => {
        readChurchInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setPage(1);
        setclickedChurch(null);
    }, [isShowDelete])

    useEffect(() => {
        if(excelJSONData !== null) {
            var count = 0;
            excelJSONData.forEach(data => {
                if(data.isValid === false)
                    count++;
            });
            seterrorCount(count);
        }
    }, [excelJSONData])

    const readChurchInfo = async () => {

        if(keyword !== null){
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'church',
                {
                    params: {
                        keyword: encodeURI(keyword),
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );
            setchurchInfo(response.data);
        }else {
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'church', {
                    params: {
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );
            setchurchInfo(response.data);
        }
        setKeyword(null);
        setclickedChurch(null);
    }

    const searchKeywordChanged = e => {
        setKeyword(e.target.value);
    }

    function clickChurch(church) {
        if(clickedChurch === null || church !== clickedChurch) {
            setclickedChurch(church);
            seteditChurchInfo(church);
            seteditChurch(false);
        } else {
            setclickedChurch(null);
            seteditChurch(false);
            seteditChurchInfo({name:"", region_id:"", city:"", district:"", zip_code:"", addr1:"", addr2:"", phone:"", email:"", page_url:"", fax:"", size:"", denomination:"", pastor:"", admin_name:"", hgu_yn:"", hgu_memo:"", writer_name:"", memo:""})
        }
    }

    const openModal = () => {
        setModalOpen(true);
    }
    const closeModal = () => {
        setModalOpen(false);
    }
    const insertModalOpen = () => {
        setisInsertModalOpen(true);
    }
    const insertModalClose = () => {
        setisInsertModalOpen(false);
        setaddChurchInfo({userId:window.sessionStorage.getItem('id') , name:"", region_id:"", nation:"", city:"", district:"", zip_code:"", addr1:"", addr2:"", phone:"", email:"", page_url:"", fax:"", size:"", denomination:"", pastor:"", admin_name:"", hgu_yn:"", hgu_memo:"", writer_name:"", memo:""})
    }
    const editBtnClick = () => {
        seteditChurch(true);
    }
    const cancelBtnClick = () => {
        seteditChurch(false);
    }

    const onAdd = (e) => {
        const { value, name } = e.target;
        setaddChurchInfo({
            ...addChurchInfo,
            [name]: value
        });
    };

    const onEdit = (e) => {
        const { value, name } = e.target;
        seteditChurchInfo({
            ...editChurchInfo,
            [name]: value
        });
    };

    const createChurch = async() => {
        var params = new URLSearchParams();
        params.append('userId', window.sessionStorage.getItem('id'));
        params.append('name', addChurchInfo.name);
        params.append('nation', addChurchInfo.nation);
        params.append('district', addChurchInfo.district);
        params.append('zip_code', addChurchInfo.zip_code);
        params.append('addr1', addChurchInfo.addr1);
        params.append('addr2', addChurchInfo.addr2);
        params.append('phone', addChurchInfo.phone);
        params.append('email', addChurchInfo.email);
        params.append('page_url', addChurchInfo.page_url);
        params.append('fax', addChurchInfo.fax);
        params.append('size', addChurchInfo.size);
        params.append('denomination', addChurchInfo.denomination);
        params.append('pastor', addChurchInfo.pastor);
        params.append('admin_name', addChurchInfo.admin_name);
        params.append('hgu_yn', addChurchInfo.hgu_yn);
        params.append('hgu_memo', addChurchInfo.hgu_memo);
        params.append('memo', addChurchInfo.memo);
        params.append('token', window.sessionStorage.getItem('token'));
        params.append('manageID', window.sessionStorage.getItem('id'));

        if(window.confirm("교회를 추가하시겠습니까?")) {
            const response = await axios.post(
            process.env.REACT_APP_RESTAPI_HOST + 'church',
            params,
            ).then(function(res) {
                alert("추가되었습니다.");
                readChurchInfo();
                setaddChurchInfo({userId:window.sessionStorage.getItem('id') , name:"", region_id:"", city:"", district:"", zip_code:"", addr1:"", addr2:"", phone:"", email:"", page_url:"", fax:"", size:"", denomination:"", pastor:"", admin_name:"", hgu_yn:"", hgu_memo:"", writer_name:"", memo:""})
                setisInsertModalOpen(false);
            });
        }
    }

    const updateChurch = async() => {
        if(window.confirm("교회 정보를 수정하시겠습니까?")) {
            editChurchInfo.token = window.sessionStorage.getItem('token');
            editChurchInfo.manageID = window.sessionStorage.getItem('id');
            axios(
                {
                url: process.env.REACT_APP_RESTAPI_HOST+'church/churchId/'+window.sessionStorage.getItem('id'),
                method: 'put',
                data: editChurchInfo
                }
            ).then(function(res) {
                alert("수정이 완료되었습니다.");
                readChurchInfo();
                setclickedChurch(null)
                seteditChurch(false)
                seteditChurchInfo({name:"", region_id:"", city:"", district:"", zip_code:"", addr1:"", addr2:"", phone:"", email:"", page_url:"", fax:"", size:"", denomination:"", pastor:"", admin_name:"", hgu_yn:"", hgu_memo:"", writer_name:"", memo:""});
            })
        }
    }

    const deleteChurch = async() => {
        if(window.confirm("교회를 삭제하시겠습니까?")) {
            axios(
                {
                    url: process.env.REACT_APP_RESTAPI_HOST+'church/delete',
                    method: 'put',
                    data: {
                        church_id: clickedChurch.id,
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            ).then(function(res) {
                readChurchInfo();
                alert("삭제가 완료되었습니다.")
                setclickedChurch(null)
            })
        }
    }

    const recoverChurch = () => {
        if(window.confirm("교회를 복구하시겠습니까?")) {
            axios(
                {
                    url: process.env.REACT_APP_RESTAPI_HOST+'church/recover',
                    method: 'put',
                    data: {
                        church_id: clickedChurch.id,
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            ).then(function(res) {
                readChurchInfo();
                alert("복구가 완료되었습니다.")
                setclickedChurch(null)
            })
        }
    }

    function readExcel(event) {
        seterrorCount(0);
        let input = event.target;
        let reader = new FileReader();
        reader.onload = function () {
            let data = reader.result;
            let workBook = XLSX.read(data, { type: 'binary' });
            workBook.SheetNames.forEach(function (sheetName) {
                let rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
                var changedData = [];
                rows.forEach(data => {
                    var temp = {
                        name:data.name, 
                        nation: data.nation,
                        zip_code:data.zip_code, 
                        city: data.city,
                        district: data.district,
                        addr1:data.addr1, 
                        addr2:data.addr2, 
                        phone:data.phone, 
                        email:data.email, 
                        page_url:data.page_url, 
                        fax:data.fax, 
                        size:data.size, 
                        denomination:data.denomination, 
                        pastor:data.pastor, 
                        admin_name:data.admin_name, 
                        hgu_yn:data.hgu_yn, 
                        hgu_memo:data.hgu_memo, 
                        writer_name:data.writer_name, 
                        memo:data.memo};

                    for (var variable in temp) { 
                        if(temp[variable] === undefined) {
                            temp[variable] = "";
                        }   
                    }
                    if(temp['name'] === "" || temp['addr1'] === "" || temp['addr2'] === "" || temp['zip_code'] === "" || temp['phone'] === "") {
                        temp.isValid = false;
                    } else {
                        temp.isValid = true;
                    }
                    changedData.push(temp);
                });
                setExcelJSONData(changedData);
            })
        };
        if(input.files[0] !== undefined) {
            reader.readAsBinaryString(input.files[0]);
            openModal();
            event.target.value = null;
        }
    }

    const uploadExcelFile = async() => {
        var params = new URLSearchParams();
        params.append('data', JSON.stringify(excelJSONData));
        
        if(window.confirm("교회 정보를 업로드하시겠습니까?")) {
            await axios.post(
            process.env.REACT_APP_RESTAPI_HOST + 'church/excel/'+window.sessionStorage.getItem('id'),
            params,
            ).then(function(res) {
                alert("엑셀 업로드가 완료되었습니다!");
                setModalOpen(false);
                readChurchInfo();
                setExcelJSONData(null);
            });
        }
    }
    
    const exportToCSV = () => {
        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const fileName = "church";
        const ws = XLSX.utils.json_to_sheet(churchInfo);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    const exportExcelForamt = () => {
        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const fileName = "church_format";
        const ws = XLSX.utils.json_to_sheet(excelFormat);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    const selectPostCode = (data) => {
        setaddChurchInfo({
            ...addChurchInfo,
            addr1: data.address,
            city: data.sido,
            district: data.sigungu,
            zip_code: data.zonecode
        });
        setisPostCodeOpen(false);
    }

    const selectEditPostCode = (data) => {
        seteditChurchInfo({
            ...editChurchInfo,
            addr1: data.address,
            city: data.sido,
            district: data.sigungu,
            zip_code: data.zonecode
        });
    }

    const closePostModal = () => {
        setPostModal(false);
    }

    const handlePageChange = (page) => { 
        setPage(page); 
    };

    function currentPosts(tmp) {
        var indexOfLast = page * postsPerPage;
        var indexOfFirst = indexOfLast - postsPerPage;

        let currentPosts = 0;
        if(isShowDelete){ // 삭제된 거 보여줄때   
            currentPosts = churchInfo.filter(data => data.del_date !== null).slice(indexOfFirst, indexOfLast);
        } else { // 전체 강의일 때
            currentPosts = churchInfo.filter(data => data.del_date === null).slice(indexOfFirst, indexOfLast);
        }
        return currentPosts;
    }

    return (
    <div>
        <p className="admin-title-header">교회 관리</p>
        <div className="admin-content-wrapper">
            <div className="table-wrapper mt0 relative">
                <p className="table-name mb40">
                    {isShowDelete ? "삭제된 교회 목록" : "교회 목록"}
                    <GreyButton class="right" name="교회 추가하기" click={insertModalOpen}/>
                    <GreyButton class="right mr10" name="엑셀 파일 다운로드" click={exportToCSV}/>
                    <GreyButton class="right mr10" name="엑셀 업로드 포맷" click={exportExcelForamt}/>

                    <input
                        type='file'
                        accept='.xlsx'
                        onChange={readExcel}
                        id='uploadExcel'
                        name='uploadExcel'
                        style={{ display: 'none' }}
                    />
                    <label htmlFor='uploadExcel' className="grey-btn">
                        교회 정보 업로드
                    </label>
                </p>

                <CommonModal open={isPostModal} close={closePostModal} func={closePostModal} header="주소 찾기" footer="닫기"> 
                    <Postcode
                        style={{ width: 320, height: 320 }}
                        jsOptions={{ animated: true, hideMapBtn: true }}
                        onSelected={data => {
                            selectEditPostCode(data);
                            setPostModal(false);
                        }}
                    />
                </CommonModal>

                <CommonModal open={ isInsertModalOpen } close={ insertModalClose } func={createChurch} header="교회 추가하기" footer="추가하기">
                    <div id="church-info" className="lecture-info-wrapper mb40">
                        <div className="mt20">
                            <span className="add-church-title">교회명</span>
                            <input className="p4" type="text" name="name" onChange={onAdd}/>
                        </div>
                        <div>
                            <span className="add-church-title">교단</span>
                            <input className="p4" type="text" name="denomination" onChange={onAdd}/>
                        </div>
                        {/* <div>
                            <span className="add-church-title">교단</span>
                            <select className="w158 p4">
                                <option>교단</option>
                            </select>
                        </div> */}
                        <div>
                            <span className="add-church-title">한동대와 연관성</span>
                            <input className="p4 mr15" placeholder="예) 한동대 후원 교회" name="hgu_yn" onChange={onAdd}/>
                            <input className="p4 no-left-margin" placeholder="세부사항 입력"  name="hgu_memo" onChange={onAdd}/>
                        </div>
                        <div>
                            <span className="add-church-title">교회 규모</span>
                            <input className="p4 no-left-margin" placeholder="예) 1000명 이상"  name="size" onChange={onAdd}/>
                        </div>
                        <hr className="lecture-hr"/>
                        <div>
                            <span className="add-church-title">담임 목사 성명</span>
                            <input className="p4" type="text" name="pastor" onChange={onAdd}/>
                        </div>
                        <div>
                            <span className="add-church-title">실무자 성명</span>
                            <input className="p4" type="text" name="admin_name" onChange={onAdd}/>
                        </div>
                        <div>
                            <span className="add-church-title">정보 제공자</span>
                            <input className="p4" type="text" name="writer_name" onChange={onAdd}/>
                        </div>
                        <div>
                            <span className="add-church-title">주소 입력</span>
                            <input className="church-addr no-left-margin w158 p4 mr15" type="text" placeholder="국가" value={addChurchInfo.nation} name="nation" onChange={onAdd}/>
                            <input className="church-addr w158 p4 mr15" type="text" placeholder="시/도" value={addChurchInfo.city} name="city" onChange={onAdd}/>
                            <input className="church-addr no-left-margin w158 p4 mr15" placeholder="시/군/구" type="text" value={addChurchInfo.district} name="district" onChange={onAdd}/>
                        </div>

                        <div className="mb8" style={{position:'relative'}}>
                            <span className="add-church-title"></span>
                            <input readOnly className="p4 mr15" type="text" placeholder="우편 번호" value={addChurchInfo.zip_code} name="zip_code" onChange={onAdd}/>
                            {isPostCodeOpen ? 
                            <BlueButton click={() => setisPostCodeOpen(false)} name="주소창닫기" class="blue-btn"/>:
                            <BlueButton click={() => setisPostCodeOpen(true)} name="주소찾기" class="blue-btn"/>
                            }
                            {isPostCodeOpen &&
                            <Postcode
                                style={{ width: 320, height: 320, position:'absolute', left:'170px' }}
                                jsOptions={{ animated: true }}
                                onSelected={data => selectPostCode(data)}
                            />
                            }
                        </div>
                        <div className="mb8">
                            <span className="add-church-title"></span>
                            <input readOnly className="p4 w400" type="text" placeholder="주소" name="addr1" value={addChurchInfo.addr1} onChange={onAdd}/>
                        </div>
                        <div className="mb8">
                            <span className="add-church-title"></span>
                            <input className="p4 w400" type="text" placeholder="상세 주소 입력" name="addr2" onChange={onAdd}/>
                        </div>
                        <hr className="lecture-hr"/>
                        <div >
                            <span className="add-church-title">교회 연락처</span>
                            <input className="p4" type="text" name="phone" onChange={onAdd}/>
                        </div>
                        <div>
                            <span className="add-church-title">교회 이메일</span>
                            <input className="p4" type="text" name="email" onChange={onAdd}/>
                        </div>
                        <div>
                            <span className="add-church-title">교회 홈페이지</span>
                            <input className="w400 p4" type="text" name="page_url" onChange={onAdd}/>
                        </div>
                        <div>
                            <span className="add-church-title">교회 팩스 번호</span>
                            <input className="w400 p4" type="text" name="fax" onChange={onAdd}/>
                        </div>
                        <hr className="lecture-hr"/>
                        <div className="church-grid mb30">
                            <span className="add-church-title">메모 사항</span>
                            <textarea className="h180 p4" name="memo" onChange={onAdd}></textarea>
                        </div>
                    </div>
                </CommonModal>

                <CommonModal open={ modalOpen } close={ closeModal } func={uploadExcelFile} header="파일 업로드 목록" footer="데이터 저장">
                    <p>
                        빨간 색으로 표시된 것은 업로드 할 수 없는 데이터입니다. 빼고 업로드를 진행할까요?<br/>
                        현재 잘못된 데이터는 {errorCount}개 입니다.
                    </p>
                    <div className="table-wrapper mt0 relative modal-table" style={{width:"2200px"}}>
                        <div className="mt50 table-row-modal-church">
                            <span className="th">이름</span>
                            <span className="th">국가</span>
                            <span className="th">우편번호</span>
                            <span className="th">주소</span>
                            <span className="th">세부지역</span>
                            <span className="th">교회 번호</span>
                            <span className="th">교회 이메일</span>
                            <span className="th">홈페이지</span>
                            <span className="th">팩스</span>
                            <span className="th">교회규모</span>
                            <span className="th">교단</span>
                            <span className="th">담임목사</span>
                            <span className="th">관리자이름</span>
                            <span className="th">한동대 연관성</span>
                            <span className="th">한동대 세부 연관</span>
                            <span className="th">작성자이름</span>
                            <span className="th">메모</span>
                        </div>
                        {excelJSONData !== null ?
                        excelJSONData.map((data, i) =>
                        <div key={i} className={data.isValid ? "table-row-modal-church" : "table-row-modal-church modal-error"}>
                            <span className="td">{data.name}</span>
                            <span className="td">{data.nation}</span>
                            <span className="td">{data.zip_code}</span>
                            <span className="td">{data.addr1}</span>
                            <span className="td">{data.addr2}</span>
                            <span className="td">{data.phone}</span>
                            <span className="td">{data.email}</span>
                            <span className="td">{data.page_url}</span>
                            <span className="td">{data.fax}</span>
                            <span className="td">{data.size}</span>
                            <span className="td">{data.denomination}</span>
                            <span className="td">{data.pastor}</span>
                            <span className="td">{data.admin_name}</span>
                            <span className="td">{data.hgu_yn}</span>
                            <span className="td">{data.hgu_memo}</span>
                            <span className="td">{data.writer_name}</span>
                            <span className="td">{data.memo}</span>
                        </div>
                        )
                        :
                        <div>엑셀 데이터가 없습니다.</div>
                        }
                    </div>
                </CommonModal>

                <div className="mb35">
                    <input className="p48 search-lecture-input" type="text" placeholder="교회명, 교단, 연관성, 담임 목사명, 실무자명, 전체 주소, 연락처, 이메일, 메모 사항으로 키워드 검색" value={keyword || ""} onChange={searchKeywordChanged}/>
                    <GreyButton class="mr15" name="검색" click={readChurchInfo}/>
                    {!isShowDelete ?
                        <GreyButton name="삭제된 교회 보기" click={() => {setisShowDelete(true)}}/>:
                        <GreyButton name="교회 보기" click={() => {setisShowDelete(false)}}/>}
                </div>

                {clickedChurch !== null ?
                editChurch === true ?
                // edit church
                <div id="church-info" className="lecture-info-wrapper mb40">
                    <div className="church-info lecture-date mb30">
                        <span>작성일자: {clickedChurch.reg_date}</span>
                        <span>작성자: {clickedChurch.creater_name}</span>
                        <span className="">관리자확인 일자: {clickedChurch.confirm_date}</span>
                        <span className="info-admin">수정일자: {clickedChurch.update_date}</span>
                        <span className="info-admin">수정자: {clickedChurch.updater_name}</span>
                    </div>
                    <div>
                        <span className="add-church-title">교회명</span>
                        <input className="p4" type="text" value={editChurchInfo.name} name="name" onChange={onEdit}/>
                    </div>
                    <div>
                        <span className="add-church-title">교단</span>
                        <input className="p4" type="text" value={editChurchInfo.denomination} name="denomination" onChange={onEdit}/>
                    </div>
                    {/* <div>
                        <span className="add-church-title">교단</span>
                        <select className="w158 p4">
                            <option>교단</option>
                        </select>
                    </div> */}
                    <div>
                        <span className="add-church-title">한동대와 연관성</span>
                        <input className="p4 mr15" type="text" value={editChurchInfo.hgu_yn} name="hgu_yn" onChange={onEdit}/>
                        {/* <select className="w158 p4 mr15" >
                            <option>한동대와 연관성</option>
                        </select> */}
                        <input className="p4 no-left-margin" placeholder="세부사항 입력" value={editChurchInfo.hgu_memo} name="hgu_memo" onChange={onEdit}/>
                    </div>
                    <div>
                        <span className="add-church-title">교회 규모</span>
                        {/* <select className="w158 p4">
                            <option>교회 규모</option>
                        </select> */}
                        <input className="p4" value={editChurchInfo.size} name="size" onChange={onEdit}/>
                    </div>
                    <hr className="lecture-hr"/>
                    <div>
                        <span className="add-church-title">담임 목사 성명</span>
                        <input className="p4" type="text" value={editChurchInfo.pastor} name="pastor" onChange={onEdit}/>
                    </div>
                    <div>
                        <span className="add-church-title">실무자 성명</span>
                        <input className="p4" type="text" value={editChurchInfo.admin_name} name="admin_name" onChange={onEdit}/>
                    </div>
                    <div>
                        <span className="add-church-title">정보 제공자</span>
                        <input className="p4" type="text" value={editChurchInfo.writer_name} name="writer_name" onChange={onEdit}/>
                    </div>
                    <div>
                        <span className="add-church-title">주소 입력</span>
                        <input className="church-addr no-left-margin w158 p4 mr15" type="text" placeholder="국가" value={editChurchInfo.nation} name="nation" onChange={onEdit}/>
                        <input className="church-addr w158 p4 mr15" type="text" placeholder="시/도" value={editChurchInfo.city} name="city" onChange={onEdit}/>
                        <input className="church-addr no-left-margin w158 p4 mr15" placeholder="시/군/구" type="text" value={editChurchInfo.district} name="district" onChange={onEdit}/>
                    </div>
                    <div className="mb8">
                        <span className="add-church-title"></span>
                        <input readOnly className="p4 mr10" type="text" placeholder="우편 번호" value={editChurchInfo.zip_code} name="zip_code" onChange={onEdit}/>
                        <BlueButton class="blue-btn" name="주소검색" click={() => setPostModal(true)}/>
                    </div>
                    <div className="mb8">
                        <span className="add-church-title"></span>
                        <input readOnly className="p4 mr15 w400" type="text" value={editChurchInfo.addr1} name="addr1" onChange={onEdit}/>
                    </div>
                    <div className="mb8">
                        <span className="add-church-title"></span>
                        <input className="p4 w400" type="text" placeholder="상세 주소 입력" value={editChurchInfo.addr2} name="addr2" onChange={onEdit}/>
                    </div>
                    <hr className="lecture-hr"/>
                    <div >
                        <span className="add-church-title">교회 연락처</span>
                        <input className="p4" type="text" value={editChurchInfo.phone} name="phone" onChange={onEdit}/>
                    </div>
                    <div>
                        <span className="add-church-title">교회 이메일</span>
                        <input className="p4" type="text" value={editChurchInfo.email} name="email" onChange={onEdit}/>
                    </div>
                    <div>
                        <span className="add-church-title">교회 홈페이지</span>
                        <input className="w400 p4" type="text" value={editChurchInfo.page_url} name="page_url" onChange={onEdit}/>
                    </div>
                    <div>
                        <span className="add-church-title">교회 팩스 번호</span>
                        <input className="w400 p4" type="text" value={editChurchInfo.fax} name="fax" onChange={onEdit}/>
                    </div>
                    <hr className="lecture-hr"/>
                    <div className="church-grid">
                        <span className="add-church-title">메모 사항</span>
                        <textarea className="h180 p4" value={editChurchInfo.memo} name="memo" onChange={onEdit}></textarea>
                    </div>
                    <div className="button-wrapper">
                        <GreyButton class="mr15" name="수정 완료" click={updateChurch}/>
                        <GreyButton class="mb40" name="수정 취소" click={cancelBtnClick}/>
                    </div>
                </div>
                :
                // read church
                <div id="read-church-info" className="lecture-info-wrapper mb40">
                    <div className="church-info lecture-date mb30">
                        <span>작성일자: {clickedChurch.reg_date}</span>
                        <span>작성자: {clickedChurch.creater_name}</span>
                        <span>관리자확인 일자: {clickedChurch.confirm_date}</span>
                        <span>수정일자: {clickedChurch.update_date}</span>
                        <span>수정자: {clickedChurch.updater_name}</span>
                    </div>
                    <div className="read-church-content">
                        <div>
                            <span className="add-church-title">교회명</span>
                            <span>{clickedChurch.name}</span>
                        </div>
                        <div>
                            <span className="add-church-title">교단</span>
                            <span>{clickedChurch.denomination}</span>
                        </div>
                        <div>
                            <span className="add-church-title">한동대와 연관성</span>
                            <span>{clickedChurch.hgu_yn}</span>
                            <span>{clickedChurch.hgu_memo}</span>
                        </div>
                        <div>
                            <span className="add-church-title">교회 규모</span>
                            <span>{clickedChurch.size}</span>
                        </div>
                        <hr className="lecture-hr"/>
                        <div>
                            <span className="add-church-title">담임 목사 성명</span>
                            <span>{clickedChurch.pastor}</span>
                        </div>
                        <div>
                            <span className="add-church-title">실무자 성명</span>
                            <span>{clickedChurch.admin_name}</span>
                        </div>
                        <div>
                            <span className="add-church-title">정보 제공자</span>
                            <span>{clickedChurch.writer_name}</span>
                        </div>
                        {/* <div>
                            <span className="add-church-title">실무자 연락처</span>
                            <span>{clickedChurch.admin_phone}</span>
                        </div> */}
                        <div>
                            <span className="add-church-title">주소</span>
                            <span>{clickedChurch.nation}</span>
                            <span>{clickedChurch.city}</span>
                            <span>{clickedChurch.district}</span>
                        </div>
                        <div>
                            <span className="add-church-title">우편 번호</span>
                            <span>{clickedChurch.zip_code}</span>
                        </div>
                        <div>
                            <span className="add-church-title">교회 주소</span>
                            {/* <span className=" church-blank add-church-title"></span> */}
                            <span>{clickedChurch.addr1}</span>
                        </div>
                        <div>
                            <span className="add-church-title">교회 세부 주소</span>
                            <span>{clickedChurch.addr2}</span>
                        </div>
                        <hr className="lecture-hr"/>
                        <div >
                            <span className="add-church-title">교회 연락처</span>
                            <span>{clickedChurch.phone}</span>
                        </div>
                        <div>
                            <span className="add-church-title">교회 이메일</span>
                            <span>{clickedChurch.email}</span>
                        </div>
                        <div>
                            <span className="add-church-title">교회 홈페이지</span>
                            <span><a href={clickedChurch.page_url !== "" && clickedChurch.page_url !== null ? clickedChurch.page_url : ""}>{clickedChurch.page_url}</a></span>
                        </div>
                        <div>
                            <span className="add-church-title">교회 팩스 번호</span>
                            <span>{clickedChurch.fax}</span>
                        </div>
                        <hr className="lecture-hr"/>
                        <div className="church-grid">
                            <span className="add-church-title">메모 사항</span>
                            <span>{clickedChurch.memo}</span>
                        </div>
                        {isShowDelete ?
                        <div className="button-wrapper">
                            <GreyButton class="" name="복구하기" click={recoverChurch}/>
                        </div>
                        :
                        <div className="button-wrapper">
                            <GreyButton class="mr15" name="수정하기" click={editBtnClick}/>
                            <GreyButton class="" name="삭제하기" click={deleteChurch}/>
                        </div>
                        }
                    </div>
                </div> 
                :
                null
                }
                
                <div className="mt50 table-row-church">
                    <span className="th">교단</span>
                    <span className="th">이름</span>
                    <span className="th church-location">주소</span>
                    <span className="th church-writer">정보제공자</span>
                    <span className="th church-date">작성일자</span>
                </div>
                {churchInfo !== null && currentPosts(churchInfo).length > 0 ?
                currentPosts(churchInfo).map((church, i) =>
                    <div key={church.id} className={church === clickedChurch ? "table-row-church click-inst-row" : "table-row-church"} onClick = {() => {clickChurch(church)}}>
                        <span className="td">{church.denomination}</span>
                        <span className="td">{church.name}</span>
                        <span className="td church-location">{church.addr1} {church.addr2}</span>
                        <span className="td church-writer">{church.writer_name}</span>
                        <span className="td church-date">{church.reg_date}</span>
                    </div>
                )
                : <div className="no-content">교회 정보 없음</div>
                }
            </div>
            <Pagination 
                activePage={page} 
                itemsCountPerPage={postsPerPage} 
                totalItemsCount={churchInfo === null ? 
                    0 :
                    isShowDelete ? 
                    churchInfo.filter(data => data.del_date !== null).length:
                    churchInfo.filter(data => data.del_date === null).length} 
                pageRangeDisplayed={5} 
                prevPageText={"‹"} 
                nextPageText={"›"} 
                onChange={handlePageChange} 
            />
        </div>
    </div>
    )
}

export default AdminChurch;