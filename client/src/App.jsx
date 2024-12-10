import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Main from './components/Main/Main'
import Header from './components/Header/Header';
import '@fortawesome/fontawesome-free/css/all.css';



function App() {
 

  return (

    <>
    <Header />
    <Main />
    </>
  )

}

export default App;



