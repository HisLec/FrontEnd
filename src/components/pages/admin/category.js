import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "react-js-pagination";
import XLSX from "xlsx";
import FileSaver from "file-saver";
import "../../../assets/css/table.css";
import "../../../assets/css/default.css";
import "../../../assets/css/admin_category.css";
import WhiteButton from "../../modules/button/white_button";
import GreyButton from "../../modules/button/admin_grey_btn";

function AdminCategory() {
  const [keyword, setKeyword] = useState(null);
  const [categoryInfo, setcategoryInfo] = useState(null);
  const [editCategory, seteditCategory] = useState(null);
  const [isDisable, setisDisable] = useState(false);
  const [addDisable, setaddDisable] = useState(false);
  const [addCategory, setaddCategory] = useState({ name: "", status: "", disable: "0", priority: "0" });
  const [isAdd, setisAdd] = useState(false);
  const [page, setPage] = useState(1);
  const postsPerPage = 10;
  const [statusSelect, setStatusSelect] = useState(-2);

  useEffect(() => {
    readCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    readCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusSelect]);

  const searchKeywordChanged = (e) => {
    setKeyword(e.target.value);
  };

  const readCategory = async () => {
    if (keyword !== null && keyword !== "") {
      const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "topic", {
        params: {
          keyword: encodeURI(keyword),
          statusSelect: statusSelect,
          token: window.sessionStorage.getItem("token"),
          manageID: window.sessionStorage.getItem("id"),
        },
      });
      setcategoryInfo(response.data);
    } else {
      const response = await axios.get(process.env.REACT_APP_RESTAPI_HOST + "topic", {
        params: {
          statusSelect: statusSelect,
          token: window.sessionStorage.getItem("token"),
          manageID: window.sessionStorage.getItem("id"),
        },
      });
      setcategoryInfo(response.data);
    }
    setKeyword("");
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const clickEditFinish = async () => {
    editCategory.token = window.sessionStorage.getItem("token");
    editCategory.manageID = window.sessionStorage.getItem("id");
    if (window.confirm("카테고리를 수정하시겠습니까?")) {
      axios({
        url: process.env.REACT_APP_RESTAPI_HOST + "topic",
        method: "put",
        data: editCategory,
      }).then(function (res) {
        alert("수정이 완료되었습니다.");
        readCategory();
        seteditCategory(null);
      });
    }
  };

  const createCategory = async () => {
    var params = new URLSearchParams();
    params.append("name", addCategory.name);
    params.append("disable", addCategory.disable);
    params.append("priority", addCategory.priority);
    params.append("token", window.sessionStorage.getItem("token"));
    params.append("manageID", window.sessionStorage.getItem("id"));

    if (window.confirm("카테고리를 추가하시겠습니까?")) {
      const response = await axios.post(process.env.REACT_APP_RESTAPI_HOST + "topic", params).then(function (res) {
        alert(res.data);
        readCategory();
        setisAdd(false);
        setaddDisable(false);
        setaddCategory({ name: "", status: "", disable: "0", priority: "0" });
      });
    }
  };

  const confirmCategory = async (category) => {
    if (window.confirm("카테고리를 수락하시겠습니까?")) {
      axios({
        url: process.env.REACT_APP_RESTAPI_HOST + "topic/status",
        method: "put",
        data: {
          status: 1,
          id: category.id,
          token: window.sessionStorage.getItem("token"),
          manageID: window.sessionStorage.getItem("id"),
        },
      }).then(function (res) {
        alert("수락되었습니다.");
        readCategory();
      });
    }
  };

  const rejectCategory = async (category) => {
    if (window.confirm("카테고리를 거절하시겠습니까?")) {
      axios({
        url: process.env.REACT_APP_RESTAPI_HOST + "topic/status",
        method: "put",
        data: {
          status: -1,
          id: category.id,
          token: window.sessionStorage.getItem("token"),
          manageID: window.sessionStorage.getItem("id"),
        },
      }).then(function (res) {
        alert("거절되었습니다.");
        readCategory();
      });
    }
  };

  const clickEditBtn = (category) => {
    seteditCategory(category);
    if (category.disable === 1) setisDisable(true);
    else setisDisable(false);
  };

  const onEdit = (e) => {
    const { value, name } = e.target;
    seteditCategory({
      ...editCategory,
      [name]: value,
    });
  };

  const onAdd = (e) => {
    const { value, name } = e.target;
    setaddCategory({
      ...addCategory,
      [name]: value,
    });
  };

  const clickCancelBtn = () => {
    seteditCategory(null);
  };

  const addCancelBtn = () => {
    setisAdd(false);
    setaddDisable(false);
    setaddCategory({ name: "", status: "", disable: "0", priority: "0" });
  };

  const clickAddDisableBtn = () => {
    if (addDisable) {
      setaddDisable(false);
      setaddCategory({
        ...addCategory,
        disable: 0,
      });
    } else {
      setaddDisable(true);
      setaddCategory({
        ...addCategory,
        disable: 1,
      });
    }
  };

  const clickDisableBtn = () => {
    if (isDisable) {
      setisDisable(false);
      seteditCategory({
        ...editCategory,
        disable: 0,
      });
    } else {
      setisDisable(true);
      seteditCategory({
        ...editCategory,
        disable: 1,
      });
    }
  };

  function currentPosts(tmp) {
    var indexOfLast = page * postsPerPage;
    var indexOfFirst = indexOfLast - postsPerPage;

    let currentPosts = 0;
    currentPosts = categoryInfo.slice(indexOfFirst, indexOfLast);
    return currentPosts;
  }

  const exportToCSV = () => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = "category";
    const ws = XLSX.utils.json_to_sheet(categoryInfo);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <div>
      <p className="admin-title-header">주제 카테고리 관리</p>
      <div className="admin-content-wrapper">
        <div className="table-wrapper mt0 relative">
          <p className="table-name mb40">
            주제 카테고리 관리
            <GreyButton class="right" name="엑셀 파일 다운로드" click={exportToCSV} />
          </p>

          <div className="mb35">
            <select
              defaultValue={statusSelect}
              className="mr15 p48 user-search"
              onChange={(e) => {
                setStatusSelect(e.target.value);
              }}
            >
              <option value="-2">전체</option>
              <option value="0">일반</option>
              <option value="1">숨겨진 카테고리</option>
            </select>
            <input className="p48 search-lecture-input" type="text" placeholder="카테고리명으로 키워드 검색" value={keyword || ""} onChange={searchKeywordChanged} />
            <GreyButton name="검색" click={readCategory} />
          </div>

          <div className="mt50 table-row-category">
            <span className="th category-index"></span>
            <span className="th">카테고리명</span>
            <span className="th">우선순위</span>
            <span className="th">숨김여부</span>
            <span className="th category-btn-col"></span>
          </div>
          {categoryInfo !== null && categoryInfo.length !== 0 ? (
            currentPosts(categoryInfo).map((category, index) => (
              <div key={category.id} className={category.status === 0 ? "table-row-category new-category" : "table-row-category"}>
                <span className="td category-index">{index + 1 + (page - 1) * postsPerPage}</span>
                {editCategory && category.id === editCategory.id ? (
                  <span className="td input-row">
                    <input value={editCategory.name} name="name" onChange={onEdit} />
                  </span>
                ) : (
                  <span className="td">{category.name}</span>
                )}
                {editCategory && category.id === editCategory.id ? (
                  <span className="td input-row">
                    <input value={editCategory.priority} type="number" name="priority" onChange={onEdit} />
                  </span>
                ) : (
                  <span className="td">{category.priority}</span>
                )}
                {editCategory && category.id === editCategory.id ? (
                  <span className="td input-row">
                    <input style={{ width: "auto", margin: "6px 5px" }} type="radio" id="disable" checked={isDisable} onClick={clickDisableBtn} onChange={clickDisableBtn} />
                  </span>
                ) : (
                  <span className="td">{category.disable === 1 ? "O" : "X"}</span>
                )}
                {editCategory && category.id === editCategory.id ? (
                  <span className="td category-btn-col">
                    <WhiteButton class="mr15" name="완료" click={clickEditFinish} />
                    <WhiteButton name="취소" click={clickCancelBtn} />
                  </span>
                ) : category.status === 0 ? (
                  <span className="td category-btn-col">
                    <WhiteButton
                      class="mr15"
                      name="수락"
                      click={() => {
                        confirmCategory(category);
                      }}
                    />
                    <WhiteButton
                      name="거절"
                      click={() => {
                        rejectCategory(category);
                      }}
                    />
                  </span>
                ) : category.status === 1 ? (
                  <span className="td category-btn-col">
                    <WhiteButton
                      class="mr15"
                      name="수정"
                      click={() => {
                        clickEditBtn(category);
                      }}
                    />
                    {/* <WhiteButton name="숨기기"/> */}
                  </span>
                ) : (
                  <span className="td category-btn-col reject-category">거절됨</span>
                )}
              </div>
            ))
          ) : (
            <div className="no-content">등록된 카테고리가 없습니다.</div>
          )}

          {isAdd ? (
            <div className="table-row-category">
              <span className="td category-index"></span>
              <span className="td input-row">
                <input value={addCategory.name} name="name" onChange={onAdd} />
              </span>
              <span className="td input-row">
                <input value={addCategory.priority} type="number" name="priority" onChange={onAdd} />
              </span>
              <span className="td input-row">
                <input style={{ width: "auto", margin: "6px 5px" }} type="radio" checked={addDisable} onClick={clickAddDisableBtn} onChange={clickAddDisableBtn} />
              </span>
              <span className="td category-btn-col">
                <WhiteButton
                  class="mr15"
                  name="추가"
                  click={() => {
                    createCategory();
                  }}
                />
                <WhiteButton name="취소" click={addCancelBtn} />
              </span>
            </div>
          ) : null}
        </div>
        <Pagination
          activePage={page}
          itemsCountPerPage={postsPerPage}
          totalItemsCount={categoryInfo !== null ? categoryInfo.length : 0}
          pageRangeDisplayed={5}
          prevPageText={"‹"}
          nextPageText={"›"}
          onChange={handlePageChange}
        />
        <div style={{ textAlign: "right" }}>
          <WhiteButton
            class="mt20"
            name="카테고리 추가"
            click={() => {
              setisAdd(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminCategory;
