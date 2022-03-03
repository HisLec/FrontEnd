import React, {useState, useEffect} from "react";
import axios from 'axios';
import Pagination from "react-js-pagination";
import XLSX from "xlsx";
import FileSaver from "file-saver";
import '../../../assets/css/table.css';
import '../../../assets/css/default.css';
import '../../../assets/css/admin_user.css';
import GreyButton from '../../modules/button/admin_grey_btn';

function AdminUsers() {
    const [keyword, setKeyword] = useState(null);
    const [userInfo, setuserInfo] = useState(null)
    const [page, setPage] = useState(1);
    const postsPerPage = 10;

    useEffect(() => {
        readUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const searchKeywordChanged = e => {
        setKeyword(e.target.value);
    }

    const readUser = async () => {
        if(keyword !== null){
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'user',
                {
                    params: {
                        keyword: encodeURI(keyword),
                        token:  window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );
            setuserInfo(response.data)
        }else {
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'user', {
                    params: {
                        token:  window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );
            setuserInfo(response.data)
        }
        setKeyword(null);
    }

    const statusChange = async(e, user_id) => {
        const { value,name } = e.target;

        if(window.confirm("사용자의 권한을 변경하시겠습니까?")) {
            axios(
                {
                    url: process.env.REACT_APP_RESTAPI_HOST+'user/status',
                    method: 'put',
                    data: {
                        id : name,
                        status: value,
                        token:  window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            ).then(function(res) {
                alert("권한이 변경되었습니다.")
            });
        } else {
            var box_value = document.getElementById('statusSelect'+user_id).value;
            if(box_value === 0)
                document.getElementById('statusSelect'+user_id).value = -1;
            else
                document.getElementById('statusSelect'+user_id).value = 0;
        }
    }

    const handlePageChange = (page) => { 
        setPage(page); 
    };

    function currentPosts(tmp) {
        var indexOfLast = page * postsPerPage;
        var indexOfFirst = indexOfLast - postsPerPage;

        let currentPosts = 0;
        currentPosts = userInfo.slice(indexOfFirst, indexOfLast);
        return currentPosts;
    }

    const exportToCSV = () => {
        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const fileName = "user";
        const ws = XLSX.utils.json_to_sheet(userInfo);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };
    
    return (
        <div>
            <p className="admin-title-header">사용자 관리</p>
            <div className="admin-content-wrapper">
                <div className="table-wrapper mt0 relative">
                    
                    <p className="table-name mb40">
                        사용자 관리
                        <GreyButton class="right" name="엑셀 파일 다운로드" click={exportToCSV}/>
                    </p>
                    
                    <div className="mb35">
                        <input className="p48 search-lecture-input" type="text" placeholder="이메일 주소로 키워드 검색" value={keyword || ""} onChange={searchKeywordChanged}/>
                        <GreyButton name="검색" click={readUser}/>
                    </div>
                    
                    
                    <div className="mt50 table-row-user">
                        <span className="th user-index"></span>
                        {/* <span className="th">이름</span> */}
                        <span className="th">이메일</span>
                        <span className="th user-date">가입일</span>
                        <span className="th user-access">접근제한여부</span>
                    </div>
                    {userInfo !== null ?
                        currentPosts(userInfo).map((user, i) =>
                            <div key={user.id} className="table-row-user">
                                <span className="td user-index">{(i+1)+((page-1)*postsPerPage)}</span>
                                {/* <span className="td">{user.name}</span> */}
                                <span className="td">{user.email}</span>
                                <span className="td user-date">{user.reg_date}</span>
                                {user.status === 2?
                                <span className="td user-access">
                                    관리자
                                </span>
                                :user.status === 1?
                                <span className="td user-access">
                                    강사
                                </span>
                                :
                                <span className="td user-access">
                                    <select id={"statusSelect"+user.id} defaultValue={user.status} name={user.id} onChange={(e)=>{statusChange(e, user.id)}}>
                                        <option value="0">일반사용자</option>
                                        <option value="-1">접근제한</option>
                                    </select>
                                </span>
                                }
                            </div>
                        )
                        : <div>사용자 정보 없음</div>
                    }
                </div>
                <Pagination 
                    activePage={page} 
                    itemsCountPerPage={postsPerPage} 
                    totalItemsCount={userInfo !== null ? userInfo.length : 0} 
                    pageRangeDisplayed={5} 
                    prevPageText={"‹"} 
                    nextPageText={"›"} 
                    onChange={handlePageChange} 
                />
            </div>
        </div>
    )

}

export default AdminUsers;