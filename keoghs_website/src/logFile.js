
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

export function saveEvent(m)
{   
    try {
        console.log("saveEvent");
        db.collection(getCurrentLogFile()).add({
            time_stamp:  Timestamp.fromDate(new Date()),
            message: m,
        });
        
    } catch (error) {
        console.log(error);
    }
}
export async function signOut()
{  

    try {
        console.log("signOut");
        //     const querySnapshot = await db.collection(getCurrentLogFile()).get()
        //     if (!querySnapshot.empty) {
            
            let out = (await db.collection('curUser').doc('1').get()).data().name
            //if no user currently signed in
        saveEvent(out + " logged out");
        db.collection('curUser').doc('1').update({
            name: "No One Logged in to loggout",
        });
        // saveEvent(name + " logged in");
    } catch (error) {
        console.log(error);
        
    }
}

export async function signIn(name)
{
    try {
        // const querySnapshot = await db.collection(getCurrentLogFile()).get()
        // if (querySnapshot.empty) { 
            console.log("signIn");   
            let out = (await db.collection('curUser').doc('1').get()).data().name
            //if no user currently signed in
            // if(out === "No One Logged in to loggout")
            // {
            //     saveEvent(out);
            // }
            // else
            // {
                saveEvent(out + " logged out");
            // }
            db.collection('curUser').doc('1').update({
                name: name,
            });
            saveEvent(name + " logged in");
            // console.log("Name "+ name );
        // }
    } catch (error) {
        console.log(error); 
    }
}

const LogPage = () =>
{
    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState([]);
 
    useEffect(() => {
        try {
            const getEntriesFromFirebase = [];
            const subscriber = db
            .collection(getCurrentLogFile()).orderBy("time_stamp")
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
            //   console.log(getEntriesFromFirebase);
            // return cleanup function
            return () => subscriber();
        
        } catch (error) {
            console.log(error); 
        }
    }, [loading]); // empty dependencies array => useEffect only called once
 
      const downloadTxtFile = () => {
        const element = document.createElement("a");
        const file = new Blob([document.getElementById('logFileTableBody').innerText],    
                    {type: 'text/plain;charset=utf-8'});
        element.href = URL.createObjectURL(file);
        element.download = getCurrentLogFile()+".txt";
        document.body.appendChild(element);
        element.click();
      }
 
    return (
        <div id="logFilePage">
            <div id="logFileContainer">
                <h3 id = "logFileHeader">Log File for {new Date().getFullYear()}<button id="downloadLogFile" onClick={downloadTxtFile}>Download</button></h3>
                
                <div id="logFileTableContainer">
                    <table id="logFileTable">
                        <thead>
                            <tr>
                                <th width="175px" id="timeStampTableHeader" className="logFileTableHeader timestamp">Timestamp</th>
                                <th id="messageTableHeader" className="logFileTableHeader message">Message</th>
                            </tr>
                        </thead>
                        <tbody id="logFileTableBody">
                            {entries.map((entry) => 
                            <tr>
                                <td key={entry.id} className="logInput timestamp">{getFormatedDate(entry.time_stamp.toDate())} </td>
                                <td key={entry.id} className="logInput message">{entry.message}</td>
                            </tr> )
                            }
                        </tbody>
                    </table>
                </div>
                {/* <button onClick={this.downloadTxtFile}>Download</button>  */}
            </div>
        </div>
    );
}
export default LogPage
