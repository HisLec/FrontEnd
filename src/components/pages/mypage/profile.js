import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import "../../../assets/css/default.css";
import "../../../assets/css/lecture_layout.css";
import BlueButton from "../../modules/button/blue_button";
// import Calendar from '../../modules/calendar/common';
import { Link } from "react-router-dom";

function MypageProfile(props) {
  const [profileInfo, setprofileInfo] = useState(null);
  const [editProfileInfo, seteditProfileInfo] = useState(null);
  const [isEdit, setisEdit] = useState(false);
  const [isAgree, setisAgree] = useState(false);
  const [removeProfileImage, setRemoveProfileImage] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageBase64, setProfileImageBase64] = useState("");
  const [settingInfo, setsettingInfo] = useState(null);

  useEffect(() => {
    readProfile();
    readSettingInfo();
  }, []);

  const readSettingInfo = async () => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "setting", {
      params: {
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    setsettingInfo(response.data);
  };

  const readProfile = async (id) => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "instructor/" + window.sessionStorage.getItem("id"), {
      params: {
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    setprofileInfo(response.data);
    var responseValue = response.data;
    responseValue.intro = responseValue.intro.replaceAll("<br/>", "\n");
    responseValue.memo = responseValue.memo.replaceAll("<br/>", "\n");
    seteditProfileInfo(responseValue);
  };

  const clickCancelBtn = () => {
    setisEdit(false);
    setisAgree(false);
    seteditProfileInfo(profileInfo);
  };

  const clickFinishBtn = async () => {
    if (!isAgree) {
      alert("개인정보 수집 및 이용 동의에 동의해주세요!");
    } else {
      if (window.confirm("프로필 정보를 수정하시겠습니까?")) {
        const params = new FormData();
        const headers = {
          "Content-type": "multipart/form-data; charset=UTF-8",
          Accept: "*/*",
        };
        if (removeProfileImage === true) {
          params.append("image", "");
        } else {
          params.append("image", editProfileInfo.image);
          params.append("file", profileImage);
        }
        //var params = new URLSearchParams();
        params.append("id", editProfileInfo.id);
        params.append("position_id", editProfileInfo.position_id);
        params.append("name", editProfileInfo.name);
        params.append("phone", editProfileInfo.phone);
        params.append("intro", editProfileInfo.intro);
        params.append("memo", editProfileInfo.memo);
        params.append("token", window.sessionStorage.getItem("token"));
        params.append("manageID", window.sessionStorage.getItem("id"));

        await axios.post(process.env.REACT_APP_RESTAPI_HOST + "instructor/update", params, { headers }).then(function (res) {
          alert("프로필 수정이 완료되었습니다.");
          readProfile();
          setisEdit(false);
          setisAgree(false);
        });
      }
    }
  };

  const changeAgree = () => {
    if (isAgree) setisAgree(false);
    else setisAgree(true);
  };

  const onEdit = (e) => {
    const { value, name } = e.target;
    seteditProfileInfo({
      ...editProfileInfo,
      [name]: value,
    });
  };

  const handleChangeFile = (event, setImage, setImagebase64) => {
    var reader = new FileReader();
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]);
      setImage(event.target.files[0]);
    }
    reader.onloadend = () => {
      const base64 = reader.result;
      if (base64) {
        setImagebase64(base64.toString());
      }
    };
  };

  return (
    <div className="container">
      <div className="mypage-image relative">
        <img className="page-background" src={process.env.REACT_APP_DEFAULT_URL + "image/instructor_mypage.png"} alt="lecture page" />
        <div className="page-info">
          <h2 style={{ color: "white" }} className="page-title">
            마이페이지
          </h2>
          <p className="page-intro">
            {settingInfo !== null
              ? settingInfo
                  .find((element) => element.key === "mypage_profile_phrase")
                  .value.split("<br/>")
                  .map((item, i) => <div key={i}>{item}</div>)
              : ""}
          </p>
        </div>
      </div>
      <div className="inst-title-header">
        <h2 style={{ color: "white" }}>마이페이지</h2>
        <p>
          {settingInfo !== null
            ? settingInfo
                .find((element) => element.key === "mypage_profile_phrase")
                .value.split("<br/>")
                .map((item, i) => <div key={i}>{item}</div>)
            : ""}
        </p>
      </div>
      {profileInfo !== null ? (
        <div className="content-wrapper">
          <div className="left-navbar">
            <span>
              <Link className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL + "mypage/profile" ? "left-active" : ""} to={process.env.REACT_APP_DEFAULT_URL + "mypage/profile"}>
                내 프로필
              </Link>
            </span>
            <span>
              <Link className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL + "mypage/lecture" ? "left-active" : ""} to={process.env.REACT_APP_DEFAULT_URL + "mypage/lecture"}>
                내 강의함
              </Link>
            </span>
            <span>
              <Link className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL + "mypage/contact" ? "left-active" : ""} to={process.env.REACT_APP_DEFAULT_URL + "mypage/contact"}>
                컨택 일정
              </Link>
            </span>
            <span>
              <Link
                className={props.history.location.pathname === process.env.REACT_APP_DEFAULT_URL + "mypage/visitlog" ? "left-active" : ""}
                to={process.env.REACT_APP_DEFAULT_URL + "mypage/visitlog"}
              >
                방문일지
              </Link>
            </span>
          </div>
          <div className="right-content">
            {/* <Calendar/> */}
            {isEdit ? (
              <div className="profile-edit-wrapper">
                <h2 className="mb20 fs20">프로필 사진</h2>
                <div className="profile-edit">
                  <div className="profile-image">
                    {removeProfileImage === false && profileImage !== null ? (
                      <img
                        className="profile-img-content"
                        src={profileImageBase64}
                        alt="profile_image"
                        onError={(e) => {
                          e.target.src = process.env.REACT_APP_DEFAULT_URL + "image/errorImage2.png";
                        }}
                      />
                    ) : removeProfileImage === false && profileInfo !== null && profileInfo.image !== "null" && profileInfo.image !== null && profileInfo.image !== "" ? (
                      <img
                        className="profile-img-content"
                        src={process.env.REACT_APP_RESTAPI_HOST + "resources/upload/" + profileInfo.image}
                        alt="profile_image"
                        onError={(e) => {
                          e.target.src = process.env.REACT_APP_DEFAULT_URL + "image/errorImage2.png";
                        }}
                      />
                    ) : null}
                  </div>
                  <div className="profile-info">
                    <div>
                      <span className="mb30">이름</span>
                      <input className="mr10" style={{ width: "136px" }} defaultValue={editProfileInfo.name} name="name" onChange={onEdit} />
                      <select className="p48" defaultValue={editProfileInfo.position_id} name="position_id" onChange={onEdit}>
                        <option value="3">교수</option>
                        <option value="2">동문</option>
                        <option value="1">학부모</option>
                      </select>
                    </div>
                    <div>
                      <span className="mb30">연락처</span>
                      <input defaultValue={editProfileInfo.phone} name="phone" onChange={onEdit} />
                    </div>
                    <div>
                      <span>이메일</span>
                      {profileInfo.email}
                    </div>
                  </div>
                  <div className="profile-file">
                    <label className={removeProfileImage === false ? "file-button" : "file-button disabled"} htmlFor="input-file">
                      첨부파일
                    </label>
                    <div className="checkbox-wrapper">
                      <span className="checkbox-content">삭제</span>
                      <input
                        className="checkbox-input"
                        type="checkbox"
                        onChange={(e) => {
                          setRemoveProfileImage(!removeProfileImage);
                        }}
                      />
                    </div>
                  </div>
                  {removeProfileImage === true ? (
                    <input type="file" id="input-file" style={{ display: "none" }} disabled />
                  ) : (
                    <input
                      type="file"
                      id="input-file"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        handleChangeFile(e, setProfileImage, setProfileImageBase64);
                      }}
                    />
                  )}
                </div>
                <textarea className="mb30 introduce-textarea" placeholder="인사말 작성란" defaultValue={editProfileInfo.intro} name="intro" onChange={onEdit} />
                <textarea className="profile-textarea mb20" placeholder="약력 작성란" name="memo" defaultValue={editProfileInfo.memo} onChange={onEdit} />
                <ul className="agree-ul mb40">
                  <li className="mb10">
                    이단 및 사이비 단체는 작성글을 게시할 수 없으며 적발 시 예배 및 설교 방해죄 (형법 제 158조), 퇴거불응죄(형법 제 319조 2항), 업무방해죄(형법 제314조), 개인정보보호법 위반 등으로
                    처벌받을 수 있습니다.
                  </li>
                  <li>개인 정보 수집 동의 - 이용자가 제공한 모든 정보는 다음의 목적을 위해 활용하며, 하기 목적 이외의 용도로는 사용하지 않습니다.</li>
                </ul>
                <div>
                  <input className="agree-check mr10" type="checkbox" defaultValue={isAgree} onChange={changeAgree} />
                  <span className="fs14">개인정보 수집 및 이용에 대해 동의합니다.</span>
                </div>
                <div style={{ textAlign: "center", marginTop: "30px" }}>
                  <BlueButton class="mr15" name="수정완료" click={() => clickFinishBtn()} />
                  <BlueButton name="수정취소" click={() => clickCancelBtn()} />
                </div>
              </div>
            ) : (
              <div>
                <div className="profile-wrapper">
                  <h2 className="mb20 fs20">프로필 사진</h2>
                  <div className="profile">
                    <div className="profile-image">
                      {profileInfo.image !== "null" && profileInfo.image !== null && profileInfo.image !== "" ? (
                        <img
                          className="profile-img-content"
                          src={process.env.REACT_APP_RESTAPI_HOST + "resources/upload/" + profileInfo.image}
                          alt="profile_image"
                          onError={(e) => {
                            e.target.src = process.env.REACT_APP_DEFAULT_URL + "image/errorImage2.png";
                          }}
                        />
                      ) : null}
                    </div>
                    <div className="profile-info">
                      <h1>
                        {profileInfo.name} <span style={{ marginLeft: "15px", fontSize: "18px" }}>{profileInfo.position_name}</span>
                      </h1>
                      <p>{profileInfo.phone}</p>
                      <p>{profileInfo.email}</p>
                    </div>
                  </div>

                  <h2 className="mb10 fs20">인사말</h2>
                  <p className="introduce">
                    {/* {profileInfo.intro.split("\n").map((item, i) => (
                      <div key={i}>{item}</div>
                    ))} */}
                    {profileInfo.intro.split("\n").map((item, i) => (item === "\r" ? <br /> : <div>{item}</div>))}
                  </p>

                  <h2 className="mb25 fs20">약력</h2>
                  <ul className="profile-ul" style={{ padding: 0 }}>
                    {/* {profileInfo.memo.split("\n").map( (item, i) => <div key={i}>{item}</div>)} */}
                    {profileInfo.memo.split("\n").map((item, i) => (item === "\r" ? <br /> : <div>{item}</div>))}
                  </ul>
                </div>
                <BlueButton class="profile-btn" name="수정하기" click={() => setisEdit(true)} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <ReactLoading type="spin" color="#05589c" />
      )}
    </div>
  );
}

export default MypageProfile;
