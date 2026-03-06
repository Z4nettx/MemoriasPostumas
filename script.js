/* ================================================================
   script.js — Memórias Póstumas de Brás Cubas
   Contém:
     1) Modal de abertura (animação do texto)
     2) Caveiras flutuantes com drag
     3) Parallax por scroll (seções px-cena)
     4) Partículas de névoa (canvas seção 1)
     5) Fragmentos de frases flutuantes (seção 2)
     6) Fade-in de elementos ao entrar na viewport
     7) Timeline — entrada lateral dos cards
     8) Parallax da timeline (névoa + partículas flutuantes)
   ================================================================ */


/* ================================================================
   1) MODAL DE ABERTURA
   ================================================================ */
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
            {
                opacity: 0, filter: "blur(14px) brightness(8)", letterSpacing: "0.4em",
                textShadow: "0 0 60px #fff, 0 0 100px #f5c842"
            },
            { opacity: 1, filter: "blur(3px) brightness(3)", letterSpacing: "0.08em", offset: 0.35 },
            {
                opacity: 1, filter: "blur(0px) brightness(1)", letterSpacing: "normal",
                textShadow: "0 0 6px rgba(248,200,80,0.25)"
            }
        ], { duration: DURACAO, easing: "ease", fill: "forwards" });
    }, 1000);

    setTimeout(() => {
        linha2.animate([
            {
                opacity: 0, filter: "blur(14px) brightness(8)", letterSpacing: "0.4em",
                textShadow: "0 0 60px #fff, 0 0 120px #e8a000"
            },
            { opacity: 1, filter: "blur(3px) brightness(3)", letterSpacing: "0.08em", offset: 0.35 },
            {
                opacity: 1, filter: "blur(0px) brightness(1)", letterSpacing: "normal",
                textShadow: "0 0 10px rgba(240,192,64,0.5)"
            }
        ], { duration: DURACAO, easing: "ease", fill: "forwards" });
    }, 2800);

    setTimeout(() => {
        modal.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            { duration: 1000, easing: "ease", fill: "forwards" }
        ).finished.then(() => modal.style.display = "none");
    }, 6500);
});


