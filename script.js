const horarioAtual = document.getElementById("horario-atual");
const statusLoja = document.getElementById("status-loja");
const contrasteButton = document.getElementById("alternar-contraste");
const formAgendamento = document.getElementById("form-agendamento");
const servicoSelect = document.getElementById("servico");
const metodoSelect = document.getElementById("metodo");
const dataInput = document.getElementById("data-agendamento");
const horaInput = document.getElementById("hora-agendamento");
const resumoServico = document.getElementById("resumo-servico");
const resumoMetodo = document.getElementById("resumo-metodo");
const mensagemHorario = document.getElementById("mensagem-horario");
const mensagemSucesso = document.getElementById("mensagem-sucesso");
let resetProgramatico = false;

function atualizarRelogio() {
  const agora = new Date();
  const diaSemana = agora.getDay();
  const horas = agora.getHours();
  const horarioFormatado = agora.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  horarioAtual.textContent = horarioFormatado;

  const horarioComercial = horas >= 9 && horas < 18;
  const diaUtil = diaSemana >= 1 && diaSemana <= 6;

  statusLoja.textContent = horarioComercial && diaUtil ? "Aberto agora" : "Fechado no momento";
}

function configurarDataMinima() {
  const hoje = new Date();
  const offset = hoje.getTimezoneOffset();
  const hojeLocal = new Date(hoje.getTime() - offset * 60 * 1000);

  dataInput.min = hojeLocal.toISOString().split("T")[0];
}

function atualizarResumo() {
  resumoServico.textContent = servicoSelect.value || "Nao selecionado";
  resumoMetodo.textContent = metodoSelect.value || "Nao selecionado";

  if (!dataInput.value) {
    mensagemHorario.textContent = "Selecione uma data.";
    return;
  }

  const dataFormatada = new Date(`${dataInput.value}T00:00:00`).toLocaleDateString("pt-BR");
  const horarioTexto = horaInput.value || "horario a definir";

  mensagemHorario.textContent = `${dataFormatada} as ${horarioTexto}`;
}

function alternarContraste() {
  const altoContrasteAtivo = document.body.classList.toggle("high-contrast");
  contrasteButton.setAttribute("aria-pressed", String(altoContrasteAtivo));
}

function validarHorarioEscolhido() {
  if (!horaInput.value) {
    return true;
  }

  const [hora] = horaInput.value.split(":").map(Number);
  return hora >= 9 && hora <= 18;
}

function tratarEnvioFormulario(evento) {
  evento.preventDefault();

  const formularioValido = formAgendamento.checkValidity();
  const horarioValido = validarHorarioEscolhido();

  if (!formularioValido || !horarioValido) {
    if (!horarioValido) {
      horaInput.setCustomValidity("Escolha um horario entre 09:00 e 18:00.");
    } else {
      horaInput.setCustomValidity("");
    }

    formAgendamento.classList.add("was-validated");
    return;
  }

  horaInput.setCustomValidity("");
  formAgendamento.classList.remove("was-validated");

  const nomeCliente = document.getElementById("nome-cliente").value;
  const nomePet = document.getElementById("nome-pet").value;

  mensagemSucesso.textContent =
    `Cadastro enviado com sucesso. ${nomeCliente}, o atendimento de ${nomePet} foi solicitado para ${mensagemHorario.textContent}.`;
  mensagemSucesso.classList.remove("d-none");

  resetProgramatico = true;
  formAgendamento.reset();
  configurarDataMinima();
  atualizarResumo();
}

setInterval(atualizarRelogio, 1000);
atualizarRelogio();
configurarDataMinima();
atualizarResumo();

contrasteButton.addEventListener("click", alternarContraste);
servicoSelect.addEventListener("change", atualizarResumo);
metodoSelect.addEventListener("change", atualizarResumo);
dataInput.addEventListener("change", atualizarResumo);
horaInput.addEventListener("change", atualizarResumo);
horaInput.addEventListener("input", () => horaInput.setCustomValidity(""));
formAgendamento.addEventListener("submit", tratarEnvioFormulario);
formAgendamento.addEventListener("reset", () => {
  // Aguarda o reset nativo antes de recomputar os dados exibidos na tela.
  setTimeout(() => {
    if (!resetProgramatico) {
      mensagemSucesso.classList.add("d-none");
    }

    configurarDataMinima();
    atualizarResumo();
    formAgendamento.classList.remove("was-validated");
    resetProgramatico = false;
  }, 0);
});
