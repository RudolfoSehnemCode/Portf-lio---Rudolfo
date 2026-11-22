let ultimo_envio = 0;

        function enviarWhats(event) {
            event.preventDefault()

            const nome = document.getElementById('nome').value;
            const mensagem = document.getElementById('mensagem').value;
            const telefone = '5547997477499'


            if (nome.trim() === '' || mensagem.trim() === '') {
                alert('Preencha todos os campos!');
                return;
            }


            const agora = Date.now();
            if (agora - ultimo_envio < 30000) {
                document.getElementById('aviso').textContent = 'Aguarde 30 segundos antes de enviar novamente';
                return;
            }

            ultimo_envio = agora;

            const texto = `Olá me chamo ${nome}, ${mensagem}`
            const msgFormatada = encodeURIComponent(texto)

            const url = `https://wa.me/${telefone}?text=${msgFormatada}`

            document.getElementById('formulario').reset();
            document.getElementById('aviso').textContent = '';

            window.open(url, '_blank')
        }


// ================= Animações =================
// Só rodam quando o <head> marcou html.anim (ou seja, sem prefers-reduced-motion).

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function digitarTexto(el, texto, velocidade = 60) {
    for (let i = 1; i <= texto.length; i++) {
        el.textContent = texto.slice(0, i);
        await esperar(velocidade + Math.random() * 40);
    }
}

// Terminal do topo: digita cada comando e mostra a saída, linha por linha
async function animarHero() {
    const corpo = document.querySelector('.hero-terminal .terminal-corpo');
    if (!corpo) return;

    const cursor = corpo.querySelector('.cursor');
    const linhas = [...corpo.children];

    // guarda os textos e esvazia antes de começar
    const alvos = new Map();
    corpo.querySelectorAll('.cmd, #digitar').forEach((el) => {
        alvos.set(el, el.textContent);
        el.textContent = '';
    });

    await esperar(400);

    for (const linha of linhas) {
        linha.classList.add('mostrar');
        const alvo = linha.querySelector('.cmd, #digitar');

        if (alvo) {
            alvo.after(cursor);
            await digitarTexto(alvo, alvos.get(alvo), alvo.id === 'digitar' ? 75 : 55);
            await esperar(alvo.classList.contains('cmd') ? 300 : 200);
        } else if (linha.classList.contains('linha-final')) {
            linha.append(cursor);
        } else {
            await esperar(250);
        }
    }

    // foto entra depois que o terminal terminou
    document.querySelector('.foto-moldura')?.classList.add('visivel');
}

// Títulos das seções digitam o comando quando aparecem na tela
function animarTitulos() {
    const titulos = document.querySelectorAll('.secao-titulo .cmd');
    titulos.forEach((cmd) => {
        cmd.dataset.texto = cmd.textContent;
        cmd.textContent = '';
    });

    const obs = new IntersectionObserver((entradas) => {
        entradas.forEach((e) => {
            if (!e.isIntersecting) return;
            obs.unobserve(e.target);
            const cmd = e.target.querySelector('.cmd');
            digitarTexto(cmd, cmd.dataset.texto, 45);
        });
    }, { threshold: 0.8 });

    titulos.forEach((t) => obs.observe(t.closest('.secao-titulo')));
}

// Painéis, cards e formulário sobem suavemente ao rolar (com atraso em cascata)
function animarRevelar() {
    const grupos = [
        document.querySelectorAll('#sobre .painel'),
        document.querySelectorAll('.stack-grupo'),
        document.querySelectorAll('.projeto-link'),
        document.querySelectorAll('.formulario-contato'),
    ];

    const obs = new IntersectionObserver((entradas) => {
        entradas.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add('visivel');
            obs.unobserve(e.target);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    grupos.forEach((lista) => {
        lista.forEach((el, i) => {
            el.classList.add('revelar');
            el.style.transitionDelay = `${i * 120}ms`;
            // itens do "ls" aparecem um depois do outro
            el.querySelectorAll('.stack-lista li').forEach((li, j) => {
                li.style.transitionDelay = `${i * 120 + 250 + j * 90}ms`;
            });
            obs.observe(el);
        });
    });

    document.querySelector('.foto-moldura')?.classList.add('revelar');
}

// Cards de projeto: leve inclinação 3D + brilho que segue o mouse
function animarCards() {
    if (!window.matchMedia('(hover: hover)').matches) return;

    document.querySelectorAll('.projeto-link').forEach((link) => {
        const card = link.querySelector('.projetos-card');

        link.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width;
            const y = (e.clientY - r.top) / r.height;
            card.style.setProperty('--mx', `${x * 100}%`);
            card.style.setProperty('--my', `${y * 100}%`);
            card.style.transform =
                `translateY(-6px) perspective(800px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 6}deg)`;
        });

        link.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });

        // o atraso da cascata não deve deixar o hover lento depois que o card já entrou
        link.addEventListener('transitionend', () => {
            link.style.transitionDelay = '';
        }, { once: true });
    });
}

// Barra de progresso de leitura + link ativo no menu
function animarNavegacao() {
    const barra = document.querySelector('.progresso');
    const links = document.querySelectorAll('.menu-link');

    const atualizarBarra = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        barra.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    window.addEventListener('scroll', atualizarBarra, { passive: true });
    atualizarBarra();

    const obs = new IntersectionObserver((entradas) => {
        entradas.forEach((e) => {
            if (!e.isIntersecting) return;
            links.forEach((l) => {
                l.classList.toggle('ativo', l.getAttribute('href') === `#${e.target.id}`);
            });
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    document.querySelectorAll('main[id], section[id]').forEach((s) => obs.observe(s));
}

document.addEventListener('DOMContentLoaded', () => {
    // a barra de progresso e o menu ativo não são "movimento", funcionam sempre
    animarNavegacao();

    if (!document.documentElement.classList.contains('anim')) return;

    animarRevelar();
    animarHero();
    animarTitulos();
    animarCards();
});