/* ================================================================
   2) CAVEIRAS FLUTUANTES COM DRAG
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const skulls = document.querySelectorAll('.caveiras img');

    skulls.forEach(skull => {
        const state = {
            x: Math.random() * (window.innerWidth - 100),
            y: Math.random() * (window.innerHeight - 100),
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

        let dragging = false, dragOffsetX = 0, dragOffsetY = 0;

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

                const maxX = window.innerWidth - 100;
                const maxY = window.innerHeight - 100;

                if (state.x <= 0 || state.x >= maxX) { state.vx *= -1; state.x = Math.max(0, Math.min(state.x, maxX)); }
                if (state.y <= 0 || state.y >= maxY) { state.vy *= -1; state.y = Math.max(0, Math.min(state.y, maxY)); }
                apply();
            }
            requestAnimationFrame(animate);
        };
        animate();
    });
});


/* ================================================================
   3) PARALLAX POR SCROLL — seções .px-cena (exceto timeline)
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {

    const cenas = document.querySelectorAll('.px-cena:not(#px-timeline)');

    const camadas = [];
    cenas.forEach(cena => {
        cena.querySelectorAll('.px-layer').forEach(layer => {
            camadas.push({
                el: layer,
                speed: parseFloat(layer.dataset.speed || 0.3),
                cena: cena,
                offset: 0,
                target: 0,
            });
        });
    });

    const onScroll = () => {
        const scrollY = window.scrollY;
        camadas.forEach(c => {
            const rect = c.cena.getBoundingClientRect();
            const cenaTop = scrollY + rect.top;
            const scrollado = scrollY - cenaTop;
            c.target = scrollado * c.speed * -1;
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const LERP = 0.1;
    const loopParallax = () => {
        camadas.forEach(c => {
            c.offset += (c.target - c.offset) * LERP;
            c.el.style.transform = `translateY(${c.offset.toFixed(2)}px)`;
        });
        requestAnimationFrame(loopParallax);
    };
    loopParallax();
});


/* ================================================================
   4) PARTÍCULAS DE NÉVOA — Canvas (Seção 1)
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('px-canvas-1');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const resize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const NUM_PARTICULAS = 90;
    const particulas = Array.from({ length: NUM_PARTICULAS }, () => criaPartícula(true));

    function criaPartícula(aleatóriaY = false) {
        return {
            x: Math.random() * canvas.width,
            y: aleatóriaY ? Math.random() * canvas.height : canvas.height + 10,
            r: 0.5 + Math.random() * 2.2,
            vy: -(0.15 + Math.random() * 0.45),
            vx: (Math.random() - 0.5) * 0.18,
            opMax: 0.08 + Math.random() * 0.25,
            op: 0,
            fase: Math.random() * Math.PI * 2,
            vel: 0.004 + Math.random() * 0.008,
        };
    }

    const loop = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particulas.forEach((p, i) => {
            p.fase += p.vel;
            const opAtual = p.opMax * (0.5 + 0.5 * Math.sin(p.fase));
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 192, 128, ${opAtual})`;
            ctx.fill();
            p.x += p.vx;
            p.y += p.vy;
            if (p.y < -10) particulas[i] = criaPartícula(false);
        });
        requestAnimationFrame(loop);
    };
    loop();
});


/* ================================================================
   5) FRAGMENTOS DE FRASES FLUTUANTES (Seção 2)
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('px-frases');
    if (!container) return;

    const FRASES = [
        "Ao vencedor, as batatas.",
        "Vivia, portanto, em plena vaidade.",
        "A morte não avisa.",
        "Não fui grande nem bom.",
        "O mundo é dos vivos.",
        "Morremos todos, uns antes.",
        "Nada conserva o viço da vida.",
        "Fui autor de mim mesmo.",
        "Era um filósofo à minha moda.",
        "A glória! a glória!",
        "Negócio, amor, política…",
        "Os séculos me contemplam.",
        "Legado: zero.",
        "A ironia é a última sabedoria.",
        "Humanitas! eis o segredo.",
    ];

    const NUM_FRASES = 10;

    const criaFrase = () => {
        const el = document.createElement('span');
        el.classList.add('px-frase');
        el.textContent = FRASES[Math.floor(Math.random() * FRASES.length)];

        const x = 5 + Math.random() * 85;
        const duracao = 18 + Math.random() * 22;
        const delay = Math.random() * -duracao;
        const tamanho = 0.62 + Math.random() * 0.32;
        const opMax = 0.12 + Math.random() * 0.22;

        el.style.cssText = `
            left: ${x}%;
            bottom: -5%;
            font-size: ${tamanho}rem;
            opacity: ${opMax};
            animation-duration: ${duracao}s;
            animation-delay: ${delay}s;
        `;

        container.appendChild(el);
    };

    for (let i = 0; i < NUM_FRASES; i++) criaFrase();
});


/* ================================================================
   6) FADE-IN DE ELEMENTOS AO ENTRAR NA VIEWPORT
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const revealEls = document.querySelectorAll('.px-reveal');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('px-visível');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.28 }
    );

    revealEls.forEach(el => observer.observe(el));
});


/* ================================================================
   7) TIMELINE — entrada lateral dos cards
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {

    const eventos = document.querySelectorAll('.tl-evento');
    if (!eventos.length) return;

    eventos.forEach(ev => {
        const card = ev.querySelector('.tl-card');
        if (!card) return;
        const éDireita = ev.classList.contains('tl-direita');
        card.style.opacity = '0';
        card.style.transform = `translateX(${éDireita ? '50px' : '-50px'})`;
        card.style.transition = 'opacity 0.85s cubic-bezier(0.22,0.61,0.36,1), transform 0.85s cubic-bezier(0.22,0.61,0.36,1)';
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const card = entry.target.querySelector('.tl-card');
            if (card) {
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    eventos.forEach(ev => observer.observe(ev));
});


/* ================================================================
   8) PARALLAX DA TIMELINE
   ─────────────────────────────────────────────────────────────────
   A timeline usa position:sticky para o fundo (não é .px-layer),
   então não entra no loop de parallax das outras seções.
   Aqui criamos um efeito próprio:
     - Canvas de partículas douradas subindo (igual à seção 1)
     - Névoa translúcida que desloca suavemente ao scroll
     - Os cards dos eventos ganham um leve translateY proporcional
       à sua posição no scroll, criando profundidade entre eles.
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {

    const timeline = document.getElementById('px-timeline');
    if (!timeline) return;

    /* ── 8a) Canvas de partículas na timeline ── */
    const tlCanvas = document.createElement('canvas');
    tlCanvas.id = 'tl-canvas';
    tlCanvas.style.cssText = `
        position: sticky;
        top: 0;
        width: 100%;
        height: 100vh;
        margin-bottom: -100vh;
        pointer-events: none;
        z-index: 1;
        opacity: 0.4;
        mix-blend-mode: screen;
        display: block;
    `;
    /* Insere logo após o .tl-bg-fixo */
    const bgFixo = timeline.querySelector('.tl-bg-fixo');
    bgFixo.insertAdjacentElement('afterend', tlCanvas);

    const ctxTl = tlCanvas.getContext('2d');

    const resizeTl = () => {
        tlCanvas.width = tlCanvas.offsetWidth;
        tlCanvas.height = tlCanvas.offsetHeight;
    };
    resizeTl();
    window.addEventListener('resize', resizeTl);

    function criaPartTl(aleatóriaY = false) {
        return {
            x: Math.random() * tlCanvas.width,
            y: aleatóriaY ? Math.random() * tlCanvas.height : tlCanvas.height + 10,
            r: 0.4 + Math.random() * 1.8,
            vy: -(0.12 + Math.random() * 0.35),
            vx: (Math.random() - 0.5) * 0.14,
            opMax: 0.06 + Math.random() * 0.18,
            fase: Math.random() * Math.PI * 2,
            vel: 0.003 + Math.random() * 0.007,
        };
    }

    const partsTl = Array.from({ length: 70 }, () => criaPartTl(true));

    const loopTl = () => {
        ctxTl.clearRect(0, 0, tlCanvas.width, tlCanvas.height);
        partsTl.forEach((p, i) => {
            p.fase += p.vel;
            const op = p.opMax * (0.5 + 0.5 * Math.sin(p.fase));
            ctxTl.beginPath();
            ctxTl.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctxTl.fillStyle = `rgba(212, 192, 128, ${op})`;
            ctxTl.fill();
            p.x += p.vx;
            p.y += p.vy;
            if (p.y < -10) partsTl[i] = criaPartTl(false);
        });
        requestAnimationFrame(loopTl);
    };
    loopTl();


    /* ── 8b) Névoa parallax na timeline ── */
    const nevoa = document.createElement('div');
    nevoa.id = 'tl-nevoa';
    nevoa.style.cssText = `
        position: sticky;
        top: 0;
        width: 100%;
        height: 100vh;
        margin-bottom: -100vh;
        pointer-events: none;
        z-index: 1;
        background:
            radial-gradient(ellipse 70% 50% at 20% 60%, rgba(184,155,94,0.04) 0%, transparent 65%),
            radial-gradient(ellipse 50% 60% at 80% 35%, rgba(90,70,30,0.06) 0%, transparent 55%);
        mix-blend-mode: screen;
        will-change: transform;
    `;
    tlCanvas.insertAdjacentElement('afterend', nevoa);


    /* ── 8c) Parallax de profundidade nos cards e bolhas ──
       Cada card recebe um deslocamento vertical leve baseado
       em quanto a timeline foi scrollada. Cards mais acima
       (data-speed-item menor) movem menos → parecem mais distantes. */
    const itens = timeline.querySelectorAll('.tl-evento');
    const offsetsIniciais = new Map();

    itens.forEach(item => {
        offsetsIniciais.set(item, { offset: 0, target: 0 });
    });

    /* Névoa: offset suavizado */
    let nevoaOffset = 0;
    let nevoaTarget = 0;

    const onScrollTl = () => {
        const scrollY = window.scrollY;
        const rect = timeline.getBoundingClientRect();
        const tlTop = scrollY + rect.top;
        const scrollado = scrollY - tlTop;

        /* Névoa move levemente */
        nevoaTarget = scrollado * 0.06 * -1;

        /* Cada evento: speed vem do data-speed-item do HTML */
        itens.forEach(item => {
            const speed = parseFloat(item.dataset.speedItem || 0.18);
            const state = offsetsIniciais.get(item);
            state.target = scrollado * speed * -1;
        });
    };

    window.addEventListener('scroll', onScrollTl, { passive: true });
    onScrollTl();

    const LERP_TL = 0.08;

    const loopParallaxTl = () => {
        /* Névoa */
        nevoaOffset += (nevoaTarget - nevoaOffset) * LERP_TL;
        nevoa.style.transform = `translateY(${nevoaOffset.toFixed(2)}px)`;

        /* Cards e bolhas de cada evento */
        itens.forEach(item => {
            const state = offsetsIniciais.get(item);
            state.offset += (state.target - state.offset) * LERP_TL;
            item.style.transform = `translateY(${state.offset.toFixed(2)}px)`;
        });

        requestAnimationFrame(loopParallaxTl);
    };
    loopParallaxTl();

});