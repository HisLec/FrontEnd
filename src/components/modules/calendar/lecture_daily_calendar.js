import React, { useCallback, useRef, useEffect, useState } from "react";

import TUICalendar from "@toast-ui/react-calendar";
// import { ISchedule, ICalendarInfo } from "tui-calendar";

import "tui-calendar/dist/tui-calendar.css";
import "tui-date-picker/dist/tui-date-picker.css";
import '../../../assets/css/calendar.css';
import "tui-time-picker/dist/tui-time-picker.css";
import WhiteButton from '../../modules/button/white_button';

const allcalendarColor = ["#ef6f87","#e49d5a", "#e4ce5a", "#7ddc8b" ,"#c0afff","#9fcae8","#F23DA0", "#3C5FA6", "#F28705", "#467326", "#D99066", "#ff5722"];
const calendarColor = ["#fbbc05", "#cccccc", "#4285f4", "#7ddc8b" ,"#34A853","#9fcae8","#F23DA0", "#3C5FA6", "#F28705", "#467326", "#D99066", "#ff5722"];
// const calendarInstructor = ["#ef6f87","#e49d5a", "#2196f3", "#7ddc8b" ,"#c0afff","#9fcae8","#F23DA0", "#3C5FA6", "#F28705", "#467326", "#D99066", "#ff5722"];


