import './css/homePage.css';
import SiteHeader from './components/header'
import HomeOptions from './components/homeOptions'
import SiteFooter from './components/footer'

function homePage() {
  return (
    <div className="homePage">
        <SiteHeader/>
        <HomeOptions/>
        <SiteFooter/>
      <h1>Home Page</h1>

    </div>
  );
}

export default homePage;
