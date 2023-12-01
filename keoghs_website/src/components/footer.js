import React,{ Component } from 'react';
import './footer.css';
import keoghLogo from '../other/placeholder-logo.png'
  

class siteFooter extends Component
{
  render () 
  {
    return (
      <div className="footer">
        <footer>
          <div className = "note">
          <form>
            <textarea
              id = "noteInput"
              placeholder="Insert note..."
              maxlength="1000"
              minlength="1"
            >
              Insert note to log file here...
            </textarea>
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
