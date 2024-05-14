
import google.generativeai as genai
import requests
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_cors import cross_origin
from pymongo import MongoClient
# from pymongo.errors import ConnectionFailure, WriteError


# Configuração do MongoDB
client = MongoClient('mongodb://localhost:27017/')  # Conecção MongoDB
db = client['gemini_db']  # Selecione o banco de dados
collection = db['respostas']  # Selecione a coleção

<<<<<<< HEAD
# Coloque sua API key
genai.configure(api_key='AIzaSyDx-ef08Pa6IyLvSHEPhg5jRCaoD4tXhCw')
=======
genai.configure(api_key='API_KEY') # Substitua pela sua chave de API
>>>>>>> bf8f4dd45eed7e480597f2f5c110784a3953833e
model = genai.GenerativeModel('models/gemini-1.5-pro-latest')
app = Flask(__name__)

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['CORS_RESOURCES'] = {r"/dados_gemini":
                                {"origins": "http://localhost:5173"}}
CORS(app, resources=app.config['CORS_RESOURCES'])

instrucoes = """
## Instrução:
* Formate a resposta como uma lista de objetos JSON.
* Cada objeto deve ter duas chaves: "tipo" e "conteudo".
* Use os seguintes valores para a chave "tipo": "titulo", "subtitulo" ou "paragrafo".
* A chave "conteudo" deve conter o texto correspondente ao tipo.

## Contexto:
* No momento estou em busca de:
"""

instrucoes2 = """
## Instrução:
* Reavalie a resposta antes e forneça um direcionamento sobre como se destacar no mercado.
* indique cursos, livros ou materiais de apoio para atingir o objetivo, com links de videos de aulas, por exemplo.
* Seja motivador, passe confiança e seja amigável e se possivel adicionar emogis nos titulos e subtitulos.
"""


def consumir_gemini_api(endpoint, params=None):
    consulta = instrucoes + endpoint + instrucoes2
    print(consulta)
    try:
        response = model.generate_content(consulta)

        print(f"Resposta do Gemini: {response.text}")

        if response.text:
            try:
                # Remover prefixo e sufixo
                json_str = response.text.strip()
                if json_str.startswith("```json\n") and json_str.endswith("```"):
                    json_str = json_str[len("```json\n"):-3]

                data2 = json.loads(json_str)  # Converte a resposta para JSON

                data = {"resposta": data2}
                result = collection.insert_one(data)
                print(result.inserted_id)  # Verificar se o doc foi inserido

                return response.text
            except json.JSONDecodeError as e:
                print(f"Erro ao analisar JSON: {e}")
                return jsonify({"erro": "Resposta da API não é um JSON válido."}), 500
        else:
            print("Erro: Resposta do Gemini está vazia.")
            return jsonify({"erro": "Resposta da API está vazia."}), 500

    except requests.exceptions.RequestException as e:
        print(f"Erro ao consumir a API Gemini: {e}")
        return None


@app.route("/dados_gemini")
@cross_origin(origins='http://localhost:5173')
def obter_dados_gemini():
    endpoint = request.args.get("endpoint")
    print(endpoint)
    params = request.args.to_dict()
    if not endpoint:
        return jsonify({"erro": "Endpoint não especificado."}), 400

    dados = consumir_gemini_api(endpoint, params)
    print(dados)

    if isinstance(dados, tuple):  # Verifica se dados é uma tupla (erro)
        return dados

    # Extrai o texto da resposta do Gemini
    if dados is not None:
        texto_resposta = dados
    else:
        texto_resposta = ""

    return jsonify({"dados": texto_resposta})  # Retorna o texto como JSON


@app.route('/gemini_responses')
@cross_origin(origins='http://localhost:5173')
def get_gemini_responses():
    data = collection.find_one(sort=[('_id', -1)])  # Obter o último documento
    if data:
        data['_id'] = str(data['_id'])  # Converter ObjectId para string
        return jsonify([data])
    else:
        return jsonify([])


if __name__ == "__main__":
    app.run(debug=True)
