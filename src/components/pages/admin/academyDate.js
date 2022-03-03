import React, {useState, useEffect} from "react";
import axios from 'axios';
import XLSX from "xlsx";
import FileSaver from "file-saver";

import GreyButton from '../../modules/button/admin_grey_btn';
import WhiteButton from '../../modules/button/white_button';
import CommonModal from '../../modules/modal/common';
import Calendar from '../../modules/calendar/crud_calendar';

import '../../../assets/css/academyDate.css'

function AdminAcademyDate(props) {
    const [ modalOpen, setModalOpen ] = useState(false);
    const [academyInfo, setacademyInfo] = useState(null);
    const [categoryInfo, setcategoryInfo] = useState(null);
    const [selectCategory, setselectCategory] = useState([]);
    const [addName, setaddName] = useState("");
    const [isAdd, setisAdd] = useState(false);
    const [previousAcademyInfo, setpreviousAcademyInfo] = useState(null)
    var array = null;
 
    // excel upload
    const [excelJSONData, setExcelJSONData] = useState(null);
    const [errorCount, seterrorCount] = useState(0);
    const excelFormat = {name:"일정명 (필수)", date:"날짜(2021-00-00 형식으로) (필수)", category:"분류(비전, 교육, 책임, 심리, 육아, 상담, 성경, 관계 중) -> 여러개 입력 시 , 로 연결해주세요 (육아,상담,성경 의 형식으로) (필수)" };

    useEffect(() => {
        readAcademy();
        readCategory();
        previousYearAcademy();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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


    const openModal = () => {
        // document.getElementById('upload').click()

        setModalOpen(true);
    }
    const closeModal = () => {
        setModalOpen(false);
    }

    const clickCategory = (category) => {
        array = selectCategory;
        var check = 0;
        for(var i=0 ; i<array.length ; i++) {
            if(array[i] === category.id) {
                const idx = array.findIndex(function(item) {return item === category.id})
                if (idx > -1) array.splice(idx, 1)
                check=1;
                break;
            }
        }
        if(check===0) {
            array.push(category.id)
        }

        readAcademy(array)
        setselectCategory(array)
        
    }

    const readAcademy = async(ids) => {
        ids="";
        
        for(var i=0 ; i<selectCategory.length ; i++) {
            ids += selectCategory[i];
            if(i<selectCategory.length-1)
                ids += ",";
        }
        if(selectCategory.length === 0)
            ids = null;
            
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'academyDate', {
                params:{
                    category: ids,
                    token: window.sessionStorage.getItem('token'),
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        setacademyInfo(response.data)  
    }

    const previousYearAcademy = async () => {
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'academyDate/previous', {
                params: {
                    token: window.sessionStorage.getItem('token'),
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        setpreviousAcademyInfo(response.data);
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
                    var temp = data;
                    
                    if(!temp.hasOwnProperty('date') || !temp.hasOwnProperty('name') || !temp.hasOwnProperty('category_name')) {
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

    const uploadExcelFile = async () => {
        // console.log(excelJSONData);
        var params = new URLSearchParams();
        params.append('data', JSON.stringify(excelJSONData));
        params.append('token', window.sessionStorage.getItem('token'));
        params.append('manageID', window.sessionStorage.getItem('id'));

        if(window.confirm("학사일정을 업로드하시겠습니까?")) {
            await axios.post(
            process.env.REACT_APP_RESTAPI_HOST + 'academyDate/excel',
            params,
            ).then(function(res) {
                alert("엑셀 업로드가 완료되었습니다!");
                setModalOpen(false);
                readAcademy();
                setExcelJSONData(null);
            });
        }
    }

    const readCategory = async() => {
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'academyDate/category', {
                params: {
                    token: window.sessionStorage.getItem('token'),
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        setcategoryInfo(response.data);
    }

    const exportToCSV = () => {
        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const fileName = "academy_date";
        const ws = XLSX.utils.json_to_sheet(academyInfo);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    const exportExcelForamt = () => {
        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const fileName = "academy_date_format";
        const ws = XLSX.utils.json_to_sheet(excelFormat);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    const exportToCSVPreviousYear = () => {
        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const fileName = "previous_academy_date";
        const ws = XLSX.utils.json_to_sheet(previousAcademyInfo);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    const clickAddBtn = () => {
        setaddName("");
        if(isAdd)
            setisAdd(false);
        else
            setisAdd(true);
    }

    const addCategory = async () => {
        var params = new URLSearchParams();
        params.append('name', addName);
        params.append('token', window.sessionStorage.getItem('token'));
        params.append('manageID', window.sessionStorage.getItem('id'));

        if(window.confirm("카테고리를 추가하시겠습니까?")) {
            await axios.post(
            process.env.REACT_APP_RESTAPI_HOST + 'academyDate/category', 
            params,
            ).then(function(res) {
                alert("카테고리가 추가되었습니다.");
                readCategory();
                setisAdd(false);
                setaddName("");
            });
        }
    }

    const deleteCategory = (id) => {
        if(window.confirm("카테고리와 연관된 모든 일정이 함께 삭제됩니다. 카테고리를 삭제하시겠습니까?")) {
            axios(
                {
                    url: process.env.REACT_APP_RESTAPI_HOST+'academyDate/category',
                    method: 'delete',
                    data: {
                        id: id,
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            ).then(function(res) {
                alert("삭제가 완료되었습니다.")
                readCategory();
                readAcademy();
            })
        }
    }

    return (
        <div>
            <p className="admin-title-header">학사일정 관리</p>
            <div className="admin-content-wrapper">
                <p className="table-name mb40">
                    학사일정 관리
                    <GreyButton class="none-buttoon right" name="학사 일정 다운로드" click={exportToCSV}/>
                    <GreyButton class="none-buttoon right mr10" name="업로드 포맷 다운" click={exportExcelForamt}/>
                    <GreyButton class="none-buttoon right mr10" name="전년도 학사 일정 가져오기" click={exportToCSVPreviousYear}/>
                    <input
                        type='file'
                        accept='.xlsx'
                        onChange={readExcel}
                        id='uploadExcel'
                        name='uploadExcel'
                        style={{ display: 'none' }}
                    />
                    <label htmlFor='uploadExcel' className="grey-btn">
                        일정 파일 업로드
                    </label>
                </p>
                <CommonModal open={modalOpen} close={closeModal} func={uploadExcelFile} header="일정 업로드 목록" footer="데이터 저장">
                    <p className="mb20">
                        빨간 색으로 표시된 것은 업로드 할 수 없는 데이터입니다. 빼고 업로드를 진행할까요?<br/>
                        현재 잘못된 데이터는 {errorCount}개 입니다.
                    </p>
                    
                    <div className="table-wrapper mt0 relative modal-table">
                        <div className="table-row-academy" >
                            <span className="th">일정 이름</span>
                            <span className="th">날짜</span>
                            <span className="th">카테고리</span>
                        </div>
                        {excelJSONData !== null ?
                        excelJSONData.map((data, i) =>
                        <div key={i} className={data.isValid ? "table-row-academy" : "table-row-academy modal-error"}>
                            <span className="td">{data.name}</span>
                            <span className="td">{data.date}</span>
                            <span className="td">{data.category_name}</span>
                        </div>
                        )
                        :
                        <div>엑셀 데이터가 없습니다.</div>
                        }
                        
                    </div>
                </CommonModal>
                <div className="academy-wrapper">
                    <div style={{padding:"15px"}}>
                        <Calendar readAcademy={readAcademy} calendarData = {academyInfo} categoryData={categoryInfo} path={window.location.href.replace(process.env.REACT_APP_DEFAULT_WHOLE_URL, "/")}/>
                    </div>
                    <div className="academy-category">
                        <div className="academy-category-title">
                            카테고리별로 보기 (중복 선택 가능)
                        </div>
                        <div className="academy-category-content">                            
                            { categoryInfo !== null ?
                                categoryInfo.map((category, index) => 
                                <span key={category.id} className="academyDate-category" style={{position:'relative', padding:'9px 5px'}}>
                                    <WhiteButton 
                                    name={category.name}
                                    class={selectCategory.find(element => element === category.id) ? "clicked-category mb10" : "mb10"} 
                                    click={() => clickCategory(category)}/>
                                    <span className="delete-category-btn" onClick={() => deleteCategory(category.id)}>X</span>
                                </span>
                                )
                                :
                                <div>카테고리가 없습니다.</div>
                            }
                            <WhiteButton name="카테고리 추가" class={isAdd ? "clicked-category" : ""} click={() => clickAddBtn()}/>
                        </div>
                        {isAdd?
                        <div style={{padding:"8px"}}>
                            <input className="categoryAddInput" defaultValue={addName} onChange={(e)=>setaddName(e.target.value)}/>
                            <GreyButton class="categoryAddBtn" name="추가" click={addCategory}/>
                        </div>
                        :
                        null
                        }
                    </div>
                </div>
            </div>
        </div>
        )
}

export default AdminAcademyDate;