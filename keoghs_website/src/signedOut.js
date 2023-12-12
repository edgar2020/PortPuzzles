import './css/signedOut.css';
import { saveEvent } from './logFile';

function SignedOut() {
  return (
    <div id="signedOutPage">
        <div id="signedOutPageContent">
            <h1>Software Signed Out</h1>
            <h2>Happy Holidys!</h2>
            <p>Sign back in: <button id='return' className="signedOutButton" onClick={(e)=> this.endOfYearSignOut(e)}>Sign-In</button></p>
            <iframe
            width="860"
            height="484"
            src="/logFiles"
            ></iframe>;

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
