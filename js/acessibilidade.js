export function iniciarAcessibilidade() {
  const contrasteButton = document.getElementById("alternar-contraste");

  function alternarContraste() {
    // Esse botao ajuda quem precisa de mais contraste para ler a pagina.
    const altoContrasteAtivo = document.body.classList.toggle("high-contrast");
    contrasteButton.setAttribute("aria-pressed", String(altoContrasteAtivo));
  }

  contrasteButton.addEventListener("click", alternarContraste);
}
