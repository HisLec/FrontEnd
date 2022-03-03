import React, { useState, useEffect} from 'react';
import axios from 'axios';
import DataListInput from "react-datalist-input";
import Postcode from '@actbase/react-daum-postcode';
import { Link } from 'react-router-dom';

import "react-datepicker/dist/react-datepicker.css";
import '../../../assets/css/table.css';
import '../../../assets/css/Application.css';
import BlueButton from '../../modules/button/blue_button';
import WhiteButton from '../../modules/button/white_button';
import CommonModal from '../../modules/modal/common';


const LectureApplication = (props) => {
    // const [category, setCategory] = useState('subject');

    // const [selectedLecture, setSelectedLecture] = useState(null);
    // const [backgroundUrl, setBackgroundUrl] = useState('/image/application.jpeg');
    // lecture_id는 props로
    const [application, setApplication] = useState({ user_id:window.sessionStorage.getItem('id'), lecture_id: "", lecture_date_id: "", church_id: "", memo: "", admin_phone:"", admin_name:"", admin_email:"", email:"", attendee_number:"50", timezone:"", city:"", district:"", zip_code:"", addr1:"", addr2:"", attendeeTarget:[0,0,0,0,0,0,0,0]});
    const [churchInfo, setchurchInfo] = useState(null)
    const [lectureDates, setlectureDates] = useState(null)
    const [churchData, setchurchData] = useState([])
    const [selectChurch, setselectChurch] = useState(null)
    // const [selectedDate, setSelectedDate] = useState(new Date());
    const [morning, setmorning] = useState(false)
    const [afternoon, setafternoon] = useState(false)
    const [dinner, setdinner] = useState(false)
    const [isAgree, setisAgree] = useState(false)
    const [newChurchAdd, setnewChurchAdd] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [zip_code, setzip_code] = useState("")
    // eslint-disable-next-line no-unused-vars
    const [addr1, setaddr1] = useState("")
    // eslint-disable-next-line no-unused-vars
    const [addr2, setaddr2] = useState("")
    const [isModal, setModal] = useState(false);
    const [settingInfo, setsettingInfo] = useState(null);
    let submitFlag = false;

    function submitCheck(){
        if(submitFlag){
            return submitFlag;
        }else{
            submitFlag = true;
            return false;
        }
    }

    useEffect(() => {
        readChurchInfo();
        readLectureDate();
        readSettingInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setApplication({
            ...application,
            lecture_id: props.location.state.lecture
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.location.state.lecture])

    useEffect(() => {
        var churchArray = [];
        if(churchInfo !== null) {
            for(var i=0 ; i<churchInfo.length ; i++) {
                churchArray.push({label:churchInfo[i].name, key:churchInfo[i].id})
            }
            setchurchData(churchArray);
        }
    }, [churchInfo])

    useEffect(() => {
        if(selectChurch !== null) {
            setApplication({
                ...application,
                church: selectChurch.name,
                addr1: selectChurch.addr1,
                addr2: selectChurch.addr2,
                city: selectChurch.city,
                district: selectChurch.district,
                zip_code: selectChurch.zip_code,
                pastor: selectChurch.pastor,
                phone: selectChurch.phone,
                email: selectChurch.email
            });
            setzip_code(selectChurch.zip_code)
            setaddr1(selectChurch.addr1)
            setaddr2(selectChurch.addr2)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectChurch])

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

    const readChurchInfo = async () => {
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'church/user', {
                params: {
                    token: window.sessionStorage.getItem('token'),
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        setchurchInfo(response.data)
    }

    
    const readLectureDate = async () => {
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'lectureDate', {
                params: {
                    lecture_id: props.location.state.lecture.id,
                    token: window.sessionStorage.getItem('token'),
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        if(response.data.length === 0 ){
            setlectureDates(null);
            setApplication({
                ...application,
                lecture_date_id: 0
            });
        }else{
            var value = response.data;
            var week = ['일', '월', '화', '수', '목', '금', '토'];
            for(var i=0; i<value.length; i++){
                var dayOfWeek = week[new Date(value[i].date).getDay()];
                value[i].date = value[i].date + " ("+dayOfWeek+")";
            }
            setApplication({
                ...application,
                lecture_date_id: response.data[0].id
            });
            setlectureDates(value);
        }
    }

    const handleChange = (selectedItem) => {
        setselectChurch(null);
        setzip_code("")
        setaddr1("")
        setaddr2("")

        setApplication({
            ...application,
            church_id: selectedItem.key
        });
        setselectChurch(churchInfo.find(element => element.id === selectedItem.key))
        
    };

    const closeModal = () => {
        setModal(false);
    }

    const setMorning = () => {
        if(morning)
            setmorning(false)
        else
            setmorning(true)
    }
    const setAfternoon = () => {
        if(afternoon)
            setafternoon(false)
        else
            setafternoon(true)
    }
    const setDinner = () => {
        if(dinner)
            setdinner(false)
        else
            setdinner(true)
    }

    const setIsAgree = () => {
        if(isAgree)
            setisAgree(false)
        else
            setisAgree(true)
    }
    const clickAddBtn = () => {
        setselectChurch(null);

        if(newChurchAdd) {
            setnewChurchAdd(false)
            setApplication({
                ...application,
                church: "",
                addr1: "",
                addr2: "",
                city: "",
                district: "",
                zip_code: "",
                pastor: "",
                phone: "",
                email: "",
                church_id: 0
            });
        }
        else {
            setnewChurchAdd(true)
            setApplication({
                ...application,
                church: "",
                addr1: "",
                addr2: "",
                city: "",
                district: "",
                zip_code: "",
                pastor: "",
                phone: "",
                email: "",
                church_id: 0
            });
        }
    }

    const onAdd = (e) => {
        const { value, name } = e.target;
        if(name === "zip_code")
            setzip_code(value)
        if(name === "addr1")
            setaddr1(value)
        if(name === "addr2")
            setaddr2(value)

        setApplication({
            ...application,
            [name]: value
        });
    };

    const submitApplication = async () => {

        var timezone = "";
        if(morning)
            timezone += "오전 ";
        if(afternoon)
            timezone += "오후 ";
        if(dinner)
            timezone += "저녁 ";
    
        if(timezone === "" || application.addr1 === "" || application.addr2 === "" || application.admin_name === "" || application.admin_phone === "" || application.attendee_number === "" || application.attendee_target === "" || application.church_id === "" || application.lecture_date_id === "" || application.zip_code === "") {
            alert("신청서 정보를 모두 입력해주세요!")
            return;
        }

        if(props.location.state.lecture.date === null && application.memo === "") {
            alert("일정과 관련한 요청 사항을 입력해주세요!");
            return;
        }

        if(!isAgree) {
            alert("개인정보 활용에 동의해주세요!");
            return ;
        }

        var attendee_target = [];
        if(application.attendeeTarget[0]===1) attendee_target.push("유아");
        if(application.attendeeTarget[1]===1) attendee_target.push("초등학생");
        if(application.attendeeTarget[2]===1) attendee_target.push("중학생");
        if(application.attendeeTarget[3]===1) attendee_target.push("고등학생");
        if(application.attendeeTarget[4]===1) attendee_target.push("청년");
        if(application.attendeeTarget[5]===1) attendee_target.push("중년");
        if(application.attendeeTarget[6]===1) attendee_target.push("장년");
        if(application.attendeeTarget[7]===1) attendee_target.push("노년");
        attendee_target = attendee_target.join(',');

        if(submitCheck()){
            alert("강의를 신청하는 중입니다.");
            return;
        }
        
        var params = new URLSearchParams();
        params.append('user_id', window.sessionStorage.getItem('id'));
        params.append('name', application.name);
        params.append('church_id', application.church_id);
        params.append('district', application.district);
        params.append('city', application.city);
        params.append('zip_code', application.zip_code);
        params.append('addr1', application.addr1);
        params.append('addr2', application.addr2);
        params.append('pastor', application.pastor);
        params.append('phone', application.phone);
        params.append('email', application.email);
        params.append('lecture_id', props.location.state.lecture.id);
        params.append('lecture_date_id', application.lecture_date_id);
        params.append('memo', application.memo);
        params.append('admin_phone', application.admin_phone);
        params.append('admin_name', application.admin_name);
        params.append('admin_email', application.admin_email);
        params.append('attendee_number', application.attendee_number);
        params.append('attendee_target', attendee_target);
        params.append('timezone', timezone);
        params.append('inst_email', props.location.state.lecture.instructor_email);
        if(application.lecture_date_id === 0)
            params.append('date', "추후협의");
        else
            params.append('date', lectureDates.find(element => parseInt(element.id) === parseInt(application.lecture_date_id)).date);
        params.append('lecture_name', props.location.state.lecture.name);
        params.append('church_name', application.church);
        params.append('link', process.env.REACT_APP_HOMEPAGE);
        params.append('church', application.church);
        params.append('token', window.sessionStorage.getItem('token'));
        params.append('manageID', window.sessionStorage.getItem('id'));

        if(window.confirm("강의를 신청하시겠습니까?")) {
            const response = await axios.post(
            process.env.REACT_APP_RESTAPI_HOST + 'application',
            params,
            ).then(function(res) {
                document.location.href = process.env.REACT_APP_DEFAULT_URL+"mypage/apply";
                alert("신청서가 등록되었습니다.");
            });
        }
    }

    const selectPostCode = (data) => {
        setApplication({
            ...application,
            addr1: data.address,
            city: data.sido,
            district: data.sigungu,
            zip_code: data.zonecode
        });
        setzip_code(data.zonecode);
        setaddr1(data.address);
    }

    const clickTarget = (index) => {
        var tempTarget = application.attendeeTarget;
        if(tempTarget[index] === 0){
            tempTarget[index] = 1;
        } else {
            tempTarget[index] = 0;
        }            
        setApplication({
            ...application,
            attendeeTarget: tempTarget
        })
    }

    return (
        <div>
            <div className="main-image">
                <img className="page-background" src={process.env.REACT_APP_DEFAULT_URL+'image/application.jpeg'} alt="lecture page" 
                onError={(e) => {
                    e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage.jpeg';
                }}/>
                <div className="page-info">
                    <h2 className="white_color">신청서 작성하기</h2>
                    <p>
                        {settingInfo !== null ?
                        settingInfo.find(element => element.key === "application_page_phrase").value.split("<br/>").map( (item, i) => <div key={i}>{item}</div>) :
                        ""
                        }
                    </p>
                </div>
            </div>
            <div className="content-wrapper">
                <div className="left-navbar">
                    <span>
                        <Link className="sub-title" to={process.env.REACT_APP_DEFAULT_URL+"lecture/subject"}>주제별</Link>
                    </span>
                    <span>
                        <Link className="sub-title" to={process.env.REACT_APP_DEFAULT_URL+"lecture/instructor"}>강사별</Link>
                    </span>
                    <span>
                        <Link className="sub-title" to={process.env.REACT_APP_DEFAULT_URL+"lecture/date"}>일자별</Link>
                    </span>
                </div>
                <div className="right-content">
                    <div>
                        <div className="form-wrapper">
                            <div className="mb15">
                                <span className="form-title">강의명</span>
                                <span>{props.location.state.lecture.name}</span>
                            </div>
                            <div className="mb15">
                                <span className="form-title">강사명</span>
                                <span>{props.location.state.lecture.instructor_name}</span>
                            </div>
                            <hr className="mb30"/>
                            <div className="mb15">
                                <span className="form-title">교회명</span>
                                {newChurchAdd ?
                                <input className="form-input" type="text" placeholder="추가할 교회명" name="church" onChange={onAdd}/>
                                :
                                churchData !== null ?
                                <DataListInput
                                style={{width:"100px"}}
                                placeholder="교회명을 입력하고 선택하세요."
                                items={churchData}
                                onSelect={handleChange}
                                />
                                :
                                null
                                }
                                {newChurchAdd ?
                                <BlueButton class="blue-btn" name="교회 목록 보기" click={clickAddBtn}/>
                                :
                                <BlueButton class="blue-btn" name="새로운 교회 추가" click={clickAddBtn}/>
                                }

                            </div>
                            <CommonModal open={isModal} close={closeModal} header="주소 찾기" footer="닫기"> 
                                <Postcode
                                    style={{ width: 320, height: 320 }}
                                    jsOptions={{ animated: true, hideMapBtn: true }}
                                    onSelected={data => {
                                        selectPostCode(data);
                                        setModal(false);
                                    }}
                                />
                            </CommonModal>

                            
                            <div className="mb15">
                                <span className="form-title">주소 검색</span>
                                <input readOnly placeholder="우편번호" className="form-addr mr10" value={application.zip_code} name="zip_code" onChange={onAdd}/> 
                                <BlueButton click={() => setModal(true)} name="주소찾기" class="blue-btn"/>
                            </div>
                            <div className="mb15">
                                <span className="form-title"></span>
                                <input readOnly placeholder="주소" className="form-addr" value={application.addr1} name="addr1" onChange={onAdd}/>
                            </div>
                            <div className="mb35">
                                <span className="form-title"></span>
                                <input placeholder="세부주소" className="form-addr" name="addr2" onChange={onAdd} value={application.addr2}/>
                            </div>

                            {newChurchAdd &&
                            <span>
                                <div className="mb15">
                                    <span className="form-title">담임 목사</span>
                                    <input className="form-input" name="pastor" placeholder="담임 목사 이름" value={application.pastor} onChange={onAdd}/>
                                </div>
                                <div className="mb15">
                                    <span className="form-title">대표 연락처</span>
                                    <input className="form-input" name="phone" placeholder="교회 대표 연락처" value={application.phone} onChange={onAdd}/>
                                </div>
                                <div className="mb30">
                                    <span className="form-title">대표 이메일</span>
                                    <input className="form-input" name="email" placeholder="교회 대표 이메일" value={application.email} onChange={onAdd}/>
                                </div>
                            </span>
                            }
                            {/* <div className="mb15">
                                <span className="form-title">담임 목사</span>
                                <input className="form-input" name="pastor" placeholder="담임 목사 이름" value={application.pastor} onChange={onAdd}/>
                            </div>
                            <div className="mb15">
                                <span className="form-title">대표 연락처</span>
                                <input className="form-input" name="phone" placeholder="교회 대표 연락처" value={application.phone} onChange={onAdd}/>
                            </div>
                            <div className="mb30">
                                <span className="form-title">대표 이메일</span>
                                <input className="form-input" name="email" placeholder="교회 대표 이메일" value={application.email} onChange={onAdd}/>
                            </div> */}
                            <hr className="m30 mb30"/>
                            <div className="mb15">
                                <span className="form-title">담당자 이름</span>
                                <input className="form-input" name="admin_name" onChange={onAdd}/>
                            </div>
                            <div className="mb15">
                                <span className="form-title">담당자 휴대전화</span>
                                <input className="form-input" name="admin_phone" onChange={onAdd}/>
                            </div>
                            <div className="mb30">
                                <span className="form-title">담당자 이메일(선택)</span>
                                <input className="form-input" name="admin_email" onChange={onAdd}/>
                            </div>
                            <hr className="m30"/>
                            <div className="select-wrapper">
                                <div style={{gridColumn:'1 / span 2'}}>
                                    <span className="form-title">강의 대상</span>
                                    <span>
                                        <span className={application !== null && application.attendeeTarget[0]===1 ? "category-btn category-active" : "category-btn"} onClick={() => clickTarget(0)}>유아</span>
                                        <span className={application !== null && application.attendeeTarget[1]===1 ? "category-btn category-active" : "category-btn"} onClick={() => clickTarget(1)}>초등학생</span>
                                        <span className={application !== null && application.attendeeTarget[2]===1 ? "category-btn category-active" : "category-btn"} onClick={() => clickTarget(2)}>중학생</span>
                                        <span className={application !== null && application.attendeeTarget[3]===1 ? "category-btn category-active" : "category-btn"} onClick={() => clickTarget(3)}>고등학생</span>
                                        <span className={application !== null && application.attendeeTarget[4]===1 ? "category-btn category-active" : "category-btn"} onClick={() => clickTarget(4)}>청년</span>
                                        <span className={application !== null && application.attendeeTarget[5]===1 ? "category-btn category-active" : "category-btn"} onClick={() => clickTarget(5)}>중년</span>
                                        <span className={application !== null && application.attendeeTarget[6]===1 ? "category-btn category-active" : "category-btn"} onClick={() => clickTarget(6)}>장년</span>
                                        <span className={application !== null && application.attendeeTarget[7]===1 ? "category-btn category-active" : "category-btn"} onClick={() => clickTarget(7)}>노년</span>
                                    </span>
                                </div>
                                <div>
                                    <span className="form-title">청강자 수</span>
                                    <select className="form-input" name="attendee_number" defaultValue={application.attendee_number} onChange={onAdd}>
                                        <option>50</option>
                                        <option>100</option>
                                        <option>200</option>
                                        <option>500</option>
                                        <option>1000</option>
                                        <option>1000</option>
                                    </select>
                                </div>
                                <div>
                                    <span className="form-title">강의 희망날짜</span>
                                    <select className="form-input" name="lecture_date_id" defaultValue={application.lecture_date_id} onChange={onAdd}>
                                    {lectureDates !== null ?
                                    lectureDates.map((date, i) => <option key={i} value={date.id}>{date.date}</option>)
                                    : <option>추후 협의</option>
                                    // : <option style={{width:'240px'}}>아래 요청 사항에 희망 일정을 입력해주세요.</option>
                                    }
                                    </select>
                                </div>
                                <div style={{display:"flex"}}>
                                    <span className="form-title">원하는 시간대</span>
                                    <WhiteButton class={morning ? "application-time application-time-select" : "application-time"} name="오전" click={setMorning}/>
                                    <WhiteButton class={afternoon ? "application-time application-time-select" : "application-time"} name="오후" click={setAfternoon}/>
                                    <WhiteButton class={dinner ? "application-time application-time-select" : "application-time"} name="저녁" click={setDinner}/>
                                </div>

                            </div>
                            <textarea className="form-textarea" placeholder="요청 사항 / 컨택 포인트 작성란&#13;&#10;강의 희망 날짜가 추후 협의인 경우, 이 곳에 희망 일정을 입력해주세요." name="memo" onChange={onAdd}></textarea>

                            <ul className="agree-ul mb40">
                                <li className="mb10">
                                    {settingInfo !== null ?
                                    settingInfo.find(element => element.key === "agree_personal_information_1").value.split("\n").map( (item, i) => <div key={i}>{item}</div>) :
                                    ""
                                    }
                                </li>
                                <li>
                                    {settingInfo !== null ?
                                    settingInfo.find(element => element.key === "agree_personal_information_2").value.split("\n").map( (item, i) => <div key={i}>{item}</div>) :
                                    ""
                                    }
                                </li>
                            </ul>
                            <div className="mb40">
                                <input className="agree-check mr10" type="checkbox" onClick={setIsAgree}/>
                                <span className="fs14" style={{display:"inline-block"}}>
                                    {settingInfo !== null ?
                                    settingInfo.find(element => element.key === "agree_personal_information_3").value.split("\n").map( (item, i) => <div key={i}>{item}</div>) :
                                    ""
                                    }
                                </span>
                            </div>

                            </div>
                        </div>
                        <div className="center mt40">
                            <BlueButton name="작성 완료" click={submitApplication}/>
                        </div>
                    </div>

            </div>
        </div>
    )
}

export default LectureApplication;
