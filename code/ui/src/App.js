import './App.css';
import {
  BrowserRouter as Router,
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";

import Landing from './layouts/landing/landing.js'
import Signup from './layouts/signup/signup'
import Login from './layouts/login/login'
import Auth from './layouts/coinbaseAuth/auth'
import Redirecter from './layouts/mailAuth/mailAuth'
import Dash from './layouts/dashboard/dashboard'
import Profile from './layouts/userProfile/profile'
import Simulator from './layouts/chargingSimulator/simulator'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Landing/>} />
            <Route exact path="/login" element={<Login/>} />
            <Route exact path="/signup" element={<Signup/>} />
            <Route exact path="/coinbaseauth/" element={<Auth/>} />
            <Route exact path="/mailauth/:id" element={<Redirecter/>} />
            <Route exact path="/dashboard/:email" element={<Dash/>} />
            <Route exact path="/user/:email" element={<Profile/>} />        
            <Route exact path="/simulator/:address" element={<Simulator/>} /> 

          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
