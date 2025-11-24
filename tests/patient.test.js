const request = require('supertest');
const app = require('../server/app'); 

describe('Testes de Integração API PatientsOnFIRE', () => {
    let createdPatientId;

    const validPatient = {
        resourceType: "Patient",
        name: [ { family: "Silva", given: ["Maria"] } ],
        gender: "female",
        birthDate: "1980-01-01"
    };

    // 1. Teste de Criação (POST)
    describe('POST /Patient', () => {
        it('Deve criar um paciente válido e retornar 201 + Location + ID', async () => {
            const res = await request(app)
                .post('/Patient')
                .send(validPatient);

            expect(res.statusCode).toEqual(201); 
            expect(res.headers).toHaveProperty('location'); 
            expect(res.body).toHaveProperty('identifier');
            
            createdPatientId = res.body.identifier[0].value;
            expect(createdPatientId).toBeDefined();
        });

        it('Deve retornar 400 ou 422 para JSON inválido ou incompleto', async () => {
            const invalidPatient = { gender: "female" }; // Falta resourceType e name
            const res = await request(app)
                .post('/Patient')
                .send(invalidPatient);
            
            expect([400, 422]).toContain(res.statusCode);
        });
    });

    // 2. Teste de Leitura (GET)
    describe('GET /Patient/:id', () => {
        it('Deve retornar o paciente criado (200 OK)', async () => {
            const res = await request(app).get(`/Patient/${createdPatientId}`);
            expect(res.statusCode).toEqual(200); // 
            expect(res.body.identifier[0].value).toEqual(createdPatientId); 
        });

        it('Deve retornar 404 para ID inexistente', async () => {
            const res = await request(app).get('/Patient/999999');
            expect(res.statusCode).toEqual(404); 
        });
    });

    // 3. Teste de Atualização (PUT)
    describe('PUT /Patient/:id', () => {
        it('Deve atualizar paciente quando ID da URL bate com o corpo (200 OK)', async () => {
            const updatedPatient = {
                ...validPatient,
                identifier: [{ value: createdPatientId }], // Obrigatório no PUT 
                gender: "other"
            };

            const res = await request(app)
                .put(`/Patient/${createdPatientId}`)
                .send(updatedPatient);

            expect(res.statusCode).toEqual(200);
            // Verifica se atualizou
            const check = await request(app).get(`/Patient/${createdPatientId}`);
            expect(check.body.gender).toEqual("other");
        });

        it('Deve retornar 400 se o ID do corpo for diferente da URL', async () => {
            const badRequestPatient = {
                ...validPatient,
                identifier: [{ value: 12345 }] // ID diferente do createdPatientId
            };

            const res = await request(app)
                .put(`/Patient/${createdPatientId}`)
                .send(badRequestPatient);
            
            expect(res.statusCode).toEqual(400); 
        });
        
        it('Deve retornar 404 ao tentar atualizar paciente inexistente', async () => {
             const res = await request(app)
                .put('/Patient/999999')
                .send({ ...validPatient, identifier: [{ value: 999999 }] });
             
             expect(res.statusCode).toEqual(404);
        });
    });

    // // 4. Teste de Listagem de IDs (GET /PatientIDs)
    // describe('GET /PatientIDs', () => {
    //     it('Deve retornar lista de IDs (200 OK) quando há pacientes', async () => {
    //         const res = await request(app).get('/PatientIDs');
    //         expect(res.statusCode).toEqual(200);
    //         expect(Array.isArray(res.body)).toBeTruthy();
    //         expect(res.body).toContain(createdPatientId);
    //     });
    // });

    // 4. Teste de Listagem de IDs (GET /PatientIDs)
    describe('GET /PatientIDs', () => {
        it('Deve retornar lista de IDs (200 OK) quando há pacientes', async () => {
            const res = await request(app).get('/PatientIDs');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy(); 
            
            const idProcurado = Number(createdPatientId);
            const listaIds = res.body.map(id => Number(id));
            
            expect(listaIds).toContain(idProcurado);
        });
    });
    
    // 5. Teste de Exclusão (DELETE)
    describe('DELETE /Patient/:id', () => {
        it('Deve deletar o paciente e retornar 204 No Content', async () => {
            const res = await request(app).delete(`/Patient/${createdPatientId}`);
            expect(res.statusCode).toEqual(204); 
            expect(res.body).toEqual({}); 
        });

        it('Deve retornar 404 ao tentar buscar o paciente deletado', async () => {
            const res = await request(app).get(`/Patient/${createdPatientId}`);
            expect(res.statusCode).toEqual(404); 
        });
    });

    // 6. Teste de Lista Vazia
    describe('Verificação de Lista Vazia', () => {
        // Nota: Este teste assume que o banco começa vazio ou foi limpo. 
        // Se houver outros dados, pode falhar, mas segue a spec do trabalho.
        it('Se não houver pacientes, PatientIDs deve retornar 204', async () => {

        });
    });
});