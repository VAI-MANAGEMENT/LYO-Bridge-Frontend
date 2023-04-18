
import React, { useState, useEffect } from "react";
function Timer({timerDate, timerType}) {
  const [timer, setTimer] = useState();
  const [days, setDays] = useState();
  const [hours, setHours] = useState();
  const [minitues, setMinitues] = useState();
  const [seconds, setSeconds] = useState();
  // const [currentDate, setCurrentDate] = useState();


  useEffect(() => {   

    if(timerDate){
      getWaitingTime();
    }   
 
  }, [timerDate]);

  // function getCurrentDate() {
   
  //   setCurrentDate(newDate);
  // }

  var inervalTime = null;

  const getWaitingTime = () => {
   if(timerDate){


    inervalTime = setInterval(function () {

      let currentDate = new Date().getTime();

      let newDate2 = new Date(timerDate).getTime();
      let dif = newDate2 - currentDate;
      // console.log(currentDate, newDate2)
      var days = Math.floor(dif / (1000 * 60 * 60 * 24));
      days = days.toString();
      days = days.padStart(2, "0")
      var hours = Math.floor((dif % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      hours = hours.toString();
      hours = hours.padStart(2, "0")
      var minutes = Math.floor((dif % (1000 * 60 * 60)) / (1000 * 60));
      minutes = minutes.toString();
      minutes = minutes.padStart(2, "0")
      var seconds = Math.floor((dif % (1000 * 60)) / 1000);
      seconds = seconds.toString();
      seconds = seconds.padStart(2, "0")
    
      let returnTimer =
        days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

      if (dif < 0) {
        clearInterval(inervalTime);   
        // console.log("returnTimer", returnTimer)     
        setTimer(null);
      } else {
        // console.log("returnTimer", returnTimer)
        setTimer(returnTimer);
        setDays(days);
        setHours(hours);
        setMinitues(minutes);
        setSeconds(seconds);
      }
    }, 1000);

    // return timer;
    // console.log("current", newDate2)
   }
   
  };

 

    return (
     <>
      {timerType == 'start' ? 
      <label className="timer">{timer != null ? <><span>{days}</span> : <span>{hours}</span> : <span>{minitues}</span> : <span>{seconds}</span></> : 'Started' }</label> 
      : 
      <label className="timer">{timer != null ? <><span>{days}</span> : <span>{hours}</span> : <span>{minitues}</span> : <span>{seconds}</span></> : 'Ended' }</label>}
      
     </>
    
    );
  }
  
  export default Timer;
  