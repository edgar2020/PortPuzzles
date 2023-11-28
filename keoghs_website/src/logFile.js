
import React, { Component, useEffect, useState  } from "react";
import db from './firebase';
import {Timestamp} from 'firebase/firestore'
import './css/log.css' 

function getCurrentLogFile()
{
    let year = new Date().getFullYear();
    return "Keoghs_Port_"+ year;
}

function getFormatedDate(date)
{
    var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hh = date.getHours();
        var mm = date.getMinutes();
        let curDate = ((month < 10 ? "0" + month : month)+'/'+
                       (day < 10 ? "0" + day : day) +'/'+
                       (year%1000) + ' '+ 
                       (hh < 10 ? "0" + hh : hh) + ':'+
                       (mm < 10 ? "0" + mm : mm));
        return "["+curDate+"]";
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
    db.collection(getCurrentLogFile()).add({
        time_stamp:  Timestamp.fromDate(new Date()),
        message: m,
    });
}


const LogPage = () =>
{
    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState([]);
 
    useEffect(() => {
        const getEntriesFromFirebase = [];
        const subscriber = db
          .collection(getCurrentLogFile())
          .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                getEntriesFromFirebase.push({
                ...doc.data(), //spread operator
                key: doc.id, // `id` given to us by Firebase
              });
            });
            setEntries(getEntriesFromFirebase);
            setLoading(false);
          });
          console.log(getEntriesFromFirebase);
        // return cleanup function
        return () => subscriber();
      }, [loading]); // empty dependencies array => useEffect only called once
 

 
    return (
        <div className="">
           
            <div className="">
                <table>
                    <tr>
                        <th>Timestamp</th>
                        <th>Message</th>
                    </tr>
 
                    {entries.map((entry) => 
                    <tr>
                        {/* {entry.timestamp} */}
                        {/* <td key={entry.id} className="tg-0lax">{entry.time_stamp}</td> */}
                        <td key={entry.id} className="tg-0lax">{getFormatedDate(entry.time_stamp.toDate())}: </td>
                        <td key={entry.id} className="tg-0lax">{entry.message}</td>
                    </tr> )
                }
                </table>
            </div>
        </div>
    );
}
export default LogPage
