import { Component } from 'react';
import './App.css';
import Router from './components/router/Router';
import { BrowserRouter } from 'react-router-dom';




class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

    <BrowserRouter>
      <div className="App">

        <Router/>

      </div>
    </BrowserRouter>
      
    );
  }
}

export default App;




