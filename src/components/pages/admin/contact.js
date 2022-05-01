import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "react-js-pagination";
import XLSX from "xlsx";
import Postcode from "@actbase/react-daum-postcode";
import FileSaver from "file-saver";
import DataListInput from "react-datalist-input";
import "../../../assets/css/table.css";
import "../../../assets/css/default.css";
import "../../../assets/css/admin_contact.css";
import GreyButton from "../../modules/button/admin_grey_btn";
import BlueButton from "../../modules/button/admin_blue_btn";
import WhiteButton from "../../modules/button/admin_white_btn";
import CommonModal from "../../modules/modal/common";
import { faSort } from "@fortawesome/free-solid-svg-icons";

function AdminContact() {
  const [keyword, setKeyword] = useState("");
  const [contactDate, setContactDate] = useState("");
  const [contactStartDate, setContactStartDate] = useState("");
  const [contactEndDate, setContactEndDate] = useState("");
  const [contactMemo, setContactMemo] = useState("");
  const [statusSelect, setStatusSelect] = useState(-2);

  const [clickedContact, setClickedContact] = useState(null);
  const [applicationInfo, setapplicationInfo] = useState(null);
  const [isEdit, setisEdit] = useState(false);
  const [page, setPage] = useState(1);
  const postsPerPage = 8;

  const [isOpen, setisOpen] = useState(false);
  const [isAgree, setisAgree] = useState(false);
  const [addApplicationInfo, setaddApplicationInfo] = useState({
    zip_code: "",
    admin_email: "",
    city: "",
    district: "",
    addr1: "",
    addr2: "",
    memo: "",
    attendee_number: "50",
    attendeeTarget: [0, 0, 0, 0, 0, 0, 0, 0],
  });
  const [morning, setmorning] = useState(false);
  const [afternoon, setafternoon] = useState(false);
  const [dinner, setdinner] = useState(false);
  const [lectureDates, setlectureDates] = useState(null);
  const [newChurchAdd, setnewChurchAdd] = useState(false);
  const [churchData, setchurchData] = useState([]);
  const [churchInfo, setchurchInfo] = useState(null);
  const [selectChurch, setselectChurch] = useState(null);
  const [isPostCodeOpen, setisPostCodeOpen] = useState(false);
  const [lectureData, setlectureData] = useState(null);
  const [selectedLecture, setselectedLecture] = useState(null);

  useEffect(() => {
    readApplicationForms();
    readChurchInfo();
    readLecture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    readApplicationForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusSelect]);

  useEffect(() => {
    var churchArray = [];
    if (churchInfo !== null) {
      for (var i = 0; i < churchInfo.length; i++) {
        churchArray.push({ label: churchInfo[i].name, key: churchInfo[i].id });
      }
      setchurchData(churchArray);
    }
  }, [churchInfo]);

  useEffect(() => {
    if (selectedLecture !== null) readLectureDate(selectedLecture.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLecture]);

  useEffect(() => {
    if (selectChurch !== null) {
      setaddApplicationInfo({
        ...addApplicationInfo,
        church: selectChurch.name,
        addr1: selectChurch.addr1,
        addr2: selectChurch.addr2,
        zip_code: selectChurch.zip_code,
        city: selectChurch.city,
        district: selectChurch.district,
        pastor: selectChurch.pastor,
        phone: selectChurch.phone,
        email: selectChurch.email,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectChurch]);

  const readLecture = async () => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "lecture/subject", {
      params: {
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    setlectureData(response.data);
    setselectedLecture(response.data[0]);
    setaddApplicationInfo({
      ...addApplicationInfo,
      lecture_id: response.data[0].id,
    });
  };

  const readChurchInfo = async () => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "church", {
      params: {
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    setchurchInfo(response.data);
  };

  const searchKeywordChanged = (e) => {
    setKeyword(e.target.value);
  };

  const readApplicationForms = async () => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "application", {
      params: {
        keyword: keyword,
        statusSelect: statusSelect,
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    const responseList = response.data;
    responseList.sort((a) => (a.status === 0 ? -1 : 1));
    setapplicationInfo(responseList);

    setKeyword("");
  };

  const cancelContact = async () => {
    if (window.confirm("컨택을 취소하시겠습니까?")) {
      axios({
        url: process.env.REACT_APP_RESTAPI_HOST + "application/status",
        method: "put",
        data: {
          application_form_id: clickedContact.id,
          status: -1,
          token: window.sessionStorage.getItem("token"),
          manageID: window.sessionStorage.getItem("id"),
        },
      }).then(function (res) {
        readApplicationForms();
        setClickedContact({
          ...clickedContact,
          status: -1,
        });
        alert("컨택이 취소되었습니다.");
      });
    }
  };

  const contactStart = async () => {
    if (window.confirm("신청자와 컨택을 시작하시겠습니까?")) {
      axios({
        url: process.env.REACT_APP_RESTAPI_HOST + "application/status",
        method: "put",
        data: {
          application_form_id: clickedContact.id,
          status: 1,
          token: window.sessionStorage.getItem("token"),
          manageID: window.sessionStorage.getItem("id"),
        },
      }).then(function (res) {
        readApplicationForms();
        setClickedContact({
          ...clickedContact,
          status: 1,
        });
      });
    }
  };

  const finishContact = async () => {
    if (window.confirm("날짜를 확정하시겠습니까?")) {
      axios({
        url: process.env.REACT_APP_RESTAPI_HOST + "application/complete",
        method: "put",
        data: {
          selectDate: contactDate,
          contact_start_date: contactStartDate,
          contact_end_date: contactEndDate,
          application_form_id: clickedContact.id,
          lecture_id: clickedContact.lecture_id,
          contact_memo: contactMemo,
          status: 2,
          token: window.sessionStorage.getItem("token"),
          manageID: window.sessionStorage.getItem("id"),
        },
      }).then(function (res) {
        readApplicationForms();
        alert("컨택이 완료되었습니다.");
        setClickedContact(null);
        setisEdit(false);
      });
    }
  };

  function clickContact(application) {
    setisEdit(false);
    if (clickedContact === null || application !== clickedContact) {
      setClickedContact(application);
      // console.log('Here!!!!!!!!!!!!!!!');
      // console.log(clickedContact);
      if (application.date === null) setContactDate("");
      else setContactDate(application.date);
      if (application.contact_start_date === null) setContactStartDate("");
      else setContactStartDate(application.contact_start_date);
      if (application.contact_end_date === null) setContactEndDate("");
      else setContactEndDate(application.contact_end_date);
      if (application.memo === null) setContactMemo("");
      else setContactMemo(application.memo);
    } else setClickedContact(null);
  }

  const clickEditBtn = () => {
    setisEdit(true);
  };

  const clickBackBtn = () => {
    setisEdit(false);
    if (clickedContact.date === null) setContactDate("");
    else setContactDate(clickedContact.date);
    if (clickedContact.contact_start_date === null) setContactStartDate("");
    else setContactStartDate(clickedContact.contact_start_date);
    if (clickedContact.contact_end_date === null) setContactEndDate("");
    else setContactEndDate(clickedContact.contact_end_date);
    if (clickedContact.memo === null) setContactMemo("");
    else setContactMemo(clickedContact.memo);
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
    const fileName = "contact";
    const ws = XLSX.utils.json_to_sheet(applicationInfo);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const closeModal = () => {
    setaddApplicationInfo({
      zip_code: "",
      city: "",
      district: "",
      admin_email: "",
      addr1: "",
      addr2: "",
      memo: "",
      phone: "",
      email: "",
      pastor: "",
      lecture_id: lectureData[0].id,
      lecture_date_id: 0,
      attendee_number: "50",
      attendee_target: "유아",
      attendeeTarget: [0, 0, 0, 0, 0, 0, 0, 0],
    });
    setmorning(false);
    setafternoon(false);
    setdinner(false);
    setselectedLecture(lectureData[0]);
    setselectChurch(null);
    setnewChurchAdd(false);
    setisOpen(false);
  };

  const onAdd = (e) => {
    const { value, name } = e.target;

    setaddApplicationInfo({
      ...addApplicationInfo,
      [name]: value,
    });
  };

  const setMorning = () => {
    if (morning) setmorning(false);
    else setmorning(true);
  };
  const setAfternoon = () => {
    if (afternoon) setafternoon(false);
    else setafternoon(true);
  };
  const setDinner = () => {
    if (dinner) setdinner(false);
    else setdinner(true);
  };

  const setIsAgree = () => {
    if (isAgree) setisAgree(false);
    else setisAgree(true);
  };

  const readLectureDate = async (lecture_id) => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "lectureDate", {
      params: {
        lecture_id: lecture_id,
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    if (response.data !== null && response.data.length > 0)
      setaddApplicationInfo({
        ...addApplicationInfo,
        lecture_id: lecture_id,
        lecture_date_id: response.data[0].id,
      });
    else
      setaddApplicationInfo({
        ...addApplicationInfo,
        lecture_id: lecture_id,
        lecture_date_id: 0,
      });
    setlectureDates(response.data);
  };

  const handleChange = (selectedItem) => {
    setselectChurch(null);
    setaddApplicationInfo({
      ...addApplicationInfo,
      church_id: selectedItem.key,
    });
    setselectChurch(churchInfo.find((element) => element.id === selectedItem.key));
  };

  const clickAddBtn = () => {
    setselectChurch(null);

    if (newChurchAdd) {
      setnewChurchAdd(false);
      setaddApplicationInfo({
        ...addApplicationInfo,
        zip_code: "",
        addr1: "",
        addr2: "",
        city: "",
        district: "",
        pastor: "",
        email: "",
        phone: "",
      });
    } else {
      setnewChurchAdd(true);
      setaddApplicationInfo({
        ...addApplicationInfo,
        zip_code: "",
        addr1: "",
        addr2: "",
        city: "",
        district: "",
        pastor: "",
        email: "",
        phone: "",
        church_id: 0,
      });
    }
  };

  const selectPostCode = (data) => {
    setaddApplicationInfo({
      ...addApplicationInfo,
      addr1: data.address,
      city: data.sido,
      district: data.sigungu,
      zip_code: data.zonecode,
    });
    setisPostCodeOpen(false);
  };

  const lectureChange = (e) => {
    // var data = lectureData.find(element => element.id == e.target.value);
    var data = null;
    for (var i = 0; i < lectureData.length; i++) {
      if (lectureData[i].id == e.target.value) {
        console.log("걸림");
        data = lectureData[i];
      }
    }
    console.log(e.target.value, lectureData);
    console.log("data!!!!!!!", data);
    if (data.date === "") {
      setaddApplicationInfo({
        ...addApplicationInfo,
        lecture_id: e.target.value,
        lecture_date_id: 0,
      });
    } else {
      setaddApplicationInfo({
        ...addApplicationInfo,
        lecture_id: e.target.value,
      });
    }
    setselectedLecture(data);
  };

  const addApplication = async () => {
    var timezone = "";
    if (morning) timezone += "오전 ";
    if (afternoon) timezone += "오후 ";
    if (dinner) timezone += "저녁 ";

    if (
      timezone === "" ||
      addApplicationInfo.addr1 === "" ||
      addApplicationInfo.addr2 === "" ||
      addApplicationInfo.admin_name === "" ||
      addApplicationInfo.admin_phone === "" ||
      addApplicationInfo.attendee_number === "" ||
      addApplicationInfo.attendee_target === "" ||
      addApplicationInfo.church_id === "" ||
      addApplicationInfo.lecture_date_id === "" ||
      addApplicationInfo.zip_code === "" ||
      addApplicationInfo.lecture_id === ""
    ) {
      alert("신청서 정보를 모두 입력해주세요!");
      return;
    }

    if (newChurchAdd) {
      if (addApplicationInfo.pastor === "" || addApplicationInfo.email === "" || addApplicationInfo.phone === "") {
        alert("새로운 교회와 관련된 정보를 모두 입력해주세요!");
        return;
      }
    }

    var attendee_target = [];
    if (addApplicationInfo.attendeeTarget[0] === 1) attendee_target.push("유아");
    if (addApplicationInfo.attendeeTarget[1] === 1) attendee_target.push("초등학생");
    if (addApplicationInfo.attendeeTarget[2] === 1) attendee_target.push("중학생");
    if (addApplicationInfo.attendeeTarget[3] === 1) attendee_target.push("고등학생");
    if (addApplicationInfo.attendeeTarget[4] === 1) attendee_target.push("청년");
    if (addApplicationInfo.attendeeTarget[5] === 1) attendee_target.push("중년");
    if (addApplicationInfo.attendeeTarget[6] === 1) attendee_target.push("장년");
    if (addApplicationInfo.attendeeTarget[7] === 1) attendee_target.push("노년");
    attendee_target = attendee_target.join(",");

    var date = "추후협의";
    if (addApplicationInfo.lecture_date_id !== 0) date = lectureDates.find((element) => parseInt(element.id) === parseInt(applicationInfo.lecture_date_id)).date;

    if (!isAgree) {
      alert("개인정보 활용에 동의해주세요!");
      return;
    }
    console.log(selectedLecture);
    console.log(addApplicationInfo);
    console.log(lectureDates);

    var params = new URLSearchParams();
    params.append("user_id", window.sessionStorage.getItem("id"));
    params.append("church_id", addApplicationInfo.church_id);
    params.append("zip_code", addApplicationInfo.zip_code);
    params.append("addr1", addApplicationInfo.addr1);
    params.append("addr2", addApplicationInfo.addr2);
    params.append("pastor", addApplicationInfo.pastor);
    params.append("email", addApplicationInfo.email);
    params.append("phone", addApplicationInfo.phone);
    params.append("lecture_id", addApplicationInfo.lecture_id);
    params.append("lecture_date_id", addApplicationInfo.lecture_date_id);
    params.append("memo", addApplicationInfo.memo);
    params.append("admin_phone", addApplicationInfo.admin_phone);
    params.append("admin_name", addApplicationInfo.admin_name);
    params.append("admin_email", addApplicationInfo.admin_email);
    params.append("attendee_number", addApplicationInfo.attendee_number);
    params.append("attendee_target", attendee_target);
    params.append("timezone", timezone);
    params.append("inst_email", addApplicationInfo.email);
    params.append("date", date);
    params.append("lecture_name", selectedLecture.name);
    params.append("church_name", addApplicationInfo.church);
    params.append("link", process.env.REACT_APP_HOMEPAGE);
    params.append("church", addApplicationInfo.church);
    params.append("city", addApplicationInfo.city);
    params.append("district", addApplicationInfo.district);
    params.append("token", window.sessionStorage.getItem("token"));
    params.append("manageID", window.sessionStorage.getItem("id"));

    if (window.confirm("강의를 신청하시겠습니까?")) {
      const response = await axios.post(process.env.REACT_APP_RESTAPI_HOST + "application", params).then(function (res) {
        alert("신청서가 등록되었습니다.");
        readApplicationForms();
        setisOpen(false);
        setisAgree(false);
        setmorning(false);
        setafternoon(false);
        setdinner(false);
        setnewChurchAdd(false);
        setselectChurch(null);
        setaddApplicationInfo({
          zip_code: "",
          city: "",
          district: "",
          admin_email: "",
          addr1: "",
          addr2: "",
          memo: "",
          phone: "",
          email: "",
          pastor: "",
          lecture_id: lectureData[0].id,
          lecture_date_id: 0,
          attendee_number: "50",
          attendee_target: "유아",
          attendeeTarget: [0, 0, 0, 0, 0, 0, 0, 0],
        });
        setselectedLecture(lectureData[0]);
      });
    }
  };

  const clickTarget = (index) => {
    var tempTarget = addApplicationInfo.attendeeTarget;
    if (tempTarget[index] === 0) {
      tempTarget[index] = 1;
    } else {
      tempTarget[index] = 0;
    }
    setaddApplicationInfo({
      ...addApplicationInfo,
      attendeeTarget: tempTarget,
    });
  };

  return (
    <div>
      <p className="admin-title-header">컨택 내역 목록</p>
      <div id="contact-wrapper" className="admin-content-wrapper">
        <div>
          <div className="table-wrapper mt0">
            <p className="adcontact-table-name">
              컨택 내역 목록
              <GreyButton
                class="right"
                name="컨택 추가하기"
                click={() => {
                  setisOpen(true);
                }}
              />
              <GreyButton class="right mr15" name="엑셀 파일 다운로드" click={exportToCSV} />
            </p>
            <CommonModal open={isOpen} close={closeModal} func={addApplication} header="컨택 내역 추가하기" footer="추가하기">
              <div>
                <div className="form-wrapper">
                  <div className="mb15">
                    <span className="form-title">신청할 강의 선택</span>
                    <select defaultValue={addApplicationInfo.lecture_id} name="lecture_id" className="p48" onChange={lectureChange}>
                      {lectureData !== null &&
                        lectureData.map((lectureData, index) => (
                          <option key={lectureData.id} value={lectureData.id}>
                            {lectureData.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* <div className="mb15">
                                        <span className="form-title">강의명</span>
                                        <span>{selectedLecture !== null ? selectedLecture.name : "강의를 선택해주세요"}</span>
                                    </div> */}
                  <div className="mb15">
                    <span className="form-title">강사명</span>
                    <span>{selectedLecture !== null ? selectedLecture.instructor_name : "강의를 선택해주세요"}</span>
                  </div>
                  <hr className="mb30" />
                  <div className="mb15">
                    <span className="form-title">교회명</span>
                    {newChurchAdd ? (
                      <input className="form-input" type="text" placeholder="추가할 교회명" name="church" onChange={onAdd} />
                    ) : churchData !== null ? (
                      <DataListInput style={{ width: "100px" }} placeholder="교회를 선택하세요." items={churchData} onSelect={handleChange} />
                    ) : null}
                    {newChurchAdd ? <BlueButton class="blue-btn" name="교회 목록 보기" click={clickAddBtn} /> : <BlueButton class="blue-btn" name="새로운 교회 추가" click={clickAddBtn} />}
                  </div>
                  {/* <CommonModal open={isModal} close={closeModal} header="주소 찾기" footer="닫기"> 
                                        <Postcode
                                            style={{ width: 320, height: 320 }}
                                            jsOptions={{ animated: true, hideMapBtn: true }}
                                            onSelected={data => {
                                                selectPostCode(data);
                                                setModal(false);
                                            }}
                                        />
                                    </CommonModal> */}

                  <div className="mb15" style={{ position: "relative" }}>
                    <span className="form-title">주소 검색</span>
                    <input readOnly placeholder="우편번호" className="form-addr mr10" value={addApplicationInfo.zip_code} name="zip_code" onChange={onAdd} />
                    {isPostCodeOpen ? (
                      <BlueButton click={() => setisPostCodeOpen(false)} name="주소창닫기" class="blue-btn" />
                    ) : (
                      <BlueButton click={() => setisPostCodeOpen(true)} name="주소찾기" class="blue-btn" />
                    )}
                    {isPostCodeOpen && <Postcode style={{ width: 320, height: 320, position: "absolute", left: "170px" }} jsOptions={{ animated: true }} onSelected={(data) => selectPostCode(data)} />}
                  </div>
                  <div className="mb15">
                    <span className="form-title"></span>
                    <input readOnly placeholder="주소" className="form-addr" value={addApplicationInfo.addr1} name="addr1" onChange={onAdd} />
                  </div>
                  <div className="mb35">
                    <span className="form-title"></span>
                    <input className="form-addr" name="addr2" onChange={onAdd} placeholder="상세 주소 입력" value={addApplicationInfo.addr2} />
                  </div>
                  {newChurchAdd && (
                    <span>
                      <div className="mb15">
                        <span className="form-title">담임 목사</span>
                        <input className="form-input" name="pastor" placeholder="담임 목사 이름" value={addApplicationInfo.pastor} onChange={onAdd} />
                      </div>
                      <div className="mb15">
                        <span className="form-title">대표 연락처</span>
                        <input className="form-input" name="phone" placeholder="교회 대표 연락처" value={addApplicationInfo.phone} onChange={onAdd} />
                      </div>
                      <div className="mb30">
                        <span className="form-title">대표 이메일</span>
                        <input className="form-input" name="email" placeholder="교회 대표 이메일" value={addApplicationInfo.email} onChange={onAdd} />
                      </div>
                    </span>
                  )}
                  <hr className="m30 mb30" />
                  <div className="mb15">
                    <span className="form-title">담당자 이름</span>
                    <input className="form-input" name="admin_name" onChange={onAdd} />
                  </div>
                  <div className="mb15">
                    <span className="form-title">담당자 휴대전화</span>
                    <input className="form-input" name="admin_phone" onChange={onAdd} />
                  </div>
                  <div className="mb30">
                    <span className="form-title">담당자 이메일(선택)</span>
                    <input className="form-input" name="admin_email" onChange={onAdd} />
                  </div>
                  {/* <div className="mb30">
                                        <span className="form-title">담당자 이메일</span>
                                        <input className="form-input" name="email" onChange={onAdd}/>
                                    </div> */}
                  <hr className="m30" />
                  <div className="select-wrapper">
                    <div style={{ gridColumn: "1 / span 2" }}>
                      <span className="form-title">강의 대상</span>
                      {addApplicationInfo !== null && (
                        <span>
                          <span className={addApplicationInfo.attendeeTarget[0] === 1 ? "category-btn category-active" : "category-btn"} onClick={() => clickTarget(0)}>
                            유아
                          </span>
                          <span className={addApplicationInfo.attendeeTarget[1] === 1 ? "category-btn category-active" : "category-btn"} onClick={() => clickTarget(1)}>
                            초등학생
                          </span>
                          <span className={addApplicationInfo.attendeeTarget[2] === 1 ? "category-btn category-active" : "category-btn"} onClick={() => clickTarget(2)}>
                            중학생
                          </span>
                          <span className={addApplicationInfo.attendeeTarget[3] === 1 ? "category-btn category-active" : "category-btn"} onClick={() => clickTarget(3)}>
                            고등학생
                          </span>
                          <span className={addApplicationInfo.attendeeTarget[4] === 1 ? "category-btn category-active" : "category-btn"} onClick={() => clickTarget(4)}>
                            청년
                          </span>
                          <span className={addApplicationInfo.attendeeTarget[5] === 1 ? "category-btn category-active" : "category-btn"} onClick={() => clickTarget(5)}>
                            중년
                          </span>
                          <span className={addApplicationInfo.attendeeTarget[6] === 1 ? "category-btn category-active" : "category-btn"} onClick={() => clickTarget(6)}>
                            장년
                          </span>
                          <span className={addApplicationInfo.attendeeTarget[7] === 1 ? "category-btn category-active" : "category-btn"} onClick={() => clickTarget(7)}>
                            노년
                          </span>
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="form-title">청강자 수</span>
                      <select className="form-input" name="attendee_number" defaultValue={addApplicationInfo.attendee_number} onChange={onAdd}>
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
                      <select className="form-input" name="lecture_date_id" defaultValue={addApplicationInfo.lecture_date_id} onChange={onAdd}>
                        {lectureDates !== null && lectureDates.length > 0 ? (
                          lectureDates.map((date, i) => (
                            <option key={i} value={date.id}>
                              {date.date}
                            </option>
                          ))
                        ) : (
                          <option value="0">추후 협의</option>
                        )}
                      </select>
                    </div>
                    <div style={{ display: "flex" }}>
                      <span className="form-title">원하는 시간대</span>
                      <WhiteButton class={morning ? "application-time application-time-select" : "application-time"} name="오전" click={setMorning} />
                      <WhiteButton class={afternoon ? "application-time application-time-select" : "application-time"} name="오후" click={setAfternoon} />
                      <WhiteButton class={dinner ? "application-time application-time-select" : "application-time"} name="저녁" click={setDinner} />
                    </div>
                  </div>

                  <textarea className="form-textarea" placeholder="요청 사항 / 컨택 포인트 작성란" name="memo" onChange={onAdd}></textarea>

                  <ul className="agree-ul mb40">
                    <li className="mb10">
                      이단 및 사이비 단체는 작성글을 게시할 수 없으며 적발 시 예배 및 설교 방해죄 (형법 제 158조), 퇴거불응죄(형법 제 319조 2항), 업무방해죄(형법 제314조), 개인정보보호법 위반 등으로
                      처벌받을 수 있습니다.
                    </li>
                    <li>개인 정보 수집 동의 - 이용자가 제공한 모든 정보는 다음의 목적을 위해 활용하며, 하기 목적 이외의 용도로는 사용하지 않습니다.</li>
                  </ul>
                  <div className="mb40">
                    <input className="agree-check mr10" type="checkbox" onClick={setIsAgree} />
                    <span className="fs14">개인정보 수집 및 이용에 대해 동의합니다.</span>
                  </div>
                </div>
              </div>
            </CommonModal>
            <div className="mb20">
              <select
                defaultValue={statusSelect}
                className="inst-group mr15 p48"
                onChange={(e) => {
                  setStatusSelect(e.target.value);
                }}
              >
                <option value="-2">전체</option>
                <option value="0">신규(미확인)</option>
                <option value="1">진행중</option>
                <option value="2">일정확정됨</option>
                <option value="-1">취소됨</option>
              </select>
              <input
                className="p48 search-lecture-input"
                type="text"
                placeholder="강사명, 강의명, 교회명, 담당자명, 담당자 핸드폰 번호로 키워드 검색"
                value={keyword || ""}
                onChange={searchKeywordChanged}
              />
              <GreyButton name="검색" click={readApplicationForms} />
            </div>
            <div className="table-row-adcontact">
              <span className="th">강사명</span>
              <span className="th">강의명</span>
              <span className="th">교회명</span>
              <span className="th">희망 날짜</span>
              <span className="th">컨택 상황</span>
            </div>
            {applicationInfo !== null && applicationInfo.length > 0 ? (
              currentPosts(applicationInfo).map((data, index) => (
                <div
                  key={data.id}
                  className={clickedContact !== null && clickedContact.id === data.id ? "click-inst-row table-row-adcontact" : "table-row-adcontact"}
                  onClick={() => {
                    clickContact(data);
                  }}
                >
                  <span className="td">{data.inst_name}</span>
                  <span className="td">{data.lecture_name}</span>
                  <span className="td">{data.church_name}</span>
                  <span className="td">
                    {data.date}({data.timezone})
                  </span>
                  {data.status === 0 ? (
                    <span className="td">
                      <span className="contact-ing" style={{ color: "#ff0000b8", border: "1px solid #ff0000b8" }}>
                        신규(미확인)
                      </span>
                    </span>
                  ) : data.status === 1 ? (
                    <span className="td">
                      <span className="contact-ing">진행중</span>
                    </span>
                  ) : data.isVisiting > 0 ? (
                    <div className="td contact-ok">강의완료</div>
                  ) : data.status === 2 ? (
                    <div className="td contact-ok">일정확정됨</div>
                  ) : (
                    <div className="td contact-cancel">취소됨</div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-content">신청서가 없습니다.</div>
            )}
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
        <div className="relative">
          {clickedContact ? (
            isEdit ? (
              <div className="show-lecture-detail">
                <h2 className="mb20">{clickedContact.lecture_name}</h2>
                <hr className="bold-hr mb25" />
                <div className="mb8">
                  <span className="form-title">신청자명</span>
                  <span>{clickedContact.admin_name}</span>
                </div>
                <div>
                  <span className="form-title">연락처</span>
                  <span>{clickedContact.admin_phone}</span>
                </div>
                <hr className="m20" />
                {/* <div className="mb8">
                        <span className="form-title">교회명</span>
                        <span>{clickedContact.church_name}</span>
                    </div> */}

                <div className="mb8">
                  <span className="form-title">주소</span>
                  <span>
                    {clickedContact.addr1} {clickedContact.addr2}
                  </span>
                </div>
                <div className="mb8">
                  <span className="form-title">교회 연락처</span>
                  <span>{clickedContact.phone}</span>
                </div>
                <div>
                  <span className="form-title">교회 이메일</span>
                  <span>{clickedContact.email}</span>
                </div>
                <hr className="m20" />
                <div className="mb8">
                  <span className="form-title">강의 대상</span>
                  <span>{clickedContact.attendee_target}</span>
                </div>
                <div className="mb8">
                  <span className="form-title">청강자 수</span>
                  <span>{clickedContact.attendee_number}</span>
                </div>
                <div className="mb8">
                  <span className="form-title">원하는 날짜</span>
                  <input className="form-input" type="date" value={contactDate} onChange={(e) => setContactDate(e.target.value)} />
                </div>
                <div className="mb35">
                  <span className="form-title">원하는 시간대</span>
                  <input className="form-input" type="time" value={contactStartDate} onChange={(e) => setContactStartDate(e.target.value)} /> ~{" "}
                  <input className="form-input" type="time" value={contactEndDate} onChange={(e) => setContactEndDate(e.target.value)} />
                </div>
                <div className="mb25 form-grid">
                  <span className="form-title">요청사항</span>
                  <textarea className="form-textarea" type="date" value={contactMemo.replaceAll("<br/>", "\n")} onChange={(e) => setContactMemo(e.target.value)} />
                </div>
                <hr className="bold-hr mb35" />
                <div className="form-btn-wrapper">
                  <button className="form-btn mr15" onClick={finishContact}>
                    날짜 수정 완료
                  </button>
                  <button className="form-btn" onClick={clickBackBtn}>
                    뒤로가기
                  </button>
                </div>
              </div>
            ) : (
              <div className="show-lecture-detail">
                <h2 className="mb20">{clickedContact.lecture_name}</h2>
                <hr className="bold-hr mb25" />

                {/* <div>now</div>
                        <div>{clickedContact.status}</div> */}

                {clickedContact.status !== 0 && (
                  <span>
                    {/* <div>here!!</div>
                        <div>{clickedContact.status}</div> */}

                    <div className="mb8">
                      <span className="form-title">신청자명</span>
                      <span>{clickedContact.admin_name}</span>
                    </div>
                    <div>
                      <span className="form-title">연락처</span>
                      <span>{clickedContact.admin_phone}</span>
                    </div>
                    <hr className="m20" />
                  </span>
                )}
                <div className="mb8">
                  <span className="form-title">교회명</span>
                  <span>{clickedContact.church_name}</span>
                </div>
                <div className="mb8">
                  <span className="form-title">주소</span>
                  <span>
                    {clickedContact.addr1} {clickedContact.addr2}
                  </span>
                </div>
                <div className="mb8">
                  <span className="form-title">교회 연락처</span>
                  <span>{clickedContact.phone}</span>
                </div>
                <div>
                  <span className="form-title">교회 이메일</span>
                  <span>{clickedContact.email}</span>
                </div>
                <hr className="m20" />
                <div className="mb8">
                  <span className="form-title">강의 대상</span>
                  <span>{clickedContact.attendee_target}</span>
                </div>
                <div className="mb8">
                  <span className="form-title">청강자 수</span>
                  <span>{clickedContact.attendee_number}</span>
                </div>
                <div className="mb8">
                  <span className="form-title">원하는 날짜</span>
                  <span>{clickedContact.date}</span>
                </div>
                <div className="mb35">
                  <span className="form-title">원하는 시간대</span>
                  {clickedContact.status === 2 ? (
                    <span>
                      {clickedContact.contact_start_date} ~ {clickedContact.contact_end_date}
                    </span>
                  ) : (
                    <span>{clickedContact.timezone}</span>
                  )}
                </div>
                <div className="mb25 form-grid">
                  <span className="form-title">요청사항</span>
                  <span>
                    {clickedContact.memo.split("<br/>").map((item, i) => (
                      <div key={i}>{item}</div>
                    ))}
                  </span>
                </div>
                <hr className="bold-hr mb35" />
                {clickedContact.status === 0 ? (
                  <div className="form-btn-wrapper">
                    <button className="form-btn mr15" onClick={contactStart}>
                      연락처 확인하기
                    </button>
                    {/* <button className="form-btn mr15" onClick={contactStart}>컨택 시작하기</button> */}
                  </div>
                ) : clickedContact.status === 1 ? (
                  <div className="form-btn-wrapper">
                    <button className="form-btn mr15" onClick={clickEditBtn}>
                      날짜 확정하기
                    </button>
                    <button className="form-btn" onClick={cancelContact}>
                      컨택 취소하기
                    </button>
                  </div>
                ) : clickedContact.status === 2 ? (
                  <div className="form-btn-wrapper">
                    <button className="form-btn" onClick={clickEditBtn}>
                      날짜 수정하기
                    </button>
                    <button className="form-btn" onClick={cancelContact}>
                      컨택 취소하기
                    </button>
                  </div>
                ) : null}
              </div>
            )
          ) : (
            <div className="select-inst">컨택 내역을 선택하세요.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminContact;
