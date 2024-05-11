import './App.css'
import React from 'react';
import AppRoutes from './routes';
import AppProvider from './context/AppContext';

function App() {

  return (
    <>
      <AppProvider> 
        <AppRoutes /> 
      </AppProvider>
    </>
  )
}

export default App
