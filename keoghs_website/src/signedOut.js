import './css/signedOut.css';

function SignedOut() {
  return (
    <div id="signedOutPage">
        <div id="signedOutPageContent">
            <h1>Software Signed Out</h1>
            <h2>Happy Holidys!</h2>
            <p>Download LogFile: <button id='return' className="signedOutButton" onClick={(e)=> this.endOfYearSignOut(e)}>Download</button></p>
            <p>Sign back in: <button id='return' className="signedOutButton" onClick={(e)=> this.endOfYearSignOut(e)}>Sign-In</button></p>

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
