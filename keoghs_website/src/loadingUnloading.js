// import './css/loadingUnloading.css';
import './css/index.css';
import SiteHeader from './components/header'
import SiteFooter from './components/footer'

function loadingUnloading() {
  return (
    <div className="loadingUnloadingContainer">
      <SiteHeader/>
      <h1>loading and Unloading</h1>
      <SiteFooter/>
    </div>
  );
}

export default loadingUnloading;
