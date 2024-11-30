import './App.css';
import Login from './Compnant/LOGIN/login/Login';
import Register from './Compnant/LOGIN/register/risgter';
import DashBoard from './Compnant/DashBoard/DashBoard';
import GroupsList from './Compnant/Group/GroupList.js';
import GroupDetail from './Compnant/Group/GroupDetial.js';


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes> 
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/GroupsList" element={<GroupsList />} />
        <Route path="/Group/:id" element={<GroupDetail />} />

      </Routes>
    </Router>
  );
}

export default App;

