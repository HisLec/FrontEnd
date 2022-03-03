import React, {useState, useEffect} from "react";
import axios from 'axios';
import XLSX from "xlsx";
import FileSaver from "file-saver";
import '../../../assets/css/table.css';
import '../../../assets/css/default.css';
import '../../../assets/css/admin_category.css';
import '../../../assets/css/admin_staticstics.css';
import WhiteButton from '../../modules/button/white_button';


function AdminStatistics() {
    const [lecturePeriod, setlecturePeriod] = useState(0);
    const [statInstPosition, setstatInstPosition] = useState(null);
    const [statLecture, setstatLecture] = useState(null);
    const [positionPeriod, setpositionPeriod] = useState(0);

    const [statAllData, setstatAllData] = useState(null);

    const [statInstructor, setStatInstructor] = useState(null);
    const [statRegion, setStatRegion] = useState(null);
    const [statDenomination, setStatDenomination] = useState(null);

    const [denominationPeriod, setDenominationPeriod] = useState(null);
    const [regionPeriod, setRegionPeriod] = useState(null);
    const [instructorPeriod, setInstructorPeriod] = useState(null);
    
    useEffect(() => {
        readStatLecture();
        readStatInstByPosition();

        readStatAllData();
        readStatDenomination(null);
        readStatInstructor(null);
        readStatRegion(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        readStatLecture();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lecturePeriod])

    useEffect(() => {
        readStatInstByPosition();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [positionPeriod])

    const readStatLecture = async () => {
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'lecture/stat/'+lecturePeriod, {
                params: {
                    token: window.sessionStorage.getItem('token'),
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        setstatLecture(response.data);
    }

    const readStatInstByPosition = async() => {
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'instructor/stat/position/'+positionPeriod, {
                params: {
                    token: window.sessionStorage.getItem('token'),
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        setstatInstPosition(response.data);
    }


    const readStatAllData = async () => {
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'application/stat/all', {
                params: {
                    token: window.sessionStorage.getItem('token'),
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        setstatAllData(response.data);
    }

    const exportToCSV = () => {
        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const fileName = "statAllData";
        const ws = XLSX.utils.json_to_sheet(statAllData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    const readStatInstructor = async(period) => {
        if(period === null){
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'application/statistics/instructor', {
                    params: {
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );
            setStatInstructor(response.data);
        }else {
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'application/statistics/instructor',
                {
                    params: {
                        period: period,
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    },
                }
            );
            setStatInstructor(response.data);
        }
        setInstructorPeriod(period);

    }

    const readStatRegion = async(period) => {
        if(period === null){
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'application/statistics/region', {
                    params: {
                        token:  window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );
            setStatRegion(response.data);
        }else {
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'application/statistics/region',
                {
                    params: {
                        period: period,
                        token:  window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    },
                }
            );
            setStatRegion(response.data);
        }
        setRegionPeriod(period);
    }

    const readStatDenomination = async(period) => {
        if(period === null){
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'application/statistics/religious-body', {
                    params: {
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );
            setStatDenomination(response.data);
        }else {
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'application/statistics/religious-body',
                {
                    params: {
                        period: period,
                        token:  window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    },
                }
            );
            setStatDenomination(response.data);
        }
        setDenominationPeriod(period);
    }

    return (
        <div>
            <p className="admin-title-header">통계</p>

            <div className="admin-content-wrapper">
                <div className="table-wrapper mt0 mb50" style={{width:'500px'}}>
                    <p className="table-name mb20">
                        강의 기준
                    </p>
                    <div className="mb10">
                        <span className={lecturePeriod === 0 ? "category-btn category-active" : "category-btn"} onClick={() => setlecturePeriod(0)}>전체</span>
                        <span className={lecturePeriod === 1 ? "category-btn category-active" : "category-btn"} onClick={() => setlecturePeriod(1)}>1달</span>
                        <span className={lecturePeriod === 3 ? "category-btn category-active" : "category-btn"} onClick={() => setlecturePeriod(3)}>3달</span>
                        <span className={lecturePeriod === 12 ? "category-btn category-active" : "category-btn"} onClick={() => setlecturePeriod(12)}>1년</span>
                    </div>
                    <div className="table-row-stat-lecture">
                        <span className="th">신청강의</span>
                        <span className="th">완료강의</span>
                        <span className="th">미완료강의</span>
                        <span className="th">참여 강의자수</span>
                        <span className="th">참여 교회수</span>
                    </div>
                    {statLecture !== null ?
                    <div className="table-row-stat-lecture">
                        <span className="td">{statLecture.all_lecture}</span>
                        <span className="td">{statLecture.finish_lecture}</span>
                        <span className="td">{statLecture.not_finish_lecture}</span>
                        <span className="td">{statLecture.inst_count}</span>
                        <span className="td">{statLecture.church_count}</span>
                    </div>
                    :
                    <div className="no-content">통계가 없습니다.</div>
                    }
                </div>
                
                <div className="table-wrapper mt0 mb50" style={{width:'500px'}}>
                    <p className="table-name mb20">
                        강사 구분 기준
                    </p>
                    <div className="mb10">
                        <span className={positionPeriod === 0 ? "category-btn category-active" : "category-btn"} onClick={() => setpositionPeriod(0)}>전체</span>
                        <span className={positionPeriod === 1 ? "category-btn category-active" : "category-btn"} onClick={() => setpositionPeriod(1)}>1달</span>
                        <span className={positionPeriod === 3 ? "category-btn category-active" : "category-btn"} onClick={() => setpositionPeriod(3)}>3달</span>
                        <span className={positionPeriod === 12 ? "category-btn category-active" : "category-btn"} onClick={() => setpositionPeriod(12)}>1년</span>
                    </div>
                    <div className="table-row-stat-inst">
                        <span className="th">구분</span>
                        <span className="th">강사수</span>
                    </div>
                    {statInstPosition !== null && statInstPosition.length > 0 ?
                    statInstPosition.map((data, index) =>
                    <div key={index} className="table-row-stat-inst">
                        <span className="td">{data.position_name}</span>
                        <span className="td">{data.position_count}</span>
                    </div>)
                    :
                    <div className="no-content">통계 정보가 없습니다.</div>
                    }
                </div>

                <div className="table-wrapper mt0 mb50" style={{width:'500px'}}>
                    <p className="table-name mb20">
                        교단 기준
                    </p>
                    <div className="mb10">
                        <span className={denominationPeriod === null ? "category-btn category-active" : "category-btn"} onClick={() => readStatDenomination(null)}>전체</span>
                        <span className={denominationPeriod === 1 ? "category-btn category-active" : "category-btn"} onClick={() => readStatDenomination(1)}>1달</span>
                        <span className={denominationPeriod === 3 ? "category-btn category-active" : "category-btn"} onClick={() => readStatDenomination(3)}>3달</span>
                        <span className={denominationPeriod === 12 ? "category-btn category-active" : "category-btn"} onClick={() => readStatDenomination(12)}>1년</span>
                    </div>
                    <div className="table-statistics-1">
                        <span className="th">교단명</span>
                        <span className="th">신청강의수</span>
                    </div>
                    {statDenomination !== null && statDenomination.length > 0 ?
                        statDenomination.map((data, index) =>
                        <div key={index} className="table-statistics-1">
                            <span className="td">{data.name}</span>
                            <span className="td">{data.count}</span>
                        </div>)
                        :
                        <div className="no-content">통계 정보가 없습니다.</div>
                    }
                </div>

                <div className="table-wrapper mt0 mb50" style={{width:'500px'}}>
                    <p className="table-name mb20">
                        지역 기준
                    </p>
                    <div className="mb10">
                        <span className={regionPeriod === null ? "category-btn category-active" : "category-btn"} onClick={() => readStatRegion(null)}>전체</span>
                        <span className={regionPeriod === 1 ? "category-btn category-active" : "category-btn"} onClick={() => readStatRegion(1)}>1달</span>
                        <span className={regionPeriod === 3 ? "category-btn category-active" : "category-btn"} onClick={() => readStatRegion(3)}>3달</span>
                        <span className={regionPeriod === 12 ? "category-btn category-active" : "category-btn"} onClick={() => readStatRegion(12)}>1년</span>
                    </div>
                    <div className="table-statistics-1">
                        <span className="th">지역구분</span>
                        <span className="th">신청강의수</span>
                    </div>
                    {statRegion !== null && statRegion.length > 0 ?
                        statRegion.map((data, index) =>
                        <div key={index} className="table-statistics-1">
                            <span className="td">{data.name? data.name: "기타"+index}</span>
                            <span className="td">{data.count}</span>
                        </div>)
                        :
                        <div className="no-content">통계 정보가 없습니다.</div>
                    }
                </div>

                <div className="table-wrapper mt0 mb50" style={{width:'500px'}}>
                    <p className="table-name mb20">
                        강사별 기준
                    </p>
                    <div className="mb10">
                        <span className={instructorPeriod === null ? "category-btn category-active" : "category-btn"} onClick={() => readStatInstructor(null)}>전체</span>
                        <span className={instructorPeriod === 1 ? "category-btn category-active" : "category-btn"} onClick={() => readStatInstructor(1)}>1달</span>
                        <span className={instructorPeriod === 3 ? "category-btn category-active" : "category-btn"} onClick={() => readStatInstructor(3)}>3달</span>
                        <span className={instructorPeriod === 12 ? "category-btn category-active" : "category-btn"} onClick={() => readStatInstructor(12)}>1년</span>
                    </div>
                    <div className="table-statistics-2">
                        <span className="th">연번</span>
                        <span className="th">구분</span>
                        <span className="th">강사명</span>
                        <span className="th">참여완료 강의수</span>
                    </div>
                    {statInstructor !== null && statInstructor.length > 0 ?
                        statInstructor.map((data, index) =>
                        <div key={index} className="table-statistics-2">
                            <span className="td">{index+1}</span>
                            <span className="td">{data.position}</span>
                            <span className="td">{data.name}</span>
                            <span className="td">{data.count}</span>
                        </div>)
                        :
                        <div className="no-content">통계 정보가 없습니다.</div>
                    }
                </div>

                <div className="mt0 mb50">
                    <p className="table-name mb20">
                        전체 신청서 정보 다운로드
                    </p>
                    <WhiteButton name="다운로드" click={exportToCSV}/>
                </div>
            </div>
        </div>
    )

}

export default AdminStatistics;
