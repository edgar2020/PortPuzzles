import './css/homePage.css';
import SiteHeader from './components/header'
import HomeOptions from './components/homeOptions'
import SiteFooter from './components/footer'

function homePage() {
  return (
    <div className="homePage">
        <SiteHeader value={"Move Generator"} signOut={true}/>
        <HomeOptions/>
        <SiteFooter/>
    </div>
  );
}
export default homePage;
