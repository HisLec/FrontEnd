import React, {useEffect, useState} from "react";
import axios from 'axios';

import '../../../assets/css/admin.css';
import GreyButton from '../../modules/button/admin_grey_btn';

function AdminMain() {
    const [settingInfo, setSettingInfo] = useState(null)
    const [instructorInfo, setInstructorInfo] = useState(null)
    const [lectureInfo, setLectureInfo] = useState(null)

    /* section 1*/
    const [removeBackgroundImage,setRemoveBackgroundImage] = useState([false, false,false,false, false])
    const [backgroundImage,setBackgroundImage] = useState([null,null,null,null, null])
    const [backgroundBase64Image, setBackgroundBase64Image] = useState(["","","","", ""])

    const [section1backgroundDelay, setSection1backgroundDelay] = useState(null)

    /* section 2*/
    const [removeBackgroundSection2,setRemoveBackgroundSection2] = useState(false)
    const [backgroundSection2,setBackgroundSection2] = useState(null)
    const [backgroundBase64Section2, setBackgroundBase64Section2] = useState("")

    const [section2Content, setSection2Content] = useState(null)

    /* section 3*/
    const [defaultInstructorImage, setDefaultInstructorImage] = useState([true,true,true,true])
    const [instructorImage, setInstructorImage] = useState([null,null,null,null])
    const [instructorBase64Image, setInstructorBase64Image] = useState(["","","",""])
    const [instructorFlag, setInstructorFlag] = useState([false, false, false, false])
    const [instructorId, setInstructorId] = useState([-2,-2,-2,-2])

    /* section 4*/
    //const [removeLectureImage, setRemoveLectureImage] = useState([false, false, false, false, false,false, false, false])
    const [defaultLectureImage, setDefaultLectureImage] = useState([true,true,true,true,true,true,true,true])
    const [lectureFlag, setLectureFlag] = useState([false, false, false, false,false, false, false, false])
    const [lectureImage, setLectureImage] = useState([null,null,null,null,null,null,null,null])
    const [lectureBase64Image, setLectureBase64Image] = useState(["","","","","","","",""])
    const [lectureId, setLectureId] = useState([-2,-2,-2,-2,-2,-2,-2,-2])

    useEffect(() => {
        readMainPageContent();
        readAllLecture();
        readInstructor();
    }, []);
    
    useEffect (() => {
        if(settingInfo !== null){
            var value = [false, false, false, false, false];
            
            for(let index=0; index<4; index++){
                if(settingInfo.find(element => element.key === "section1_img"+(index+1)).value === "" || settingInfo.find(element => element.key === "section1_img"+(index+1)).value === null)
                    value[index] = true;
            }
            if(settingInfo.find(element => element.key === "section1_title").value === "" || settingInfo.find(element => element.key === "section1_title").value === null){
                value[4] = true;
            }
            setRemoveBackgroundImage(value);
            setSection1backgroundDelay(settingInfo.find(element => element.key === "section1_delay").value);


            if(settingInfo.find(element => element.key === "section2_img").value === "" || settingInfo.find(element => element.key === "section2_img").value === null)
                setRemoveBackgroundSection2(true);

            setSection2Content(settingInfo.find(element => element.key === "section2_text").value);

            setInstructorId([
                parseInt(settingInfo.find(element => element.key === "section3_id1").value),
                parseInt(settingInfo.find(element => element.key === "section3_id2").value),
                parseInt(settingInfo.find(element => element.key === "section3_id3").value),
                parseInt(settingInfo.find(element => element.key === "section3_id4").value)
            ]);
            setLectureId([
                parseInt(settingInfo.find(element => element.key === "section5_id1").value),
                parseInt(settingInfo.find(element => element.key === "section5_id2").value),
                parseInt(settingInfo.find(element => element.key === "section5_id3").value),
                parseInt(settingInfo.find(element => element.key === "section5_id4").value),
                parseInt(settingInfo.find(element => element.key === "section5_id5").value),
                parseInt(settingInfo.find(element => element.key === "section5_id6").value),
                parseInt(settingInfo.find(element => element.key === "section5_id7").value),
                parseInt(settingInfo.find(element => element.key === "section5_id8").value)
            ]);
        }
    }, [settingInfo]);

    useEffect(() => {
        let newArr = instructorBase64Image.map((item, i) => { 
            if (instructorId[i] === -1) { 
                return null; 
            } else { 
                return item; 
            } 
        }); 
        setInstructorBase64Image(newArr);

        let newArr2 = instructorImage.map((item, i) => { 
            if (instructorId[i] === -1) { 
                return null; 
            } else { 
                return item; 
            } 
        }); 
        setInstructorImage(newArr2);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [instructorId]);

    useEffect(() => {
        let newArr = lectureBase64Image.map((item, i) => { 
            if (lectureId[i] === -1) { 
                return null; 
            } else { 
                return item; 
            } 
        }); 
        setLectureBase64Image(newArr);

        let newArr2 = lectureImage.map((item, i) => { 
            if (lectureId[i] === -1) { 
                return null; 
            } else { 
                return item; 
            } 
        }); 
        setLectureImage(newArr2);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lectureId]);
    
    const delayChanged = e => {
        setSection1backgroundDelay(e.target.value);
    }


    const handleChangeFile = (event,setImage,setImagebase64) => {
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
        }
        
    }
    const ChangeFiles = (event,Image, setImage,Imagebase64, setImagebase64, index) => {
        var reader = new FileReader();
        if (event.target.files[0]) {
            reader.readAsDataURL(event.target.files[0]);

            let newArr = Image.map((item, i) => { 
                if (index === i) { 
                    return event.target.files[0]; 
                } else { 
                    return item; 
                } 
            }); 
            setImage(newArr);
        }
        reader.onloadend = () => {
            const base64 = reader.result;
            if (base64) {
                let newArr = Imagebase64.map((item, i) => { 
                    if (index === i) { 
                        return base64.toString(); 
                    } else { 
                        return item; 
                    } 
                }); 
                setImagebase64(newArr);
            }
        }
    }
    const ChangeFiles2 = (event,Image, setImage,Imagebase64, setImagebase64, index, setImageFlag, imageFlag) => {
        var reader = new FileReader();
        if (event.target.files[0]) {
            reader.readAsDataURL(event.target.files[0]);

            let newArr = Image.map((item, i) => { 
                if (index === i) { 
                    return event.target.files[0]; 
                } else { 
                    return item; 
                } 
            }); 
            setImage(newArr);

            let newArr3 = imageFlag.map((item, i) => { 
                if (index === i) { 
                    return true; 
                } else { 
                    return item; 
                } 
            }); 
            setImageFlag(newArr3);
        }else {
            let newArr2 = imageFlag.map((item, i) => { 
                if (index === i) { 
                    return false; 
                } else { 
                    return item; 
                } 
            }); 
            setImageFlag(newArr2);
        }
        reader.onloadend = () => {
            const base64 = reader.result;
            if (base64) {
                let newArr = Imagebase64.map((item, i) => { 
                    if (index === i) { 
                        return base64.toString(); 
                    } else { 
                        return item; 
                    } 
                }); 
                setImagebase64(newArr);
            }
        }
    }

    const readMainPageContent = async () =>{
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

    const readAllLecture = async() => {

        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'lecture/all', {
                params: {
                    token: window.sessionStorage.getItem('token'),
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        setLectureInfo(response.data);
    }

    const readInstructor = async () => {
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'instructor/all', {
                params: {
                    token: window.sessionStorage.getItem('token'),
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        setInstructorInfo(response.data)
    }
    const clickEditMainPageButton = async () =>{
        const params = new FormData();
        const headers = {
            'Content-type': 'multipart/form-data; charset=UTF-8',
            'Accept': '*/*'
        }
        var removeFlag = false;
        var values = ["","","","",""];
        for(let i=0; i<4; i++){
            if(removeBackgroundImage[i] === false){
                values[i] = settingInfo.find(element => element.key === "section1_img"+(i+1)).value;
                removeFlag = true;
            }
            else 
                values[i] = null;
        }

        if(removeBackgroundImage[4] === false){
            values[4] = settingInfo.find(element => element.key === "section1_title").value;
            removeFlag = true;
        }else 
            values[4] = null;

        if(!removeFlag){
            alert("이미지를 하나 이상 넣어야 수정할 수 있습니다.");
            return;
        }

        let fileCount = backgroundImage.map((item, i) => { 
            if (removeBackgroundImage[i] === false && item !== null) {
                params.append('file', item);
                return i;
            } else { 
                return -1;
            } 
        });
        fileCount = fileCount.filter(x => x !== -1);

        let valuesData = values.map((item, i) => { 
            if (removeBackgroundImage[i] === false) { 
                return item;
            } else { 
                return null; 
            } 
        }); 

        params.append('values', valuesData);
        params.append('delay', section1backgroundDelay);
        params.append('fileCount', fileCount);
        params.append('token', window.sessionStorage.getItem('token'));
        params.append('manageID', window.sessionStorage.getItem('id'));

        await axios.post(
        process.env.REACT_APP_RESTAPI_HOST +'setting/mainHome',
        params,{headers})
        .then(function(res) {
            alert("처음 화면 수정이 완료되었습니다.");
            readMainPageContent();
            setBackgroundImage([null,null,null,null, null]);
            setBackgroundBase64Image(["","","","", ""]);
        });
    }

    const clickEditExplainSiteButton = async () => {
        const params = new FormData();
        const headers = {
            'Content-type': 'multipart/form-data; charset=UTF-8',
            'Accept': '*/*'
        }
        if(removeBackgroundSection2 === true){
            alert("사진을 하나 이상 넣어야 수정하실 수 있습니다.");
            return;
        }else {
            params.append('value', settingInfo.find(element => element.key === "section2_img").value);
            params.append('file', backgroundSection2);
        }
        params.append('content', section2Content);
        params.append('token', window.sessionStorage.getItem('token'));
        params.append('manageID', window.sessionStorage.getItem('id'));

        await axios.post(
            process.env.REACT_APP_RESTAPI_HOST +'setting/explainSite',
            params,{headers})
            .then(function(res) {
                alert("사이트 설명 화면 수정이 완료되었습니다.");
                readMainPageContent();
                setBackgroundBase64Section2("");
                setBackgroundSection2(null);
            });
    }

    const clickEditExplainInstructorButton = async () => {
        const params = new FormData();
        const headers = {
            'Content-type': 'multipart/form-data; charset=UTF-8',
            'Accept': '*/*'
        }
        var defaultValues = ["","","","","final"];
        for(let i=0; i<4; i++){
            if(instructorId[i] !== -1 && instructorId[i] !== parseInt(settingInfo.find(element => element.key === "section3_id"+(i+1)).value)){
                defaultValues[i] = instructorInfo.find(element => parseInt(element.id) === instructorId[i]).image;
            }else {
                defaultValues[i] = settingInfo.find(element => element.key === "section3_img"+(i+1)).value;
            }
        }
        var instructorFlag = false;
        let fileCount = instructorImage.map((item, i) => { 
            if (instructorId[i] !== -1 && instructorImage[i] !== null) {
                params.append('file', item);
                instructorFlag = true;
                return i;
            } else { 
                return -1;
            } 
        });
        fileCount = fileCount.filter(x => x !== -1);

        if(!instructorFlag){
            alert("사진을 하나 이상 넣어야 수정하실 수 있습니다.");
            return;
        }
        params.append('fileCount', fileCount);
        params.append('values', defaultValues);
        params.append('instructor_id', instructorId);
        params.append('token', window.sessionStorage.getItem('token'))
        params.append('manageID', window.sessionStorage.getItem('id'));

        await axios.post(
        process.env.REACT_APP_RESTAPI_HOST +'setting/explainInstructor',
        params,{headers})
        .then(function(res) {
            alert("강사 화면 수정이 완료되었습니다.");
            readMainPageContent();
            setInstructorImage([null,null,null,null]);
            setInstructorBase64Image(["","","","", ""]);
            setInstructorFlag([false, false, false, false]);
        });
    }

    const clickEditExplainLectureButton = async () => {
        const params = new FormData();
        const headers = {
            'Content-type': 'multipart/form-data; charset=UTF-8',
            'Accept': '*/*'
        }
        var defaultValues = ["","","",""];
        for(let i=0; i<8; i++){
            defaultValues[i] = settingInfo.find(element => element.key === "section5_img"+(i+1)).value;
        }
        let fileCount = lectureImage.map((item, i) => { 
            if (lectureId[i] !== -1 && lectureImage[i] !== null) {
                params.append('file', item);
                return i;
            } else { 
                return -1;
            } 
        });
        fileCount = fileCount.filter(x => x !== -1);
 
        params.append('fileCount', fileCount);
        params.append('values', defaultValues);
        params.append('lecture_id', lectureId);
        params.append('token', window.sessionStorage.getItem('token'));
        params.append('manageID', window.sessionStorage.getItem('id'));

        await axios.post(
        process.env.REACT_APP_RESTAPI_HOST +'setting/explainLecture',
        params,{headers})
        .then(function(res) {
            alert("강사 화면 수정이 완료되었습니다.");
            readMainPageContent();
            setLectureImage([null,null,null,null,null,null,null,null]);
            setLectureBase64Image(["","","","", "","","",""]);
        });
    }

    return (
        <div>
            <p className="admin-title-header">메인페이지 관리</p>
            <div className="admin-content-wrapper">
                <p className="main-title mb40">
                    처음 화면
                </p>
                <div className="main-content-wrapper mb55">
                    <p className="main-title">배경 화면</p>
                    <div className="main-sub-wrapper">
                        {
                            [0,1,2,3].map((data, i) =>
                                <div className="img-wrapper" key={i}>
                                    <span className="default-img">
                                        {removeBackgroundImage[data] === false && backgroundImage[data] !== null?
                                        <img className="default-img" src={backgroundBase64Image[data]} alt="배경화면"
                                        onError={(e) => {
                                            e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage2.png';
                                        }}/>:
                                        removeBackgroundImage[data] === false && settingInfo !== null && settingInfo.find(element => element.key === "section1_img"+(data+1)).value !== null && settingInfo.find(element => element.key === "section1_img"+(data+1)).value !== "" && settingInfo.find(element => element.key === "section1_img"+(data+1)).value !== "null"?
                                        <img className="default-img" src={process.env.REACT_APP_RESTAPI_HOST+ "resources/upload/"+settingInfo.find(element => element.key === "section1_img"+(data+1)).value} alt="배경화면"
                                        onError={(e) => {
                                            e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage2.png';
                                        }}/>:null
                                        }
                                    </span>
                                    <div>
                                    <label className={removeBackgroundImage[data] === false? "input-file-button": "input-file-button disabled"} htmlFor={"input-file"+data}>첨부파일</label>
                                    {removeBackgroundImage[data] === true?
                                    <input type="file" id="input-file" style={{display:"none"}} disabled/>:
                                    <input type="file" id={"input-file"+data} style={{display:"none"}} onChange={(e) => { ChangeFiles(e, backgroundImage, setBackgroundImage, backgroundBase64Image, setBackgroundBase64Image,data);}}/>
                                    }
                                    <span className="admin-main-remove" >삭제</span>
                                    {
                                        removeBackgroundImage[data] === false?
                                            <input type="checkbox" onChange={(e) => {
                                                let newArr = removeBackgroundImage.map((item, index) => { 
                                                    if (data === index) { 
                                                        return e.target.checked; 
                                                    } else { 
                                                        return item; 
                                                    } 
                                                }); 
                                                setRemoveBackgroundImage(newArr);
                                            }}/>
                                        :
                                            <input type="checkbox" onChange={(e) => {
                                                let newArr = removeBackgroundImage.map((item, index) => { 
                                                    if (data === index) { 
                                                        return e.target.checked; 
                                                    } else { 
                                                        return item; 
                                                    } 
                                                }); 
                                                setRemoveBackgroundImage(newArr);
                                            }} checked/>
                                    }
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <p className="main-title">배경 전환</p>
                    <div className="main-sub-wrapper">
                        <span className="main-second">
                            사진이 <input className="sec-input" type="text" value={section1backgroundDelay || ""} onChange={delayChanged}/> 초에 한 번씩 바뀌도록
                        </span>
                    </div>
                    <p className="main-title">중간 글귀</p>
                    <div className="main-sub-wrapper justify-start mb0">
                        <div className="mr30 img-wrapper no-margin">
                            <span className="default-img">
                                    {removeBackgroundImage[4] === false && backgroundImage[4] !== null?
                                        <img className="default-img" src={backgroundBase64Image[4]} alt="배경화면"
                                        onError={(e) => {
                                            e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage2.png';
                                        }}/>:
                                        removeBackgroundImage[4] === false && settingInfo !== null && settingInfo.find(element => element.key === "section1_title").value !== null && settingInfo.find(element => element.key === "section1_title").value !== "null" && settingInfo.find(element => element.key === "section1_title").value !== ""?
                                        <img className="default-img" src={process.env.REACT_APP_RESTAPI_HOST+ "resources/upload/"+settingInfo.find(element => element.key === "section1_title").value} alt="배경화면 1"
                                        onError={(e) => {
                                            e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage2.png';
                                        }}/>:null
                                    }
                            </span>
                            <label className={removeBackgroundImage[4] === false? "input-file-button": "input-file-button disabled"} htmlFor={"input-file"+4}>첨부파일</label>
                                {removeBackgroundImage[4] === true?
                                <input type="file" id="input-file" style={{display:"none"}} disabled/>:
                                <input type="file" id={"input-file"+4} style={{display:"none"}} onChange={(e) => { ChangeFiles(e, backgroundImage, setBackgroundImage, backgroundBase64Image, setBackgroundBase64Image, 4) }}/>
                            }
                            <span className="admin-main-remove" >삭제</span>
                            <input type="checkbox" defaultValue={removeBackgroundImage[4]} onChange={(e) => {
                                        let newArr = removeBackgroundImage.map((item, i) => { 
                                            if (4 === i) { 
                                                return !item; 
                                            } else { 
                                                return item; 
                                            } 
                                        }); 
                                        setRemoveBackgroundImage(newArr);
                                    }}/>
                        </div>
                        <div className="position-r">
                        </div>
                    </div>
                </div>
                <div className="button-wrapper"><GreyButton class="inst-grey-btn" name="수정하기" click={clickEditMainPageButton}/></div>
                <p className="main-title mb30">
                    사이트 설명 화면
                </p>
                <div className="main-content-wrapper mb55">
                    <p className="main-title">배경 사진</p>
                    <div className="main-sub-wrapper">
                        <div className="mr25 img-wrapper">
                            <span className="default-img">
                                {removeBackgroundSection2 === false && backgroundSection2 !== null?
                                    <img className="default-img" src={backgroundBase64Section2} alt="배경화면 section2"
                                    onError={(e) => {
                                        e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage2.png';
                                    }}/>:
                                    removeBackgroundSection2 === false && settingInfo !== null && settingInfo.find(element => element.key === "section2_img").value !== null && settingInfo.find(element => element.key === "section2_img").value !== "null" && settingInfo.find(element => element.key === "section2_img").value !== ""?
                                    <img className="default-img" src={process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+settingInfo.find(element => element.key === "section2_img").value} alt="배경화면 section 2"
                                    onError={(e) => {
                                        e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage2.png';
                                    }}/>:null
                                }
                            </span>
                            <label className={removeBackgroundSection2 === false? "input-file-button": "input-file-button disabled"} htmlFor="input-file-explain">첨부파일</label>
                            {removeBackgroundSection2 === true?
                                <input type="file" id="input-file-explain" style={{display:"none"}} disabled/>:
                                <input type="file" id="input-file-explain" style={{display:"none"}} onChange={(e) => {handleChangeFile(e, setBackgroundSection2, setBackgroundBase64Section2)}}/>
                            }
                            <span className="admin-main-remove" >삭제</span>
                            <input type="checkbox" onChange={(e) => {setRemoveBackgroundSection2(e.target.checked); }}/>
                        </div>
                    </div>
                    <p className="main-title">행사 조직 안내글</p>
                    <div>
                        <textarea className="info-textarea" placeholder="행사 조직 안내글을 입력하세요." value={section2Content || ""} onChange={(e) => {setSection2Content(e.target.value);}}></textarea>
                    </div>
                </div>
                <div className="button-wrapper"><GreyButton class="inst-grey-btn" name="수정하기" click={clickEditExplainSiteButton}/></div>
                
                <p className="main-title mb30">
                    대표 강사 소개 화면
                </p>
                <div className="main-content-wrapper mb55 p4020">
                    <div className="main-sub-wrapper mb0">
                        {
                            [0,1,2,3].map((data, i) =>
                                <div className="img-inst-wrapper" key={i}>
                                    <span className="default-inst-img">
                                        {instructorId[data] !== -1 && instructorBase64Image[data] !== null && instructorBase64Image[data] !== ""?
                                        <img className="default-img admin-main-img-content" src={instructorBase64Image[data]} alt="강사화면1"onError={(e) => {
                                            e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage2.png';
                                        }}/>:
                                        instructorFlag[data] === false && defaultInstructorImage[data] === true && settingInfo !== null && settingInfo.find(element => element.key === "section3_img"+(data+1)).value !== null && settingInfo.find(element => element.key === "section3_img"+(data+1)).value !== "" && settingInfo.find(element => element.key === "section3_img"+(data+1)).value !== "null"?
                                        <img className="default-img admin-main-img-content" src={process.env.REACT_APP_RESTAPI_HOST+ "resources/upload/"+settingInfo.find(element => element.key === "section3_img"+(data+1)).value} alt="강사화면2"
                                        onError={(e) => {
                                            e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage2.png';
                                        }}/>:
                                        instructorId[data] !== -1 && instructorInfo !== null && instructorInfo.find(element => parseInt(element.id) === instructorId[data]) !== null && instructorInfo.find(element => parseInt(element.id) === instructorId[data]) !== undefined && instructorInfo.find(element => parseInt(element.id) === instructorId[data]).image !== undefined && instructorInfo.find(element => parseInt(element.id) === instructorId[data]).image !== null && instructorInfo.find(element => parseInt(element.id) === instructorId[data]).image !== "null" && instructorInfo.find(element => parseInt(element.id) === instructorId[data]).image !== ""?
                                        <img className="default-img admin-main-img-content" src={process.env.REACT_APP_RESTAPI_HOST+ "resources/upload/"+instructorInfo.find(element => parseInt(element.id) === instructorId[data]).image} alt="강사화면3"
                                        onError={(e) => {
                                            e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage2.png';
                                        }}/>:
                                        instructorId[data] !== -1 && settingInfo !== null && settingInfo.find(element => element.key === "section3_img"+(data+1)).value !== null && settingInfo.find(element => element.key === "section3_img"+(data+1)).value !== "" && settingInfo.find(element => element.key === "section3_img"+(data+1)).value !== "null"?
                                        <img className="default-img admin-main-img-content" src={process.env.REACT_APP_RESTAPI_HOST+ "resources/upload/"+settingInfo.find(element => element.key === "section3_img"+(data+1)).value} alt="강사화면4"
                                        onError={(e) => {
                                            e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage2.png';
                                        }}/>:null
                                        }
                                    </span>
                                    <label className={instructorId[data] !== -1? "input-file-button": "input-file-button disabled"} htmlFor={"input-inst-file"+data}>첨부파일</label>
                                    {instructorId[data] === -1?
                                    <input type="file" id="input-inst-file" style={{display:"none"}} disabled/>:
                                    <input type="file" id={"input-inst-file"+data} style={{display:"none"}} onChange={(e) => { ChangeFiles2(e, instructorImage, setInstructorImage, instructorBase64Image, setInstructorBase64Image,data, setInstructorFlag, instructorFlag);}}/>
                                    }
                                    <span className="search-inst-wrapper">
                                        {
                                            instructorInfo !== null?
                                            <select className = "search-input" value={instructorId[data]}
                                            onChange={(e) =>{
                                                if(defaultInstructorImage[data] === true){
                                                    let newArr2 = defaultInstructorImage.map((item, i) => { 
                                                        if (data === i) { 
                                                            return false; 
                                                        } else { 
                                                            return item; 
                                                        } 
                                                    }); 
                                                    setDefaultInstructorImage(newArr2);
                                                }
                                                let newArr = instructorId.map((item, i) => { 
                                                    if (data === i) { 
                                                        return parseInt(e.target.value); 
                                                    } else { 
                                                        return item; 
                                                    } 
                                                }); 
                                                setInstructorId(newArr);
                                            }}>
                                            <option value={-1}>삭제 (선택 안 함)</option>
                                            {instructorInfo !== null ?
                                                instructorInfo.map((data2, index2) =>
                                                <option key={index2} value={parseInt(data2.id)}>{data2.inst_name}</option>
                                                    )
                                                :
                                                <option value="-2">데이터 없음</option>
                                            }
                                        </select>:
                                        <select className = "search-input" defaultValue="-2">
                                            <option value="-2">데이터 없음</option>
                                        </select>
                                        }
                                    </span>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="button-wrapper"><GreyButton class="inst-grey-btn" name="수정하기" click={clickEditExplainInstructorButton}/></div>
                <p className="main-title mb30">
                    대표 강좌 소개 화면
                </p>
                <div className="main-content-wrapper mb55 p4020">
                    <div className="main-sub-lecture-wrapper mb0">
                        {
                            [0,1,2,3,4,5,6,7].map((data, i) =>
                                <div className="img-lecture-wrapper" key={i}>
                                    <span className="default-lecture-img">
                                        {lectureId[data] !== -1 && lectureBase64Image[data] !== "" && lectureBase64Image[data] !== null?
                                        <img className="default-img admin-main-img-content" src={lectureBase64Image[data]} alt="강사화면"
                                        onError={(e) => {
                                            e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage2.png';
                                        }}
                                        />:
                                        lectureId[data] !== -1 && settingInfo !== null && settingInfo.find(element => element.key === "section5_img"+(data+1)).value !== null && settingInfo.find(element => element.key === "section5_img"+(data+1)).value !== "" && settingInfo.find(element => element.key === "section5_img"+(data+1)).value !== "null"?
                                        <img className="default-img admin-main-img-content" src={process.env.REACT_APP_RESTAPI_HOST+ "resources/upload/"+settingInfo.find(element => element.key === "section5_img"+(data+1)).value} alt="강사화면2"
                                        onError={(e) => {
                                            e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage2.png';
                                        }}
                                        />:
                                        null
                                        }
                                    </span>
                                    <label className={lectureId[data] !== -1? "input-file-button": "input-file-button disabled"} htmlFor={"input-lecture-file"+data}>첨부파일</label>
                                    {lectureId[data] === -1?
                                    <input type="file" id="input-lecture-file" style={{display:"none"}} disabled/>:
                                    <input type="file" id={"input-lecture-file"+data} style={{display:"none"}} onChange={(e) => { ChangeFiles2(e, lectureImage, setLectureImage, lectureBase64Image, setLectureBase64Image, data, setLectureFlag, lectureFlag);}}/>
                                    }
                                    <span className="search-lecture-wrapper">
                                        <select className = "search-input" value={lectureId[data]} 
                                            onChange={(e) =>{
                                                if(defaultLectureImage[data] === true){
                                                    let newArr2 = defaultLectureImage.map((item, i) => { 
                                                        if (data === i) { 
                                                            return false; 
                                                        } else { 
                                                            return item; 
                                                        } 
                                                    }); 
                                                    setDefaultLectureImage(newArr2);
                                                }
                                                let newArr = lectureId.map((item, i) => { 
                                                    if (data === i) { 
                                                        return parseInt(e.target.value); 
                                                    } else { 
                                                        return item; 
                                                    } 
                                                }); 
                                                setLectureId(newArr);
                                            }}>
                                            <option value={-1}>삭제 (선택 안 함)</option>
                                            {lectureInfo !== null ?
                                                lectureInfo.map((data, index) =>
                                                    <option key={index} value={parseInt(data.id)}>{data.name}</option>
                                                    )
                                                :
                                                <option value="-2">데이터 없음</option>
                                            }
                                        </select>
                                    </span>
                                </div>
                            )
                        }
                        
                        
                    </div>
                </div>
                <div className="button-wrapper"><GreyButton class="inst-grey-btn" name="수정하기" click={clickEditExplainLectureButton}/></div>
            </div>        
        </div>
    )
}

export default AdminMain;