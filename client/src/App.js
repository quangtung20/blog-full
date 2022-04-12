import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom'
import {DataProvider} from './GlobalState'
import Header from './components/headers/Header'
import MainPages from './components/mainpages/Pages'
import Footer from './components/footers/Footer';
import axios from 'axios'


function App() {
  axios.defaults.withCredentials=true;
  return (
    <DataProvider>
      <Router>
        <div className="App">
          <Header />
          <MainPages />
          {/* <Footer/> */}
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
