import './css/homePage.css';
import SiteHeader from './components/header'
import HomeOptions from './components/homeOptions'
import SiteFooter from './components/footer'

function pageNotFound() {
  return (
    <div className="pageNotFound">
        <h1>404: Page Not Found</h1>
        <a href='/'><button>Return to Home Page</button></a>
    </div>
  );
}
export default pageNotFound;
