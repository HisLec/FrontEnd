import React, { useState, useEffect, createRef } from 'react';
import axios from 'axios';
import Pagination from "react-js-pagination";
import { Link } from 'react-router-dom';
import WhiteButton from '../modules/button/white_button';
import { Editor, Viewer } from '@toast-ui/react-editor';
import "../../assets/css/notice.css";
import '@toast-ui/editor/dist/toastui-editor.css';
import GreyButton from '../modules/button/admin_grey_btn';

function Notice() {
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [selectedContent, setselectedContent] = useState("");
    const [editNotice, seteditNotice] = useState(null);
    const [keyword, setkeyword] = useState(null);
    const [NoticeInfo, setNoticeInfo] = useState(null);
    const [mode, setmode] = useState(null);
    const editorRef = createRef();
    const readViewerRef = createRef();
    const editEditorRef = createRef();
    const [addTitle, setaddTitle] = useState("");
    const [administratorInfo, setAdministratorInfo] = useState(null);
    const [page, setPage] = useState(1);
    // eslint-disable-next-line no-unused-vars
    const [postsPerPage, setpostsPerPage] = useState(10);

    useEffect(() => {
        readNotice();
        readAdministratorInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    function noticeClick(e) {

        if (selectedNotice === null || selectedNotice !== e) {
            setSelectedNotice(null);
            clickedSetFunction(e);
            setselectedContent(e.content);
            seteditNotice(e);
            setmode("read");
        }
        else{
            setSelectedNotice(null);
            setmode(null);
        }
    }

    const clickedSetFunction = (e) => {
        setSelectedNotice(e);
    }

    const readAdministratorInfo = async () => {
        if(parseInt(window.sessionStorage.getItem('status')) === 2){
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'administrator/user/'+window.sessionStorage.getItem('id'), {
                    params: {
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );
            setAdministratorInfo(response.data);
        }
    }

    function addNoticeClick(e) {
        if (mode !== 'create')
            setmode('create');
        else
            setSelectedNotice("read");
    }

    const readNotice = async () => {
        if(keyword !== '' && keyword !== null){
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'notice',
                {
                    params: {
                        keyword: keyword,
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );
            setNoticeInfo(response.data)
        }else {
            const response = await axios.get(
                process.env.REACT_APP_RESTAPI_HOST + 'notice', {
                    params: {
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            );
            setNoticeInfo(response.data)
        }
        setkeyword(null);
    }

    const createNotice = () => {
        var lines = editorRef.current.getInstance().toastMark.lineTexts;
        var addContent = lines.join("\n");
        if(window.confirm("공지사항을 등록하시겠습니까?")) {
            axios(
                {
                    url: process.env.REACT_APP_RESTAPI_HOST+'notice',
                    method: 'post',
                    data: {
                        administrator_id: administratorInfo.id,
                        title: addTitle,
                        content: addContent,
                        important: 0,
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            ).then(function(res) {
                alert("공지사항이 등록되었습니다.");
                readNotice();
                setmode(null);
                setaddTitle("");
            })
        }
    }

    const editFinishBtn = () => {
        var lines = editEditorRef.current.getInstance().toastMark.lineTexts;
        var editContent = lines.join("\n");
        let dataset = {...editNotice, content:editContent, token: window.sessionStorage.getItem('token'), manageID: window.sessionStorage.getItem('id')};
        
        if(window.confirm("공지사항을 수정하시겠습니까?")) {
            axios(
                {
                    url: process.env.REACT_APP_RESTAPI_HOST+'notice',
                    method: 'put',
                    data: dataset
                }
            ).then(function(res) {
                alert("수정이 완료되었습니다.")
                readNotice();
                setmode(null);
                seteditNotice(null);
                setSelectedNotice(null);
            })
        }
    }

    const onEdit = (e) => {
        const { value, name } = e.target;
        seteditNotice({
            ...editNotice,
            [name]: value
        });
    };

    const cancelEditBtn = () => {
        setmode("read");
        seteditNotice(selectedNotice);
    }

    const cancelReadBtn = () => {
        setmode(null);
        setaddTitle("");
    }

    const deleteNotice = () => {
        if(window.confirm("공지사항을 삭제하시겠습니까?")) {
            axios(
                {
                    url: process.env.REACT_APP_RESTAPI_HOST+'notice',
                    method: 'delete',
                    data: {
                        notice_id: selectedNotice.id,
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            ).then(function(res) {
                alert("삭제가 완료되었습니다.")
                readNotice();
                setSelectedNotice(null);
                setmode(null);
            })
        }
    }

    const handlePageChange = (page) => { 
        setPage(page); 
    };

    function currentPosts(tmp) {
        var indexOfLast = page * postsPerPage;
        var indexOfFirst = indexOfLast - postsPerPage;

        let currentPosts = 0;
        currentPosts = NoticeInfo.slice(indexOfFirst, indexOfLast);
        return currentPosts;
    }

    return (
        <div>
            <div className="main-image">
                <img className="page-background" src={process.env.REACT_APP_DEFAULT_URL+"image/notice.png"} alt="lecture page" />
                <div className="page-info">
                    <h2>공지사항</h2>
                    <p>사이트 이용 방법과 공지사항을 보여줍니다</p>
                </div>
            </div>
            <div className="content-wrapper">
                <div className="left-navbar">
                    <span>
                        <Link className="sub-title active" to={process.env.REACT_APP_DEFAULT_URL+"notice"}>공지사항</Link>
                    </span>
                </div>
                <div className="right-content">
                    {mode === null &&
                        <div className="mb35" style={{textAlign:'right'}}>
                            <input className="p48 mr10" type="text" placeholder="제목, 내용, 글쓴이로 검색" value={keyword || ""} onChange={(e)=>setkeyword(e.target.value)}/>
                            <GreyButton name="검색" click={readNotice}/>
                        </div>
                    }
                    {selectedNotice !== null ?
                        mode === "edit"?
                        <div>
                            <div className="detail-title notice-detail-title">
                                <h2 className="notice-header"> 공지사항 글쓰기</h2>
                                <input className="notice-input-title" defaultValue={editNotice.title} name="title" onChange={onEdit} placeholder="제목을 입력해주세요."/>
                            </div>
                            <div className="detail-content notice-detail-title notice-pc-editor">
                                <Editor
                                    placeholder="내용을 입력해주세요"
                                    previewStyle="vertical"
                                    height="600px"
                                    initialEditType="markdown"
                                    initialValue={editNotice.content}
                                    useCommandShortcut={true}
                                    ref={editEditorRef}
                                />
                            </div>
                            <div className="detail-content notice-detail-title notice-mobile-editor">
                                <Editor
                                    placeholder="내용을 입력해주세요"
                                    previewStyle="horizon"
                                    height="600px"
                                    initialEditType="markdown"
                                    initialValue={editNotice.content}
                                    useCommandShortcut={true}
                                />
                            </div>
                            <div className="button-wrapper notice-create-button-wrapper">
                                <WhiteButton name="완료" class="mr15" click={()=>editFinishBtn()}/>
                                <WhiteButton name="취소" click={()=>cancelEditBtn()}/>
                            </div>
                        </div>
                        :
                        <div>
                            <div className="detail-title">
                                <h2>{selectedNotice.title}</h2>
                                <span>{selectedNotice.admin_name} 작성</span>
                                <span className="detail-date">{selectedNotice.reg_date}</span>
                            </div>
                            <div className="detail-content">
                                <Viewer
                                initialValue={selectedContent}
                                ref={readViewerRef}
                                />
                            </div>
                            <div className="button-wrapper notice-button-wrapper">
                                <WhiteButton name="목록으로" class="mr15" click={()=>{setmode(null); setSelectedNotice(null)}}/>
                                {
                                    parseInt(window.sessionStorage.getItem('status')) === 2?
                                    <span>
                                        <WhiteButton name="수정" class="mr15" click={()=>setmode("edit")}/>
                                        <WhiteButton name="삭제" click={()=>deleteNotice()}/>
                                    </span>:null
                                }
                            </div>
                        </div>
                        : mode === "create" ?
                        <div>
                            <div className="detail-title notice-detail-title">
                                <h2 className="notice-header"> 공지사항 글쓰기</h2>
                                <input className="notice-input-title" defaultValue={addTitle} onChange={(e)=>setaddTitle(e.target.value)}/>
                            </div>
                            <div className="detail-content notice-detail-title notice-pc-editor">
                                <Editor
                                    placeholder="내용을 입력해주세요"
                                    previewStyle="vertical"
                                    height="600px"
                                    initialEditType="markdown"
                                    useCommandShortcut={true}
                                    ref={editorRef}
                                />
                            </div>
                            <div className="detail-content notice-detail-title notice-mobile-editor">
                                <Editor
                                    placeholder="내용을 입력해주세요"
                                    previewStyle="horizon"
                                    height="600px"
                                    initialEditType="markdown"
                                    useCommandShortcut={true}
                                />
                            </div>
                            <div className="button-wrapper notice-create-button-wrapper">
                                <WhiteButton name="완료" class="mr15" click={createNotice}/>
                                <WhiteButton name="취소" click={cancelReadBtn}/>
                            </div>
                        </div>
                        :<div>
                        </div>
                    }
                    {mode === null &&
                    <div>
                        <div className="table-wrapper">
                            <div className="table-row-user" >
                                <div className="th">번호</div>
                                <div className="th">제목</div>
                                <div className="th date">글쓴이</div>
                                <div className="th date">등록일</div>
                            </div>
                            { NoticeInfo !== null && NoticeInfo.length > 0 ?
                                currentPosts(NoticeInfo).map((notice, index) =>
                                <div key={notice.id} className={notice === selectedNotice ? " table-row-user click-inst-row" : "table-row-user"} onClick={() => noticeClick(notice)}>
                                    <div className="td">{index+1}</div>
                                    <div className="td">{notice.title}</div>
                                    <div className="td date">{notice.admin_name}</div>
                                    <div className="td date">{notice.reg_date}</div>
                                </div>
                                )
                                :
                                <div className="no-content">등록된 공지사항이 없습니다.</div>
                            }
                        </div>
                        <Pagination 
                            activePage={page} 
                            itemsCountPerPage={postsPerPage} 
                            totalItemsCount={NoticeInfo !== null ? NoticeInfo.length : 0} 
                            pageRangeDisplayed={5} 
                            prevPageText={"‹"} 
                            nextPageText={"›"} 
                            onChange={handlePageChange} 
                        />
                    </div>
                    }
                    {mode === null && parseInt(window.sessionStorage.getItem('status')) === 2?
                        <div className="button-left-wrapper"><WhiteButton name="글쓰기" click={addNoticeClick}/></div>:null
                    }
                </div>
            </div>
        </div>
    );
}

export default Notice;
