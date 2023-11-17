// import './css/loadingUnloading.css';
import './css/index.css';
import SiteHeader from './components/header'
import SiteFooter from './components/footer'

import TASK1 from './components/task1Loading'

function loadingUnloading() {
  return (
    <div className="loadingUnloadingContainer">
      <SiteHeader/>
        <TASK1/>
      <SiteFooter/>
    </div>
  );
}

export default loadingUnloading;
