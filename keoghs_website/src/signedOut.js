import { useRef, useEffect } from 'react';
import './css/signedOut.css';
import { saveEvent, signIn } from './logFile';

function SignedOut() {
    
      useEffect(() => {
        console.log("Program Closed");
        saveEvent("Program Closed");
      }, []);

  return (
    <div id="signedOutPage">
        <div id="signedOutPageContent">
            <h1>Software Signing Out</h1>
            <h2>Happy Holidys!</h2>
            <p>You May Now Close the Website</p>
            <iframe
            width="860"
            title=""
            height="484"
            src="/logFiles"
            ></iframe>

        </div>
        <div className="snowflakes" aria-hidden="true">
            <div className="snowflake">
            ❅
            </div>
            <div className="snowflake">
            ❅
            </div>
            <div className="snowflake">
            ❆
            </div>
            <div className="snowflake">
            ❄
            </div>
            <div className="snowflake">
            ❅
            </div>
            <div className="snowflake">
            ❆
            </div>
            <div className="snowflake">
            ❄
            </div>
            <div className="snowflake">
            ❅
            </div>
            <div className="snowflake">
            ❆
            </div>
            <div className="snowflake">
            ❄
            </div>
        </div>
    </div>
  );
}
export default SignedOut;
