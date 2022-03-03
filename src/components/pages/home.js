import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/home.css';
import { Link } from 'react-router-dom';
import ReactPageScroller from "react-page-scroller";
import CommonCalendar from '../modules/calendar/read_calendar';
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
    EffectFade, Autoplay, Navigation, Pagination
} from 'swiper/core';

import "swiper/swiper.min.css";
import "swiper/components/effect-fade/effect-fade.min.css"
import "swiper/components/navigation/navigation.min.css"
import "swiper/components/pagination/pagination.min.css"

  // install Swiper modules
  SwiperCore.use([EffectFade,Autoplay,Pagination,Navigation]);

const Home = (prop) => {
    const [currentPage, setCurrentPage] = useState(null);
    const [settingInfo, setsettingInfo] = useState(null);
    const [section1Image, setsection1Image] = useState(null)
    const [section5Image, setsection5Image] = useState(null)
    const [calendarInfo, setcalendarInfo] = useState(null)


    useEffect(() => {
        let today = new Date();   

        let year = today.getFullYear(); // 년도
        let month = today.getMonth() + 1;  // 월
        if(month<10)
            month="0"+month
        var date = year+"-"+month;

        readSettingInfo();
        readMainCalendar(date);
    }, [])

    const readImage = async() => {
        var images = [];
        if(settingInfo.find(element => element.key === "section1_img1").value !== null && settingInfo.find(element => element.key === "section1_img1").value !== "null"&& settingInfo.find(element => element.key === "section1_img1").value !== ""){
            await axios.get(
                process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+settingInfo.find(element => element.key === "section1_img1").value, {
                    params: {
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            )
            .then(reponse => {
                images.push(process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+settingInfo.find(element => element.key === "section1_img1").value);
            })
            .catch(function (error) {
                images.push(process.env.REACT_APP_DEFAULT_URL+'image/errorImage.jpeg');
            });
        }
        if(settingInfo.find(element => element.key === "section1_img2").value !== null && settingInfo.find(element => element.key === "section1_img2").value !== "null"&& settingInfo.find(element => element.key === "section1_img2").value !== ""){
            await axios.get(
                process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+settingInfo.find(element => element.key === "section1_img2").value, {
                    params: {
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            )
            .then(reponse => {
                images.push(process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+settingInfo.find(element => element.key === "section1_img2").value);
            })
            .catch(function (error) {
                images.push(process.env.REACT_APP_DEFAULT_URL+'image/errorImage.jpeg');
            });
        }
        if(settingInfo.find(element => element.key === "section1_img3").value !== null && settingInfo.find(element => element.key === "section1_img3").value !== "null"&& settingInfo.find(element => element.key === "section1_img3").value !== ""){
            await axios.get(
                process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+settingInfo.find(element => element.key === "section1_img3").value, {
                    params: {
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            )
            .then(reponse => {
                images.push(process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+settingInfo.find(element => element.key === "section1_img3").value);
            })
            .catch(function (error) {
                images.push(process.env.REACT_APP_DEFAULT_URL+'image/errorImage.jpeg');
            });
        }
        if(settingInfo.find(element => element.key === "section1_img4").value !== null && settingInfo.find(element => element.key === "section1_img4").value !== "null"&& settingInfo.find(element => element.key === "section1_img4").value !== ""){
            await axios.get(
                process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+settingInfo.find(element => element.key === "section1_img4").value, {
                    params: {
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            )
            .then(reponse => {
                images.push(process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+settingInfo.find(element => element.key === "section1_img4").value);
            })
            .catch(function (error) {
                images.push(process.env.REACT_APP_DEFAULT_URL+'image/errorImage.jpeg');
            });
        }
        setsection1Image(images);
    }
    useEffect(() => {
        if(settingInfo !== null) {
            readImage();

            var images2 = [];
            for(var i=1; i<=8; i++){
                // eslint-disable-next-line no-loop-func
                if(settingInfo.find(element => element.key === "section5_img"+i).value !== null && settingInfo.find(element => element.key === "section5_img"+i).value !== "null"&& settingInfo.find(element => element.key === "section5_img"+i).value !== ""){
                    // eslint-disable-next-line no-loop-func
                    if(parseInt(settingInfo.find(element => element.key === "section5_id"+i).value) === -1){
                        // eslint-disable-next-line no-loop-func
                        images2.push({name: ""});
                    }else {
                        // eslint-disable-next-line no-loop-func
                        images2.push({name: settingInfo.find(element => element.key === "section5_img"+i).value});
                    }
                }
            }
            setsection5Image(images2);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settingInfo])


    const readMainCalendar = async(date) => {
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'calendar/main',{
                params:{
                    date: date,
                    token: window.sessionStorage.getItem('token'),
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        setcalendarInfo(response.data)
    }

    const readSettingInfo = async () => {
        const response = await axios.get(
            process.env.REACT_APP_RESTAPI_HOST + 'setting', {
                params: {
                    token: window.sessionStorage.getItem('token'),
                    manageID: window.sessionStorage.getItem('id')
                }
            }
        );
        setsettingInfo(response.data)        
    }

    const handlePageChange = number => {
        setCurrentPage(number);
    };

    const lectures = [
        {
            'id': 1,
            'title': 'lecture1'
        },
        {
            'id': 2,
            'title': 'lecture2'
        },
        {
            'id': 3,
            'title': 'lecture3'
        },
        {
            'id': 4,
            'title': 'lecture4'
        },
        {
            'id': 5,
            'title': 'lecture5'
        },
        {
            'id': 6,
            'title': 'lecture6'
        },
        {
            'id': 7,
            'title': 'lecture7'
        },
        {
            'id': 8,
            'title': 'lecture8'
        },
    ];

    return (
    <div>
        <div className="main-page-scroller">
            <ReactPageScroller
                pageOnChange={handlePageChange}
                customPageNumber={currentPage}
            >
                {/* section1 start */}
                <section className="section1">
                <Swiper 
                spaceBetween={30} 
                effect={'fade'}
                centeredSlides={true} 
                loop={true} loopFillGroupWithBlank={true}
                autoplay= {
                    settingInfo !== null ?
                    {
                    "delay": settingInfo.find(element => element.key === "section1_delay").value,
                    "disableOnInteraction": false
                    }:
                    {
                    "delay": 3000,
                    "disableOnInteraction": false
                    }
                }
                pagination={{
                    "clickable": true
                }} 
                navigation={true} 
                className="mySwiper">
                    {
                        section1Image !== null ?
                        section1Image.map( (item, i) => 
                        <SwiperSlide key={i}><img className="main-slide-img" src={item} alt="main_img"/>
                        </SwiperSlide>)
                        : <div>로딩중...</div>
                    }
                </Swiper>
                <img className="home-logo" src={settingInfo !== null ? process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+settingInfo.find(element => element.key === "section1_title").value : ""} alt="logo"
                onError={(e) => {
                    e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage.jpeg';
                }}/>
                <Link className="main-section1-btn" to={process.env.REACT_APP_DEFAULT_URL+"lecture/subject"}>강의 보러 가기</Link>
                </section>

                {/* section2 start */}
                <section 
                    className="section2" 
                    style={settingInfo !== null ? 
                    {background:"url("+process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+settingInfo.find(element => element.key === "section2_img").value+") no-repeat"}:
                    {background:"none"}}
                >
                    <div className="info-wrapper">
                        <h2 className="title">행사 조직 안내글</h2>
                        <p className="contents">
                            {settingInfo !== null ?
                            settingInfo.find(element => element.key === "section2_text").value.split("<br/>").map( (item, i) => <div key={i}>{item}</div>) :
                            "로딩중..."
                            }
                        </p>
                        <Link className="lecture-btn" to={process.env.REACT_APP_DEFAULT_URL+"lecture/subject"}>강의 보러 가기</Link>
                    </div>
                </section>

                {/* section3 start */}
                {settingInfo !== null ?
                <section className="section3">
                    <img src={process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+settingInfo.find(element => element.key === "section3_img1").value} alt="lecture1" 
                    onError={(e) => {
                        e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage.jpeg';
                    }}></img>
                    <img src={process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+settingInfo.find(element => element.key === "section3_img2").value} alt="lecture2"
                    onError={(e) => {
                        e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage.jpeg';
                    }}></img>
                    <img src={process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+settingInfo.find(element => element.key === "section3_img3").value} alt="lecture3"
                    onError={(e) => {
                        e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage.jpeg';
                    }}></img>
                    <img src={process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+settingInfo.find(element => element.key === "section3_img4").value} alt="lecture4"
                    onError={(e) => {
                        e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage.jpeg';
                    }}></img>
                    <Link className="lecture-btn2" to={process.env.REACT_APP_DEFAULT_URL+"lecture/subject"}>강의 보러 가기</Link>
                </section>
                :
                <div>로딩중...</div>
                }

                {/* section5 start */}
                <section className="section5">
                    <h2 className="lecture-title">대표 강좌</h2>
                    <div className="lecture-wrapper">
                        {lectures.map((lecture, index) => {
                            return <div key={index} className="lecture"></div>;
                        })}
                    </div>
                    <div id="slideshow" className="lecture-wrapper-mobile">
                        <div className="entire-content">
                            <div className="content-carrousel">
                                {section5Image !== null ?
                                section5Image.map((image, index) => {
                                    return  <figure key={index} className="shadow"><img src={process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+image.name} alt="section5"
                                    onError={(e) => {
                                        e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage.jpeg';
                                    }}/></figure>;
                                })
                                : <div>로딩중...</div>
                                }
                            </div>
                        </div>
                    </div>
                    <Link className="lecture-btn3" to={process.env.REACT_APP_DEFAULT_URL+"lecture/subject"}>강의 보러 가기</Link>
                </section>
            </ReactPageScroller>
        </div>
        {/* 일반 */}
        <div className="main-page-nonscroll">
                {/* section1 start */}
                
                <section className="section1">
                <Swiper 
                spaceBetween={30} 
                effect={'fade'}
                centeredSlides={true} 
                loop={true} loopFillGroupWithBlank={true}
                autoplay= {
                    settingInfo !== null ?
                    {
                    "delay": settingInfo.find(element => element.key === "section1_delay").value,
                    "disableOnInteraction": false
                    }:
                    {
                    "delay": 3000,
                    "disableOnInteraction": false
                    }
                }
                pagination={{
                    "clickable": true
                }} 
                navigation={true} 
                className="mySwiper">
                    {
                        section1Image !== null ?
                        section1Image.map( (item, i) => <SwiperSlide key={i}><img className="main-slide-img" src={item} alt="main" /></SwiperSlide>)
                        : <div>로딩중...</div>
                    }
                </Swiper>
                <img className="home-logo" src={settingInfo !== null ? process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+settingInfo.find(element => element.key === "section1_title").value : ""} alt="logo"
                onError={(e) => {
                    e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage.jpeg';
                }}/>
                <Link className="main-section1-btn" to={process.env.REACT_APP_DEFAULT_URL+"lecture/subject"}>강의 보러 가기</Link>
                </section>

                {/* section2 start */}
                <section 
                    className="section2" 
                    style={settingInfo !== null ? 
                    {background:"url("+process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+settingInfo.find(element => element.key === "section2_img").value+") no-repeat"}:
                    {background:"none"}}
                >
                    <div className="info-wrapper">
                        <h2 className="title">행사 조직 안내글</h2>
                        <p className="contents">
                            {settingInfo !== null ?
                            settingInfo.find(element => element.key === "section2_text").value.split("<br/>").map( (item, i) => <div key={i}>{item}</div>) :
                            "로딩중..."
                            }
                        </p>
                        <Link className="lecture-btn" to={process.env.REACT_APP_DEFAULT_URL+"lecture/subject"}>강의 보러 가기</Link>
                    </div>
                </section>

                {/* section3 start */}
                {settingInfo !== null ?
                <section className="section3">
                    <img src={process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+settingInfo.find(element => element.key === "section3_img1").value} alt="lecture1"
                        onError={(e) => {
                        e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage.jpeg';
                    }}></img>
                    <img src={process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+settingInfo.find(element => element.key === "section3_img2").value} alt="lecture2"
                        onError={(e) => {
                            e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage.jpeg';
                    }}></img>
                    <img src={process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+settingInfo.find(element => element.key === "section3_img3").value} alt="lecture3"
                        onError={(e) => {
                        e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage.jpeg';
                    }}></img>
                    <img src={process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+settingInfo.find(element => element.key === "section3_img4").value} alt="lecture4"
                        onError={(e) => {
                        e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage.jpeg';
                    }}></img>
                    <Link className="lecture-btn2" to={process.env.REACT_APP_DEFAULT_URL+"lecture/subject"}>강의 보러 가기</Link>
                </section>
                :
                <div>로딩중...</div>
                }
                

                {/* section4 start */}
                <section className="section4">
                    <div className="main-calendar">
                        <CommonCalendar readMainCalendar={readMainCalendar} calendarData={calendarInfo} path={window.location.href.replace(process.env.REACT_APP_DEFAULT_WHOLE_URL, "/")}/>
                    </div>
                    <Link className="lecture-btn3" to={process.env.REACT_APP_DEFAULT_URL+"lecture/subject"}>강의 보러 가기</Link>
                </section>

                {/* section5 start */}
                <section className="section5">
                    <h2 className="lecture-title">대표 강좌</h2>
                    <div className="lecture-wrapper">
                        {/* {lectures.map((lecture, index) => {
                            return <div key={index} className="lecture"></div>;
                        })} */}
                        {section5Image !== null ?
                        section5Image.map((image, index) => {
                            return  <div key={index} className="lecture"><img src={process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+image.name} alt="section5"
                            onError={(e) => {
                                e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage.jpeg';
                            }}/></div>;
                        })
                        : <div>로딩중...</div>
                        }
                    </div>
                    <div id="slideshow" className="lecture-wrapper-mobile">
                        <div className="entire-content">
                            <div className="content-carrousel">
                                {section5Image !== null ?
                                section5Image.map((image, index) => {
                                    return  <figure key={index} className="shadow"><img src={process.env.REACT_APP_RESTAPI_HOST+"resources/upload/"+image.name} alt="section5"
                                    onError={(e) => {
                                        e.target.src = process.env.REACT_APP_DEFAULT_URL+'image/errorImage.jpeg';
                                    }}
                                    /></figure>;
                                })
                                : <div>로딩중...</div>
                                }
                            </div>
                        </div>
                    </div>
                    <Link className="lecture-btn3" to={process.env.REACT_APP_DEFAULT_URL+"lecture/subject"}>강의 보러 가기</Link>
                </section>
        </div>
    </div>
    )
}

export default Home;
