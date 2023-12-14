import React,{ Component } from 'react';
import '../css/homeOptions.css';
import '../css/tasks.css'

import PDF1 from '../other/Instructionional_guide.pdf'

class SiteHeader extends Component
{
  render () 
  {
    return (  
      <div id='homeOptions' className='page'>
        <h2>Options</h2>
        
        <a href="/LoadUnload"><button id="load-unload">Load and Unload</button></a>
        <a href="/Weight"><button id="weight-balancing">Weight Balancing</button></a>
        <a href={PDF1} target="_blank"
                    rel="noreferrer"><button id="helpButton">Help</button></a>
      </div>
    )
  }
}
export default SiteHeader;
