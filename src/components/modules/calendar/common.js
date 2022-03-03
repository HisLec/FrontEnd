import React, { useCallback, useRef, useEffect, useState } from "react";

import TUICalendar from "@toast-ui/react-calendar";

import "tui-calendar/dist/tui-calendar.css";
import "tui-date-picker/dist/tui-date-picker.css";
import '../../../assets/css/calendar.css';
import "tui-time-picker/dist/tui-time-picker.css";
import WhiteButton from '../../modules/button/white_button';

const calendarColor = ["#000000","#e49d5a", "#e4ce5a", "#4285f4" ,"#c0afff","#9fcae8","#F23DA0", "#3C5FA6", "#F28705", "#467326", "#D99066", "#ff5722"];

function CommonCalendar(props) {
    const cal = useRef(null);
    const [schedules, setschedules] = useState([])
    const [calendars, setcalendars] = useState([])
    const [year, setyear] = useState(null)
    const [month, setmonth] = useState(null)
    const [calendarDates, setcalendarDates] = useState(null);


    useEffect(() => {
        if (cal !== null) {
            const calendarInstance = cal.current.getInstance();
            calendarInstance.today();
            var m = calendarInstance.getDate().getMonth() + 1;
            var y = calendarInstance.getDate().getFullYear();
            if(m < 10)
                m = "0"+m;
            //var date = y+"-"+m;

            setmonth(m);
            setyear(y);
        }
    }, [])

    useEffect(() => {
        if(props.resultDates !== null) {
            setcalendarDates(props.resultDates);
        }
    }, [props.resultDates])


    useEffect(() => {
        var dateData = [];
        schedules.forEach(element => {
            if(element.calendarId === 1)
                dateData.push(element.start);
        });
        props.setdateData(dateData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [schedules])

    useEffect(() => {
        if(calendarDates !== null) {
            var tempSchedule = [];
            var tempCalendar = [];
            calendarDates.forEach((date, index) => {
                tempSchedule.push({
                    calendarId: 1,
                    category:"time",
                    isAllDay: true,
                    isVisible: true,
                    title: '강의'+(index+1),
                    id: index+1,
                    start: date,
                    end: date
                })
            });

            if(props.academyDates !== null) {
                // var academy_id = tempSchedule[tempSchedule.length-1].id;
                props.academyDates.forEach((data, index) => {
                    tempSchedule.push({
                        calendarId: 2,
                        isAllDay: true,
                        isVisible: true,
                        category: "time",
                        isReadOnly: true,
                        title: data.name,
                        id: 0,
                        start: data.date,
                        end: data.date
                    })
                    // academy_id++;
                });
            }
            setschedules(tempSchedule);

            tempCalendar.push({
                id: 1,
                name: "강의 시간",
                color: calendarColor[3],
                bgColor: calendarColor[3]+"40",
                dragBgColor: calendarColor[3]+"40",
                borderColor: calendarColor[3]
            });
            tempCalendar.push({
                id: 2,
                name: "학사 일정",
                color: calendarColor[0],
                bgColor: calendarColor[0]+"40",
                dragBgColor: calendarColor[0]+"40",
                borderColor: calendarColor[0]
            })
            setcalendars(tempCalendar);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [calendarDates])

    const addLectureDate = (data) => {
        var index = 0;
        schedules.forEach(element => {
            if(element.id > index)
                index = element.id;
        });
        var date = data.start;
        var year = date.getFullYear(); 
        var month = date.getMonth() + 1; 
        var day = date.getDate();
        if(month < 10)
            month = "0"+month;
        if(day < 10)
            day = "0"+day;
        var lecture_date = year+"-"+month+"-"+day
        
        const addSchedule = {
            calendarId: 1,
            category:"time",
            isAllDay: true,
            isVisible: true,
            title: '강의'+(index+1),
            id: index+1,
            start: lecture_date,
            end: lecture_date
        };
        setschedules(schedules.concat(addSchedule));
    }

    const deleteLecture = (res) => {
        setschedules(schedules.filter((e) => (e.id !== res.schedule.id)))
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

            setmonth(m);
            setyear(y);

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
        
        <h2 className="calendar-title">{year}년 {month}월</h2>
       
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
                onBeforeCreateSchedule={addLectureDate}
                onBeforeDeleteSchedule={deleteLecture}
                // onBeforeUpdateSchedule={updateLecture}
            />
        </div>
    );
}

export default CommonCalendar;