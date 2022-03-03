import React, { useCallback, useRef, useEffect, useState } from "react";
import axios from 'axios';
import TUICalendar from "@toast-ui/react-calendar";


import "tui-calendar/dist/tui-calendar.css";
import "tui-date-picker/dist/tui-date-picker.css";
import '../../../assets/css/calendar.css';
import "tui-time-picker/dist/tui-time-picker.css";
import WhiteButton from '../../modules/button/white_button';

// const start = new Date();
// const end = new Date(new Date().setMinutes(start.getMinutes() + 30));
const calendarColor = ["#ef6f87","#e49d5a", "#e4ce5a", "#7ddc8b" ,"#c0afff","#9fcae8","#F23DA0", "#3C5FA6", "#F28705", "#467326", "#D99066", "#ff5722"];
// const calendarInstructor = ["#ef6f87","#e49d5a", "#2196f3", "#7ddc8b" ,"#c0afff","#9fcae8","#F23DA0", "#3C5FA6", "#F28705", "#467326", "#D99066", "#ff5722"];


function CommonCalendar(props) {
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
            
            if(props.path !== null && props.path ==="/admin/academy_date") {
                for(var i=0 ; i<data.length ; i++) {
                    tempSchedule.push({
                        calendarId: data[i].category_id,
                        category: "time",
                        isAllDay: true,
                        isVisible: true,
                        title: data[i].name,
                        id: data[i].id,
                        start: data[i].date,
                        end: data[i].date
                    })
                }

                setschedules(tempSchedule);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.calendarData])

    useEffect(() => {
        if(props.categoryData !== null) {
            var data = props.categoryData;
            var tempCalendar = [];
            var index = 0;

            for(var i=0 ; i<data.length ; i++) {
                tempCalendar.push({
                    id: data[i].id,
                    name: data[i].name,
                    color: calendarColor[index],
                    bgColor: calendarColor[index]+"40",
                    dragBgColor: calendarColor[index]+"40",
                    borderColor: calendarColor[index]
                })
                index++;
                if(index === calendarColor.length)
                        index=0;
            }
            setcalendars(tempCalendar);
        }
        
    }, [props.categoryData])


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

    const createAcademy = async(data) => {
        var date = data.start._date
        var year = date.getFullYear(); 
        var month = date.getMonth() + 1; 
        var day = date.getDate();
        if(month < 10)
            month = "0"+month;
        if(day < 10)
            day = "0"+day;
        var academy_date = year+"-"+month+"-"+day
        
        var params = new URLSearchParams();
        params.append('name', data.title);
        params.append('date', academy_date);
        params.append('category_id', data.calendarId);
        params.append('token', window.sessionStorage.getItem('token'));
        params.append('manageID', window.sessionStorage.getItem('id'));

        const response = await axios.post(
        process.env.REACT_APP_RESTAPI_HOST + 'academyDate',
        params,
        ).then(function(res) {
            props.readAcademy();
        });
    }

    const updateAcademy = async(e) => {
        const { schedule, changes } = e;


        var date = schedule.start._date
        var changeCategoryId = schedule.calendarId;
        var changeTitle = schedule.title;


        if(changes.hasOwnProperty('start'))
            date = changes.start._date;
        if(changes.hasOwnProperty('calendarId'))
            changeCategoryId = changes.calendarId
        if(changes.hasOwnProperty('title'))
            changeTitle = changes.title;
      
        var year = date.getFullYear(); 
        var month = date.getMonth() + 1; 
        var day = date.getDate();
        if(month < 10)
            month = "0"+month;
        if(day < 10)
            day = "0"+day;
        var changeDate = year+"-"+month+"-"+day

        
        var updateAcademy = {
            id: schedule.id,
            name: changeTitle,
            date: changeDate,
            category_id: changeCategoryId,
            token: window.sessionStorage.getItem('token'),
            manageID: window.sessionStorage.getItem('id')
        }
        axios(
            {
                url: process.env.REACT_APP_RESTAPI_HOST+'academyDate',
                method: 'put',
                data: updateAcademy
            }
        ).then(function(res) {
            props.readAcademy()
        })
    }

    const deleteAcademy = async(id) => {
        if(window.confirm("학사일정을 삭제하시겠습니까?")) {
            axios(
                {
                    url: process.env.REACT_APP_RESTAPI_HOST+'academyDate',
                    method: 'delete',
                    data: {
                        id: id,
                        token: window.sessionStorage.getItem('token'),
                        manageID: window.sessionStorage.getItem('id')
                    }
                }
            ).then(function(res) {
                props.readAcademy()
            })
        }
    }

    const onBeforeCreateSchedule = useCallback((scheduleData) => {
        if(window.confirm("학사 일정을 추가하시겠습니까?")) {
            createAcademy(scheduleData)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onBeforeDeleteSchedule = useCallback((res) => {
        // eslint-disable-next-line no-unused-vars
        const { id, calendarId } = res.schedule;
        deleteAcademy(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onBeforeUpdateSchedule = useCallback((e) => {
        if(window.confirm("일정을 수정하시겠습니까?")) {
            updateAcademy(e)
        }
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
        <h2 className="calendar-title">{year}년 {month}월의 학사일정</h2>
            <div className="mb15">
                <WhiteButton class="mr15" name="오늘날짜" click={TodayButton}/>
                <WhiteButton class="mr15" name="<" click={PrevButton}/>
                <WhiteButton name=">" click={NextButton}/>
            </div>

            <div style={{textAlign:"right", marginBottom:"15px"}}>
                {props.categoryData !== null ? 
                props.categoryData.map((category, index) => {
                    return <span key={category.id} className="mr15">
                                <span className="color-circle" style={{background:calendarColor[index]}}></span>
                                <span>{category.name}</span>
                            </span>
                }):
                null
                }
            </div>
            
            <TUICalendar
                ref={cal}
                height="100%"
                view="month"
                useCreationPopup={true}
                useDetailPopup={true}
                template={templates}
                calendars={calendars}
                schedules={schedules}
                onClickSchedule={onClickSchedule}
                onBeforeCreateSchedule={onBeforeCreateSchedule}
                onBeforeDeleteSchedule={onBeforeDeleteSchedule}
                onBeforeUpdateSchedule={onBeforeUpdateSchedule}
            />
        </div>
    );
}

export default CommonCalendar;