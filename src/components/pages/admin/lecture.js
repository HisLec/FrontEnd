import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "react-js-pagination";
import XLSX from "xlsx";
import FileSaver from "file-saver";
import "../../../assets/css/table.css";
import "../../../assets/css/default.css";
import "../../../assets/css/admin_lecture.css";
import GreyButton from "../../modules/button/admin_grey_btn";
import CommonModal from "../../modules/modal/common";

import LectureCalendar from "../../modules/calendar/lecture_calendar";
import CommonCalendar from "../../modules/calendar/common";
import ReadCalendar from "../../modules/calendar/read_calendar";
import WhiteButton from "../../modules/button/white_button";

function AdminLecture(props) {
  const [keyword, setKeyword] = useState(null);
  const [calendarInfo, setcalendarInfo] = useState(null);

  const [allLecture, setAllLecture] = useState(null);
  const [allInstructors, setallInstructors] = useState(null);
  const [editLecture, seteditLecture] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [categoryData, setCategoryData] = useState([]);

  const [addLectureInstId, setaddLectureInstId] = useState("-");
  const [addLectureName, setAddLectureName] = useState("");
  const [addLectureStartDate, setAddLectureStartDate] = useState("");
  const [addLectureEndDate, setAddLectureEndDate] = useState("");
  const [addLectureSampleUrl, setAddLectureSampleUrl] = useState("");
  const [addLectureIntro, setAddLectureIntro] = useState("");

  const [isModalOpen, setisModalOpen] = useState(false);
  const [today, setToday] = useState(new Date());
  const [regionData, setRegionData] = useState(null);
  const [selectedCategoryData, setSelectedCategoryData] = useState([]);
  const [selectedRegionData, setSelectedRegionData] = useState([]);
  const [calendar, setCalendar] = useState(false);
  const [editcalendar, seteditcalendar] = useState(false);
  const [selectedTimeZoneData, setSelectedTimeZoneData] = useState([]);
  const [selectedDayWeekData, setSelectedDayWeekData] = useState([]);
  const [isShowDelete, setisShowDelete] = useState(false);

  const [topicDataByLecture, settopicDataByLecture] = useState(null);
  const [regionDataByLecture, setregionDataByLecture] = useState(null);
  const [lectureDateDataByLecture, setlectureDateByLecture] = useState(null);
  const [detailByLecture, setDetailByLecture] = useState(null);
  const [editLectureInfo, seteditLectureInfo] = useState(null);
  const [resultDates, setresultDates] = useState(null);
  const [dateData, setdateData] = useState([]);
  const [notUsingCalendar, setnotUsingCalendar] = useState(false);
  const [academyDates, setacademyDates] = useState(null);

  const [page, setPage] = useState(1);
  const postsPerPage = 10;

  let submitFlag = false;

  function submitCheck() {
    if (submitFlag) {
      return submitFlag;
    } else {
      submitFlag = true;
      return false;
    }
  }

  useEffect(() => {
    readAllLecture();
    readCategory();
    readAllInstructors();
    readAcademyDates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPage(1);
  }, [isShowDelete]);

  useEffect(() => {
    if (selectedLecture !== null) {
      seteditLectureInfo(selectedLecture);
      if (selectedLecture.date === "") {
        seteditcalendar(false);
      } else {
        seteditcalendar(true);
      }
      readTopicByLectureId();
      readRegionByLectureId();
      readLectureDateByLectureId();
      readDetailByLectureId();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLecture]);

  useEffect(() => {
    if (notUsingCalendar) {
      seteditLectureInfo({
        ...editLectureInfo,
        start_date: null,
        end_date: null,
        day_week_array: [0, 0, 0, 0, 0, 0, 0],
        morning: 0,
        afternoon: 0,
        evening: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notUsingCalendar]);

  useEffect(() => {
    if (detailByLecture !== null && lectureDateDataByLecture !== null && lectureDateDataByLecture.length !== 0 && detailByLecture.day_week !== null) {
      setnotUsingCalendar(false);
      var day_split = detailByLecture.day_week.split(",");
      var default_day_week = [0, 0, 0, 0, 0, 0, 0];
      day_split.forEach((day) => {
        if (day.trim() === "월") default_day_week[1] = 1;
        if (day.trim() === "화") default_day_week[2] = 1;
        if (day.trim() === "수") default_day_week[3] = 1;
        if (day.trim() === "목") default_day_week[4] = 1;
        if (day.trim() === "금") default_day_week[5] = 1;
        if (day.trim() === "토") default_day_week[6] = 1;
        if (day.trim() === "일") default_day_week[0] = 1;
      });
      seteditLectureInfo({
        ...editLectureInfo,
        start_date: detailByLecture.start_date,
        end_date: detailByLecture.end_date,
        morning: detailByLecture.morning,
        afternoon: detailByLecture.afternoon,
        evening: detailByLecture.evening,
        day_week_array: default_day_week,
      });
    } else if (detailByLecture !== null) {
      setnotUsingCalendar(true);
      seteditLectureInfo({
        ...editLectureInfo,
        start_date: detailByLecture.start_date,
        end_date: detailByLecture.end_date,
        morning: detailByLecture.morning,
        afternoon: detailByLecture.afternoon,
        evening: detailByLecture.evening,
        day_week_array: [0, 0, 0, 0, 0, 0, 0],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailByLecture]);

  const searchKeywordChanged = (e) => {
    setKeyword(e.target.value);
  };

  const readAcademyDates = async () => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "academyDate", {
      params: {
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    setacademyDates(response.data);
  };

  const readLectureDateByLectureId = async () => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "lectureDate", {
      params: {
        lecture_id: selectedLecture.id,
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    setlectureDateByLecture(response.data);
  };

  const readTopicByLectureId = async () => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "lecture/topic/" + selectedLecture.id, {
      params: {
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    settopicDataByLecture(response.data);
  };

  const readRegionByLectureId = async () => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "lecture/region/" + selectedLecture.id, {
      params: {
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    setregionDataByLecture(response.data);
  };

  const readDetailByLectureId = async () => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "lecture/lectureDetail/" + selectedLecture.id, {
      params: {
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    setDetailByLecture(response.data);
  };

  const readAllInstructors = async () => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "instructor", {
      params: {
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    //setaddLectureInstId(response.data[0].user_id);
    setallInstructors(response.data);
  };

  const readAllLecture = async () => {
    setPage(1);
    if (keyword !== null && keyword !== "") {
      const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "lecture/admin", {
        params: {
          keyword: encodeURI(keyword),
          token: window.sessionStorage.getItem("token"),
          manageID: window.sessionStorage.getItem("id"),
        },
      });
      setAllLecture(response.data);
    } else {
      const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "lecture/admin", {
        params: {
          token: window.sessionStorage.getItem("token"),
          manageID: window.sessionStorage.getItem("id"),
        },
      });
      setAllLecture(response.data);
    }
    setKeyword(null);
    setSelectedLecture(null);
  };

  function clickLecture(data) {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    if (month < 10) month = "0" + month;
    var date = year + "-" + month;

    if (selectedLecture === null || selectedLecture.id !== data.id) {
      setSelectedLecture(data);
      readMainCalendar(date, data.id);
      seteditLecture(false);
      seteditLectureInfo(data);
    } else {
      setSelectedLecture(null);
    }
  }

  const readMainCalendar = async (date, id) => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "calendar/lecture", {
      params: {
        date: date,
        lecture_id: id,
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    setcalendarInfo(response.data);
    setresultDates(response.data);
  };

  const editBtnClick = () => {
    seteditLecture(true);
    seteditLectureInfo(selectedLecture);
    readTopicByLectureId();
    readRegionByLectureId();
    readLectureDateByLectureId();
    readDetailByLectureId();
  };

  const cancelBtnClick = () => {
    seteditLecture(false);
    if (selectedLecture.date === "") {
      seteditcalendar(false);
    } else {
      seteditcalendar(true);
    }
  };
  const deleteBtnClick = () => {
    if (window.confirm("강의를 삭제하시겠습니까?")) {
      axios({
        url: process.env.REACT_APP_RESTAPI_HOST + "lecture/delete",
        method: "put",
        data: {
          id: selectedLecture.id,
          token: window.sessionStorage.getItem("token"),
          manageID: window.sessionStorage.getItem("id"),
        },
      }).then(function (res) {
        readAllLecture();
        setSelectedLecture(null);
        alert("강의가 삭제되었습니다.");
      });
    }
  };

  const updateFinishBtn = () => {
    var day_week_string = [];
    editLectureInfo.day_week_array.forEach((item, index) => {
      if (index === 0 && item === 1) day_week_string.push("일");
      if (index === 1 && item === 1) day_week_string.push("월");
      if (index === 2 && item === 1) day_week_string.push("화");
      if (index === 3 && item === 1) day_week_string.push("수");
      if (index === 4 && item === 1) day_week_string.push("목");
      if (index === 5 && item === 1) day_week_string.push("금");
      if (index === 6 && item === 1) day_week_string.push("토");
    });
    day_week_string = day_week_string.join(",");

    if (editLectureInfo.name === null || editLectureInfo.name === "") {
      alert("강의 제목을 입력해주세요.");
      return;
    }
    var topicFlag = false;
    var regionFlag = false;
    topicDataByLecture.forEach((topic) => {
      if (topic.status === 1) topicFlag = true;
    });
    regionDataByLecture.forEach((region) => {
      if (region.status === 1) regionFlag = true;
    });
    if (topicFlag === false) {
      alert("강의 주제를 선택해주세요.");
      return;
    }
    if (regionFlag === false) {
      alert("강의 가능 지역을 선택해주세요.");
      return;
    }
    if (!notUsingCalendar) {
      if (editLectureInfo.morning === 0 && editLectureInfo.afternoon === 0 && editLectureInfo.evening === 0) {
        alert("강의 가능 시간대를 선택해주세요.");
        return;
      }
    }
    if (editLectureInfo.intro === null || editLectureInfo.intro === "") {
      alert("강의 소개를 입력해주세요.");
      return;
    }
    if (!notUsingCalendar && !editcalendar) {
      alert("캘린더에 일정을 반영해주세요!");
      return;
    }

    if (window.confirm("강의를 수정하시겠습니까?")) {
      axios({
        url: process.env.REACT_APP_RESTAPI_HOST + "lecture/update",
        method: "put",
        data: {
          ...editLectureInfo,
          regionInfo: regionDataByLecture,
          topicInfo: topicDataByLecture,
          dateInfo: resultDates,
          day_week: day_week_string,
          token: window.sessionStorage.getItem("token"),
          manageID: window.sessionStorage.getItem("id"),
        },
      }).then(function (res) {
        readAllLecture();
        setSelectedLecture(null);
        seteditLecture(false);
        seteditcalendar(false);
        alert("강의가 수정되었습니다.");
      });
    }
  };

  const openModal = () => {
    setToday(new Date());
    readCategory();
    readRegion();
    setisModalOpen(true);
  };
  const readCategory = async () => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "lecture/category", {
      params: {
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    setCategoryData(response.data);
  };

  const selectCategory = (index) => {
    const result = selectedCategoryData.filter((id) => id === index);
    if (result.length === 0) {
      setSelectedCategoryData([...selectedCategoryData, index]);
    } else {
      setSelectedCategoryData(selectedCategoryData.filter((id) => id !== index));
    }
  };

  const readRegion = async () => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "lecture/region", {
      params: {
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    setRegionData(response.data);
  };

  const selectRegion = (index) => {
    const result = selectedRegionData.filter((id) => id === index || id === 0);
    var temp;
    if (result.length === 0) {
      if (index === 0) {
        temp = [...selectedRegionData, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
        temp.sort(function (a, b) {
          return a - b;
        });
        setSelectedRegionData(temp);
      } else {
        temp = [...selectedRegionData, index];
        temp.sort(function (a, b) {
          return a - b;
        });
        setSelectedRegionData(temp);
      }
    } else {
      if (index === 0) {
        setSelectedRegionData([]);
      } else {
        setSelectedRegionData(selectedRegionData.filter((id) => id !== index && id !== 0));
      }
    }
  };

  const selectTimeZone = (index) => {
    const result = selectedTimeZoneData.filter((id) => id === index);
    if (result.length === 0) {
      setSelectedTimeZoneData([...selectedTimeZoneData, index]);
    } else {
      setSelectedTimeZoneData(selectedTimeZoneData.filter((id) => id !== index));
    }
  };

  const selectDayWeek = (index) => {
    const result = selectedDayWeekData.filter((id) => id === index);
    if (result.length === 0) {
      setSelectedDayWeekData([...selectedDayWeekData, index]);
    } else {
      setSelectedDayWeekData(selectedDayWeekData.filter((id) => id !== index));
    }
  };

  const closeModal = () => {
    setisModalOpen(false);
    setAddLectureName(null);
    setAddLectureIntro(null);
    setAddLectureSampleUrl("");
    setAddLectureStartDate(null);
    setAddLectureEndDate(null);
    setSelectedDayWeekData([]);
    setSelectedTimeZoneData([]);
    setSelectedCategoryData([]);
    setSelectedRegionData([]);
    //setaddLectureInstId(allInstructors[0].user_id);
    setresultDates(null);
    setCalendar(false);
    setnotUsingCalendar(false);
    submitFlag = false;
  };

  const createLecture = async () => {
    var tempDayWeek = [];
    if (selectedDayWeekData.find((element) => element === "월")) tempDayWeek.push("월");
    if (selectedDayWeekData.find((element) => element === "화")) tempDayWeek.push("화");
    if (selectedDayWeekData.find((element) => element === "수")) tempDayWeek.push("수");
    if (selectedDayWeekData.find((element) => element === "목")) tempDayWeek.push("목");
    if (selectedDayWeekData.find((element) => element === "금")) tempDayWeek.push("금");
    if (selectedDayWeekData.find((element) => element === "토")) tempDayWeek.push("토");
    if (selectedDayWeekData.find((element) => element === "일")) tempDayWeek.push("일");

    if (addLectureInstId === null || addLectureInstId === "-") {
      alert("교수님을 선택해주세요");
      return;
    }

    if (addLectureName === null || addLectureName === "") {
      alert("강의 제목을 입력해주세요.");
      return;
    }
    if (selectedCategoryData === [] || selectedCategoryData.length === 0) {
      alert("강의 주제를 선택해주세요.");
      return;
    }
    if (selectedRegionData === [] || selectedRegionData.length === 0) {
      alert("강의 가능 지역을 선택해주세요.");
      return;
    }
    if (!notUsingCalendar) {
      if (selectedTimeZoneData === [] || selectedTimeZoneData.length === 0) {
        alert("강의 가능 시간대를 선택해주세요.");
        return;
      }
    }
    if (addLectureIntro === null || addLectureIntro === "") {
      alert("강의 소개를 입력해주세요.");
      return;
    }
    if (!notUsingCalendar && !calendar) {
      alert("캘린더에 일정을 반영해주세요!");
      return;
    }
    if (submitCheck()) {
      alert("데이터 처리 중입니다.");
      return;
    }
    if (window.confirm("강의를 추가하시겠습니까?")) {
      var params = new URLSearchParams();
      params.append("name", addLectureName);
      params.append("intro", addLectureIntro);
      params.append("sample_url", addLectureSampleUrl);
      if (!notUsingCalendar) {
        params.append("start_date", addLectureStartDate);
        params.append("end_date", addLectureEndDate);
        params.append("day_week", Array.from(new Set(tempDayWeek)).join(", "));
      }
      params.append("morning", Array.from(new Set(selectedTimeZoneData)).filter((timezone) => timezone === "morning").length);
      params.append("afternoon", Array.from(new Set(selectedTimeZoneData)).filter((timezone) => timezone === "afternoon").length);
      params.append("evening", Array.from(new Set(selectedTimeZoneData)).filter((timezone) => timezone === "evening").length);
      params.append("topic", Array.from(new Set(selectedCategoryData)).join(","));
      params.append("token", window.sessionStorage.getItem("token"));
      params.append("manageID", window.sessionStorage.getItem("id"));
      if (selectedRegionData.filter((id) => id === 0).length >= 1) {
        params.append("region", "0");
      } else {
        params.append("region", Array.from(new Set(selectedRegionData)).join(","));
      }
      params.append("dateData", dateData);
      await axios.post(
        process.env.REACT_APP_RESTAPI_HOST + "lecture/instructor/" + addLectureInstId, //[loginID]로그인 후 변경
        params
      );

      setAddLectureName(null);
      setAddLectureIntro(null);
      setAddLectureSampleUrl("");
      setAddLectureStartDate(null);
      setAddLectureEndDate(null);
      setSelectedDayWeekData([]);
      setSelectedTimeZoneData([]);
      setSelectedCategoryData([]);
      setSelectedRegionData([]);
      setaddLectureInstId(allInstructors[0].user_id);
      setresultDates(null);
      setCalendar(false);
      setnotUsingCalendar(false);

      readAllLecture();
      alert("강의를 추가했습니다.");
      closeModal();
    }
  };

  const openCalendar = () => {
    if (addLectureStartDate === null || addLectureEndDate === null || selectedDayWeekData.length === 0) {
      alert("시작날짜, 끝날짜, 요일을 모두 선택해주세요!");
      return;
    }
    var allDays = betweenDate();
    var weekDays = [0, 0, 0, 0, 0, 0, 0]; // 일, 월, 화, 수, 목, 금, 토
    var resultDates = [];

    selectedDayWeekData.forEach((day) => {
      if (day === "일") weekDays[0] = 1;
      else if (day === "월") weekDays[1] = 1;
      else if (day === "화") weekDays[2] = 1;
      else if (day === "수") weekDays[3] = 1;
      else if (day === "목") weekDays[4] = 1;
      else if (day === "금") weekDays[5] = 1;
      else if (day === "토") weekDays[6] = 1;
    });
    allDays.forEach((date) => {
      if (weekDays[new Date(date).getDay()] === 1) resultDates.push(date);
    });
    setresultDates(resultDates);

    setCalendar(true);
  };

  const reCalendar = () => {
    if (addLectureStartDate === null || addLectureEndDate === null || selectedDayWeekData.length === 0) {
      alert("시작날짜, 끝날짜, 요일을 선택해주세요!");
      return;
    }
    if (window.confirm("위에 일정을 다시 캘린더에 반영하면 캘린더에서 편집했던 일정이 모두 사라집니다. 반영하시겠습니까?")) {
      var allDays = betweenDate();
      var weekDays = [0, 0, 0, 0, 0, 0, 0]; // 일, 월, 화, 수, 목, 금, 토
      var resultDates = [];

      selectedDayWeekData.forEach((day) => {
        if (day === "일") weekDays[0] = 1;
        else if (day === "월") weekDays[1] = 1;
        else if (day === "화") weekDays[2] = 1;
        else if (day === "수") weekDays[3] = 1;
        else if (day === "목") weekDays[4] = 1;
        else if (day === "금") weekDays[5] = 1;
        else if (day === "토") weekDays[6] = 1;
      });
      allDays.forEach((date) => {
        if (weekDays[new Date(date).getDay()] === 1) resultDates.push(date);
      });
      setresultDates(resultDates);
    }
  };

  const reEditCalendar = () => {
    if (
      editLectureInfo.start_date === null ||
      editLectureInfo.start_date === "" ||
      editLectureInfo.end_date === null ||
      editLectureInfo.end_date === "" ||
      editLectureInfo.day_week_array.find((element) => element === 1) === undefined
    ) {
      alert("시작날짜, 끝날짜, 요일을 모두 선택해주세요!");
      return;
    }
    if (window.confirm("위에 일정을 다시 캘린더에 반영하면 캘린더에서 편집했던 일정이 모두 사라집니다. 반영할까요?")) {
      var allDays = betweenEditDate();
      var tempData = [];
      if (resultDates !== null) tempData = resultDates.filter((e) => e.form_id !== 0);

      allDays.forEach((date) => {
        if (editLectureInfo.day_week_array[new Date(date).getDay()] === 1)
          tempData.push({
            lecture_date_id: 0,
            date: date,
            form_id: 0,
          });
      });
      setresultDates(tempData);
      seteditcalendar(true);
    }
  };

  function betweenDate() {
    var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
    if (!(regex.test(addLectureStartDate) && regex.test(addLectureEndDate))) return "Not Date Format";
    var result = [];
    var curDate = new Date(addLectureStartDate);
    while (curDate <= new Date(addLectureEndDate)) {
      result.push(curDate.toISOString().split("T")[0]);
      curDate.setDate(curDate.getDate() + 1);
    }
    return result;
  }

  function betweenEditDate() {
    var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
    if (!(regex.test(editLectureInfo.start_date) && regex.test(editLectureInfo.end_date))) return "Not Date Format";
    var result = [];
    var curDate = new Date(editLectureInfo.start_date);
    while (curDate <= new Date(editLectureInfo.end_date)) {
      result.push(curDate.toISOString().split("T")[0]);
      curDate.setDate(curDate.getDate() + 1);
    }
    return result;
  }

  const handlePageChange = (page) => {
    setPage(page);
  };

  function currentPosts(tmp) {
    var indexOfLast = page * postsPerPage;
    var indexOfFirst = indexOfLast - postsPerPage;

    let currentPosts = 0;
    if (isShowDelete) {
      // 삭제된 거 보여줄때
      currentPosts = allLecture.filter((data) => data.del_date !== null).slice(indexOfFirst, indexOfLast);
    } else {
      // 전체 강의일 때
      currentPosts = allLecture.filter((data) => data.del_date === null).slice(indexOfFirst, indexOfLast);
    }
    return currentPosts;
  }

  const exportToCSV = () => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = "lecture";
    const ws = XLSX.utils.json_to_sheet(allLecture);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const deleteToExist = () => {
    if (window.confirm("강의를 복구하시겠습니까?")) {
      axios({
        url: process.env.REACT_APP_RESTAPI_HOST + "lecture/recover",
        method: "put",
        data: {
          id: selectedLecture.id,
          token: window.sessionStorage.getItem("token"),
          manageID: window.sessionStorage.getItem("id"),
        },
      }).then(function (res) {
        readAllLecture();
        setSelectedLecture(null);
        alert("강의가 복구되었습니다.");
      });
    }
  };

  const onEdit = (e) => {
    const { value, name } = e.target;
    seteditLectureInfo({
      ...editLectureInfo,
      [name]: value,
    });
  };

  const createDate = async (lecture_id, date) => {
    var params = new URLSearchParams();
    params.append("lecture_id", lecture_id);
    params.append("date", date);
    params.append("token", window.sessionStorage.getItem("token"));
    params.append("manageID", window.sessionStorage.getItem("id"));

    const response = await axios.post(process.env.REACT_APP_RESTAPI_HOST + "lectureDate", params);
  };

  const deleteDate = (id) => {
    axios({
      url: process.env.REACT_APP_RESTAPI_HOST + "lectureDate",
      method: "delete",
      data: {
        id: id,
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
  };

  const clickTopic = (data) => {
    let newTopic = topicDataByLecture.map((topic, i) => {
      if (topic.id === data.id) {
        if (topic.status === 0) return { ...topic, status: 1 };
        else return { ...topic, status: 0 };
      } else {
        return topic;
      }
    });
    settopicDataByLecture(newTopic);
  };

  const clickRegion = (data) => {
    var check = 0;
    let newRegion = regionDataByLecture.map((region, i) => {
      if (region.id === data.id) {
        if (region.status === 0) return { ...region, status: 1 };
        else {
          check = 1;
          return { ...region, status: 0 };
        }
      } else {
        return region;
      }
    });
    if (check === 1) {
      newRegion[0].status = 0;
    }
    setregionDataByLecture(newRegion);
  };

  const clickTimezone = (time) => {
    var status = 0;
    if (time === "morning") {
      if (editLectureInfo.morning === 0) status = 1;
      seteditLectureInfo({
        ...editLectureInfo,
        morning: status,
      });
    } else if (time === "afternoon") {
      if (editLectureInfo.afternoon === 0) status = 1;
      seteditLectureInfo({
        ...editLectureInfo,
        afternoon: status,
      });
    }
    if (time === "evening") {
      if (editLectureInfo.evening === 0) status = 1;
      seteditLectureInfo({
        ...editLectureInfo,
        evening: status,
      });
    }
  };

  const editDayClick = (index) => {
    let updateArr = editLectureInfo.day_week_array;
    updateArr.forEach((item, i) => {
      if (i === index) {
        if (item === 0) updateArr[i] = 1;
        else updateArr[i] = 0;
      }
    });
    seteditLectureInfo({
      ...editLectureInfo,
      day_week_array: updateArr,
    });
  };

  const clickEveryRegion = () => {
    var isEvery = regionDataByLecture[0].status;

    let newArr = regionDataByLecture.map((item, i) => {
      if (isEvery) {
        // 전국 체크 해제
        return { ...item, status: 0 };
      } else {
        return { ...item, status: 1 };
      }
    });

    setregionDataByLecture(newArr);
  };

  return (
    <div>
      <p className="admin-title-header">강의 관리</p>
      <div className="admin-content-wrapper">
        <div className="table-wrapper mt0 relative">
          <p className="table-name mb40">
            {isShowDelete ? "삭제된 강의 목록" : "강의 목록"}
            <GreyButton class="right" name="강의 추가하기" click={openModal} />
            <GreyButton class="right mr10" name="엑셀 파일 다운로드" click={exportToCSV} />
          </p>

          <div className="mb35">
            <input className="p48 search-lecture-input" type="text" placeholder="강사명, 강의명, 강의 소개, 지역, 주제로 키워드 검색" value={keyword || ""} onChange={searchKeywordChanged} />
            <GreyButton name="검색" class="mr15" click={readAllLecture} />
            {!isShowDelete ? (
              <GreyButton
                name="삭제된 강의 보기"
                click={() => {
                  setisShowDelete(true);
                }}
              />
            ) : (
              <GreyButton
                name="전체 강의 보기"
                click={() => {
                  setisShowDelete(false);
                }}
              />
            )}
          </div>

          <CommonModal open={isModalOpen} close={closeModal} func={createLecture} header="강의 추가하기" footer="추가하기">
            <div className="lecture-info-wrapper">
              <p className="admin-lecture-date">
                <span>
                  {allInstructors !== null && allInstructors.length !== 0 ? (
                    <select className="mr15 p4" defaultValue="-" onChange={(e) => setaddLectureInstId(e.target.value)}>
                      <option value="-">교수님 선택</option>
                      {allInstructors
                        .filter((data) => data.del_date === null)
                        .map((data) => (
                          <option key={data.id} value={data.user_id}>
                            {data.inst_name} {data.position_name}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <span>강사가 없습니다.</span>
                  )}
                  {/* {allInstructors !== null ?
                                    <select>
                                    allInstructors.map((data, index) => (
                                        <option value={data.id}>{data.name} 강사</option>
                                    ))
                                    </select>
                                    :
                                    <span>강사가 없습니다.</span>
                                    } */}
                  작성일 {today.toLocaleString()}
                </span>
                {/* <span className="lecture-update">수정일 2021_07_14_일</span> */}
              </p>
              <div className="p4030">
                <div className="lecture-grid-layout2 mb15">
                  <span className="lecture-info-title">강의 제목</span>
                  <input
                    className="lecture-input"
                    onChange={(e) => {
                      setAddLectureName(e.target.value);
                    }}
                  />
                </div>
                <hr className="lecture-hr" />
                <div className="category-grid mb20">
                  <span className="lecture-info-title">가능 지역</span>
                  <div className="category-wrapper">
                    {regionData !== null
                      ? regionData.map((dataUnit, index2) => (
                          <div
                            key={index2}
                            className={selectedRegionData.filter((id) => id === dataUnit.id || id === 0).length !== 0 ? "category-btn category-active" : "category-btn "}
                            onClick={() => {
                              selectRegion(dataUnit.id);
                            }}
                          >
                            {dataUnit.name}
                          </div>
                        ))
                      : null}
                  </div>
                </div>
                <div className="category-grid">
                  <span className="lecture-info-title">주제 카테고리</span>
                  <div className="category-wrapper">
                    {categoryData !== null
                      ? categoryData.map((dataUnit, index2) => (
                          <div
                            key={index2}
                            className={selectedCategoryData.filter((id) => id === dataUnit.id).length !== 0 ? "category-btn category-active" : "category-btn "}
                            onClick={() => {
                              selectCategory(dataUnit.id);
                            }}
                          >
                            {dataUnit.name}
                          </div>
                        ))
                      : null}
                  </div>
                </div>
                <hr className="lecture-hr" />
                {notUsingCalendar ? (
                  <div className="mb40 lecture-grid-layout">
                    <span className="lecture-info-title">가능한 날짜</span>
                    <span>
                      <div className="mt5">
                        <label className="mr10">일정 미지정</label>
                        <input type="checkbox" onChange={(e) => setnotUsingCalendar(!notUsingCalendar)} checked />
                      </div>
                    </span>
                  </div>
                ) : (
                  <div className="mb40 lecture-grid-layout">
                    <span className="lecture-info-title">가능한 날짜</span>
                    <span>
                      <input
                        className="lecture-input"
                        type="date"
                        onChange={(e) => {
                          setAddLectureStartDate(e.target.value);
                        }}
                      />{" "}
                      ~{" "}
                      <input
                        className="lecture-input"
                        type="date"
                        onChange={(e) => {
                          setAddLectureEndDate(e.target.value);
                        }}
                      />
                      <div className="mt5">
                        <label className="mr10">일정 미지정</label>
                        <input type="checkbox" onChange={(e) => setnotUsingCalendar(!notUsingCalendar)} />
                      </div>
                    </span>
                    <span className="lecture-info-title">가능한 시간대</span>
                    <span>
                      <span
                        className={selectedTimeZoneData.filter((id) => id === "morning").length !== 0 ? "day-btn day-active" : "day-btn"}
                        onClick={() => {
                          selectTimeZone("morning");
                        }}
                      >
                        오전
                      </span>
                      <span
                        className={selectedTimeZoneData.filter((id) => id === "afternoon").length !== 0 ? "day-btn day-active" : "day-btn"}
                        onClick={() => {
                          selectTimeZone("afternoon");
                        }}
                      >
                        오후
                      </span>
                      <span
                        className={selectedTimeZoneData.filter((id) => id === "evening").length !== 0 ? "day-btn day-active" : "day-btn"}
                        onClick={() => {
                          selectTimeZone("evening");
                        }}
                      >
                        저녁
                      </span>
                    </span>
                    <span className="lecture-info-title">가능한 요일</span>
                    <span>
                      <span
                        className={selectedDayWeekData.filter((id) => id === "월").length !== 0 ? "day-btn day-active" : "day-btn"}
                        onClick={() => {
                          selectDayWeek("월");
                        }}
                      >
                        월
                      </span>
                      <span
                        className={selectedDayWeekData.filter((id) => id === "화").length !== 0 ? "day-btn day-active" : "day-btn"}
                        onClick={() => {
                          selectDayWeek("화");
                        }}
                      >
                        화
                      </span>
                      <span
                        className={selectedDayWeekData.filter((id) => id === "수").length !== 0 ? "day-btn day-active" : "day-btn"}
                        onClick={() => {
                          selectDayWeek("수");
                        }}
                      >
                        수
                      </span>
                      <span
                        className={selectedDayWeekData.filter((id) => id === "목").length !== 0 ? "day-btn day-active" : "day-btn"}
                        onClick={() => {
                          selectDayWeek("목");
                        }}
                      >
                        목
                      </span>
                      <span
                        className={selectedDayWeekData.filter((id) => id === "금").length !== 0 ? "day-btn day-active" : "day-btn"}
                        onClick={() => {
                          selectDayWeek("금");
                        }}
                      >
                        금
                      </span>
                      <span
                        className={selectedDayWeekData.filter((id) => id === "토").length !== 0 ? "day-btn day-active" : "day-btn"}
                        onClick={() => {
                          selectDayWeek("토");
                        }}
                      >
                        토
                      </span>
                      <span
                        className={selectedDayWeekData.filter((id) => id === "일").length !== 0 ? "day-btn day-active" : "day-btn"}
                        onClick={() => {
                          selectDayWeek("일");
                        }}
                      >
                        일
                      </span>
                    </span>
                    <span></span>
                    <WhiteButton name={calendar === true ? "다시 반영하기" : "캘린더에서 확인하기"} click={calendar === true ? reCalendar : openCalendar} />
                  </div>
                )}

                {calendar === true ? <CommonCalendar academyDates={academyDates} resultDates={resultDates} setdateData={setdateData} /> : null}
                <hr className="lecture-hr" />
                <div className="lecture-grid-layout2 mb15">
                  <span className="lecture-info-title">강의 URL 주소</span>
                  <input
                    className="lecture-input mr15"
                    onChange={(e) => {
                      setAddLectureSampleUrl(e.target.value);
                    }}
                  />
                  <span className="lecture-info-title">강의 내용 설명</span>
                  <textarea
                    className="lecture-input mr15 h600"
                    onChange={(e) => {
                      setAddLectureIntro(e.target.value);
                    }}
                  ></textarea>
                </div>
                {/* <div className="button-wrapper">
                                    <GreyButton class="mr15" name="수정 완료"/>
                                    <GreyButton class="" name="강의 삭제"/>
                                </div> */}
              </div>
            </div>
          </CommonModal>

          <div className="mt50 table-row-lec">
            <span className="th admin-subject">주제</span>
            <span className="th">강의명</span>
            <span className="th">강사명</span>
            <span className="th admin-date">기간</span>
            <span className="th admin-loc">강의 지역</span>
          </div>
          {allLecture !== null && currentPosts(allLecture).length !== 0 ? (
            currentPosts(allLecture).map((data, index) => (
              <div
                key={index}
                className={selectedLecture !== null && selectedLecture.id === data.id ? "click-inst-row table-row-lec" : "table-row-lec"}
                onClick={() => {
                  clickLecture(data);
                }}
              >
                <span className="td admin-subject">{data.topic}</span>
                <span className="td">{data.name}</span>
                <span className="td">{data.instructor_name}</span>
                <span className="td admin-date">{data.date === "" || data.date.length === 0 ? "일정 미지정" : data.date}</span>
                <span className="td admin-loc">{data.region}</span>
              </div>
            ))
          ) : (
            <div className="no-content">강의가 없습니다.</div>
          )}
        </div>
        <Pagination
          activePage={page}
          itemsCountPerPage={postsPerPage}
          totalItemsCount={allLecture === null ? 0 : isShowDelete ? allLecture.filter((data) => data.del_date !== null).length : allLecture.filter((data) => data.del_date === null).length}
          pageRangeDisplayed={5}
          prevPageText={"‹"}
          nextPageText={"›"}
          onChange={handlePageChange}
        />

        {selectedLecture !== null ? (
          editLecture === true && editLectureInfo !== null ? (
            <div className="lecture-info-wrapper">
              <p className="lecture-date">
                <span>작성일 {editLectureInfo.reg_Date}</span>
                <span className="lecture-update">수정일 {editLectureInfo.toLocaleString()}</span>
              </p>
              <div className="p4030">
                <div className="lecture-grid-layout2 mb15">
                  <span className="lecture-info-title">강의 제목</span>
                  <input className="lecture-input" defaultValue={editLectureInfo.name} name="name" onChange={onEdit} />
                </div>
                <div className="mb15">
                  <span className="lecture-info-title">강사명</span>
                  <span>{editLectureInfo.instructor_name} 강사</span>
                </div>
                <hr className="lecture-hr" />
                <div className="lecture-grid-layout mb15">
                  <span className="lecture-info-title">가능 지역</span>
                  <div className="category-wrapper">
                    {regionDataByLecture !== null ? (
                      regionDataByLecture.map((data, index) => (
                        <span
                          key={index}
                          className={data.status === 1 ? "category-btn category-active" : "category-btn"}
                          onClick={() => {
                            data.id === 0 ? clickEveryRegion() : clickRegion(data);
                          }}
                        >
                          {data.name}
                        </span>
                      ))
                    ) : (
                      <div>선택 가능한 지역이 없습니다.</div>
                    )}
                  </div>
                </div>
                <div className="category-grid">
                  <span className="lecture-info-title">주제 카테고리</span>
                  <div className="category-wrapper">
                    {topicDataByLecture !== null ? (
                      topicDataByLecture.map((data, index) => (
                        <span key={index} className={data.status === 1 ? "category-btn category-active" : "category-btn"} onClick={() => clickTopic(data)}>
                          {data.name}
                        </span>
                      ))
                    ) : (
                      <div>선택 가능한 주제가 없습니다.</div>
                    )}
                  </div>
                </div>
                <hr className="lecture-hr" />
                {notUsingCalendar ? (
                  <div className="mb40 lecture-grid-layout">
                    <span className="lecture-info-title">가능한 날짜</span>
                    <span>
                      <div className="mt5">
                        <label className="mr10">일정 미지정</label>
                        <input
                          type="checkbox"
                          value={notUsingCalendar}
                          onChange={(e) => {
                            setresultDates(null);
                            setnotUsingCalendar(!notUsingCalendar);
                          }}
                          checked
                        />
                      </div>
                    </span>
                  </div>
                ) : (
                  <div className="mb40 lecture-grid-layout">
                    <span className="lecture-info-title">가능한 날짜</span>
                    <span>
                      <input className="lecture-input" name="start_date" defaultValue={editLectureInfo.start_date} onChange={onEdit} type="date" /> ~{" "}
                      <input className="lecture-input" name="end_date" onChange={onEdit} defaultValue={editLectureInfo.end_date} type="date" />
                      <div className="mt5">
                        <label className="mr10">일정 미지정</label>
                        <input
                          type="checkbox"
                          value={notUsingCalendar}
                          onChange={(e) => {
                            setnotUsingCalendar(!notUsingCalendar);
                          }}
                        />
                      </div>
                    </span>
                    <span className="lecture-info-title">가능한 시간대</span>
                    <span>
                      <span className={editLectureInfo.morning ? "day-btn day-active" : "day-btn"} onClick={() => clickTimezone("morning")}>
                        아침
                      </span>
                      <span className={editLectureInfo.afternoon ? "day-btn day-active" : "day-btn"} onClick={() => clickTimezone("afternoon")}>
                        점심
                      </span>
                      <span className={editLectureInfo.evening ? "day-btn day-active" : "day-btn"} onClick={() => clickTimezone("evening")}>
                        저녁
                      </span>
                    </span>
                    <span className="lecture-info-title">가능한 요일</span>
                    <span>
                      <span
                        className={
                          editLectureInfo.day_week_array !== null && editLectureInfo.day_week_array !== undefined && editLectureInfo.day_week_array[1] === 1 ? "day-btn day-active" : "day-btn"
                        }
                        onClick={() => editDayClick(1)}
                      >
                        월
                      </span>
                      <span
                        className={
                          editLectureInfo.day_week_array !== null && editLectureInfo.day_week_array !== undefined && editLectureInfo.day_week_array[2] === 1 ? "day-btn day-active" : "day-btn"
                        }
                        onClick={() => editDayClick(2)}
                      >
                        화
                      </span>
                      <span
                        className={
                          editLectureInfo.day_week_array !== null && editLectureInfo.day_week_array !== undefined && editLectureInfo.day_week_array[3] === 1 ? "day-btn day-active" : "day-btn"
                        }
                        onClick={() => editDayClick(3)}
                      >
                        수
                      </span>
                      <span
                        className={
                          editLectureInfo.day_week_array !== null && editLectureInfo.day_week_array !== undefined && editLectureInfo.day_week_array[4] === 1 ? "day-btn day-active" : "day-btn"
                        }
                        onClick={() => editDayClick(4)}
                      >
                        목
                      </span>
                      <span
                        className={
                          editLectureInfo.day_week_array !== null && editLectureInfo.day_week_array !== undefined && editLectureInfo.day_week_array[5] === 1 ? "day-btn day-active" : "day-btn"
                        }
                        onClick={() => editDayClick(5)}
                      >
                        금
                      </span>
                      <span
                        className={
                          editLectureInfo.day_week_array !== null && editLectureInfo.day_week_array !== undefined && editLectureInfo.day_week_array[6] === 1 ? "day-btn day-active" : "day-btn"
                        }
                        onClick={() => editDayClick(6)}
                      >
                        토
                      </span>
                      <span
                        className={
                          editLectureInfo.day_week_array !== null && editLectureInfo.day_week_array !== undefined && editLectureInfo.day_week_array[0] === 1 ? "day-btn day-active" : "day-btn"
                        }
                        onClick={() => editDayClick(0)}
                      >
                        일
                      </span>
                    </span>
                    <WhiteButton name="다시 반영하기" click={reEditCalendar} />
                  </div>
                )}
                {!notUsingCalendar && editcalendar ? (
                  <LectureCalendar
                    academyDates={academyDates}
                    calendarData={resultDates}
                    path={window.location.href.replace(process.env.REACT_APP_DEFAULT_WHOLE_URL, "/")}
                    createDate={createDate}
                    // updateDate={updateDate}
                    deleteDate={deleteDate}
                    lectureId={editLectureInfo.id}
                    setResultDates={setresultDates}
                  />
                ) : (
                  <div></div>
                )}
                <hr className="lecture-hr" />
                <div className="lecture-grid-layout2 mb15">
                  <span className="lecture-info-title">강의 URL 주소</span>
                  <input className="lecture-input mr15" defaultValue={editLectureInfo.sample_url} name="sample_url" onChange={onEdit} />
                  <span className="lecture-info-title">강의 내용 설명</span>
                  <textarea className="lecture-input mr15 h600" defaultValue={selectedLecture.intro.replaceAll("<br/>", "\n")} name="intro" onChange={onEdit} />
                </div>
                <div className="button-wrapper">
                  <GreyButton class="mr15" name="수정 완료" click={updateFinishBtn} />
                  <GreyButton class="" name="수정 취소" click={cancelBtnClick} />
                </div>
              </div>
            </div>
          ) : (
            <div className="show-lecture-detail">
              <div className="detail-title">
                <h2>{selectedLecture.name}</h2>
                <span>{selectedLecture.instructor_name} 작성</span>
                <span className="lecture-detail-date">강의가능기간: {selectedLecture.date !== null && selectedLecture.date !== "" ? selectedLecture.date : "일정 미지정"}</span>
              </div>
              <div className="detail-content">
                <div className="detail-sub-info">
                  <span>강의 가능 지역</span>
                  <span>: {selectedLecture.region} </span>
                  <span>강의 주제 카테고리</span>
                  <span>: {selectedLecture.topic}</span>
                  {selectedLecture.sample_url !== null && selectedLecture.sample_url !== "" && selectedLecture.sample_url !== "null" ? <span>강의 URL 주소</span> : null}
                  {selectedLecture.sample_url !== null && selectedLecture.sample_url !== "" && selectedLecture.sample_url !== "null" ? (
                    <span>
                      : <a href={selectedLecture.sample_url}>{selectedLecture.sample_url}</a>
                    </span>
                  ) : null}
                </div>
                <p className="mb30">
                  {selectedLecture.intro.split("<br/>").map((item, i) => (
                    <div key={i}>{item}</div>
                  ))}
                </p>
                {selectedLecture.date.length === 0 ? (
                  "일정 추후 문의"
                ) : (
                  <div className="lecture-inst-calendar">
                    <ReadCalendar
                      academyDates={academyDates}
                      readMainCalendar={readMainCalendar}
                      calendarData={calendarInfo}
                      path={window.location.href.replace(process.env.REACT_APP_DEFAULT_WHOLE_URL, "/")}
                      clickedLecture={selectedLecture}
                    />
                  </div>
                )}
                {/* <div className="lecture-inst-calendar">
                                <ReadCalendar academyDates={academyDates} readMainCalendar={readMainCalendar} calendarData={calendarInfo} path={window.location.href.replace(process.env.REACT_APP_DEFAULT_WHOLE_URL, "/")} clickedLecture={selectedLecture}/>
                            </div> */}
                {isShowDelete ? (
                  <div className="button-wrapper">
                    <GreyButton class="" name="복구하기" click={deleteToExist} />
                  </div>
                ) : (
                  <div className="button-wrapper">
                    <GreyButton class="mr15" name="수정하기" click={editBtnClick} />
                    <GreyButton class="" name="삭제하기" click={deleteBtnClick} />
                  </div>
                )}
              </div>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}

export default AdminLecture;
