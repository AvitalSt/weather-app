import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Weather from './components/weather'
import Login from './components/login';
import Register from './components/register';
import FavoriteCities from './components/FavoriteCities';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Weather />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/favorites" element={<FavoriteCities />} />
      </Routes>
    </Router>
  );
}

export default App;
