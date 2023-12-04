import React,{ Component } from 'react';
import './footer.css';
import keoghLogo from '../other/placeholder-logo.png'

import {saveEvent } from '../logFile'
  

class siteFooter extends Component
{
  saveNote = () => {
    // alert("asdf");
    try {
        let note = document.getElementById('noteInput').value.trim();
        // let message = "Note:" + note;
        saveEvent("Note by Operator: "+note);
        
      } catch (error) {
        alert( error);
      }
      // document.getElementById('noteInput').value="";
}
  
  render () 
  {
    return (
      <div className="footer">
        <footer>
          <div className = "note">
            <form id="noteForm">
              <textarea
                id = "noteInput"
                maxLength="1000"
                minLength="1"
                placeholder="Insert note to log file here..."
              />
              <input id="noteSubmitButton" type="submit" value="Submit" onClick={() => {this.saveNote()}}/>
            </form>
          </div>
          <div className = "heap">
            <br />
            Created and maintained by H.E.A.P.
          </div>
        </footer>
      </div>
    );
  }
}
export default siteFooter;
