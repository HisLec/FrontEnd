import React, {useEffect, useState} from "react";
import axios from 'axios';
import '../../../assets/css/admin.css';
import WhiteButton from '../../modules/button/admin_white_btn';

function AdminPhrase() {
    const [settingInfo, setSettingInfo] = useState(null);
    const [lecturePageTitle, setLecturePageTitle] = useState(null)

    const [applicationPageTitle, setApplicationPageTitle] = useState(null)
    const [applicationBelowDate, setApplicationBelowDate] = useState(null)
    const [applicationListPage, setApplicationListPage] = useState(null)

    const [mypageProfile, setMypageProfile] = useState(null)
    const [mypageLecture, setMypageLecture] = useState(null)
    const [mypageContact, setMypageContact] = useState(null)
    const [mypageVisitDiary, setMypageVisitDiary] = useState(null)

    const [agreePI1, setAgreePI1] = useState(null)
    const [agreePI2, setAgreePI2] = useState(null)
    const [agreePI3, setAgreePI3] = useState(null)

    useEffect(() => {
        readSettingInfo();
    }, []);

    useEffect(() => {
        if(settingInfo !== null){
            setLecturePageTitle(settingInfo.find(element => element.key === "lecture_page_phrase").value);

            setApplicationPageTitle(settingInfo.find(element => element.key === "application_page_phrase").value);
            setApplicationBelowDate(settingInfo.find(element => element.key === "application_below_date_phrase").value);
            setApplicationListPage(settingInfo.find(element => element.key === "application_list_phrase").value);

            setMypageProfile(settingInfo.find(element => element.key === "mypage_profile_phrase").value);
            setMypageLecture(settingInfo.find(element => element.key === "mypage_lecture_phrase").value);
            setMypageContact(settingInfo.find(element => element.key === "mypage_contact_phrase").value);
            setMypageVisitDiary(settingInfo.find(element => element.key === "mypage_visit_phrase").value);

            setAgreePI1(settingInfo.find(element => element.key === "agree_personal_information_1").value);
            setAgreePI2(settingInfo.find(element => element.key === "agree_personal_information_2").value);
            setAgreePI3(settingInfo.find(element => element.key === "agree_personal_information_3").value);
        }

    }, [settingInfo]);

    const readSettingInfo = async () =>{
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'setting/admin', {
                params: {
                    token: window.sessionStorage.getItem('token'),
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        setSettingInfo(response.data)
    }

    const change0 = e => {
        setLecturePageTitle(e.target.value);
    }

    const change1 = e => {
        setApplicationPageTitle(e.target.value);
    }
    const change2 = e => {
        setApplicationBelowDate(e.target.value);
    }
    const change3 = e => {
        setApplicationListPage(e.target.value);
    }

    const change4 = e => {
        setMypageProfile(e.target.value);
    }
    const change5 = e => {
        setMypageLecture(e.target.value);
    }
    const change6 = e => {
        setMypageContact(e.target.value);
    }
    const change7 = e => {
        setMypageVisitDiary(e.target.value);
    }

    const change8 = e => {
        setAgreePI1(e.target.value);
    }
    const change9 = e => {
        setAgreePI2(e.target.value);
    }
    const change10 = e => {
        setAgreePI3(e.target.value);
    }

    const updatePhrase1 = async () => {
        var params = new URLSearchParams();
        
        params.append('lecture_page_phrase', lecturePageTitle);

        params.append('application_page_phrase', applicationPageTitle);
        params.append('application_below_date_phrase', applicationBelowDate);
        params.append('application_list_phrase', applicationListPage);

        params.append('mypage_profile_phrase', mypageProfile);
        params.append('mypage_lecture_phrase', mypageLecture);
        params.append('mypage_contact_phrase', mypageContact);
        params.append('mypage_visit_phrase', mypageVisitDiary);

        params.append('agree_personal_information_1', agreePI1);
        params.append('agree_personal_information_2', agreePI2);
        params.append('agree_personal_information_3', agreePI3);

        params.append('token', window.sessionStorage.getItem('token'));
        params.append('manageID', window.sessionStorage.getItem('id'));

        await axios.post(
        process.env.REACT_APP_RESTAPI_HOST +'setting/phrase1',
        params)
        .then(function(res) {
            alert("?????? ????????? ?????????????????????.");
        });
    }

    const updatePhrase2 = async () => {
        var params = new URLSearchParams();
        
        params.append('lecture_page_phrase', lecturePageTitle);

        params.append('application_page_phrase', applicationPageTitle);
        params.append('application_below_date_phrase', applicationBelowDate);
        params.append('application_list_phrase', applicationListPage);

        params.append('mypage_profile_phrase', mypageProfile);
        params.append('mypage_lecture_phrase', mypageLecture);
        params.append('mypage_contact_phrase', mypageContact);
        params.append('mypage_visit_phrase', mypageVisitDiary);

        params.append('agree_personal_information_1', agreePI1);
        params.append('agree_personal_information_2', agreePI2);
        params.append('agree_personal_information_3', agreePI3);

        params.append('token', window.sessionStorage.getItem('token'));
        params.append('manageID', window.sessionStorage.getItem('id'));
        
        await axios.post(
        process.env.REACT_APP_RESTAPI_HOST +'setting/phrase2',
        params)
        .then(function(res) {
            alert("?????? ????????? ?????????????????????.");
        });
    }

    return (
        <div>
            <p className="admin-title-header">?????? ??????</p>
            <div className="phrase-wrapper">
                <p className="main-title mb40">
                    ?????? ??????
                </p>
                <div className="main-content-wrapper mb55">
                    <p className="main-title">?????? ?????????</p>
                    <div className="phrase-sub-wrapper">
                        <p>?????? ?????? ?????????</p>
                        <input className="phrase-input-short" value={lecturePageTitle || ""} onChange={change0}/>
                    </div>
                    <hr className="phrase-hr"/>
                    <p className="main-title">??????, ?????? ?????????</p>
                    <div className="phrase-sub-wrapper">
                        <p>????????? ?????? ?????????</p>
                        <input className="phrase-input-short" value={applicationPageTitle || ""} onChange={change1}/>
                        <p className="phrase-p-short">????????? ?????? ?????????<br/><span>- ????????? ????????? ??????</span></p>
                        <input className="phrase-input-short" value={applicationBelowDate || ""} onChange={change2}/>
                        <p>?????? ?????? ?????????</p>
                        <input className="phrase-input-short" value={applicationListPage || ""} onChange={change3}/>
                    </div>
                    <hr className="phrase-hr"/>
                    <p className="main-title">?????? ?????????</p>
                    <div className="phrase-sub-wrapper">
                        <p>??????????????? - ??? ?????????</p>
                        <input className="phrase-input-short" value={mypageProfile || ""} onChange={change4}/>
                        <p>??????????????? - ??? ?????????</p>
                        <input className="phrase-input-short" value={mypageLecture || ""} onChange={change5}/>
                        <p>??????????????? - ?????? / ??????</p>
                        <input className="phrase-input-short" value={mypageContact || ""} onChange={change6}/>
                        <p>??????????????? - ????????????</p>
                        <input className="phrase-input-short" value={mypageVisitDiary || ""} onChange={change7}/>
                    </div>
                    <div className="center">
                        <WhiteButton class="mr20" name="?????? ??????" click={updatePhrase1}/> 
                    </div>
                </div>
                <div className="main-content-wrapper mb55">
                    <p className="main-title">????????? ?????? ?????? ?????? ???</p>
                    <div className="phrase-sub-wrapper">
                        <textarea value={agreePI1 || ""} onChange={change8}></textarea>
                        <textarea value={agreePI2 || ""} onChange={change9}></textarea>
                        <textarea value={agreePI3 || ""} onChange={change10}></textarea>
                    </div>
                    <div className="center">
                        <WhiteButton class="mr20" name="?????? ??????" click={updatePhrase2}/> 
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminPhrase;