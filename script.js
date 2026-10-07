document.addEventListener('DOMContentLoaded', () => {
    // Variáveis globais
    let estudos = [];
    let anotacoes = [];
    let estudoAtual = null;
    let timerInterval = null;
    let tempoRestante = 15 * 60; // 15 minutos em segundos
    let timerRodando = false;

    // Elementos DOM
    const btnComecar = document.getElementById('btn-comecar');
    const btnHistorico = document.getElementById('btn-historico');
    const btnVoltar = document.getElementById('btn-voltar');
    const btnVoltarHist = document.getElementById('btn-voltar-hist');
    const btnTimer = document.getElementById('btn-timer');
    const btnConcluir = document.getElementById('btn-concluir');
    const btnFecharModal = document.getElementById('btn-fechar-modal');

    const telaInicial = document.getElementById('tela-inicial');
    const telaDevocional = document.getElementById('tela-devocional');
    const telaHistorico = document.getElementById('tela-historico');
    const modalConclusao = document.getElementById('modal-conclusao');

    // Inicialização
    carregarDados();

    // Event Listeners
    btnComecar.addEventListener('click', iniciarDevocional);
    btnVoltar.addEventListener('click', () => navegar(telaInicial));
    btnHistorico.addEventListener('click', mostrarHistorico);
    btnVoltarHist.addEventListener('click', () => navegar(telaInicial));
    btnTimer.addEventListener('click', toggleTimer);
    btnConcluir.addEventListener('click', concluirDevocional);
    btnFecharModal.addEventListener('click', () => {
        modalConclusao.classList.remove('ativa');
        navegar(telaInicial);
    });

    // Funções
    function carregarDados() {
        // Usa os dados do arquivo estudos.js já carregado no HTML
        if (typeof estudosData !== 'undefined') {
            estudos = estudosData;
        } else {
            console.error("Dados dos estudos não encontrados!");
            alert("Erro ao carregar os estudos.");
        }

        // Carrega anotações do localStorage
        const anotsSalvas = localStorage.getItem('clari_anotacoes');
        if (anotsSalvas) {
            anotacoes = JSON.parse(anotsSalvas);
        }
        
        atualizarProgresso();
    }

    function navegar(telaAtiva) {
        document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
        telaAtiva.classList.add('ativa');
        window.scrollTo(0, 0);
    }

    function iniciarDevocional() {
        // Pega o dia da semana atual (0=Dom, 1=Seg...)
        const hoje = new Date().getDay();
        
        // Mapeia os índices do json
        // Vamos apenas pegar o próximo estudo não concluído ou o primeiro
        const feitos = anotacoes.map(a => a.estudo_id);
        estudoAtual = estudos.find(e => !feitos.includes(e.id)) || estudos[0];

        preencherDevocional(estudoAtual);
        navegar(telaDevocional);
        resetarTimer();
    }

    const emojisPersonagens = {
        "Divertidamente": "🧠",
        "Toy Story": "🤠",
        "Barbie e Shrek": "💖",
        "Como Treinar Seu Dragão": "🐉",
        "Lilo & Stitch": "🌺",
        "Frozen": "❄️",
        "Meu Malvado Favorito": "😈",
        "Sing": "🎤",
        "Poderoso Chefinho": "👔",
        "Moana": "🌊",
        "Trolls": "🌈",
        "Youtubers": "📱",
        "My Little Pony": "🦄",
        "Roblox": "🧱",
        "Spy x Family": "🕵️‍♀️",
        "PK XD": "🎮",
        "Haikyuu": "🏐",
        "Avatar World": "🌍",
        "Hotel Transilvânia": "🦇"
    };

    const imagensPersonagens = {
        "Divertidamente": "Alegria_divertidamente.png.png",
        "Toy Story": "Woody_toystory.png.png",
        "Barbie e Shrek": "Barbie_avatar.png.png",
        "Frozen": "Elsa_frozen.png.png",
        "Sing": "Ash_sing.png.png",
        "Moana": "Moana.png.png",
        "Trolls": "Poppy_trolls.png.png",
        "Youtubers": "Rafa_Luiz.png",
        "My Little Pony": "Twilight.png.png",
        "Spy x Family": "Anya_abraço.png.png",
        "Haikyuu": "Hinata.png.png",
        "Como Treinar Seu Dragão": "Ana_frozen.png.png", 
        "Lilo & Stitch": "Simea.png.png",
        "Meu Malvado Favorito": "Morajo.png",
        "Poderoso Chefinho": "Gabriel_Shirley.png",
        "Roblox": "Hinata_mincraque.png.png",
        "PK XD": "Torajo.png",
        "Avatar World": "Barbie_fada.png.png",
        "Hotel Transilvânia": "Zumi_png.jpg"
    };

    function preencherDevocional(estudo) {
        const diasStr = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
        const diaAtual = diasStr[new Date().getDay()];
        document.getElementById('dia-semana').textContent = diaAtual;
        
        document.getElementById('titulo-devocional').textContent = estudo.titulo;
        
        const emojiFallback = emojisPersonagens[estudo.avatar_principal] || "✨";
        let fileName = imagensPersonagens[estudo.avatar_principal];
        
        const avatarContainer = document.getElementById('avatar-personagem-dia');
        
        if (fileName) {
            avatarContainer.innerHTML = `<img src="assets/emojis_personagens/${fileName}" alt="${estudo.avatar_principal}" onerror="this.onerror=null; this.parentElement.innerHTML='${emojiFallback}';">`;
        } else {
            avatarContainer.innerHTML = emojiFallback;
        }

        document.getElementById('ref-biblica').textContent = estudo.referencia_biblica;
        document.getElementById('texto-biblico').textContent = estudo.texto_biblico;
        
        document.getElementById('tema-avatar-titulo').innerHTML = `<i class="fas fa-lightbulb"></i> Reflexão (${estudo.avatar_principal})`;
        document.getElementById('texto-reflexao').textContent = estudo.reflexao_psicopedagogica;
        
        const listaQuestoes = document.getElementById('lista-questoes');
        listaQuestoes.innerHTML = '';
        estudo.questoes.forEach(q => {
            const li = document.createElement('li');
            li.textContent = q;
            listaQuestoes.appendChild(li);
        });

        document.getElementById('texto-curiosidade').textContent = estudo.curiosidade;
        document.getElementById('texto-oracao').textContent = estudo.oracao;
        
        document.getElementById('anotacao-clari').value = '';
        document.getElementById('anotacao-clau').value = '';
    }

    function resetarTimer() {
        clearInterval(timerInterval);
        tempoRestante = 15 * 60;
        timerRodando = false;
        atualizarDisplayTimer();
        btnTimer.innerHTML = '<i class="fas fa-play"></i>';
    }

    function toggleTimer() {
        if (timerRodando) {
            clearInterval(timerInterval);
            timerRodando = false;
            btnTimer.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            timerInterval = setInterval(() => {
                if (tempoRestante > 0) {
                    tempoRestante--;
                    atualizarDisplayTimer();
                } else {
                    clearInterval(timerInterval);
                    alert("O tempo do devocional acabou! Hora de orar juntas.");
                }
            }, 1000);
            timerRodando = true;
            btnTimer.innerHTML = '<i class="fas fa-pause"></i>';
        }
    }

    function atualizarDisplayTimer() {
        const min = Math.floor(tempoRestante / 60).toString().padStart(2, '0');
        const sec = (tempoRestante % 60).toString().padStart(2, '0');
        document.getElementById('timer-display').textContent = `${min}:${sec}`;
    }

    function concluirDevocional() {
        const clariText = document.getElementById('anotacao-clari').value;
        const clauText = document.getElementById('anotacao-clau').value;

        const novaAnotacao = {
            data: new Date().toISOString().split('T')[0],
            estudo_id: estudoAtual.id,
            titulo: estudoAtual.titulo,
            clari_escreveu: clariText,
            clau_escreveu: clauText,
            oracao_do_dia: estudoAtual.oracao
        };

        anotacoes.push(novaAnotacao);
        localStorage.setItem('clari_anotacoes', JSON.stringify(anotacoes));
        
        atualizarProgresso();

        // Mostrar Modal
        document.getElementById('versiculo-resumo').textContent = estudoAtual.texto_biblico;
        modalConclusao.classList.add('ativa');
    }

    function atualizarProgresso() {
        const qtd = anotacoes.length;
        const numSemana = qtd % 5;
        const porcentagem = (numSemana / 5) * 100;
        
        document.getElementById('barra-preenchimento').style.width = `${porcentagem}%`;
        document.getElementById('texto-progresso').textContent = `${numSemana}/5 dias da semana atual concluídos`;

        // Medalhas
        const medalhasConquistadas = Math.floor(qtd / 5);
        const container = document.getElementById('container-medalhas');
        container.innerHTML = '';
        for (let i = 0; i < medalhasConquistadas; i++) {
            container.innerHTML += '💜 ';
        }
    }

    function mostrarHistorico() {
        const lista = document.getElementById('lista-historico');
        lista.innerHTML = '';
        
        if (anotacoes.length === 0) {
            lista.innerHTML = '<p>Ainda não há anotações. Comecem o primeiro devocional!</p>';
        } else {
            anotacoes.slice().reverse().forEach(anot => {
                const div = document.createElement('div');
                div.className = 'item-historico';
                div.innerHTML = `
                    <h3>${anot.titulo}</h3>
                    <p><small>${anot.data}</small></p>
                    <p><strong>Clari:</strong> ${anot.clari_escreveu || '...'}</p>
                    <p><strong>Mamãe:</strong> ${anot.clau_escreveu || '...'}</p>
                `;
                lista.appendChild(div);
            });
        }
        
        navegar(telaHistorico);
    }
});
