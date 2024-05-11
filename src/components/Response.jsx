import React, { useState, useEffect } from 'react';
import {NavLink, useLocation } from 'react-router-dom'
import { useAppData } from '../context/AppContext';
import './Response.css'

function Response() {
  const [lastResponse, setLastResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { dataReady } = useAppData();
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    try {
      fetch('http://127.0.0.1:5000/gemini_responses')
        .then(response => response.json())
        .then(data => {
            setLastResponse({
                resposta: (data[0].resposta)
            });
        })
        .catch(error => {
          console.error('Erro ao buscar dados:', error);
        })
        .finally(() => setIsLoading(false));
    } catch (error) {
      console.error('Erro inesperado:', error);
      setIsLoading(false);
    }
  }, [dataReady]);
  return (
    <>
    <NavLink to="/" className= "link">Voltar</NavLink>
      {isLoading ? (
        'Carregando...'
      ) : (
        <>
          {lastResponse && (
            <div className='container'>
                {lastResponse.resposta.map((item, index) => {
                    console.log(item.tipo)
                  switch (item.tipo) {
                    case 'titulo':
                      return <h1>{item.conteudo}</h1>
                    case 'subtitulo':
                      return <h2>{item.conteudo}</h2>
                    case 'paragrafo':
                      return <p>{item.conteudo}</p>
                    default:
                      return null;
                  }
                })}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Response;