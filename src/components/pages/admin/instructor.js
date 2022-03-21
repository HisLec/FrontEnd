import React, { useState, useEffect } from "react";
import axios from "axios";
import XLSX from "xlsx";
import FileSaver from "file-saver";
import Pagination from "react-js-pagination";

import "../../../assets/css/table.css";
import "../../../assets/css/default.css";
import "../../../assets/css/admin_instructor.css";
import GreyButton from "../../modules/button/admin_grey_btn";
import WhiteButton from "../../modules/button/admin_white_btn";
import CommonModal from "../../modules/modal/common";

function AdminInstructor() {
  const [keyword, setKeyword] = useState(null);
  const [excelModalOpen, setExcelModalOpen] = useState(false);
  const [clickedInstructor, setClickedInstructor] = useState(null);
  const [instructorInfo, setinstructorInfo] = useState(null);
  const [positionInfo, setpositionInfo] = useState(null);
  const [isEdit, setisEdit] = useState(false);
  const [editInfo, seteditInfo] = useState({ id: "", position_id: "3", inst_name: "", phone: "", image: "", intro: "", memo: "", position_name: "", email: "" });
  const [addInfo, setaddInfo] = useState({ id: "", position_id: "3", inst_name: "", phone: "", image: "", intro: "", memo: "", position_name: "", email: "" });
  const [isInsertModalOpen, setisInsertModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const postsPerPage = 10;

  const [isShowDelete, setisShowDelete] = useState(false);

  const [removeProfileImage, setRemoveProfileImage] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageBase64, setProfileImageBase64] = useState("");

  // excel upload
  const [excelJSONData, setExcelJSONData] = useState(null);
  const excelFormat = { email: "000@handong.edu(필수)", name: "강사 이름(필수)", phone: "010-0000-0000", position: "동문/학부모/교수(필수)", intro: "강사 소개", memo: "강사 약력" };
  const [errorCount, seterrorCount] = useState(0);

  useEffect(() => {
    readInstructor();
    readPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPage(1);
    setClickedInstructor(null);
  }, [isShowDelete]);

  useEffect(() => {
    if (excelJSONData !== null) {
      var count = 0;
      excelJSONData.forEach((data) => {
        if (data.isValid === false) count++;
      });
      seterrorCount(count);
    }
  }, [excelJSONData]);

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

  const searchKeywordChanged = (e) => {
    setKeyword(e.target.value);
  };

  function clickInstructor(inst) {
    if (!isEdit) {
      if (clickedInstructor === null || clickedInstructor !== inst) {
        setProfileImage(null);
        setClickedInstructor(inst);

        setisEdit(false);
        seteditInfo(inst);
      } else {
        setClickedInstructor(null);
        seteditInfo(null);
      }
    }
  }

  const readInstructor = async () => {
    setPage(1);
    if (keyword !== null) {
      const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "instructor", {
        params: {
          keyword: encodeURI(keyword),
          token: window.sessionStorage.getItem("token"),
          manageID: window.sessionStorage.getItem("id"),
        },
      });
      setinstructorInfo(response.data);
    } else {
      const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "instructor", {
        params: {
          token: window.sessionStorage.getItem("token"),
          manageID: window.sessionStorage.getItem("id"),
        },
      });
      setinstructorInfo(response.data);
    }
    setKeyword(null);
    setClickedInstructor(null);
  };

  const readPosition = async () => {
    const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "instructor/position", {
      params: {
        token: window.sessionStorage.getItem("token"),
        manageID: window.sessionStorage.getItem("id"),
      },
    });
    setpositionInfo(response.data);
  };

  const updateInstructor = async () => {
    if (window.confirm("프로필 정보를 수정하시겠습니까?")) {
      const params = new FormData();
      const headers = {
        "Content-type": "multipart/form-data; charset=UTF-8",
        Accept: "*/*",
      };
      if (removeProfileImage === true) {
        params.append("image", "");
      } else {
        params.append("image", editInfo.image);
      }
      //var params = new URLSearchParams();
      params.append("id", editInfo.id);
      params.append("position_id", editInfo.position_id);
      params.append("name", editInfo.inst_name);
      params.append("phone", editInfo.phone);
      params.append("intro", editInfo.intro);
      params.append("memo", editInfo.memo);
      params.append("file", profileImage);
      params.append("token", window.sessionStorage.getItem("token"));
      params.append("manageID", window.sessionStorage.getItem("id"));

      await axios.post(process.env.REACT_APP_RESTAPI_HOST + "instructor/update", params, { headers }).then(function (res) {
        alert("프로필 수정이 완료되었습니다.");
        readInstructor();
        setClickedInstructor(null);
        setisEdit(false);
      });
    }
  };

  const createInstructor = async () => {
    if (window.confirm("강사를 추가하시겠습니까?")) {
      const params = new FormData();
      const headers = {
        "Content-type": "multipart/form-data; charset=UTF-8",
        Accept: "*/*",
      };
      params.append(" email", addInfo.email);
      params.append("position_id", addInfo.position_id);
      params.append("name", addInfo.inst_name);
      params.append("phone", addInfo.phone);
      params.append("file", profileImage);
      params.append("intro", addInfo.intro);
      params.append("memo", addInfo.memo);
      params.append("token", window.sessionStorage.getItem("token"));
      params.append("manageID", window.sessionStorage.getItem("id"));

      await axios.post(process.env.REACT_APP_RESTAPI_HOST + "instructor", params, { headers }).then(function (res) {
        alert(res.data);
        readInstructor();
        setClickedInstructor(null);
        setaddInfo({ id: "", position_id: "3", inst_name: "", phone: "", image: "", intro: "", memo: "", position_name: "", email: "" });
        closeModal();
      });
    }
  };

  const deleteInstructor = async () => {
    if (window.confirm("강사를 삭제하시겠습니까?")) {
      axios({
        url: process.env.REACT_APP_RESTAPI_HOST + "instructor/delete",
        method: "put",
        data: {
          instructor_id: clickedInstructor.id,
          token: window.sessionStorage.getItem("token"),
          manageID: window.sessionStorage.getItem("id"),
        },
      }).then(function (res) {
        readInstructor();
        alert("강사 정보가 삭제되었습니다.");
        setClickedInstructor(null);
      });
    }
  };

  const recoverInstructor = async () => {
    if (window.confirm("강사를 복구하시겠습니까?")) {
      axios({
        url: process.env.REACT_APP_RESTAPI_HOST + "instructor/recover",
        method: "put",
        data: {
          id: clickedInstructor.id,
          email: clickedInstructor.email,
          token: window.sessionStorage.getItem("token"),
          manageID: window.sessionStorage.getItem("id"),
        },
      }).then(function (res) {
        readInstructor();
        alert(res.data);
        setClickedInstructor(null);
      });
    }
  };

  function readExcel(event) {
    seterrorCount(0);
    let input = event.target;
    let reader = new FileReader();
    reader.onload = function () {
      let data = reader.result;
      let workBook = XLSX.read(data, { type: "binary" });
      workBook.SheetNames.forEach(function (sheetName) {
        let rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
        var changedData = [];
        rows.forEach((data) => {
          var temp = {
            email: data.email,
            name: data.name,
            image: data.image,
            phone: data.phone,
            position: data.position,
            intro: data.intro,
            memo: data.memo,
            isValid: true,
          };

          for (var variable in temp) {
            if (temp[variable] === undefined) {
              temp[variable] = "";
            }
          }

          if (temp["name"] === "" || temp["position"] === "" || temp["email"] === "") {
            temp.isValid = false;
          } else {
            temp.isValid = true;
          }
          if (!positionInfo.find((position) => position.name === temp.position)) temp.isValid = false;
          changedData.push(temp);
        });
        setExcelJSONData(changedData);
      });
    };
    if (input.files[0] !== undefined) {
      reader.readAsBinaryString(input.files[0]);
      openExcelModal();
      event.target.value = null;
    }
  }

  const uploadExcelFile = async () => {
    var params = new URLSearchParams();
    params.append("data", JSON.stringify(excelJSONData));
    params.append("token", window.sessionStorage.getItem("token"));
    params.append("manageID", window.sessionStorage.getItem("id"));

    if (window.confirm("강사 정보를 업로드하시겠습니까?")) {
      await axios.post(process.env.REACT_APP_RESTAPI_HOST + "instructor/excel", params).then(function (res) {
        alert("엑셀 업로드가 완료되었습니다!");
        setClickedInstructor(null);
        setExcelModalOpen(false);
        readInstructor();
        setExcelJSONData(null);
      });
    }
  };

  const clickEditBtn = async () => {
    setisEdit(true);
    seteditInfo(clickedInstructor);
  };

  const clickCloseBtn = async () => {
    setClickedInstructor(null);
  };

  const clickCancelBtn = () => {
    setisEdit(false);
    seteditInfo(null);
    setProfileImage(null);
  };

  const onAdd = (e) => {
    const { value, name } = e.target;
    setaddInfo({
      ...addInfo,
      [name]: value,
    });
  };

  const onEdit = (e) => {
    const { value, name } = e.target;
    seteditInfo({
      ...editInfo,
      [name]: value,
    });
  };

  const insertModalClose = () => {
    setisInsertModalOpen(false);
  };

  const openModal = () => {
    setisInsertModalOpen(true);
  };

  const closeModal = () => {
    setisInsertModalOpen(false);
  };

  const openExcelModal = () => {
    setExcelModalOpen(true);
  };
  const closeExcelModal = () => {
    setExcelModalOpen(false);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  function currentPosts(tmp) {
    var indexOfLast = page * postsPerPage;
    var indexOfFirst = indexOfLast - postsPerPage;

    let currentPosts = 0;
    if (isShowDelete) {
      // 삭제된 거 보여줄때
      currentPosts = instructorInfo.filter((data) => data.del_date !== null).slice(indexOfFirst, indexOfLast);
    } else {
      // 전체 강의일 때
      currentPosts = instructorInfo.filter((data) => data.del_date === null).slice(indexOfFirst, indexOfLast);
    }
    return currentPosts;
  }

  const exportToCSV = () => {
    var excelInstructor = instructorInfo.map((obj) => {
      return { email: obj.email, inst_name: obj.inst_name, intro: obj.intro, memo: obj.memo, phone: obj.phone, position_name: obj.position_name, reg_date: obj.reg_date };
    });
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = "instructor";
    const ws = XLSX.utils.json_to_sheet(excelInstructor);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const exportExcelForamt = () => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = "instructor_format";
    const ws = XLSX.utils.json_to_sheet(excelFormat);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <div>
      <p className="admin-title-header">강사 관리</p>
      <div id="instructor-wrapper" className="admin-content-wrapper">
        <div className="instructor-title">
          <p className="table-name">
            {isShowDelete ? "삭제된 강사 목록" : "강사 목록"}
            <GreyButton class="right" name="강사 추가하기" click={openModal} />
            <GreyButton class="no-button right mr10" name="엑셀 파일 다운로드" click={exportToCSV} />
            <GreyButton class="no-button right mr10" name="엑셀 업로드 포맷" click={exportExcelForamt} />
            <input type="file" accept=".xlsx" onChange={readExcel} id="uploadExcel" name="uploadExcel" style={{ display: "none" }} />
            <label htmlFor="uploadExcel" className="no-button grey-btn">
              강사 정보 업로드
            </label>
            {/* <GreyButton class="inst-grey-btn position1 mb8" name="강사 정보 업로드" click={openExcelModal}/> */}
          </p>
          <div className="mb20">
            <input
              className="p48 search-lecture-input"
              type="text"
              placeholder="강사명, 연락처, 그룹, 강사 소개, 메모, 이메일 주소로 키워드 검색"
              value={keyword || ""}
              onChange={searchKeywordChanged}
            />
            <GreyButton class="mr15" name="검색" click={readInstructor} />
            {!isShowDelete ? (
              <GreyButton
                class="delete-inst"
                name="삭제된 강사 보기"
                click={() => {
                  setisShowDelete(true);
                }}
              />
            ) : (
              <GreyButton
                name="전체 강사 보기"
                click={() => {
                  setisShowDelete(false);
                }}
              />
            )}
          </div>
        </div>
        <div>
          <div className="table-wrapper mt0">
            <div className="table-row-inst">
              <span className="th">그룹</span>
              <span className="th">이름</span>
            </div>
            {instructorInfo !== null && currentPosts(instructorInfo).length > 0 ? (
              currentPosts(instructorInfo).map((inst, i) => (
                <div
                  key={inst.id}
                  className={inst === clickedInstructor ? "click-inst-row table-row-inst" : "table-row-inst"}
                  onClick={() => {
                    clickInstructor(inst);
                  }}
                >
                  <span className="td">{inst.position_name}</span>
                  <span className="td">{inst.inst_name}</span>
                </div>
              ))
            ) : (
              <div className="no-content">강사 정보 없음</div>
            )}
            <CommonModal open={isInsertModalOpen} close={insertModalClose} func={createInstructor} header="강사 추가하기" footer="추가하기">
              <p className="mb13">프로필</p>
              <div className="flex-layout mb40">
                <div className="flex-item" style={{ textAlign: "center" }}>
                  <span className="default-img h180">
                    {profileImage !== null ? (
                      <img
                        className="profile-img-content"
                        src={profileImageBase64}
                        alt="profile_image"
                        onError={(e) => {
                          e.target.src = process.env.REACT_APP_DEFAULT_URL + "image/errorImage2.png";
                        }}
                      />
                    ) : null}
                  </span>
                  <label className="input-file-button" htmlFor="input-file2">
                    첨부파일
                  </label>
                  <input
                    type="file"
                    id="input-file2"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      handleChangeFile(e, setProfileImage, setProfileImageBase64);
                    }}
                  />
                </div>
                <div className="inst-info-wrapper mb30">
                  <span>이름</span>
                  <input name="inst_name" onChange={onAdd} />
                  <select defaultValue={addInfo.position_id} name="position_id" onChange={onAdd}>
                    <option value="3">교수</option>
                    <option value="2">동문</option>
                    <option value="1">학부모</option>
                  </select>
                  <span>연락처</span>
                  <input name="phone" onChange={onAdd} />
                  <span></span>
                  <span>이메일</span>
                  <input name="email" onChange={onAdd} />
                  <span></span>
                </div>
              </div>

              <p className="mb10">인사말 작성란</p>
              <textarea name="intro" onChange={onAdd} className="h100 mb20 inst-textarea"></textarea>
              <p className="mb10">약력 작성란</p>
              <textarea name="memo" onChange={onAdd} className="h180 mb20 inst-textarea"></textarea>
              {/* <div className="center">
                                <WhiteButton class="mr20" name="추가하기" click={createInstructor}/>
                                <WhiteButton name="취소하기" click={closeModal}/>
                            </div> */}
            </CommonModal>
            <CommonModal open={excelModalOpen} close={closeExcelModal} func={uploadExcelFile} header="강사 업로드 목록" footer="데이터 저장">
              <p className="mb20">
                강사의 이름, 이메일, 그룹은 필수 입력 요소입니다.
                <br />
                업로드시 intro가 소개를, memo가 약력을 의미합니다. position의 경우 동문, 학부모, 교수 중에서 입력해주세요.
                <br />
                빨간 색으로 표시된 것은 업로드 할 수 없는 데이터입니다. 빼고 업로드를 진행할까요?
                <br />
                현재 잘못된 데이터는 {errorCount}개 입니다.
              </p>
              <div className="table-wrapper mt0 relative modal-table">
                <div className="table-row-excel-inst">
                  <span className="th">이메일</span>
                  <span className="th">이름</span>
                  <span className="th">핸드폰</span>
                  <span className="th">그룹</span>
                  <span className="th">소개</span>
                  <span className="th">약력</span>
                </div>
                {excelJSONData !== null ? (
                  excelJSONData.map((data, i) => (
                    <div key={i} className={data.isValid ? "table-row-excel-inst" : "table-row-excel-inst modal-error"}>
                      <span className="td">{data.email}</span>
                      <span className="td">{data.name}</span>
                      <span className="td">{data.phone}</span>
                      <span className="td">{data.position}</span>
                      <span className="td">{data.intro}</span>
                      <span className="td">{data.memo}</span>
                      {/* <span className="td">{data.position}</span> */}
                    </div>
                  ))
                ) : (
                  <div>엑셀 데이터가 없습니다.</div>
                )}
              </div>
            </CommonModal>
          </div>
          <Pagination
            activePage={page}
            itemsCountPerPage={postsPerPage}
            totalItemsCount={
              instructorInfo === null ? 0 : isShowDelete ? instructorInfo.filter((data) => data.del_date !== null).length : instructorInfo.filter((data) => data.del_date === null).length
            }
            pageRangeDisplayed={5}
            prevPageText={"‹"}
            nextPageText={"›"}
            onChange={handlePageChange}
          />
        </div>
        <div className="relative">
          {clickedInstructor ? (
            isEdit ? (
              <div className="show-inst-detail relative">
                <p className="mb13">프로필</p>
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
                    ) : removeProfileImage === false && clickedInstructor !== null && clickedInstructor.image !== "null" && clickedInstructor.image !== null && clickedInstructor.image !== "" ? (
                      <img
                        className="profile-img-content"
                        src={process.env.REACT_APP_RESTAPI_HOST + "resources/upload/" + clickedInstructor.image}
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
                      <input defaultValue={editInfo.inst_name} className="mr15 p48" name="inst_name" onChange={onEdit} />
                      <select defaultValue={editInfo.position_id} name="position_id" className="p48" onChange={onEdit}>
                        <option value="3">교수</option>
                        <option value="2">동문</option>
                        <option value="1">학부모</option>
                      </select>
                    </div>
                    <div>
                      <span className="mb30">연락처</span>
                      <input defaultValue={editInfo.phone} name="phone" onChange={onEdit} />
                    </div>
                    <div>
                      <span>이메일</span>
                      {editInfo.email}
                    </div>
                    {/* <div className ="checkbox-wrapper"><span className ="checkbox-content">삭제</span><input className="checkbox-input" type="checkbox" onChange={(e) => {setRemoveProfileImage(!removeProfileImage); }}/></div> */}
                  </div>
                  {/* <label className={removeProfileImage === false? "profile-file file-button": "profile-file file-button disabled"} htmlFor='input-file'>첨부파일</label> */}
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

                <p className="mb10">인사말 작성란</p>

                <textarea name="intro" className="h100 mb20 inst-textarea" value={editInfo.intro.replaceAll("<br/>", "\n")} onChange={onEdit}></textarea>
                <p className="mb10">약력 작성란</p>
                <textarea name="memo" className="h180 mb20 inst-textarea" value={editInfo.memo.replaceAll("<br/>", "\n")} onChange={onEdit}></textarea>

                <div className="center">
                  <WhiteButton class="mr20" name="수정완료" click={updateInstructor} />
                  <WhiteButton name="취소하기" click={clickCancelBtn} />
                </div>
              </div>
            ) : (
              <div className="show-inst-detail relative">
                <p className="mb13">프로필</p>
                <button className="close-btn" onClick={clickCloseBtn}>
                  X
                </button>
                <div className="flex-layout mb40">
                  <div className="flex-item" style={{ textAlign: "center" }}>
                    <span className="default-img h180">
                      {clickedInstructor.image !== "null" && clickedInstructor.image !== null && clickedInstructor.image !== "" ? (
                        <img
                          className="profile-img-content"
                          src={process.env.REACT_APP_RESTAPI_HOST + "resources/upload/" + clickedInstructor.image}
                          alt="profile_image"
                          onError={(e) => {
                            e.target.src = process.env.REACT_APP_DEFAULT_URL + "image/errorImage2.png";
                          }}
                        />
                      ) : null}
                    </span>
                  </div>
                  <div className="inst-info-wrapper mb30">
                    <span className="bold-font">이름</span>
                    <span>{clickedInstructor.inst_name}</span>
                    <span>{clickedInstructor.position_name}</span>
                    <span className="bold-font">연락처</span>
                    <span>{clickedInstructor.phone}</span>
                    <span></span>
                    <span className="bold-font">이메일</span>
                    <span>{clickedInstructor.email}</span>
                    <span></span>
                  </div>
                </div>
                <p className="mb10 bold-font">인사말 작성란</p>
                <div className="mb25">
                  {/* {clickedInstructor.intro.split("\n").map((item, i) => (
                    <div key={i}>{item}</div>
                  ))} */}
                  {clickedInstructor.intro.split("\n").map((item, i) => (item === "\r" ? <br /> : <div>{item}</div>))}
                </div>
                <p className="mb10 bold-font">약력 작성란~~~</p>
                <div className="mb25">
                  {/* {clickedInstructor.memo.split("\r\n").map((item, i) => (
                    <div key={i}>{item}</div>
                  ))} */}
                  {clickedInstructor.memo.split("\n").map((item, i) => (item === "\r" ? <br /> : <div>{item}</div>))}
                </div>
                {isShowDelete ? (
                  <div className="button-wrapper">
                    <GreyButton class="" name="복구하기" click={recoverInstructor} />
                  </div>
                ) : (
                  <div className="button-wrapper">
                    <GreyButton class="mr15" name="수정하기" click={clickEditBtn} />
                    <GreyButton class="" name="삭제하기" click={deleteInstructor} />
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="select-inst">강사를 선택하세요.</div>
          )}

          {/* // 추가하기
                    // <div className="show-inst-detail relative">
                    //     <p className="mb13">프로필</p>
                    //     <div className="flex-layout mb40">
                    //         <div className="flex-item" style={{textAlign:'center'}}>
                    //             <span className="default-img h180"></span>
                    //             <label className="input-file-button" for="input-file">첨부파일</label>
                    //             <input type="file" id="input-file" style={{display:"none"}}/>
                    //         </div>
                    //         <div className="inst-info-wrapper mb30">
                    //             <span>이름</span>
                    //             <input/>
                    //             <select>
                    //                 <option>교수</option>
                    //                 <option>동문</option>
                    //                 <option>학부모</option>
                    //             </select>
                    //             <span>연락처</span>
                    //             <input/>
                    //             <span></span>
                    //             <span>이메일</span>
                    //             <span>123@gmail.com</span>
                    //             <span></span>
                    //         </div>
                    //     </div>

                    //     <p className="mb10">인사말 작성란</p>
                    //     <textarea className="h100 mb20 inst-textarea"></textarea>
                    //     <p className="mb10">약력 작성란</p>
                    //     <textarea className="h180 mb20 inst-textarea"></textarea>

                    //     <div className="center">
                    //         <WhiteButton class="mr20" name="추가하기"/>
                    //         <WhiteButton name="취소하기"/>
                    //     </div>
                    // </div> */}
        </div>
      </div>
    </div>
  );
}

export default AdminInstructor;
