import React,{ Component } from 'react';
import '../css/footer.css';

import {saveEvent } from '../logFile'
  

export default function siteFooter ()
{
//   saveNote = () => {
//     // alert("asdf");
//     try {
//         let note = document.getElementById('noteInput').value.trim();
//         // let message = "Note:" + note;
//         saveEvent("Note by Operator: "+note);

//       } catch (error) {
  //         alert( error);
  //       }
  //       // document.getElementById('noteInput').value="";
  // }
  // document.getElementById("noteInput");
  function handleSubmit(e) {
    e.preventDefault();
    try {
      let note = document.getElementById('noteInput').value.trim();
      if(note.length === 0)
      {
        alert("Must enter a note to submit a note");
        return;
      }
      saveEvent("Note by Operator: "+note);
    } catch (error) {
      alert( error);
    }
    document.getElementById('noteInput').value="";
}
document.getElementById("noteInput");        

  // render () 
  // {
    return (
      <div className="footer">
        <footer>
          <div className = "note">
            <form id="noteForm" onSubmit={handleSubmit}>
              <textarea
                id = "noteInput"
                maxLength="1000"
                minLength="1"
                placeholder="Insert note to log file here..."
              />
              {/* <input id="noteSubmitButton" type="submit" value="Submit" onClick={() => {this.saveNote()}}/> */}
              <input id="noteSubmitButton" type="submit" value="Submit"/>
            </form>
          </div>
          <div className = "heap">
            <br />
            Created and maintained by H.E.A.P.
          </div>
        </footer>
      </div>
    );
  // }
}
// export default siteFooter;
