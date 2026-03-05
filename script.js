document.addEventListener("DOMContentLoaded", () => {
    const modal = document.querySelector(".modal");
    const linha1 = document.querySelectorAll(".linha")[0];
    const linha2 = document.querySelectorAll(".linha")[1];

    const DURACAO = 1800;
    const DURACAO_MODAL = 1200;

    // Estado inicial invisível das linhas
    [linha1, linha2].forEach(l => {
        l.style.opacity = "0";
        l.style.filter = "blur(14px) brightness(8)";
        l.style.letterSpacing = "0.4em";
    });

    // 1) Abre o modal com fade
    modal.style.display = "flex";
    modal.style.opacity = "0";
    modal.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: DURACAO_MODAL, easing: "ease", fill: "forwards" }
    );

    // 2) Revela linha 1
    setTimeout(() => {
        linha1.animate([
            { opacity: 0, filter: "blur(14px) brightness(8)", letterSpacing: "0.4em", textShadow: "0 0 60px #fff, 0 0 100px #f5c842" },
            { opacity: 1, filter: "blur(3px)  brightness(3)", letterSpacing: "0.08em", offset: 0.35 },
            { opacity: 1, filter: "blur(0px)  brightness(1)", letterSpacing: "normal", textShadow: "0 0 6px rgba(248,200,80,0.25)" }
        ], { duration: DURACAO, easing: "ease", fill: "forwards" });
    }, 1000);

    // 3) Revela linha 2 (bold/dourada)
    setTimeout(() => {
        linha2.animate([
            { opacity: 0, filter: "blur(14px) brightness(8)", letterSpacing: "0.4em", textShadow: "0 0 60px #fff, 0 0 120px #e8a000" },
            { opacity: 1, filter: "blur(3px)  brightness(3)", letterSpacing: "0.08em", offset: 0.35 },
            { opacity: 1, filter: "blur(0px)  brightness(1)", letterSpacing: "normal", textShadow: "0 0 10px rgba(240,192,64,0.5)" }
        ], { duration: DURACAO, easing: "ease", fill: "forwards" });
    }, 2800);

    // 4) Fecha o modal
    setTimeout(() => {
        modal.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            { duration: 1000, easing: "ease", fill: "forwards" }
        ).finished.then(() => modal.style.display = "none");
    }, 6500);
});