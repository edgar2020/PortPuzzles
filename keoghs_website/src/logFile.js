
import React, { useState } from "react";
import db from './firebase';
import {Timestamp} from 'firebase/firestore'


function getCurrentLogFile()
{
    let year = new Date().getFullYear();
    return "Keoghs_Port_"+ year;
}

// function createTimestamp()
// {
//     var date = new Date();
//     var year = date.getFullYear();
//     var month = date.getMonth() + 1;
//     var day = date.getDate();
//     var hh = date.getHours();
//     var mm = date.getMinutes();
//     let curDate = ((month < 10 ? "0" + month : month)+'/'+
//                    (day < 10 ? "0" + day : day) +'/'+
//                    (year%1000) + ' '+ 
//                    (hh < 10 ? "0" + hh : hh) + ':'+
//                    (mm < 10 ? "0" + mm : mm));
//     // let unixTime = Date.parse(curDate);
//     return  curDate;
//     // return new Timestamp.fromDate(unixTime);
//     // return  Timestamp.fromDate(date);

// };


export function saveEvent(m)
{   
    // let timestamp = createTimestamp();

    db.collection(getCurrentLogFile()).add({
        timestamp:  Timestamp.fromDate(new Date()),
        message: m,
    });
}