function LectureDailyCalendar(props) {
    const cal = useRef(null);
    const [schedules, setschedules] = useState([])
    const [calendars, setcalendars] = useState([])
    const [year, setyear] = useState(null)
    const [month, setmonth] = useState(null)
    const [clickedDate, setclickedDate] = useState("날짜를 선택해주세요.");

    useEffect(() => {
        if(props.calendarData !== null) {
            const data = props.calendarData;
            
            var index = 0;
            var tempSchedule = [];
            var tempCalendar = [];
            
            if(props.path !== null && (props.path ==="/" || props.path ==="/lecture/date")) {

                for(var i=0 ; i<data.length ; i++) {
                    tempSchedule.push({
                        calendarId: data[i].id,
                        category: "time",
                        isAllDay: true,
                        isVisible: true,
                        title: data[i].name,
                        id: data[i].id,
                        body: "[강사명] "+data[i].inst_name+"- [주제]" +data[i].topic_list,
                        start: data[i].date,
                        end: data[i].date,
                        location: data[i].region_list
                    })

                    // eslint-disable-next-line no-loop-func
                    if(!tempCalendar.find(element => element.id === data[i].id)) {
                        tempCalendar.push({
                            id: data[i].id,
                            name: data[i].name,
                            color: allcalendarColor[index],
                            bgColor: allcalendarColor[index]+"40",
                            dragBgColor: allcalendarColor[index]+"40",
                            borderColor: allcalendarColor[index]
                        })
                        index++;
                    }
                    
                    if(index === calendarColor.length)
                        index=0;
                }
            }
            else if(props.path === "/mypage/contact" || props.path === "/lecture/subject" || props.path === "/lecture/instructor" || props.path === "/admin/lecture" || props.path === "/mypage/lecture") {
                // var tempSchedule = [];
                // var tempCalendar = [];

                // eslint-disable-next-line no-redeclare
                for(var i=0 ; i<data.length ; i++) {
                    var status_id = 0;
                    var start_time = data[i].date;
                    var end_time = data[i].date;
                    var isAllDay = true;
                    
                    // 신청자가 있을 때
                    if(data[i].form_id) {
                        // status
                        if(data[i].status === 0)
                            status_id = 0
                        else if(data[i].status === 1)
                            status_id = 1
                        else if(data[i].status === 2) {
                            status_id = 2
                            start_time = data[i].date+" "+data[i].contact_start_date
                            end_time = data[i].date+" "+data[i].contact_end_date
                            isAllDay = false
                        }
                        
                        // 취소된 컨택내역은 안보여줌
                        if(data[i].status !== -1)
                            tempSchedule.push({
                                calendarId: status_id,
                                category: "time",
                                isAllDay: isAllDay,
                                isVisible: true,
                                title: data[i].name,
                                id: status_id,
                                body: "[주제]" +data[i].topic_list,
                                start: start_time,
                                end: end_time,
                                location: data[i].region_list
                            })
                    } else {
                        tempSchedule.push({
                            calendarId: 3,
                            category: "time",
                            isAllDay: true,
                            isVisible: true,
                            title: data[i].name,
                            id: 3,
                            body: "[주제]" +data[i].topic_list,
                            start: data[i].date,
                            end: data[i].date,
                            location: data[i].region_list
                        })
                    }
                }

                tempCalendar.push({
                    id: 0,
                    name: "컨택요청",
                    color: calendarColor[0],
                    bgColor: calendarColor[0]+"40",
                    dragBgColor: calendarColor[0]+"40",
                    borderColor: calendarColor[0]
                })
                tempCalendar.push({
                    id: 1,
                    name: "컨택진행중",
                    color: calendarColor[1],
                    bgColor: calendarColor[1]+"40",
                    dragBgColor: calendarColor[1]+"40",
                    borderColor: calendarColor[1]
                })
                tempCalendar.push({
                    id: 2,
                    name: "컨택완료",
                    color: calendarColor[2],
                    bgColor: calendarColor[2]+"40",
                    dragBgColor: calendarColor[2]+"40",
                    borderColor: calendarColor[2]
                })
                tempCalendar.push({
                    id: 3,
                    name: "컨택취소",
                    color: calendarColor[3],
                    bgColor: calendarColor[3]+"40",
                    dragBgColor: calendarColor[3]+"40",
                    borderColor: calendarColor[3]
                })
                tempCalendar.push({
                    id: 4,
                    name: "신청자없음",
                    color: calendarColor[4],
                    bgColor: calendarColor[4]+"40",
                    dragBgColor: calendarColor[4]+"40",
                    borderColor: calendarColor[4]
                })
            }

            setschedules(tempSchedule)
            setcalendars(tempCalendar)

        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.calendarData])


    useEffect(() => {
        if (cal !== null) {
            const calendarInstance = cal.current.getInstance();
            calendarInstance.today();
            var m = calendarInstance.getDate().getMonth() + 1;
            var y = calendarInstance.getDate().getFullYear();
            if(m < 10)
                m = "0"+m;
            var date = y+"-"+m;

            setmonth(m);
            setyear(y);

            if(props.clickedLecture !== null && (props.path === "/lecture/subject" || props.path === "/lecture/instructor" || props.path === "/admin/lecture" || props.path === "/mypage/lecture"))
                props.readMainCalendar(date, props.clickedLecture.id);
            else
                props.readMainCalendar(date)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const calendarInstance = cal.current.getInstance();
        calendarInstance.today();
        var m = calendarInstance.getDate().getMonth() + 1;
        var y = calendarInstance.getDate().getFullYear();
        if(m < 10)
            m = "0"+m;
        // var date = y+"-"+m;

        setmonth(m);
        setyear(y);
    }, [props.clickedLecture])


    const onClickSchedule = useCallback((e) => {
        const { calendarId, id } = e.schedule;
        cal.current.calendarInst.getElement(id, calendarId);

    }, []);

    const onBeforeCreateSchedule = useCallback((scheduleData) => {
        scheduleData.guide.clearGuideElement();
        var date = scheduleData.start._date
        var year = date.getFullYear(); 
        var month = date.getMonth() + 1; 
        var day = date.getDate();
        if(month < 10)
            month = "0"+month;
        if(day < 10)
            day = "0"+day;
        var click_date = year+"-"+month+"-"+day;
        setclickedDate(click_date);
        props.readLecture(click_date);

        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    

    function _getFormattedTime(time) {
        const date = new Date(time);
        const h = date.getHours();
        const m = date.getMinutes();

        return `${h}:${m}`;
    }

    function _getTimeTemplate(schedule, isAllDay) {
        var html = [];

        if (!isAllDay) {
            html.push("<strong>" + _getFormattedTime(schedule.start) + "</strong> ");
        }
        if (schedule.isPrivate) {
            html.push('<span class="calendar-font-icon ic-lock-b"></span>');
            html.push(" Private");
        } else {
            if (schedule.isReadOnly) {
                html.push('<span class="calendar-font-icon ic-readonly-b"></span>');
            } else if (schedule.recurrenceRule) {
                html.push('<span class="calendar-font-icon ic-repeat-b"></span>');
            } else if (schedule.attendees.length) {
                html.push('<span class="calendar-font-icon ic-user-b"></span>');
            } else if (schedule.location) {
                html.push('<span class="calendar-font-icon ic-location-b"></span>');
            }
            html.push(" " + schedule.title);
        }

        return html.join("");
    }

    const templates = {
        time: function (schedule) {
            return _getTimeTemplate(schedule, false);
        }
    };


    const NextButton = useCallback((e) => {
        if (cal !== null) {
            const calendarInstance = cal.current.getInstance();
            calendarInstance.next();

            var m = calendarInstance.getDate().getMonth() + 1;
            var y = calendarInstance.getDate().getFullYear();
            if(m < 10)
                m = "0"+m;
            var date = y+"-"+m;

            setmonth(m);
            setyear(y);

            if((props.path === "/lecture/subject" || props.path === "/lecture/instructor" || props.path === "/admin/lecture" || props.path === "/mypage/lecture") && props.clickedLecture !== null)
                props.readMainCalendar(date, props.clickedLecture.id);
            else
                props.readMainCalendar(date)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.clickedLecture]);

    const PrevButton = useCallback((e) => {
        
        if (cal !== null) {
            const calendarInstance = cal.current.getInstance();
            calendarInstance.prev();

            var m = calendarInstance.getDate().getMonth() + 1;
            var y = calendarInstance.getDate().getFullYear();
            if(m < 10)
                m = "0"+m;
            var date = y+"-"+m;

            setmonth(m);
            setyear(y)

            if((props.path === "/lecture/subject" || props.path === "/lecture/instructor" || props.path === "/admin/lecture" || props.path === "/mypage/lecture") && props.clickedLecture !== null) {
                props.readMainCalendar(date, props.clickedLecture.id);
            }
            else
                props.readMainCalendar(date)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.clickedLecture]);

    const TodayButton = useCallback((e) => {
        if (cal !== null) {
            const calendarInstance = cal.current.getInstance();
            calendarInstance.today();

            var m = calendarInstance.getDate().getMonth() + 1;
            var y = calendarInstance.getDate().getFullYear();
            if(m < 10)
                m = "0"+m;
            var date = y+"-"+m;

            setmonth(m);
            setyear(y)

            if((props.path === "/lecture/subject" || props.path === "/lecture/instructor" || props.path === "/admin/lecture" || props.path === "/mypage/lecture") && props.clickedLecture !== null)
                props.readMainCalendar(date, props.clickedLecture.id);
            else
                props.readMainCalendar(date)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.clickedLecture]);

    const clickAllLecture = () => {
        setclickedDate("날짜를 선택해주세요.");
        props.readLecture("");
    }

    return (
        <div>
        
        <h2 className="calendar-title">{year}년 {month}월의 강의</h2>
            <div className="mb15">
                <WhiteButton class="mr15" name="전체 강의 보기" click={clickAllLecture}/>
                <WhiteButton class="mr15" name="오늘날짜" click={TodayButton}/>
                <WhiteButton class="mr15" name="<" click={PrevButton}/>
                <WhiteButton name=">" click={NextButton}/>
            </div>
            <div className="mb10">
                특정 날짜를 클릭하시면 해당 날짜의 강의들을 볼 수 있습니다.
            </div>
            <div className="mb10" style={{fontSize:'17px', fontWeight:'600'}}>
                선택 날짜: <span className="mr10">{clickedDate}</span>
            </div>
            {props.path !== null && (props.path === "/mypage/contact" || props.path === "/lecture/subject" || props.path === "/lecture/instructor" || props.path === "/admin/lecture" || props.path === "/mypage/lecture") ?
            <div style={{textAlign:"right", marginBottom:"15px"}}>
                <span className="mr15">
                    <span className="color-circle" style={{background:calendarColor[0]}}></span>
                    <span>컨택요청</span>
                </span>
                <span className="mr15">
                    <span className="color-circle" style={{background:calendarColor[1]}}></span>
                    <span>컨택진행중</span>
                </span>
                <span className="mr15">
                    <span className="color-circle" style={{background:calendarColor[2]}}></span>
                    <span>컨택완료</span>
                </span>
                <span className="mr15">
                    <span className="color-circle" style={{background:calendarColor[3]}}></span>
                    <span>신청없음</span>
                </span>
            </div> :
            null
            }
            
            <TUICalendar
                ref={cal}
                height="100%"
                view="month"
                useCreationPopup={false}
                useDetailPopup={true}
                template={templates}
                calendars={calendars}
                schedules={schedules}
                onClickSchedule={onClickSchedule}
                onBeforeCreateSchedule={onBeforeCreateSchedule}
            />
        </div>
    );
}

export default LectureDailyCalendar;