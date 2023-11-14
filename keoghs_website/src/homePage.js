import './css/homePage.css';
import loadUnload from "./loadingUnloading";
import weight from "./weightBalancing";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function homePage() {
  return (
    <div className="App">
      <h1>Home Page</h1>
    </div>
  );
}

export default homePage;
