// import './css/loadingUnloading.css';
import './css/index.css';
import SiteHeader from './components/header'
import SiteFooter from './components/footer'

import TASK1 from './components/task1Loading/task1Loading'

function loadingUnloading() {
  return (
    <div className="loadingUnloadingContainer">
      <SiteHeader value={"Loading & Unloading"}/>
        <TASK1/>
        <br></br>
        <br></br>
        <br></br>
      <SiteFooter/>
    </div>
  );
}

export default loadingUnloading;
