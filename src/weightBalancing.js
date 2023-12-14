import './css/loadingUnloading.css';
import SiteHeader from './components/header'
import SiteFooter from './components/footer'

import TASK2 from './components/task2Weight/task2Weight'
function weightBalancing() {
  return (
    <div className="weightBalancingContainer">
      <SiteHeader value={"Weight Balancing"}/>
      <TASK2/>
      <SiteFooter/>
    </div>
  );
}

export default weightBalancing;
