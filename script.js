document.addEventListener("DOMContentLoaded", () => {
    const modal = document.querySelector(".modal");
    const linha1 = document.querySelectorAll(".linha")[0];
    const linha2 = document.querySelectorAll(".linha")[1];

    const DURACAO = 1800;
    const DURACAO_MODAL = 1200;

    [linha1, linha2].forEach(l => {
        l.style.opacity = "0";
        l.style.filter = "blur(14px) brightness(8)";
        l.style.letterSpacing = "0.4em";
    });

    modal.style.display = "flex";
    modal.style.opacity = "0";
    modal.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: DURACAO_MODAL, easing: "ease", fill: "forwards" }
    );

    setTimeout(() => {
        linha1.animate([
            { opacity: 0, filter: "blur(14px) brightness(8)", letterSpacing: "0.4em", textShadow: "0 0 60px #fff, 0 0 100px #f5c842" },
            { opacity: 1, filter: "blur(3px)  brightness(3)", letterSpacing: "0.08em", offset: 0.35 },
            { opacity: 1, filter: "blur(0px)  brightness(1)", letterSpacing: "normal", textShadow: "0 0 6px rgba(248,200,80,0.25)" }
        ], { duration: DURACAO, easing: "ease", fill: "forwards" });
    }, 1000);

    setTimeout(() => {
        linha2.animate([
            { opacity: 0, filter: "blur(14px) brightness(8)", letterSpacing: "0.4em", textShadow: "0 0 60px #fff, 0 0 120px #e8a000" },
            { opacity: 1, filter: "blur(3px)  brightness(3)", letterSpacing: "0.08em", offset: 0.35 },
            { opacity: 1, filter: "blur(0px)  brightness(1)", letterSpacing: "normal", textShadow: "0 0 10px rgba(240,192,64,0.5)" }
        ], { duration: DURACAO, easing: "ease", fill: "forwards" });
    }, 2800);

    setTimeout(() => {
        modal.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            { duration: 1000, easing: "ease", fill: "forwards" }
        ).finished.then(() => modal.style.display = "none");
    }, 6500);
});

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.caveiras');
    const skulls = document.querySelectorAll('.caveiras img');

    // ← NÃO sobrescreve position nem overflow aqui
    // o CSS já cuida disso com position: fixed

    const W = window.innerWidth;
    const H = window.innerHeight;

    skulls.forEach(skull => {
        const state = {
            x: Math.random() * (W - 100),
            y: Math.random() * (H - 100),
            rotation: Math.random() * 360,
            scale: 0.6 + Math.random() * 0.8,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            vr: (Math.random() - 0.5) * 0.4,
        };

        skull.style.position = 'absolute';
        skull.style.width = '100px';
        skull.style.height = '100px';
        skull.style.cursor = 'grab';

        const apply = () => {
            skull.style.transform = `translate(${state.x}px, ${state.y}px) rotate(${state.rotation}deg) scale(${state.scale})`;
        };
        apply();

        let dragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        skull.addEventListener('mousedown', e => {
            dragging = true;
            dragOffsetX = e.clientX - state.x;
            dragOffsetY = e.clientY - state.y;
            skull.style.cursor = 'grabbing';
            skull.style.zIndex = 999;
            e.preventDefault();
        });

        window.addEventListener('mousemove', e => {
            if (!dragging) return;
            state.x = e.clientX - dragOffsetX;
            state.y = e.clientY - dragOffsetY;
            apply();
        });

        window.addEventListener('mouseup', () => {
            if (dragging) {
                dragging = false;
                skull.style.cursor = 'grab';
                skull.style.zIndex = '';
            }
        });

        const animate = () => {
            if (!dragging) {
                state.x += state.vx;
                state.y += state.vy;
                state.rotation += state.vr;

                // usa window.innerWidth/Height em vez de container.offsetWidth/Height
                const maxX = window.innerWidth - 100;
                const maxY = window.innerHeight - 100;

                if (state.x <= 0 || state.x >= maxX) {
                    state.vx *= -1;
                    state.x = Math.max(0, Math.min(state.x, maxX));
                }
                if (state.y <= 0 || state.y >= maxY) {
                    state.vy *= -1;
                    state.y = Math.max(0, Math.min(state.y, maxY));
                }

                apply();
            }
            requestAnimationFrame(animate);
        };

        animate();
    });
});