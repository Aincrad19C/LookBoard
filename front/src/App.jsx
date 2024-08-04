import React from 'react';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import ProjectPage from './pages/ProjectPage'
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/ProjectPage" element = {<ProjectPage />} />
          <Route path="/home" element={<Home />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;