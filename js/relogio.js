export function iniciarRelogio() {
  const horarioAtual = document.getElementById("horario-atual");
  const statusLoja = document.getElementById("status-loja");

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

    // Mostra de forma automatica se a loja esta aberta no horario atual.
    statusLoja.textContent =
      horarioComercial && diaUtil ? "Aberto agora" : "Fechado no momento";
  }

  atualizarRelogio();
  // Atualiza o relogio a cada segundo para manter a pagina dinamica.
  setInterval(atualizarRelogio, 1000);
}
