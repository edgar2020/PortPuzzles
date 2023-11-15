import './css/homePage.css';
import SiteHeader from './components/header'
import HomeOptions from './components/homeOptions'

function homePage() {
  return (
    <div className="homePage">
        <SiteHeader/>
        <HomeOptions/>
    </div>
  );
}

export default homePage;
