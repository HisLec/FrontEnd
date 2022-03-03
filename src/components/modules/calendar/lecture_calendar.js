import React, { useCallback, useRef, useEffect, useState } from "react";
import TUICalendar from "@toast-ui/react-calendar";

import "tui-calendar/dist/tui-calendar.css";
import "tui-date-picker/dist/tui-date-picker.css";
import '../../../assets/css/calendar.css';
import "tui-time-picker/dist/tui-time-picker.css";
import WhiteButton from '../button/white_button';

const calendarColor = ["#000000","#e49d5a", "#4285f4", "#e4ce5a" ,"#c0afff","#9fcae8","#F23DA0", "#3C5FA6", "#F28705", "#467326", "#D99066", "#ff5722"];

function LectureCalendar(props) {
    const cal = useRef(null);
    const [schedules, setschedules] = useState([])
    const [calendars, setcalendars] = useState([])
    const [year, setyear] = useState("")
    const [month, setmonth] = useState("")

    useEffect(() => {
        if(props.calendarData !== null) {
            const data = props.calendarData;
            // var index = 0;
            var tempSchedule = [];
            
            for(var i=0 ; i<data.length ; i++) {
                if(data[i].form_id === 0) {
                    tempSchedule.push({
                        calendarId: 2,
                        category: "time",
                        isAllDay: true,
                        isVisible: true,
                        title: "강의"+(i+1),
                        id: i+1,
                        start: data[i].date,
                        end: data[i].date
                    })
                } else {
                    tempSchedule.push({
                        calendarId: 1,
                        category: "time",
                        isAllDay: true,
                        isReadOnly: true,
                        isVisible: true,
                        title: "강의"+(i+1),
                        id: i+1,
                        start: data[i].date,
                        end: data[i].date
                    })
                }
            }

            if(props.academyDates !== null) {
                props.academyDates.forEach((data, index) => {
                    tempSchedule.push({
                        calendarId: 3,
                        isAllDay: true,
                        isVisible: true,
                        category: "time",
                        isReadOnly: true,
                        title: data.name,
                        id: 0,
                        start: data.date,
                        end: data.date
                    })
                });
            }
            

            var tempCalendar  = [];
            tempCalendar.push({
                id: 1,
                name: "수정 불가",
                color: calendarColor[3],
                bgColor: calendarColor[3]+"40",
                dragBgColor: calendarColor[3]+"40",
                borderColor: calendarColor[3]
            });
            tempCalendar.push({
                id: 2,
                name: "수정 가능",
                color: calendarColor[2],
                bgColor: calendarColor[2]+"40",
                dragBgColor: calendarColor[2]+"40",
                borderColor: calendarColor[2]
            });
            tempCalendar.push({
                id: 3,
                name: "학사 일정",
                color: calendarColor[0],
                bgColor: calendarColor[0]+"40",
                dragBgColor: calendarColor[0]+"40",
                borderColor: calendarColor[0]
            });
            setcalendars(tempCalendar);
            setschedules(tempSchedule);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.calendarData])



    useEffect(() => {
        let today = new Date();   
        let year = today.getFullYear(); // 년도
        let month = today.getMonth() + 1;  // 월
        // let date = today.getDate();  // 날짜
        // let day = today.getDay();  // 요일

        if(month < 10)
            month = "0"+month;
        setyear(year)
        setmonth(month)
    }, [])

    const onClickSchedule = useCallback((e) => {
        const { calendarId, id } = e.schedule;
        cal.current.calendarInst.getElement(id, calendarId);

    }, []);


    const onBeforeCreateSchedule = useCallback((scheduleData) => {

        var date = scheduleData.start._date;
        var year = date.getFullYear(); 
        var month = date.getMonth() + 1; 
        var day = date.getDate();
        if(month < 10)
            month = "0"+month;
        if(day < 10)
            day = "0"+day;
        date = year+"-"+month+"-"+day;
        // var index = 0;
        // if(schedules !== null && schedules.length > 0) {
        //     // index = schedules[schedules.length-1].id;
        // }
        // const addSchedule = {
        //     calendarId: 2,
        //     category: "time",
        //     isAllDay: true,
        //     isVisible: true,
        //     title: "강의"+(index+1),
        //     id: index+1,
        //     start: date,
        //     end: date
        // }
        const addDate = {
            date:date,
            form_id:0,
            lecture_date_id: 0
        }
        // setschedules(schedules.concat(addSchedule));
        props.setResultDates(props.calendarData.concat(addDate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [schedules]);

    const deleteDate = (res) => {
        // eslint-disable-next-line no-unused-vars
        const { id, calendarId } = res.schedule;

        setschedules(schedules.filter((e) => (e.id !== id)))
        var tempData = [];
        props.calendarData.forEach((data, i) => {
            if(i+1 !== id)
                tempData.push({
                    lecture_date_id: data.date_id,
                    date: data.date,
                    form_id: data.form_id
                })        
        });
        props.setResultDates(tempData);
    }

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
            // var date = y+"-"+m;

            setmonth(m);
            setyear(y)
        }
    }, []);

    const PrevButton = useCallback((e) => {

        if (cal !== null) {
            const calendarInstance = cal.current.getInstance();
            calendarInstance.prev();
            var m = calendarInstance.getDate().getMonth() + 1;
            var y = calendarInstance.getDate().getFullYear();
            if(m < 10)
                m = "0"+m;
            // var date = y+"-"+m;

            setmonth(m);
            setyear(y)

            // props.readMainCalendar(date)
        }

        
    }, []);

    const TodayButton = useCallback((e) => {
        if (cal !== null) {
        const calendarInstance = cal.current.getInstance();
        calendarInstance.today();
        var m = calendarInstance.getDate().getMonth() + 1;
        var y = calendarInstance.getDate().getFullYear();
        if(m < 10)
            m = "0"+m;
        // var date = y+"-"+m;

        setmonth(m);
        setyear(y)
        }
    }, []);

    return (
        <div>
        <h2 className="calendar-title">{year}년 {month}월의 강의일정</h2>
            <div className="mb15">
                <WhiteButton class="mr15" name="오늘날짜" click={TodayButton}/>
                <WhiteButton class="mr15" name="<" click={PrevButton}/>
                <WhiteButton name=">" click={NextButton}/>
            </div>
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
                onBeforeDeleteSchedule={deleteDate}
                // onBeforeUpdateSchedule={onBeforeUpdateSchedule}
            />
        </div>
    );
}

export default LectureCalendar;