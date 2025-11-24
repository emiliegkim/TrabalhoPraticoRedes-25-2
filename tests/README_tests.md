# Testes de Integração - PatientsOnFIRE

**Responsável:** Mariana Luísa
**Objetivo:** Validar se a API REST do servidor cumpre o contrato definido e a especificação FHIR simplificada.

---

## 📋 Pré-requisitos

Para rodar os testes, você deve preparar o ambiente na pasta de testes:

1. Navegue até a pasta de testes:
   ```bash
   cd tests


2. Criar um arquivo de configuração temporário:
    ```bash
    npm init -y

3. Instale as dependências de desenvolvimento (Jest e Supertest):
    ```bash
    npm install jest supertest

4. Rodar o teste:
    ```bash
    npx jest patient.test.js

-----

## 🚀 Como Rodar os Testes

Estando na pasta `/server`, execute o comando:

```bash
npm test
```


```bash
npx jest ../tests/patient.test.js
```

-----

## ✅ Cobertura dos Testes


### 1\. Criação (POST /Patient)

  - [x] **Sucesso (201):** Verifica se retorna status 201, se gera um `identifier` numérico e se retorna o header `Location`.
  - [x] **Erro (400/422):** Verifica se recusa JSON inválido ou incompleto (ex: falta de `resourceType` ou `name`).

### 2\. Leitura (GET /Patient/:id)

  - [x] **Sucesso (200):** Verifica se retorna o JSON correto do paciente solicitado.
  - [x] **Não Encontrado (404):** Verifica se retorna 404 para IDs inexistentes.

### 3\. Atualização (PUT /Patient/:id)

  - [x] **Sucesso (200):** Verifica se os dados são atualizados corretamente.
  - [x] **Erro de ID (400):** Garante que rejeita a requisição se o ID da URL for diferente do ID no corpo do JSON (`identifier[0].value`).
  - [x] **Não Encontrado (404):** Confirma que o PUT **não cria** novos registros (se não existir, dá erro).

### 4\. Remoção (DELETE /Patient/:id)

  - [x] **Sucesso (204):** Verifica se deleta e retorna "No Content" (sem corpo).
  - [x] **Verificação:** Confirma se um GET subsequente no mesmo ID retorna 404.

### 5\. Listagem (GET /PatientIDs)

  - [x] **Sucesso (200):** Retorna array de IDs `[1, 2, ...]` quando há dados.
  - [x] **Vazio (204):** Retorna status 204 se não houver pacientes cadastrados.

-----

## 🛠 Tecnologias Utilizadas

  - **Jest:** Framework de testes.
  - **Supertest:** Biblioteca para simular requisições HTTP sem precisar abrir o navegador.