const BASE_URL = "http://localhost:3000";

async function loadPatients() {
  const tbody = document.getElementById("tabelaPacientes");
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
      const name = Array.isArray(p.name) ? p.name[0].text || p.name[0].given?.join(" ") || "" : p.name;

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
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
    closeAndClearCreateModal();
    loadPatients();
  } else {
    const err = await resp.json();
    alert(`Erro ${resp.status}: ${err.error}`);
  }
}

document.querySelector("#modal form").addEventListener("submit", (e) => {
  e.preventDefault();
  createPatient();
});

async function buscarPorId(idFromButton) {
  const id = idFromButton || document.getElementById("buscarId").value;
  

  if (!id) {
    alert("Digite um ID válido!");
    return;
  }

  const resp = await fetch(`${BASE_URL}/Patient/${id}`);

  if (resp.status === 200) {
    const p = await resp.json();

    document.getElementById("idPacienteEditar").value = id;
    document.getElementById("nomePacienteEditar").value = Array.isArray(p.name) ? p.name[0].text || p.name[0].given?.join(" ") || "" : p.name;
    document.getElementById("generoEditar").value = p.gender;
    document.getElementById("dataNascimentoEditar").value = p.birthDate;

    const modal = new bootstrap.Modal(document.getElementById("modalEditar"));
    modal.show();

  } else {
    alert("Paciente não encontrado!");
  }
}


function openEdit(id) {
  buscarPorId(id);
}

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
    closeAndClearEditModal();
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

window.onload = () => {
  loadPatients();
};

function closeAndClearCreateModal() {
  const modalEl = document.getElementById("modal");
  const modal = bootstrap.Modal.getInstance(modalEl);

  modal.hide();

  document.querySelector("#modal form").reset();
}

function closeAndClearEditModal() {
  const modalEl = document.getElementById("modalEditar");
  const modal = bootstrap.Modal.getInstance(modalEl);

  modal.hide();

  document.querySelector("#modalEditar form").reset();
}
