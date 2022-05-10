import React, { useState, useEffect } from "react";
import axios from "axios";
import { RMIUploader } from "react-multiple-image-uploader";
import { Swiper, SwiperSlide } from "swiper/react";
import ReactLoading from "react-loading";
import Pagination from "react-js-pagination";
import { Link } from "react-router-dom";

import "../../../assets/css/table.css";
import "../../../assets/css/mypage.css";

const MypageUserContacted = (props) => {
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [applicationInfo, setapplicationInfo] = useState(null);
  const [feedbackContent, setFeedbackContent] = useState(null);
  const [feedbackFileData, setFeedbackFileData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [lectureRating, setLectureRating] = useState(5);
  const [instructorRating, setInstructorRating] = useState(5);
  const [page, setPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [postsPerPage, setpostsPerPage] = useState(10);
  const [settingInfo, setsettingInfo] = useState(null);

  var feedbackFile = [];

  useEffect(() => {
    readApplicationForms();
    readSettingInfo();
  }, []);

  function leftPad(value) {
    if (value >= 10) {
      return value;
    }
    return `0${value}`;
  }

  function toStringByFormatting(source, delimiter = "-") {
    const year = source.getFullYear();
    const month = leftPad(source.getMonth() + 1);
    const day = leftPad(source.getDate());
    return [year, month, day].join(delimiter);
  }

  const readSettingInfo = async () => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "setting", {
      params: {
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    setsettingInfo(response.data);
  };

  const readApplicationForms = async () => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "application/user/" + window.sessionStorage.getItem("id") + "/contacted", {
      params: {
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });

    const today = toStringByFormatting(new Date());
    var newList = [];
    var cnt = 0;
    for (var i = 0; i < response.data.length; i++) {
      const lectureDate = toStringByFormatting(new Date(response.data[i].date));
      if (lectureDate <= today) {
        newList[cnt] = response.data[i];
        cnt++;
      }
    }

    setapplicationInfo(newList);

    // setapplicationInfo(response.data);
  };

  const cancelContact = async () => {
    if (window.confirm("컨택을 취소하시겠습니까?")) {
      axios({
        url: process.env.REACT_APP_RESTAPI_HOST + "application/status",
        method: "put",
        data: {
          application_form_id: selectedLecture.id,
          status: -1,
          token: window.sessionStorage.getItem("token"),
          manageID: window.sessionStorage.getItem("id"),
        },
      }).then(function (res) {
        readApplicationForms();
        setSelectedLecture({
          ...selectedLecture,
          status: -1,
        });
      });
    }
  };

  const insertVisitingLog = async () => {
    if (window.confirm("피드백을 저장하시겠습니까?")) {
      document.getElementsByClassName("ant-btn-icon-only")[1].click();

      const params = new FormData();
      const headers = {
        "Content-type": "multipart/form-data; charset=UTF-8",
        Accept: "*/*",
      };
      //var params = new URLSearchParams();
      params.append("content", feedbackContent);
      params.append("lecture_rating", lectureRating);
      params.append("instructor_rating", instructorRating);
      params.append("token", window.sessionStorage.getItem("token"));
      params.append("manageID", window.sessionStorage.getItem("id"));

      for (var i = 0; i < feedbackFile.length; i++) {
        params.append("file", feedbackFile[i].file);
      }

      await axios
        .post(
          process.env.REACT_APP_RESTAPI_HOST + "visiting_log/feedback/" + selectedLecture.id, //[loginID]로그인 후 변경
          params,
          { headers }
        )
        .then(function (res) {
          readApplicationForms();
          setSelectedLecture(null);
          alert("피드백을 저장했습니다.");
        });
    }
  };

  const hideModal = () => {
    setVisible(false);
  };
  const onUpload = (data) => {
    feedbackFile = data;
  };
  const onSelect = (data) => {};
  const onRemove = (id) => {};

  const selectButton = async (data) => {
    if (data.visit_reg_date !== null) {
      const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "visiting_log/feedback/file/" + data.feedback_id, {
        params: {
          token: window.sessionStorage.getItem("token"),
          manageID: window.sessionStorage.getItem("id"),
        },
      });
      setFeedbackFileData(response.data);
    }
    setSelectedLecture(data);
  };

  const deleteButton = async () => {
    var value = window.confirm("사용자가 작성한 내용입니다. 삭제할까요?");
    if (value !== false) {
      // const response = await axios.get(
      //     process.env.REACT_APP_RESTAPI_HOST + 'visiting_log/feedback/file/'+data.feedback_id
      // );
      axios({
        url: process.env.REACT_APP_RESTAPI_HOST + "visiting_log/feedback",
        method: "delete",
        data: {
          id: selectedLecture.feedback_id,
          token: window.sessionStorage.getItem("token"),
          manageID: window.sessionStorage.getItem("id"),
        },
      }).then(function (res) {
        alert("삭제가 완료되었습니다.");
        readApplicationForms();
        setSelectedLecture(null);
      });
    }
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

  return (
    <div>
      <div className="main-image">
        <img className="page-background" src={process.env.REACT_APP_DEFAULT_URL + "image/mypage.jpg"} alt="lecture page" />
        <div className="page-info">
          <h2 style={{ color: "white" }}>마이페이지</h2>
          <p>
            {settingInfo !== null
              ? settingInfo
                  .find((element) => element.key === "application_list_phrase")
                  .value.split("<br/>")
                  .map((item, i) => <div key={i}>{item}</div>)
              : ""}
          </p>
        </div>
      </div>
      <div className="content-wrapper">
        <div className="left-navbar">
          <span>
            <Link className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL + "mypage/apply" ? "left-active" : ""} to={process.env.REACT_APP_DEFAULT_URL + "mypage/apply"}>
              신청한 강의
            </Link>
          </span>
          <span>
            <Link className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL + "mypage/take" ? "left-active" : ""} to={process.env.REACT_APP_DEFAULT_URL + "mypage/take"}>
              진행중 강의
            </Link>
          </span>
          <span>
            <Link className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL + "mypage/finish" ? "left-active" : ""} to={process.env.REACT_APP_DEFAULT_URL + "mypage/finish"}>
              수강한 강의
            </Link>
          </span>
        </div>
        <div className="right-content">
          <div className="table-wrapper">
            <div className="table-row-mypage2">
              <span className="th">강의 날짜</span>
              <span className="th">강사명</span>
              <span className="th">강의명</span>
              <span className="th">컨택 상황</span>
            </div>
            {applicationInfo !== null && applicationInfo.length !== 0 ? (
              currentPosts(applicationInfo).map((data, index) => (
                <div
                  key={index}
                  className={selectedLecture !== null && selectedLecture.id === data.id ? "click-inst-row table-row-mypage2" : "table-row-mypage2"}
                  onClick={() => {
                    selectButton(data);
                  }}
                >
                  <span className="td">{data.date}</span>
                  <span className="td">{data.inst_name}</span>
                  <span className="td">{data.lecture_name}</span>
                  {data.status === 0 ? (
                    <span className="td">컨택요청</span>
                  ) : data.status === 1 ? (
                    <span className="td">컨택중</span>
                  ) : data.status === 2 && data.visit_reg_date !== null ? (
                    <span className="td contact-ok">피드백 완료</span>
                  ) : data.status === 2 ? (
                    <span className="td">피드백 미완료</span>
                  ) : (
                    <span className="td">컨택취소</span>
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
          {selectedLecture !== null && selectedLecture.status === 2 && selectedLecture.visit_reg_date !== null ? (
            <div className="show-lecture-detail">
              <div className="star-wrapper">
                <span className="stars">강의 만족도</span>
                <span>
                  {[1, 2, 3, 4, 5].map((data, index) => (
                    <img
                      key={index}
                      className="rating_star"
                      src={data <= selectedLecture.lecture_star ? process.env.REACT_APP_DEFAULT_URL + "image/yellow_star.png" : process.env.REACT_APP_DEFAULT_URL + "image/white_star.png"}
                      alt="white_star"
                    />
                  ))}
                </span>
                <span className="gap"> </span>
                <span className="stars">강사 만족도</span>
                <span>
                  {[1, 2, 3, 4, 5].map((data, index) => (
                    <img
                      key={index}
                      className="rating_star"
                      src={data <= selectedLecture.instructor_star ? process.env.REACT_APP_DEFAULT_URL + "image/yellow_star.png" : process.env.REACT_APP_DEFAULT_URL + "image/white_star.png"}
                      alt="white_star"
                      onClick={() => setInstructorRating(data)}
                    />
                  ))}
                </span>
              </div>
              <p className="feedback-detail-content">
                {selectedLecture.visit_log.split("\n").map((item, i) => (
                  <div key={i}>{item}</div>
                ))}
              </p>
              <div className="feedback-image-swiper-wrapper">
                <Swiper
                  spaceBetween={30}
                  effect={"fade"}
                  centeredSlides={true}
                  loop={true}
                  loopFillGroupWithBlank={true}
                  pagination={{
                    clickable: true,
                  }}
                  navigation={true}
                  className="feedback-swiper"
                >
                  {feedbackFileData !== null ? (
                    feedbackFileData.map((data, index) => (
                      <SwiperSlide key={index}>
                        <div className="feedback-image-wrapper">
                          <img src={process.env.REACT_APP_RESTAPI_HOST + "resources/upload/" + data} alt="uploadFile" />
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    <ReactLoading type="spin" color="#05589c" />
                  )}
                </Swiper>
              </div>
              <button className="feedback-submit" onClick={deleteButton}>
                삭제하기
              </button>
            </div>
          ) : selectedLecture !== null && selectedLecture.status === 2 ? (
            <div className="show-lecture-detail">
              <div className="star-wrapper">
                <span className="stars">강의 만족도</span>
                <span>
                  {[1, 2, 3, 4, 5].map((data, index) => (
                    <img
                      key={index}
                      className="rating_star"
                      src={data <= lectureRating ? process.env.REACT_APP_DEFAULT_URL + "image/yellow_star.png" : process.env.REACT_APP_DEFAULT_URL + "image/white_star.png"}
                      alt="white_star"
                      onClick={() => setLectureRating(data)}
                    />
                  ))}
                </span>
                <span className="gap"> </span>
                <span className="stars">강사 만족도</span>
                <span>
                  {[1, 2, 3, 4, 5].map((data, index) => (
                    <img
                      key={index}
                      className="rating_star"
                      src={data <= instructorRating ? process.env.REACT_APP_DEFAULT_URL + "image/yellow_star.png" : process.env.REACT_APP_DEFAULT_URL + "image/white_star.png"}
                      alt="white_star"
                      onClick={() => setInstructorRating(data)}
                    />
                  ))}
                </span>
              </div>
              <textarea
                className="feedback-textarea"
                placeholder="글 남기기"
                onChange={(e) => {
                  setFeedbackContent(e.target.value);
                }}
              ></textarea>
              <RMIUploader isOpen={visible} hideModal={hideModal} onSelect={onSelect} onUpload={onUpload} onRemove={onRemove} dataSources={[]} />
              <button className="feedback-submit" onClick={() => insertVisitingLog()}>
                작성 완료하기
              </button>
            </div>
          ) : null}
          {selectedLecture !== null ? (
            <div className="show-lecture-detail">
              <h2 className="mb20">{selectedLecture.lecture_name}</h2>
              <hr className="bold-hr mb25" />
              <div className="mb8">
                <span className="form-title">강사명</span>
                <span>{selectedLecture.inst_name}</span>
              </div>
              <div>
                <span className="form-title">강사 연락처</span>
                <span>{selectedLecture.inst_phone}</span>
              </div>
              <hr className="m20" />
              <div className="mb8">
                <span className="form-title">신청자명</span>
                <span>{selectedLecture.admin_name}</span>
              </div>
              <div>
                <span className="form-title">연락처</span>
                <span>{selectedLecture.admin_phone}</span>
              </div>
              <hr className="m20" />
              <div className="mb8">
                <span className="form-title">교회명</span>
                <span>{selectedLecture.church_name}</span>
              </div>
              <div className="mb8">
                <span className="form-title">주소</span>
                <span>
                  {selectedLecture.addr1} {selectedLecture.addr2}
                </span>
              </div>
              <div className="mb8">
                <span className="form-title">교회 연락처</span>
                <span>{selectedLecture.phone}</span>
              </div>
              <div>
                <span className="form-title">교회 이메일</span>
                <span>{selectedLecture.email}</span>
              </div>
              <hr className="m20" />
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
                {selectedLecture.status === 2 ? (
                  <span>
                    {selectedLecture.contact_start_date} ~ {selectedLecture.contact_end_date}
                  </span>
                ) : (
                  <span>{selectedLecture.timezone}</span>
                )}
              </div>
              <div className="mb25 form-grid">
                <span className="form-title">요청사항</span>
                <span>
                  {selectedLecture.memo
                    .replaceAll("<br/>", "\n")
                    .split("\n")
                    .map((item, i) => (
                      <div key={i}>{item}</div>
                    ))}
                </span>
              </div>
              <hr className="bold-hr mb35" />
              {selectedLecture.status === 0 || selectedLecture.status === 1 ? (
                <button className="form-btn" onClick={cancelContact}>
                  컨택 취소하기
                </button>
              ) : null}
            </div>
          ) : null}
          {/* <div
                        className={selectedLecture ? "show-lecture-detail" : "no-detail"}
                    >
                        <div className="detail-title">
                            <h2>관계에 대하여</h2>
                            <span>이정호 작성</span>
                            <span className="detail-date">2021_07_10_토</span>
                        </div>
                        <div className="detail-content">
                            <p>
                                이번 하계계절학기 영상편집의 이론과 실제는 총 2개의 분반이 진행됩니다. 작년부터 영상편집수업에서 프로그램을 실습하는 날의 강의는 온라인 LMS강의로 진행됩니다.
                                학생들이 여러번 반복해서 돌려돌수 있기데 그 방식을 더 선호하여 프로그램 학습파트는 LMS 강의로 대체되지만
                                프로그램 사용이란게 처음해서 미숙할때는 누군가 붙잡고 물어보고 싶은 경우가 많을 겁니다. 분명 영상대로 했는데 왜 안돼~~~~ 이려면 머리뜯을 사람이 꼭 있기에 ᄒᄒ<br />
                                이번 하계계절학기 영상편집의 이론과 실제는 총 2개의 분반이 진행됩니다. 작년부터 영상편집수업에서 프로그램을 실습하는 날의 강의는 온라인 LMS강의로 진행됩니다.
                                학생들이 여러번 반복해서 돌려돌수 있기데 그 방식을 더 선호하여 프로그램 학습파트는 LMS 강의로 대체되지만<br />
                                프로그램 사용이란게 처음해서 미숙할때는 누군가 붙잡고 물어보고 싶은 경우가 많을 겁니다. 분명 영상대로 했는데 왜 안돼~~~~ 이려면 머리뜯을 사람이 꼭 있기에 ᄒᄒ
                                이번 하계계절학기 영상편집의 이론과 실제는 총 2개의 분반이 진행됩니다. 작년부터 영상편집수업에서 프로그램을 실습하는 날의 강의는 온라인 LMS강의로 진행됩니다.
                                학생들이 여러번 반복해서 돌려돌수 있기데 그 방식을 더 선호하여 프로그램 학습파트는 LMS 강의로 대체되지만<br />
                                프로그램 사용이란게 처음해서 미숙할때는 누군가 붙잡고 물어보고 싶은 경우가 많을 겁니다. 분명 영상대로 했는데 왜 안돼~~~~ 이려면 머리뜯을 사람이 꼭 있기에 ᄒᄒ
                            </p>
                        </div>
                    </div> */}
        </div>
      </div>
    </div>
  );
};

export default MypageUserContacted;
