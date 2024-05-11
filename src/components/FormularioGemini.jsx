import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppContext';
import Loading from './Loading';
import './FormularioGemini.css'

function FormularioGemini() {
  const [endpoint, setEndpoint] = useState('');
  const [momento, setMomento] = useState('Primeiro emprego'); // Valor inicial
  const [profissao, setProfissao] = useState('');
  const [desafios, setDesafios] = useState('');
  const [tempoPlanejamento, setTempoPlanejamento] = useState('');
  const [cursosRealizados, setCursosRealizados] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const navigate = useNavigate();
  const { setDataReady } = useAppData();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Construa o endpoint com base nos dados do formulário
    const endpointCompleto = `${momento} na minha carreira. Desejo ser ${profissao}. Meus desafios são: ${desafios}. Me planejando há ${tempoPlanejamento}. ${cursosRealizados}. Observações: ${observacoes}`;
    setEndpoint(endpointCompleto); // Atualize o estado do endpoint
  };

  useEffect(() => {
    if (endpoint) { 
      setIsLoading(true);

      fetch(`http://127.0.0.1:5000/dados_gemini?endpoint=${endpoint}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setDataReady(true);
          navigate('/response');
        })
        .catch(error => {
          console.error('Erro ao obter dados:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [endpoint]); 

  return (
    <>
      {isLoading ? ( // Renderiza o Loading se isLoading for true
          <Loading />
        ) : (
          <form onSubmit={handleSubmit}>
            <h1 className='titleForm'>💡 AjudAI 🚀</h1>
            Momento de Carreira:
            <select value={momento} onChange={(e) => setMomento(e.target.value)}>
              <option value=""></option>
              <option value="Primeiro Emprego">Primeiro Emprego</option>
              <option value="Transição de Carreira">Transição de Carreira</option>
              <option value="Progressão de Carreira">Progressão de Carreira</option>
              <option value="Recolocação">Recolocação</option>
            </select>
            Profissão Desejada:
            <input 
              type="text" 
              value={profissao} 
              onChange={(e) => setProfissao(e.target.value)} 
            />

            Principais Desafios:
            <input 
              type="text" 
              value={desafios} 
              onChange={(e) => setDesafios(e.target.value)} 
            />

            Tempo de Planejamento:
            <input 
              type="text" 
              value={tempoPlanejamento} 
              onChange={(e) => setTempoPlanejamento(e.target.value)} 
            />

            Cursos Realizados:
            <textarea 
              value={cursosRealizados} 
              onChange={(e) => setCursosRealizados(e.target.value)} 
            />

            Observações:
            <textarea 
              value={observacoes} 
              onChange={(e) => setObservacoes(e.target.value)} 
            />

            <button type="submit">Obter Dados</button>
          </form>
        )
      }
    </>
  );
}

export default FormularioGemini;