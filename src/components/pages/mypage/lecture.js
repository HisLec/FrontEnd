import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import Pagination from "react-js-pagination";
import "../../../assets/css/default.css";
import "../../../assets/css/lecture_layout.css";
import GreyButton from "../../modules/button/admin_grey_btn";
import CommonCalendar from "../../modules/calendar/common";
import ReadCalendar from "../../modules/calendar/read_calendar";
import LectureCalendar from "../../modules/calendar/lecture_calendar";
import { Link } from "react-router-dom";
import axios from "axios";
import WhiteButton from "../../modules/button/white_button";
import CommonModal from "../../modules/modal/common";

function MypageLecture(props) {
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [lectureLoading, setLectureLoading] = useState(null);
  const [lectureData, setLectureData] = useState(null);
  const [calendarInfo, setcalendarInfo] = useState(null);
  const [page, setPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [postsPerPage, setpostsPerPage] = useState(10);
  const [isEdit, setisEdit] = useState(false);

  const [isModalOpen, setisModalOpen] = useState(false);
  const [today, setToday] = useState(new Date());
  const [categoryData, setCategoryData] = useState(null);
  const [regionData, setRegionData] = useState(null);
  const [selectedCategoryData, setSelectedCategoryData] = useState([]);
  const [selectedRegionData, setSelectedRegionData] = useState([]);
  const [calendar, setCalendar] = useState(false);
  const [selectedTimeZoneData, setSelectedTimeZoneData] = useState([]);
  const [selectedDayWeekData, setSelectedDayWeekData] = useState([]);
  const [resultDates, setresultDates] = useState(null);
  const [dateData, setdateData] = useState([]);
  const [academyDates, setacademyDates] = useState(null);
  const [editCalendar, setEditCalendar] = useState(true);

  const [addLectureName, setAddLectureName] = useState(null);
  const [addLectureStartDate, setAddLectureStartDate] = useState(null);
  const [addLectureEndDate, setAddLectureEndDate] = useState(null);
  const [addLectureSampleUrl, setAddLectureSampleUrl] = useState("");
  const [addLectureIntro, setAddLectureIntro] = useState(null);

  const [topicDataByLecture, settopicDataByLecture] = useState(null);
  const [regionDataByLecture, setregionDataByLecture] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [lectureDateDataByLecture, setlectureDateByLecture] = useState(null);
  const [detailByLecture, setDetailByLecture] = useState(null);
  const [editLectureInfo, seteditLectureInfo] = useState(null);
  const [notUsingCalendar, setnotUsingCalendar] = useState(false);
  const [settingInfo, setsettingInfo] = useState(null);

  let submitFlag = false;

  const readSettingInfo = async () => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "setting", {
      params: {
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    setsettingInfo(response.data);
  };

  function submitCheck() {
    if (submitFlag) {
      return submitFlag;
    } else {
      submitFlag = true;
      return false;
    }
  }

  function lectureClick(id, data) {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    if (month < 10) month = "0" + month;
    var date = year + "-" + month;

    if (selectedLecture === id) setSelectedLecture(null);
    else {
      setSelectedLecture(id);
      readMainCalendar(date, lectureData[id].id);
      setisEdit(false);
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

  const readAcademyDates = async () => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "academyDate", {
      params: {
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    setacademyDates(response.data);
  };

  const openModal = () => {
    setnotUsingCalendar(false);
    setToday(new Date());
    readCategory();
    readRegion();
    setisModalOpen(true);
    setSelectedDayWeekData([]);
    setSelectedTimeZoneData([]);
  };
  const readCategory = async () => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "lecture/category", {
      params: {
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    setCategoryData(response.data);
    setSelectedCategoryData([]);
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
    setSelectedRegionData([]);
  };

  const selectRegion = (index) => {
    const result = selectedRegionData.filter((id) => id === index || id === 0);
    if (result.length === 0) {
      var temp;
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
    setCalendar(false);
    setSelectedDayWeekData([]);
    setAddLectureStartDate(null);
    setAddLectureEndDate(null);
    submitFlag = false;
  };

  useEffect(() => {
    readLecture();
    readAcademyDates();
    readSettingInfo();
  }, []);

  useEffect(() => {
    if (selectedLecture !== null) {
      seteditLectureInfo(lectureData[selectedLecture]);
      readTopicByLectureId();
      readRegionByLectureId();
      readLectureDateByLectureId();
      readDetailByLectureId();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLecture]);

  useEffect(() => {
    if (detailByLecture !== null && lectureData[selectedLecture].date.length !== 0) {
      setnotUsingCalendar(false);
      var day_split = detailByLecture.day_week.split(",");
      var default_day_week = [0, 0, 0, 0, 0, 0, 0];
      day_split.forEach((day) => {
        if (day.trim() === "???") default_day_week[1] = 1;
        if (day.trim() === "???") default_day_week[2] = 1;
        if (day.trim() === "???") default_day_week[3] = 1;
        if (day.trim() === "???") default_day_week[4] = 1;
        if (day.trim() === "???") default_day_week[5] = 1;
        if (day.trim() === "???") default_day_week[6] = 1;
        if (day.trim() === "???") default_day_week[0] = 1;
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

  useEffect(() => {
    setSelectedLecture(null);
  }, [page]);

  const readLectureDateByLectureId = async () => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "lectureDate", {
      params: {
        lecture_id: lectureData[selectedLecture].id,
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    setlectureDateByLecture(response.data);
  };

  const readTopicByLectureId = async () => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "lecture/topic/" + lectureData[selectedLecture].id, {
      params: {
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    settopicDataByLecture(response.data);
  };

  const readRegionByLectureId = async () => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "lecture/region/" + lectureData[selectedLecture].id, {
      params: {
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    setregionDataByLecture(response.data);
  };

  const readDetailByLectureId = async () => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "lecture/lectureDetail/" + lectureData[selectedLecture].id, {
      params: {
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    setDetailByLecture(response.data);
  };

  useEffect(() => {
    setCalendar(false);
  }, [addLectureStartDate]);
  useEffect(() => {
    setCalendar(false);
  }, [addLectureEndDate]);
  useEffect(() => {
    setCalendar(false);
  }, [selectedDayWeekData]);

  const createLecture = async () => {
    if (addLectureName === null || addLectureName === "") {
      alert("?????? ????????? ??????????????????.");
      return;
    }
    if (selectedCategoryData === [] || selectedCategoryData.length === 0) {
      alert("?????? ????????? ??????????????????.");
      return;
    }
    if (selectedRegionData === [] || selectedRegionData.length === 0) {
      alert("?????? ?????? ????????? ??????????????????.");
      return;
    }
    if (!notUsingCalendar && (selectedTimeZoneData === [] || selectedTimeZoneData.length === 0)) {
      alert("?????? ?????? ???????????? ??????????????????.");
      return;
    }
    // if(addLectureSampleUrl === null || addLectureSampleUrl === "") {
    //     alert("?????? ?????? ????????? ??????????????????.");
    //     return;
    // }
    if (addLectureIntro === null || addLectureIntro === "") {
      alert("?????? ????????? ??????????????????.");
      return;
    }
    if (!notUsingCalendar && !calendar) {
      alert("???????????? ????????? ??????????????????!");
      return;
    }
    if (submitCheck()) {
      alert("????????? ?????? ????????????.");
      return;
    }
    if (window.confirm("????????? ?????????????????????????")) {
      var params = new URLSearchParams();
      params.append("name", addLectureName);
      params.append("intro", addLectureIntro);
      params.append("sample_url", addLectureSampleUrl);
      if (!notUsingCalendar) {
        params.append("start_date", addLectureStartDate);
        params.append("end_date", addLectureEndDate);
        params.append("day_week", Array.from(new Set(selectedDayWeekData)).join(", "));
      }

      params.append("morning", Array.from(new Set(selectedTimeZoneData)).filter((timezone) => timezone === "morning").length);
      params.append("afternoon", Array.from(new Set(selectedTimeZoneData)).filter((timezone) => timezone === "afternoon").length);
      params.append("evening", Array.from(new Set(selectedTimeZoneData)).filter((timezone) => timezone === "evening").length);
      params.append("topic", Array.from(new Set(selectedCategoryData)).join(","));
      if (selectedRegionData.filter((id) => id === 0).length >= 1) {
        params.append("region", "0");
      } else {
        params.append("region", Array.from(new Set(selectedRegionData)).join(","));
      }
      params.append("dateData", dateData);
      params.append("token", window.sessionStorage.getItem("token"));
      params.append("manageID", window.sessionStorage.getItem("id"));

      await axios.post(
        process.env.REACT_APP_RESTAPI_HOST + "lecture/instructor/" + window.sessionStorage.getItem("id"), //[loginID]????????? ??? ??????
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

      readLecture();
      alert("????????? ??????????????????.");
      submitFlag = false;
      closeModal();
    }
  };

  const openCalendar = () => {
    if (addLectureStartDate === null || addLectureEndDate === null || selectedDayWeekData.length === 0) {
      alert("????????????, ?????????, ????????? ?????? ??????????????????!");
      return;
    }
    var allDays = betweenDate();
    var weekDays = [0, 0, 0, 0, 0, 0, 0]; // ???, ???, ???, ???, ???, ???, ???
    var resultDates = [];

    selectedDayWeekData.forEach((day) => {
      if (day === "???") weekDays[0] = 1;
      else if (day === "???") weekDays[1] = 1;
      else if (day === "???") weekDays[2] = 1;
      else if (day === "???") weekDays[3] = 1;
      else if (day === "???") weekDays[4] = 1;
      else if (day === "???") weekDays[5] = 1;
      else if (day === "???") weekDays[6] = 1;
    });
    allDays.forEach((date) => {
      if (weekDays[new Date(date).getDay()] === 1) resultDates.push(date);
    });
    setresultDates(resultDates);

    setCalendar(true);
  };

  const reCalendar = () => {
    if (addLectureStartDate === null || addLectureEndDate === null || selectedDayWeekData.length === 0) {
      alert("????????????, ?????????, ????????? ??????????????????!");
      return;
    }
    if (window.confirm("?????? ????????? ?????? ???????????? ???????????? ??????????????? ???????????? ????????? ?????? ???????????????. ?????????????????????????")) {
      var allDays = betweenDate();
      var weekDays = [0, 0, 0, 0, 0, 0, 0]; // ???, ???, ???, ???, ???, ???, ???
      var resultDates = [];

      selectedDayWeekData.forEach((day) => {
        if (day === "???") weekDays[0] = 1;
        else if (day === "???") weekDays[1] = 1;
        else if (day === "???") weekDays[2] = 1;
        else if (day === "???") weekDays[3] = 1;
        else if (day === "???") weekDays[4] = 1;
        else if (day === "???") weekDays[5] = 1;
        else if (day === "???") weekDays[6] = 1;
      });
      allDays.forEach((date) => {
        if (weekDays[new Date(date).getDay()] === 1) resultDates.push(date);
      });
      setresultDates(resultDates);
    }
  };

  const reEditCalendar = () => {
    setEditCalendar(true);
    if (
      editLectureInfo.start_date === null ||
      editLectureInfo.start_date === "" ||
      editLectureInfo.end_date === null ||
      editLectureInfo.end_date === "" ||
      editLectureInfo.day_week_array.find((element) => element === 1) === undefined
    ) {
      alert("????????????, ?????????, ????????? ?????? ??????????????????!");
      return;
    }
    if (window.confirm("?????? ????????? ?????? ???????????? ???????????? ??????????????? ???????????? ????????? ?????? ???????????????. ????????????????")) {
      var allDays = betweenEditDate();
      var tempData;
      if (resultDates !== null) {
        tempData = resultDates.filter((e) => e.form_id !== 0);
      } else {
        tempData = [];
      }

      allDays.forEach((date) => {
        if (editLectureInfo.day_week_array[new Date(date).getDay()] === 1)
          tempData.push({
            lecture_date_id: 0,
            date: date,
            form_id: 0,
          });
      });
      setresultDates(tempData);
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

  const readLecture = async (id) => {
    setLectureLoading(true);
    setSelectedLecture(null);
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "lecture/user/" + window.sessionStorage.getItem("id"), {
      params: {
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    setLectureData(response.data);

    setLectureLoading(false);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  function currentPosts(tmp) {
    var indexOfLast = page * postsPerPage;
    var indexOfFirst = indexOfLast - postsPerPage;

    let currentPosts = 0;
    currentPosts = lectureData.slice(indexOfFirst, indexOfLast);
    return currentPosts;
  }

  const deleteLecture = () => {
    if (window.confirm("????????? ?????????????????????????")) {
      axios({
        url: process.env.REACT_APP_RESTAPI_HOST + "lecture/delete",
        method: "put",
        data: {
          id: lectureData[selectedLecture].id,
          token: window.sessionStorage.getItem("token"),
          manageID: window.sessionStorage.getItem("id"),
        },
      }).then(function (res) {
        readLecture();
        setSelectedLecture(null);
        alert("????????? ?????????????????????.");
      });
    }
  };

  const updateBtnClick = () => {
    setToday(new Date());
    setisEdit(true);
  };

  const cancelBtnClick = () => {
    setisEdit(false);
    seteditLectureInfo(lectureData[selectedLecture]);
    readTopicByLectureId();
    readRegionByLectureId();
    readLectureDateByLectureId();
    readDetailByLectureId();
  };

  // const updateLecture = () => {
  //     setisEdit(true);
  // }

  const onEdit = (e) => {
    const { value, name } = e.target;
    if (name === "start_date" || name === "end_date") {
      setEditCalendar(false);
    }

    seteditLectureInfo({
      ...editLectureInfo,
      [name]: value,
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
    let newRegion = regionDataByLecture.map((region, i) => {
      if (region.id === 0) {
        return { ...region, status: 0 };
      }
      if (region.id === data.id) {
        if (region.status === 0) return { ...region, status: 1 };
        else return { ...region, status: 0 };
      } else {
        return region;
      }
    });
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

  const updateFinishBtn = () => {
    if (!notUsingCalendar && !editCalendar) {
      alert("???????????? ????????? ??????????????????!");
      return;
    }
    if (editLectureInfo.name === "" || editLectureInfo.name === null) {
      alert("?????? ????????? ??????????????????.");
      return;
    }
    if (regionDataByLecture.find((element) => element.status === 1) === undefined) {
      alert("?????? ?????? ????????? ??????????????????.");
      return;
    }

    // if (regionDataByLecture.find((element) => element.id === 0)) {
    //   setregionDataByLecture({ id: "0", name: "??????", status: "1" });
    // }

    if (topicDataByLecture.find((element) => element.status === 1) === undefined) {
      alert("?????? ????????? ??????????????????.");
      return;
    }
    if (!notUsingCalendar && editLectureInfo.morning === 0 && editLectureInfo.afternoon === 0 && editLectureInfo.evening === 0) {
      alert("?????? ?????? ???????????? ??????????????????.");
      return;
    }
    var day_week_string = [];
    editLectureInfo.day_week_array.forEach((item, index) => {
      if (index === 0 && item === 1) day_week_string.push("???");
      if (index === 1 && item === 1) day_week_string.push("???");
      if (index === 2 && item === 1) day_week_string.push("???");
      if (index === 3 && item === 1) day_week_string.push("???");
      if (index === 4 && item === 1) day_week_string.push("???");
      if (index === 5 && item === 1) day_week_string.push("???");
      if (index === 6 && item === 1) day_week_string.push("???");
    });
    day_week_string = day_week_string.join(",");

    console.log(editLectureInfo);
    editLectureInfo.intro = editLectureInfo.intro.replace(/<br\/>/g, "\r\n");

    if (window.confirm("????????? ?????????????????????????")) {
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
        readLecture();
        setSelectedLecture(null);
        setisEdit(false);
        alert("????????? ?????????????????????.");
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
    setEditCalendar(false);
  };

  const clickEveryRegion = () => {
    var isEvery = regionDataByLecture[0].status;

    let newArr = regionDataByLecture.map((item, i) => {
      if (isEvery) {
        // ?????? ?????? ??????
        return { ...item, status: 0 };
      } else {
        return { ...item, status: 1 };
      }
    });

    setregionDataByLecture(newArr);
  };

  return (
    <div>
      <div className="mypage-image">
        <img className="page-background" src={process.env.REACT_APP_DEFAULT_URL + "image/instructor_mypage.png"} alt="lecture page" />
        <div className="page-info">
          <h2 style={{ color: "white" }}>???????????????</h2>
          <p>
            {settingInfo !== null
              ? settingInfo
                  .find((element) => element.key === "mypage_lecture_phrase")
                  .value.split("<br/>")
                  .map((item, i) => <div key={i}>{item}</div>)
              : ""}
          </p>
        </div>
      </div>
      <div className="inst-title-header">
        <h2 style={{ color: "white" }}>???????????????</h2>
        <p>
          {settingInfo !== null
            ? settingInfo
                .find((element) => element.key === "mypage_lecture_phrase")
                .value.split("<br/>")
                .map((item, i) => <div key={i}>{item}</div>)
            : ""}
        </p>
      </div>
      <div className="content-wrapper">
        <div className="left-navbar">
          <span>
            <Link className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL + "mypage/profile" ? "left-active" : ""} to={process.env.REACT_APP_DEFAULT_URL + "mypage/profile"}>
              ??? ?????????
            </Link>
          </span>
          <span>
            <Link className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL + "mypage/lecture" ? "left-active" : ""} to={process.env.REACT_APP_DEFAULT_URL + "mypage/lecture"}>
              ??? ?????????
            </Link>
          </span>
          <span>
            <Link className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL + "mypage/contact" ? "left-active" : ""} to={process.env.REACT_APP_DEFAULT_URL + "mypage/contact"}>
              ?????? ??????
            </Link>
          </span>
          <span>
            <Link className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL + "mypage/visitlog" ? "left-active" : ""} to={process.env.REACT_APP_DEFAULT_URL + "mypage/visitlog"}>
              ????????????
            </Link>
          </span>
        </div>
        <div className="right-content">
          <CommonModal open={isModalOpen} close={closeModal} func={createLecture} header="?????? ????????????" footer="????????????">
            <div className="lecture-info-wrapper">
              <p className="lecture-date">
                <span>????????? {today.toLocaleString()}</span>
                {/* <span className="lecture-update">????????? 2021_07_14_???</span> */}
              </p>
              <div className="p4030">
                <div className="lecture-grid-layout2 mb15">
                  <span className="lecture-info-title">?????? ??????</span>
                  <input
                    className="lecture-input"
                    onChange={(e) => {
                      setAddLectureName(e.target.value);
                    }}
                  />
                </div>
                <hr className="lecture-hr" />
                <div className="category-grid mb20">
                  <span className="lecture-info-title">?????? ??????</span>
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
                  <span className="lecture-info-title">?????? ????????????</span>
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
                    <span className="lecture-info-title">????????? ??????</span>
                    <span>
                      <div className="mt5">
                        <label className="mr10">?????? ?????????</label>
                        <input type="checkbox" onChange={(e) => setnotUsingCalendar(!notUsingCalendar)} checked />
                      </div>
                    </span>
                  </div>
                ) : (
                  <div className="mb40 lecture-grid-layout">
                    <span className="lecture-info-title">????????? ??????</span>
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
                        <label className="mr10">?????? ?????????</label>
                        <input type="checkbox" onChange={(e) => setnotUsingCalendar(!notUsingCalendar)} />
                      </div>
                    </span>
                    <span className="lecture-info-title">????????? ?????????</span>
                    <span>
                      <span
                        className={selectedTimeZoneData.filter((id) => id === "morning").length !== 0 ? "day-btn day-active" : "day-btn"}
                        onClick={() => {
                          selectTimeZone("morning");
                        }}
                      >
                        ??????
                      </span>
                      <span
                        className={selectedTimeZoneData.filter((id) => id === "afternoon").length !== 0 ? "day-btn day-active" : "day-btn"}
                        onClick={() => {
                          selectTimeZone("afternoon");
                        }}
                      >
                        ??????
                      </span>
                      <span
                        className={selectedTimeZoneData.filter((id) => id === "evening").length !== 0 ? "day-btn day-active" : "day-btn"}
                        onClick={() => {
                          selectTimeZone("evening");
                        }}
                      >
                        ??????
                      </span>
                    </span>
                    <span className="lecture-info-title">????????? ??????</span>
                    <span>
                      <span
                        className={selectedDayWeekData.filter((id) => id === "???").length !== 0 ? "day-btn day-active" : "day-btn"}
                        onClick={() => {
                          selectDayWeek("???");
                        }}
                      >
                        ???
                      </span>
                      <span
                        className={selectedDayWeekData.filter((id) => id === "???").length !== 0 ? "day-btn day-active" : "day-btn"}
                        onClick={() => {
                          selectDayWeek("???");
                        }}
                      >
                        ???
                      </span>
                      <span
                        className={selectedDayWeekData.filter((id) => id === "???").length !== 0 ? "day-btn day-active" : "day-btn"}
                        onClick={() => {
                          selectDayWeek("???");
                        }}
                      >
                        ???
                      </span>
                      <span
                        className={selectedDayWeekData.filter((id) => id === "???").length !== 0 ? "day-btn day-active" : "day-btn"}
                        onClick={() => {
                          selectDayWeek("???");
                        }}
                      >
                        ???
                      </span>
                      <span
                        className={selectedDayWeekData.filter((id) => id === "???").length !== 0 ? "day-btn day-active" : "day-btn"}
                        onClick={() => {
                          selectDayWeek("???");
                        }}
                      >
                        ???
                      </span>
                      <span
                        className={selectedDayWeekData.filter((id) => id === "???").length !== 0 ? "day-btn day-active" : "day-btn"}
                        onClick={() => {
                          selectDayWeek("???");
                        }}
                      >
                        ???
                      </span>
                      <span
                        className={selectedDayWeekData.filter((id) => id === "???").length !== 0 ? "day-btn day-active" : "day-btn"}
                        onClick={() => {
                          selectDayWeek("???");
                        }}
                      >
                        ???
                      </span>
                    </span>
                    <span></span>
                    <WhiteButton name={calendar === true ? "?????? ????????????" : "??????????????? ????????????"} click={calendar === true ? reCalendar : openCalendar} />
                  </div>
                )}
                {calendar === true ? <CommonCalendar academyDates={academyDates} resultDates={resultDates} setdateData={setdateData} /> : null}
                <hr className="lecture-hr" />
                <div className="lecture-grid-layout2 mb15">
                  <span className="lecture-info-title">?????? URL ??????</span>
                  <input
                    className="lecture-input mr15"
                    onChange={(e) => {
                      setAddLectureSampleUrl(e.target.value);
                    }}
                  />
                  <span className="lecture-info-title">?????? ?????? ??????</span>
                  <textarea
                    className="lecture-input mr15 h600"
                    onChange={(e) => {
                      setAddLectureIntro(e.target.value);
                    }}
                  ></textarea>
                </div>
                {/* <div className="button-wrapper">
                                    <GreyButton class="mr15" name="?????? ??????"/>
                                    <GreyButton class="" name="?????? ??????"/>
                                </div> */}
              </div>
            </div>
          </CommonModal>
          <div className="table-wrapper">
            <div style={{ textAlign: "right", marginBottom: "30px" }}>
              <WhiteButton name="?????? ????????????" click={openModal} />
            </div>
            <div className="table-row-mylec">
              <div className="th">??????</div>
              <div className="th">?????????</div>
              <div className="th date">??????</div>
              <div className="th location">?????? ??????</div>
            </div>
            {lectureLoading === false && lectureData !== null && lectureData.length > 0 ? (
              currentPosts(lectureData).map((data, index) => (
                <div
                  key={index}
                  className={selectedLecture === index + (page - 1) * postsPerPage ? "subject-table-row selected-subject" : "subject-table-row"}
                  onClick={() => {
                    lectureClick(index + (page - 1) * postsPerPage, data);
                  }}
                >
                  <div className="td">{data.topic}</div>
                  <div className="td">{data.name}</div>
                  <div className="td date">{data.date === "" || data.date.length === 0 ? "?????? ?????????" : data.date}</div>
                  <div className="td location">{data.region}</div>
                </div>
              ))
            ) : lectureLoading === true ? (
              <div className="lecture-loading">
                <ReactLoading type="spin" color="rgb(5 88 156 / 47%)" className="lecture-loading-data" width="50px" />
              </div>
            ) : (
              <div className="lecture-no-data">????????? ????????????.</div>
            )}
          </div>
          <Pagination
            activePage={page}
            itemsCountPerPage={postsPerPage}
            totalItemsCount={lectureData !== null ? lectureData.length : 0}
            pageRangeDisplayed={5}
            prevPageText={"???"}
            nextPageText={"???"}
            onChange={handlePageChange}
          />
          {/* ????????? ?????? ?????? ?????? */}
          {selectedLecture !== null ? (
            isEdit === true ? (
              <div className="lecture-info-wrapper">
                <p className="lecture-date">
                  <span>????????? {editLectureInfo.reg_date}</span>
                  <span className="lecture-update">????????? {today.toLocaleString()}</span>
                </p>
                <div className="p4030">
                  <div className="lecture-grid-layout2 mb15">
                    <span className="lecture-info-title">?????? ??????</span>
                    <input className="lecture-input" defaultValue={editLectureInfo.name} name="name" onChange={onEdit} />
                  </div>
                  {/* <div className="mb15">
                                <span className="lecture-info-title">?????????</span>
                                <span className="l">?????????</span>
                            </div> */}
                  <hr className="lecture-hr" />
                  <div className="lecture-grid-layout mb15">
                    <span className="lecture-info-title">?????? ??????</span>
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
                        <div>?????? ????????? ????????? ????????????.</div>
                      )}
                    </div>
                  </div>
                  <div className="category-grid">
                    <span className="lecture-info-title">?????? ????????????</span>
                    <div className="category-wrapper">
                      {topicDataByLecture !== null ? (
                        topicDataByLecture.map((data, index) => (
                          <span key={index} className={data.status === 1 ? "category-btn category-active" : "category-btn"} onClick={() => clickTopic(data)}>
                            {data.name}
                          </span>
                        ))
                      ) : (
                        <div>?????? ????????? ????????? ????????????.</div>
                      )}
                    </div>
                  </div>
                  <hr className="lecture-hr" />
                  {notUsingCalendar ? (
                    <div className="mb40 lecture-grid-layout">
                      <span className="lecture-info-title">????????? ??????</span>
                      <span>
                        <div className="mt5">
                          <label className="mr10">?????? ?????????</label>
                          <input
                            type="checkbox"
                            value={notUsingCalendar}
                            onChange={(e) => {
                              setresultDates(null);
                              setnotUsingCalendar(!notUsingCalendar);
                              setEditCalendar(false);
                            }}
                            checked
                          />
                        </div>
                      </span>
                    </div>
                  ) : (
                    <div className="mb40 lecture-grid-layout">
                      <span className="lecture-info-title">????????? ??????</span>
                      <span>
                        <input className="lecture-input" name="start_date" defaultValue={editLectureInfo.start_date} onChange={onEdit} type="date" /> ~{" "}
                        <input className="lecture-input" name="end_date" onChange={onEdit} defaultValue={editLectureInfo.end_date} type="date" />
                        <div className="mt5">
                          <label className="mr10">?????? ?????????</label>
                          <input
                            type="checkbox"
                            value={notUsingCalendar}
                            onChange={(e) => {
                              setnotUsingCalendar(!notUsingCalendar);
                            }}
                          />
                        </div>
                      </span>
                      <span className="lecture-info-title">????????? ?????????</span>
                      <span>
                        <span className={editLectureInfo.morning ? "day-btn day-active" : "day-btn"} onClick={() => clickTimezone("morning")}>
                          ??????
                        </span>
                        <span className={editLectureInfo.afternoon ? "day-btn day-active" : "day-btn"} onClick={() => clickTimezone("afternoon")}>
                          ??????
                        </span>
                        <span className={editLectureInfo.evening ? "day-btn day-active" : "day-btn"} onClick={() => clickTimezone("evening")}>
                          ??????
                        </span>
                      </span>
                      <span className="lecture-info-title">????????? ??????</span>
                      <span>
                        <span className={editLectureInfo.day_week_array[1] === 1 ? "day-btn day-active" : "day-btn"} onClick={() => editDayClick(1)}>
                          ???
                        </span>
                        <span className={editLectureInfo.day_week_array[2] === 1 ? "day-btn day-active" : "day-btn"} onClick={() => editDayClick(2)}>
                          ???
                        </span>
                        <span className={editLectureInfo.day_week_array[3] === 1 ? "day-btn day-active" : "day-btn"} onClick={() => editDayClick(3)}>
                          ???
                        </span>
                        <span className={editLectureInfo.day_week_array[4] === 1 ? "day-btn day-active" : "day-btn"} onClick={() => editDayClick(4)}>
                          ???
                        </span>
                        <span className={editLectureInfo.day_week_array[5] === 1 ? "day-btn day-active" : "day-btn"} onClick={() => editDayClick(5)}>
                          ???
                        </span>
                        <span className={editLectureInfo.day_week_array[6] === 1 ? "day-btn day-active" : "day-btn"} onClick={() => editDayClick(6)}>
                          ???
                        </span>
                        <span className={editLectureInfo.day_week_array[0] === 1 ? "day-btn day-active" : "day-btn"} onClick={() => editDayClick(0)}>
                          ???
                        </span>
                      </span>
                      <WhiteButton name="?????? ????????????" click={reEditCalendar} />
                    </div>
                  )}
                  {notUsingCalendar ? (
                    <div></div>
                  ) : (
                    <LectureCalendar
                      academyDates={academyDates}
                      calendarData={resultDates}
                      path={window.location.href.replace(process.env.REACT_APP_DEFAULT_WHOLE_URL, "/")}
                      lectureId={selectedLecture.id}
                      setResultDates={setresultDates}
                    />
                  )}
                  <hr className="lecture-hr" />
                  <div className="lecture-grid-layout2 mb15">
                    <span className="lecture-info-title">?????? URL ??????</span>
                    <input
                      className="lecture-input mr15"
                      defaultValue={editLectureInfo.sample_url !== null && editLectureInfo.sample_url !== "null" ? editLectureInfo.sample_url : ""}
                      name="sample_url"
                      onChange={onEdit}
                    />
                    <span className="lecture-info-title">?????? ?????? ??????</span>
                    <textarea
                      className="lecture-input mr15 h600"
                      defaultValue={editLectureInfo.intro !== null && editLectureInfo.intro !== "null" ? editLectureInfo.intro.replaceAll("<br/>", "\n") : ""}
                      name="intro"
                      onChange={onEdit}
                    />
                  </div>
                  <div className="button-wrapper">
                    <GreyButton class="mr15" name="?????? ??????" click={updateFinishBtn} />
                    <GreyButton class="" name="?????? ??????" click={cancelBtnClick} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="show-lecture-detail">
                <div className="detail-title">
                  <h2>{lectureData[selectedLecture].name}</h2>
                  <span>{lectureData[selectedLecture].instructor_name}</span>
                  <div className="detail-date">
                    <span>??????????????????: {lectureData[selectedLecture].date.length === 0 ? "?????? ?????????" : lectureData[selectedLecture].date}</span>
                  </div>
                </div>
                <div className="detail-content">
                  <div className="detail-sub-info">
                    <span>?????? ?????? ??????</span>
                    <span>: {lectureData[selectedLecture].region} </span>
                    <span>?????? ?????? ????????????</span>
                    <span>: {lectureData[selectedLecture].topic}</span>
                    {lectureData[selectedLecture].sample_url !== null && lectureData[selectedLecture].sample_url !== "" && lectureData[selectedLecture].sample_url !== "null" ? (
                      <span>?????? URL ??????</span>
                    ) : null}
                    {lectureData[selectedLecture].sample_url !== null && lectureData[selectedLecture].sample_url !== "" && lectureData[selectedLecture].sample_url !== "null" ? (
                      <span>
                        : <a href={lectureData[selectedLecture].sample_url}>{lectureData[selectedLecture].sample_url}</a>
                      </span>
                    ) : null}
                  </div>
                  {/* <p className="mb30">{lectureData[selectedLecture].intro === null ? "" : lectureData[selectedLecture].intro.split("<br/>").map((item, i) => <div key={i}>{item}</div>)}</p> */}
                  <p className="mb30">
                    {lectureData[selectedLecture].intro === null ? "" : lectureData[selectedLecture].intro.split("<br/>").map((item, i) => (item === "\r" ? <br /> : <div>{item}</div>))}
                  </p>
                  {lectureData[selectedLecture].date.length === 0 ? (
                    "?????? ?????? ??????"
                  ) : (
                    <div className="lecture-inst-calendar">
                      <ReadCalendar
                        academyDates={academyDates}
                        readMainCalendar={readMainCalendar}
                        calendarData={calendarInfo}
                        path={window.location.href.replace(process.env.REACT_APP_DEFAULT_WHOLE_URL, "/")}
                        clickedLecture={lectureData[selectedLecture]}
                      />
                    </div>
                  )}
                  <div style={{ textAlign: "center" }}>
                    <WhiteButton class="mr15" name="????????????" click={updateBtnClick} />
                    <WhiteButton name="????????????" click={deleteLecture} />
                  </div>
                </div>
              </div>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default MypageLecture;
