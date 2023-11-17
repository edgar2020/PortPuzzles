import React,{ Component } from 'react';
import './tasks.css';

const States = {
    INIT: 0,
    SECOND: 1,
    THIRD: 2
  };
  class task1Loading extends Component {
    state = {
      current: States.INIT
    };
    transition(to) {
      this.setState({current: to});
    }
    render() {
      switch(this.state.current) {
        case States.SECOND:
          return this.renderSecond();
        case States.THIRD:
          return this.renderThird();
        case States.INIT:
        default:
          return this.renderInit();
      }
    }
    renderInit() {
      return (
        <button onClick={() => this.transition(States.SECOND)}>
          Go to state 2
        </button>
      );
    }
    renderSecond() {
      return (
        <button onClick={() => this.transition(States.THIRD)}>
          Go to state 3
        </button>
      );
    }
    renderThird() {
      return (
        <button onClick={() => this.transition(States.INIT)}>
          Go back to the initial state
        </button>
      );
    }
  }

  export default task1Loading;