export function iniciarFormularioAgendamento() {
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

  function configurarDataMinima() {
    const hoje = new Date();
    const offset = hoje.getTimezoneOffset();
    const hojeLocal = new Date(hoje.getTime() - offset * 60 * 1000);

    // Impede que o usuario escolha uma data anterior ao dia atual.
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

    // Se algo estiver faltando, o Bootstrap destaca os campos para o usuario.
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

    // Mostra uma confirmacao simples para deixar claro que o pedido foi registrado.
    mensagemSucesso.textContent =
      `Cadastro enviado com sucesso. ${nomeCliente}, o atendimento de ${nomePet} foi solicitado para ${mensagemHorario.textContent}.`;
    mensagemSucesso.classList.remove("d-none");

    resetProgramatico = true;
    formAgendamento.reset();
    configurarDataMinima();
    atualizarResumo();
  }

  configurarDataMinima();
  atualizarResumo();

  servicoSelect.addEventListener("change", atualizarResumo);
  metodoSelect.addEventListener("change", atualizarResumo);
  dataInput.addEventListener("change", atualizarResumo);
  horaInput.addEventListener("change", atualizarResumo);
  horaInput.addEventListener("input", () => horaInput.setCustomValidity(""));
  formAgendamento.addEventListener("submit", tratarEnvioFormulario);
  formAgendamento.addEventListener("reset", () => {
    // Espera o reset terminar para atualizar o resumo da lateral sem conflito.
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
}
