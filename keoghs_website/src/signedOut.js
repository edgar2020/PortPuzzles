import { useRef, useEffect } from 'react';
import './css/signedOut.css';
import { saveEvent, signIn } from './logFile';

function SignedOut() {
    
    // useEffect(() => {
    //     const timer = setTimeout(() => closeTab(), 2000);
    //     return () => clearTimeout(timer);
    //   }, []);
    
      // Call setTimeout on user interaction
    //   const timerRef = useRef(null);

    
      useEffect(() => {
        // window.open("/signed-out", "_self", "");
        console.log("Program Closed");
        saveEvent("Program Closed");
        // return () => clearTimeout(timerRef.current);
      }, []);

  return (
    <div id="signedOutPage">
        <div id="signedOutPageContent">
            <h1>Software Signing Out</h1>
            <h2>Happy Holidys!</h2>
            {/* <p><button id='return' className="signedOutButton" onClick={() => sendMessage}>Finish Signing Out</button></p> */}
            <p>You May Now Close the Website</p>
            {/* <iframe
            width="860"
            title=""
            height="484"
            src="/logFiles"
            ></iframe>; */}

        </div>
        {/* Code below is from: https://codepen.io/codeconvey/pen/xRzQay
        used to create the snow fall animation
    */}
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
