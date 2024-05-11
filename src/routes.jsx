import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import FormularioGemini from './components/FormularioGemini'
import Response from './components/Response'

function AppRoutes() {
    return (
    <>
    <BrowserRouter>
          <Routes>
            <Route path='/' element={<FormularioGemini />}/>
            <Route path='/response' element={< Response />}/>
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default AppRoutes;
