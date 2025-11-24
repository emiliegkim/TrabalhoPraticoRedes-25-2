const BASE_URL = "http://localhost:3000";

// LISTAR TODOS OS PACIENTES
async function loadPatients() {
  const tbody = document.querySelector("#secPaciente tbody");
  tbody.innerHTML = "";

  const resp = await fetch(`${BASE_URL}/PatientIDs`);

  if (resp.status === 204) {
    tbody.innerHTML = `
      <tr><td colspan="8" class="text-center">Nenhum paciente encontrado</td></tr>
    `;
    return;
  }

  const ids = await resp.json();

  for (const id of ids) {
    const patientResp = await fetch(`${BASE_URL}/Patient/${id}`);

    if (patientResp.status === 200) {
      const p = await patientResp.json();

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${id}</td>
        <td>${p.name}</td>
        <td>${p.birthDate}</td>
        <td>${p.gender}</td>
        <td>
            <button class="btn btn-sm btn-outline-success" onclick="openEdit(${id})">Editar</button>
            <button class="btn btn-sm btn-outline-danger" onclick="deletePatient(${id})">Deletar</button>
        </td>
      `;

      tbody.appendChild(tr);
    }
  }
}

// CADASTRAR PACIENTE 
async function createPatient() {
  const patient = {
    resourceType: "Patient",
    name: document.getElementById("nomePacienteCadastro").value,
    gender: document.getElementById("generoCadastro").value,
    birthDate: document.getElementById("dataNascimentoCadastro").value,
    identifier: [{ value: null }],
  };

  const resp = await fetch(`${BASE_URL}/Patient`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patient)
  });

  if (resp.status === 201) {
    alert("Paciente cadastrado com sucesso!");
    loadPatients();
  } else {
    const err = await resp.json();
    alert(`Erro ${resp.status}: ${err.error}`);
  }
}

// intercepta o submit do modal de cadastro
document.querySelector("#modal form").addEventListener("submit", (e) => {
  e.preventDefault();
  createPatient();
});

//MODAL DE EDIÇÃO E BUSCA
async function buscarPorId() {
  const id = document.getElementById("buscarId").value;

  if (!id) {
    alert("Digite um ID válido!");
    return;
  }

  const resp = await fetch(`${BASE_URL}/Patient/${id}`);

  if (resp.status === 200) {
    const p = await resp.json();

    // Abrir modal de edição com os dados carregados
    document.getElementById("idPacienteEditar").value = id;
    document.getElementById("nomePacienteEditar").value = p.name;
    document.getElementById("generoEditar").value = p.gender;
    document.getElementById("dataNascimentoEditar").value = p.birthDate;
    document.getElementById("telefoneEditar").value = p.telefone || "";
    document.getElementById("enderecoEditar").value = p.endereco || "";

    if (p.active) {
      document.getElementById("ativoEditar1").checked = true;
    } else {
      document.getElementById("ativoEditar2").checked = true;
    }

    // abre o modal
    const modal = new bootstrap.Modal(document.getElementById("modalEditar"));
    modal.show();

  } else if (resp.status === 404) {
    alert("Paciente não encontrado!");
  } else {
    const err = await resp.json();
    alert(`Erro ${resp.status}: ${err.error}`);
  }
}

// SALVAR ALTERAÇÕES (PUT)
async function updatePatient() {
  const id = document.getElementById("idPacienteEditar").value;

  const patient = {
    resourceType: "Patient",
    name: document.getElementById("nomePacienteEditar").value,
    gender: document.getElementById("generoEditar").value,
    birthDate: document.getElementById("dataNascimentoEditar").value,
    identifier: [{ value: Number(id) }]
  };

  const resp = await fetch(`${BASE_URL}/Patient/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patient)
  });

  if (resp.status === 200) {
    alert("Paciente atualizado!");
    loadPatients();
  } else {
    const err = await resp.json();
    alert(`Erro ${resp.status}: ${err.error}`);
  }
}

document
  .querySelector("#modalEditar form")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    updatePatient();
  });

// DELETAR PACIENTE 
async function deletePatient(id) {
  if (!confirm("Deseja realmente deletar este paciente?")) return;

  const resp = await fetch(`${BASE_URL}/Patient/${id}`, {
    method: "DELETE"
  });

  if (resp.status === 204) {
    alert("Paciente deletado!");
    loadPatients();
  } else {
    const err = await resp.json();
    alert(`Erro ${resp.status}: ${err.error}`);
  }
}

//INICIALIZAÇÃO 
window.onload = () => {
  loadPatients();
};
