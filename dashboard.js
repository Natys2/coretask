if (!window.dataVisualizacao) {
  window.dataVisualizacao = new Date().toLocaleDateString('pt-BR');
}

document.addEventListener('DOMContentLoaded', function () {
  function salvarDados(chave, dados) {
    localStorage.setItem(chave, JSON.stringify(dados));
  }
  function carregarDados(chave, padrao) {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : padrao;
  }
  let user = JSON.parse(localStorage.getItem('user')) || {};
  if (!user.nome || user.nome === 'VersaoTeste') {
    const nomeDigitado = prompt("Oii! Bem-vindo ao CoreTask. Qual é o seu nome?");
    if (nomeDigitado && nomeDigitado.trim() !== "") {
      user = { nome: nomeDigitado.trim(), usuario: 'CoreTask User' };
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      user = { nome: 'Convidado', usuario: 'CoreTask User' };
    }
  }

 
  const avatarSm = document.querySelector('.avatar-sm');
  const perfilSpan = document.querySelector('.user-header-profile span');
  if (avatarSm && perfilSpan) {
    perfilSpan.textContent = user.nome;
    const iniciais = user.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    avatarSm.textContent = iniciais || 'CT';
  }
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const text = link.textContent.trim();
      if (text.includes('Controle pessoal')) showResumeMonth();
      if (text.includes('Controle Financeiro')) showFinancas();
      if (text.includes('Controle Geral')) showEstudo();
      if (text.includes('Perfil')) showPerfil();
    });
  });

  document.querySelectorAll('.quick-links a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const text = link.textContent.trim();
      if (text.includes('Tarefas')) showTarefas();
      if (text.includes('Treino')) showTreino();
      if (text.includes('Alimentação')) showAlimentacao();
      if (text.includes('Estudo')) showEstudo();
      if (text.includes('Finanças')) showFinancas();
    });
  });
 
function showTarefas() {
  const el = document.getElementById('content-dashboard');
  const hoje = new Date().toLocaleDateString('pt-BR');
  let tarefas = carregarDados('tarefas', []);

  const [d, m, a] = window.dataVisualizacao.split('/');
  const dataIso = `${a}-${m}-${d}`;

  el.innerHTML = `
    <div class="tarefas-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div class="data-nav" style="display: flex; align-items: center; gap: 10px;">
        <button id="prev-day" class="nav-btn-styled">◀</button>
        <div style="position: relative; cursor: pointer;">
          <h3 style="margin: 0;">Data: ${window.dataVisualizacao}</h3>
          <input type="date" id="date-picker" value="${dataIso}" 
            style="position: absolute; opacity: 0; inset: 0; cursor: pointer; width: 100%;">
        </div>
        <button id="next-day" class="nav-btn-styled">▶</button>
      </div>
      ${window.dataVisualizacao === hoje ? 
        '<button id="add-tarefa-btn" class="main-btn">+ Adicionar tarefa</button>' : 
        '<span style="color: #888; font-size: 0.9em; background: #222; padding: 5px 10px; border-radius: 20px;">🔒 Histórico</span>'}
    </div>
    <div id="form-tarefa"></div>
    <div id="lista-tarefas"></div>
  `;

  document.getElementById('prev-day').onclick = () => mudarData(-1, showTarefas);
  document.getElementById('next-day').onclick = () => mudarData(1, showTarefas);
  document.getElementById('date-picker').onchange = (e) => {
    if(!e.target.value) return;
    const [ano, mes, dia] = e.target.value.split('-');
    window.dataVisualizacao = `${dia}/${mes}/${ano}`;
    showTarefas();
  };

  if (document.getElementById('add-tarefa-btn')) {
    document.getElementById('add-tarefa-btn').onclick = () => {
      document.getElementById('form-tarefa').innerHTML = `
        <form id="form-add-tarefa">
          <input type="text" name="tarefa" placeholder="Nova tarefa..." required>
          <button type="submit" class="btn-primary">Salvar</button>
        </form>`;
      
      document.getElementById('form-add-tarefa').onsubmit = (e) => {
        e.preventDefault();
        tarefas.push({ id: Date.now(), tarefa: e.target.tarefa.value, concluida: false, dataCriacao: hoje });
        salvarDados('tarefas', tarefas);
        document.getElementById('form-tarefa').innerHTML = '';
        renderTarefas();
      };
    };
  }

  function renderTarefas() {
    const lista = document.getElementById('lista-tarefas');
    const tarefasFiltradas = tarefas.filter(t => t.dataCriacao === window.dataVisualizacao);

    if (tarefasFiltradas.length === 0) {
      lista.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 20px; padding: 10% 0;">
          <img src="assets/undraw_calendar_8r6s.svg" alt="Vazio" style="width: 50%; max-width: 250px; opacity: 0.5;">
          <p style="color: #888;">Nenhuma tarefa para esta data.</p>
        </div>`;
      return;
    }

    lista.innerHTML = tarefasFiltradas.map((t) => {
      const originalIdx = tarefas.findIndex(item => item.id === t.id);
      return `
        <div class="tarefa-item">
          <div style="display: flex; align-items: center;">
            <button class="check-btn-custom ${t.concluida ? 'active' : ''}" onclick="toggleTarefa(${originalIdx})">
              ${t.concluida ? '✔' : ''}
            </button>
            <span style="text-decoration: ${t.concluida ? 'line-through' : 'none'}; color: ${t.concluida ? '#666' : '#fff'}">
              ${t.tarefa}
            </span>
          </div>
          <div class="actions">
            ${window.dataVisualizacao === hoje ? 
              `<button class="icon-btn edit-btn" onclick="editarTarefa(${originalIdx})"><img src="assets/icons/pencil.svg"></button>` : ''}
            <button class="icon-btn del-btn" onclick="deletarTarefa(${originalIdx})"><img src="assets/icons/trash.svg"></button>
          </div>
        </div>`;
    }).join('');
  }

  window.toggleTarefa = (idx) => {
    tarefas[idx].concluida = !tarefas[idx].concluida;
    salvarDados('tarefas', tarefas);
    renderTarefas();
  };

  window.deletarTarefa = (idx) => {
    if(confirm("Excluir tarefa?")) {
      tarefas.splice(idx, 1);
      salvarDados('tarefas', tarefas);
      renderTarefas();
    }
  };

  window.editarTarefa = (idx) => {
    const novo = prompt("Editar:", tarefas[idx].tarefa);
    if(novo) {
      tarefas[idx].tarefa = novo;
      salvarDados('tarefas', tarefas);
      renderTarefas();
    }
  };

  renderTarefas();
}

function showTreino() {
  const el = document.getElementById('content-dashboard');
  const hoje = new Date().toLocaleDateString('pt-BR');
  let treinos = carregarDados('treino', []);

  const [d, m, a] = window.dataVisualizacao.split('/');
  const dataIso = `${a}-${m}-${d}`;

  el.innerHTML = `
    <div class="tarefas-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div class="data-nav" style="display: flex; align-items: center; gap: 10px;">
        <button id="prev-day-treino" class="nav-btn-styled">◀</button>
        <div style="position: relative; cursor: pointer;">
          <h3 style="margin: 0;">Data: ${window.dataVisualizacao}</h3>
          <input type="date" id="date-picker-treino" value="${dataIso}" 
            style="position: absolute; opacity: 0; inset: 0; cursor: pointer; width: 100%;">
        </div>
        <button id="next-day-treino" class="nav-btn-styled">▶</button>
      </div>
      ${window.dataVisualizacao === hoje ? 
        '<button id="add-treino-btn" class="main-btn">+ Adicionar exercício</button>' : 
        '<span style="color: #888; font-size: 0.9em; background: #222; padding: 5px 10px; border-radius: 20px;">🔒 Histórico</span>'}
    </div>
    <div id="form-treino"></div>
    <div id="lista-treino"></div>
  `;

  document.getElementById('prev-day-treino').onclick = () => mudarData(-1, showTreino);
  document.getElementById('next-day-treino').onclick = () => mudarData(1, showTreino);
  document.getElementById('date-picker-treino').onchange = (e) => {
    if(!e.target.value) return;
    const [ano, mes, dia] = e.target.value.split('-');
    window.dataVisualizacao = `${dia}/${mes}/${ano}`;
    showTreino();
  };

  if (document.getElementById('add-treino-btn')) {
    document.getElementById('add-treino-btn').onclick = () => {
      document.getElementById('form-treino').innerHTML = `
        <form id="form-add-treino" style="background: var(--bg-form); padding: 15px; border-radius: 8px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px;">
          <input type="text" name="exercicio" placeholder="Nome do exercício (ex: Leg Press)" required style="padding: 8px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff;">
          <div style="display: flex; gap: 10px;">
            <input type="number" name="series" placeholder="Séries (ex: 4)" required style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff;">
            <input type="number" name="repeticoes" placeholder="Repetições (ex: 12)" required style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff;">
            <input type="number" step="0.5" name="peso" placeholder="Peso/Carga (kg)" required style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff;">
          </div>
          <input type="text" name="progresso" placeholder="Notas de evolução / progresso (ex: Subiu 5kg, executou bem)" style="padding: 8px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff;">
          <button type="submit" class="btn-primary" style="padding: 10px; background: var(--primary); border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Salvar Exercício</button>
        </form>`;
      
      document.getElementById('form-add-treino').onsubmit = (e) => {
        e.preventDefault();
        treinos.push({
          id: Date.now(),
          exercicio: e.target.exercicio.value,
          series: e.target.series.value,
          repeticoes: e.target.repeticoes.value,
          peso: e.target.peso.value,
          progresso: e.target.progresso.value,
          dataCriacao: hoje
        });
        salvarDados('treino', treinos);
        document.getElementById('form-treino').innerHTML = '';
        renderTreinos();
      };
    };
  }

  function renderTreinos() {
    const lista = document.getElementById('lista-treino');
    const treinosFiltrados = treinos.filter(t => t.dataCriacao === window.dataVisualizacao);

    if (treinosFiltrados.length === 0) {
      lista.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 20px; padding: 10% 0;">
          <p style="color: #888;">Nenhum treino registrado para esta data.</p>
        </div>`;
      return;
    }

    lista.innerHTML = treinosFiltrados.map((t) => {
      const originalIdx = treinos.findIndex(item => item.id === t.id);
      return `
        <div style="background: var(--bg-form); padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="margin: 0 0 5px 0; color: var(--primary-light);">${t.exercicio}</h4>
            <p style="margin: 0; color: #ccc; font-size: 0.9rem;">
              <b>${t.series}</b> séries x <b>${t.repeticoes}</b> repetições | Carga: <b>${t.peso} kg</b>
            </p>
            ${t.progresso ? `<small style="color: var(--success); display: block; margin-top: 4px;">📈 ${t.progresso}</small>` : ''}
          </div>
          <div class="actions" style="display: flex; gap: 8px;">
            <button class="icon-btn del-btn" onclick="deletarTreino(${originalIdx})" style="background: #bb2222; border: none; padding: 6px 10px; border-radius: 4px; color: #fff; cursor: pointer;">Excluir</button>
          </div>
        </div>`;
    }).join('');
  }

  window.deletarTreino = (idx) => {
    if(confirm("Excluir exercício?")) {
      treinos.splice(idx, 1);
      salvarDados('treino', treinos);
      renderTreinos();
    }
  };

  renderTreinos();
}

function showAlimentacao() {
  const el = document.getElementById('content-dashboard');
  const hoje = new Date().toLocaleDateString('pt-BR');
  let refeicoes = carregarDados('refeicoes', []);

  const [d, m, a] = window.dataVisualizacao.split('/');
  const dataIso = `${a}-${m}-${d}`;

  el.innerHTML = `
    <div class="tarefas-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div class="data-nav" style="display: flex; align-items: center; gap: 10px;">
        <button id="prev-day-alim" class="nav-btn-styled">◀</button>
        <div style="position: relative; cursor: pointer;">
          <h3 style="margin: 0;">Data: ${window.dataVisualizacao}</h3>
          <input type="date" id="date-picker-alim" value="${dataIso}" 
            style="position: absolute; opacity: 0; inset: 0; cursor: pointer; width: 100%;">
        </div>
        <button id="next-day-alim" class="nav-btn-styled">▶</button>
      </div>
      ${window.dataVisualizacao === hoje ? 
        '<button id="add-refeicao-btn" class="main-btn">+ Adicionar refeição</button>' : 
        '<span style="color: #888; font-size: 0.9em; background: #222; padding: 5px 10px; border-radius: 20px;">🔒 Histórico</span>'}
    </div>
    <div id="form-refeicao"></div>
    <div id="lista-refeicao"></div>
  `;

  document.getElementById('prev-day-alim').onclick = () => mudarData(-1, showAlimentacao);
  document.getElementById('next-day-alim').onclick = () => mudarData(1, showAlimentacao);
  document.getElementById('date-picker-alim').onchange = (e) => {
    if(!e.target.value) return;
    const [ano, mes, dia] = e.target.value.split('-');
    window.dataVisualizacao = `${dia}/${mes}/${ano}`;
    showAlimentacao();
  };

  if (document.getElementById('add-refeicao-btn')) {
    document.getElementById('add-refeicao-btn').onclick = () => {
      document.getElementById('form-refeicao').innerHTML = `
        <form id="form-add-refeicao" style="background: var(--bg-form); padding: 15px; border-radius: 8px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px;">
          <select name="tipo" required style="padding: 8px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff;">
            <option value="">Selecione a Refeição</option>
            <option value="Café da manhã">Café da manhã</option>
            <option value="Almoço">Almoço</option>
            <option value="Jantar">Jantar</option>
            <option value="Outros">Outros / Lanche</option>
          </select>
          <input type="time" name="horario" required style="padding: 8px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff;">
          <textarea name="descricao" placeholder="O que você comeu / Detalhes..." required style="padding: 8px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff; resize: vertical;"></textarea>
          <button type="submit" class="btn-primary" style="padding: 10px; background: var(--primary); border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Salvar Refeição</button>
        </form>`;
      
      document.getElementById('form-add-refeicao').onsubmit = (e) => {
        e.preventDefault();
        refeicoes.push({
          id: Date.now(),
          tipo: e.target.tipo.value,
          horario: e.target.horario.value,
          descricao: e.target.descricao.value,
          dataCriacao: hoje
        });
        salvarDados('refeicoes', refeicoes);
        document.getElementById('form-refeicao').innerHTML = '';
        renderRefeicoes();
      };
    };
  }

  function renderRefeicoes() {
    const lista = document.getElementById('lista-refeicao');
    const refeicoesFiltradas = refeicoes.filter(r => r.dataCriacao === window.dataVisualizacao);

    if (refeicoesFiltradas.length === 0) {
      lista.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 20px; padding: 10% 0;">
          <p style="color: #888;">Nenhuma refeição registrada para esta data.</p>
        </div>`;
      return;
    }

    lista.innerHTML = refeicoesFiltradas.map((r) => {
      const originalIdx = refeicoes.findIndex(item => item.id === r.id);
      return `
        <div style="background: var(--bg-form); padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="margin: 0 0 5px 0; color: var(--accent-yellow);">${r.tipo} <span style="font-size: 0.8rem; color: #888; font-weight: normal;">(${r.horario})</span></h4>
            <p style="margin: 0; color: #ccc; font-size: 0.95rem;">${r.descricao}</p>
          </div>
          <div>
            <button onclick="deletarRefeicao(${originalIdx})" style="background: #bb2222; border: none; padding: 6px 10px; border-radius: 4px; color: #fff; cursor: pointer;">Excluir</button>
          </div>
        </div>`;
    }).join('');
  }

  window.deletarRefeicao = (idx) => {
    if(confirm("Excluir refeição?")) {
      refeicoes.splice(idx, 1);
      salvarDados('refeicoes', refeicoes);
      renderRefeicoes();
    }
  };

  renderRefeicoes();
}

function showEstudo() {
  const el = document.getElementById('content-dashboard');
  const hoje = new Date().toLocaleDateString('pt-BR');
  let estudos = carregarDados('estudos', []);

  const [d, m, a] = window.dataVisualizacao.split('/');
  const dataIso = `${a}-${m}-${d}`;

  el.innerHTML = `
    <div class="tarefas-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div class="data-nav" style="display: flex; align-items: center; gap: 10px;">
        <button id="prev-day-estudo" class="nav-btn-styled">◀</button>
        <div style="position: relative; cursor: pointer;">
          <h3 style="margin: 0;">Data: ${window.dataVisualizacao}</h3>
          <input type="date" id="date-picker-estudo" value="${dataIso}" 
            style="position: absolute; opacity: 0; inset: 0; cursor: pointer; width: 100%;">
        </div>
        <button id="next-day-estudo" class="nav-btn-styled">▶</button>
      </div>
      ${window.dataVisualizacao === hoje ? 
        '<button id="add-estudo-btn" class="main-btn">+ Adicionar estudo</button>' : 
        '<span style="color: #888; font-size: 0.9em; background: #222; padding: 5px 10px; border-radius: 20px;">🔒 Histórico</span>'}
    </div>
    <div id="form-estudo"></div>
    <div id="lista-estudo"></div>
  `;

  document.getElementById('prev-day-estudo').onclick = () => mudarData(-1, showEstudo);
  document.getElementById('next-day-estudo').onclick = () => mudarData(1, showEstudo);
  document.getElementById('date-picker-estudo').onchange = (e) => {
    if(!e.target.value) return;
    const [ano, mes, dia] = e.target.value.split('-');
    window.dataVisualizacao = `${dia}/${mes}/${ano}`;
    showEstudo();
  };

  if (document.getElementById('add-estudo-btn')) {
    document.getElementById('add-estudo-btn').onclick = () => {
      document.getElementById('form-estudo').innerHTML = `
        <form id="form-add-estudo" style="background: var(--bg-form); padding: 15px; border-radius: 8px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px;">
          <input type="text" name="materia" placeholder="Matéria ou Tópico (ex: Programação Web)" required style="padding: 8px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff;">
          <div style="display: flex; gap: 10px;">
            <input type="number" name="duracao" placeholder="Duração em minutos (ex: 60)" required style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff;">
            <input type="text" name="topicos" placeholder="O que estudou? (Resumo)" style="flex: 2; padding: 8px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff;">
          </div>
          <button type="submit" class="btn-primary" style="padding: 10px; background: var(--primary); border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Salvar Estudo</button>
        </form>`;
      
      document.getElementById('form-add-estudo').onsubmit = (e) => {
        e.preventDefault();
        estudos.push({
          id: Date.now(),
          materia: e.target.materia.value,
          duracao: e.target.duracao.value,
          topicos: e.target.topicos.value,
          dataCriacao: hoje
        });
        salvarDados('estudos', estudos);
        document.getElementById('form-estudo').innerHTML = '';
        renderEstudos();
      };
    };
  }

  function renderEstudos() {
    const lista = document.getElementById('lista-estudo');
    const estudosFiltrados = estudos.filter(e => e.dataCriacao === window.dataVisualizacao);

    if (estudosFiltrados.length === 0) {
      lista.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 20px; padding: 10% 0;">
          <p style="color: #888;">Nenhum registro de estudo para esta data.</p>
        </div>`;
      return;
    }

    lista.innerHTML = estudosFiltrados.map((e) => {
      const originalIdx = estudos.findIndex(item => item.id === e.id);
      return `
        <div style="background: var(--bg-form); padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="margin: 0 0 5px 0; color: #3b82f6;">${e.materia} <span style="font-size: 0.8rem; color: #888; font-weight: normal;">(${e.duracao} min)</span></h4>
            ${e.topicos ? `<p style="margin: 0; color: #ccc; font-size: 0.9rem;">${e.topicos}</p>` : ''}
          </div>
          <div>
            <button onclick="deletarEstudo(${originalIdx})" style="background: #bb2222; border: none; padding: 6px 10px; border-radius: 4px; color: #fff; cursor: pointer;">Excluir</button>
          </div>
        </div>`;
    }).join('');
  }

  window.deletarEstudo = (idx) => {
    if(confirm("Excluir registro de estudo?")) {
      estudos.splice(idx, 1);
      salvarDados('estudos', estudos);
      renderEstudos();
    }
  };

  renderEstudos();
}

function mudarData(direcao, callbackRender) {
  const partes = window.dataVisualizacao.split('/');
  const dataAtual = new Date(partes[2], partes[1] - 1, partes[0]);
  dataAtual.setDate(dataAtual.getDate() + direcao);
  window.dataVisualizacao = dataAtual.toLocaleDateString('pt-BR');
  callbackRender();
}

async function carregarDicaInteligente() {
  const containerDica = document.getElementById('dica-ia-texto');
  if (containerDica) {
    containerDica.textContent = "Gerando seu relatório inteligente...";
  }

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    if (containerDica) {
      containerDica.textContent = "Oii, aqui está seu resumo no CoreTask! (A IA integrada via API funciona perfeitamente quando o projeto estiver no ar na Vercel).";
    }
    return;
  }

  const dataAtual = new Date();
  const mesAtual = dataAtual.getMonth() + 1;
  const anoAtual = dataAtual.getFullYear();

  const tarefas = localStorage.getItem('tarefas') || '[]';
  const financasBrutas = JSON.parse(localStorage.getItem('financas') || '{}');
  const estudos = localStorage.getItem('estudos') || '[]';
  const treinos = localStorage.getItem('treino') || '[]';
  const refeicoes = localStorage.getItem('refeicoes') || '[]';

  let financasFiltradas = {};
  for (let ano in financasBrutas) {
    if (Number(ano) <= anoAtual) {
      financasFiltradas[ano] = {};
      for (let mes in financasBrutas[ano]) {
        if (Number(ano) < anoAtual || Number(mes) <= mesAtual) {
          financasFiltradas[ano][mes] = financasBrutas[ano][mes];
        }
      }
    }
  }

  try {
    const resposta = await fetch('/api/dica', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tarefas, financasFiltradas, estudos, treinos, refeicoes })
    });

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const textoBruto = await resposta.text();
    if (!textoBruto) {
      throw new Error('Resposta vazia da API');
    }

    const resultado = JSON.parse(textoBruto);
    
    if (containerDica) {
      if (resultado.relatorio) {
        containerDica.innerHTML = resultado.relatorio.replace(/\n/g, '<br>');
      } else {
        containerDica.textContent = "Oii, aqui está seu resumo no CoreTask! Deu uma travadinha aqui na IA, mas continue firme nos registros!";
      }
    }
  } catch (error) {
    console.error("Erro ao buscar relatório da IA:", error);
    if (containerDica) {
      containerDica.textContent = "Oii, aqui está seu resumo no CoreTask! A cota de testes ou o servidor deu uma pausa, mas seus dados estão salvos e seguros.";
    }
  }
}
function showResumeMonth() {
  const el = document.getElementById('content-dashboard');
  const dataAtual = new Date();
  const mesAtual = dataAtual.getMonth() + 1;
  const anoAtual = dataAtual.getFullYear();
  const mesFormatado = String(mesAtual).padStart(2, '0');

  const tarefas = carregarDados('tarefas', []);
  const treinos = carregarDados('treino', []);
  const estudos = carregarDados('estudos', []);
  const refeicoes = carregarDados('refeicoes', []);
  const dadosFinancas = carregarDados('financas', {});

  const tarefasDoMes = tarefas.filter(t => {
    if (!t.dataCriacao) return false;
    const partes = t.dataCriacao.split('/');
    return partes[1] === mesFormatado && partes[2] == anoAtual;
  });
  
  const totalTarefas = tarefasDoMes.length;
  const concluidasTarefas = tarefasDoMes.filter(t => t.concluida).length;
  const progressoTarefas = totalTarefas > 0 ? Math.round((concluidasTarefas / totalTarefas) * 100) : 0;

  const financasMes = dadosFinancas[anoAtual] && dadosFinancas[anoAtual][mesAtual] 
    ? dadosFinancas[anoAtual][mesAtual] 
    : { salario: 0, contas: [] };
  
  const totalContas = financasMes.contas.reduce((acc, c) => acc + c.valor, 0);
  const totalPagas = financasMes.contas.filter(c => c.pago).reduce((acc, c) => acc + c.valor, 0);
  const saldoMes = financasMes.salario - totalPagas;

  const totalEstudosMin = estudos.reduce((acc, e) => acc + Number(e.duracao || 0), 0);
  const horasEstudo = (totalEstudosMin / 60).toFixed(1);

  const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  el.innerHTML = `
    <div class="resumo-mes-container">
      <h2>Resumo Mensal - ${nomesMeses[mesAtual - 1]} / ${anoAtual}</h2>
      <p style="color: var(--text-dim); margin-bottom: 25px;">Aqui está um panorama geral de tudo o que você registrou este mês.</p>
      
      <div class="resumo-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 30px;">
        
        <div style="background: var(--bg-form); padding: 20px; border-radius: 10px; border-left: 4px solid var(--primary);">
          <h4 style="color: var(--text-dim); font-size: 0.85rem; margin-bottom: 8px;">TAREFAS CONCLUÍDAS</h4>
          <p style="font-size: 1.5rem; font-weight: bold; margin: 0;">${concluidasTarefas} / ${totalTarefas}</p>
          <div style="background: #333; border-radius: 4px; height: 6px; margin-top: 10px; overflow: hidden;">
            <div style="background: var(--primary); height: 100%; width: ${progressoTarefas}%;"></div>
          </div>
          <small style="color: var(--text-dim); margin-top: 5px; display: block;">${progressoTarefas}% concluído</small>
        </div>

        <div style="background: var(--bg-form); padding: 20px; border-radius: 10px; border-left: 4px solid var(--success);">
          <h4 style="color: var(--text-dim); font-size: 0.85rem; margin-bottom: 8px;">SALDO DO MÊS</h4>
          <p style="font-size: 1.5rem; font-weight: bold; margin: 0; color: ${saldoMes < 0 ? 'var(--danger)' : 'var(--success)'};">
            R$ ${saldoMes.toFixed(2)}
          </p>
          <small style="color: var(--text-dim); margin-top: 10px; display: block;">Entrada: R$ ${financasMes.salario} | Saídas: R$ ${totalPagas}</small>
        </div>

        <div style="background: var(--bg-form); padding: 20px; border-radius: 10px; border-left: 4px solid var(--accent-yellow);">
          <h4 style="color: var(--text-dim); font-size: 0.85rem; margin-bottom: 8px;">TEMPO DE ESTUDO</h4>
          <p style="font-size: 1.5rem; font-weight: bold; margin: 0;">${horasEstudo} hrs</p>
          <small style="color: var(--text-dim); margin-top: 10px; display: block;">Registros: ${estudos.length} atividades</small>
        </div>

        <div style="background: var(--bg-form); padding: 20px; border-radius: 10px; border-left: 4px solid #3b82f6;">
          <h4 style="color: var(--text-dim); font-size: 0.85rem; margin-bottom: 8px;">REGISTROS DE ROTINA</h4>
          <p style="font-size: 1.5rem; font-weight: bold; margin: 0;">${treinos.length} Treinos</p>
          <small style="color: var(--text-dim); margin-top: 10px; display: block;">Refeições cadastradas: ${refeicoes.length}</small>
        </div>

      </div>

      <div style="background: var(--bg-form); padding: 20px; border-radius: 10px;">
        <h3 style="margin-bottom: 15px; font-size: 1.1rem; color: var(--primary-light);">🤖 Dica Inteligente do CoreTask</h3>
        <p id="dica-ia-texto" style="color: var(--text-main); font-size: 0.95rem; line-height: 1.5; font-style: italic;">
          Analisando seus dados... gerando dica personalizada...
        </p>
      </div>

    </div>
  `;

  carregarDicaInteligente();
}

  function showFinancas() {
    const contentDashboard = document.getElementById('content-dashboard');
    let dadosFinancas = carregarDados('financas', {});
    let metas = carregarDados('metas', []);
    let valoresGuardados = carregarDados('guardados', {});

    contentDashboard.innerHTML = `
      <h2>Finanças</h2>
      <div id="anos-financas">
        <button class="ano-btn" data-ano="2026">2026</button>
        <button class="ano-btn" data-ano="2025">2025</button>
        <button class="ano-btn" data-ano="2024">2024</button>
      </div>
      <div id="meses-financas"></div>
      <div id="financas-ano"></div>
    `;

function renderResumoAno(ano) {
    const contentFinancas = document.getElementById('financas-ano');
    let dadosFinancas = carregarDados('financas', {});
    let metas = carregarDados('metas', []);
    let valoresGuardados = carregarDados('guardados', {});
    
    let dividaStatus = carregarDados('divida_critica', { 
        nome: 'Dívida Prioritária', 
        total: 0, 
        economizado: 0,
        ativa: false  
    });

    let totalSalarioAno = 0;
    let totalGastoAno = 0;
    let prevSaldo = null;

    for (let m = 1; m <= 12; m++) {
        const mesData = dadosFinancas[ano] && dadosFinancas[ano][m] ? dadosFinancas[ano][m] : { salario: 0, contas: [] };
        const totalPagas = mesData.contas.filter(c => c.pago).reduce((acc, c) => acc + c.valor, 0);
        totalSalarioAno += mesData.salario;
        totalGastoAno += totalPagas;
    }

    let html = `
      <div style="margin-top: 20px;">
        <h3>Resumo Financeiro Anual - ${ano}</h3>
        
        <div class="resumo-cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
          <div class="card-financeiro" style="background: #252525; padding: 15px; border-radius: 10px; border-left: 4px solid #bb86fc; text-align: center;">
            <h4 style="color: #888; font-size: 0.8rem; margin-bottom: 5px;">SALÁRIO ACUMULADO</h4>
            <p style="font-size: 1.3rem; font-weight: bold; margin: 0;">R$ ${totalSalarioAno.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
          </div>
          <div class="card-financeiro" style="background: #252525; padding: 15px; border-radius: 10px; border-left: 4px solid #bb2222; text-align: center;">
            <h4 style="color: #888; font-size: 0.8rem; margin-bottom: 5px;">TOTAL PAGO (SAÍDAS)</h4>
            <p style="font-size: 1.3rem; font-weight: bold; margin: 0;">R$ ${totalGastoAno.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
          </div>
          <div class="card-financeiro" style="background: #252525; padding: 15px; border-radius: 10px; border-left: 4px solid #2ecc40; text-align: center;">
            <h4 style="color: #888; font-size: 0.8rem; margin-bottom: 5px;">SALDO LIVRE ATUAL</h4>
            <p style="font-size: 1.3rem; font-weight: bold; margin: 0;">R$ ${(totalSalarioAno - totalGastoAno).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
          </div>
        </div>

        <div id="dividas-pesadas-container">`;
    
    if (dividaStatus.ativa) {
        html += `
        <div id="dividas-pesadas" style="margin-bottom: 30px; background: #1a1a1a; padding: 20px; border-radius: 12px; border: 2px solid #dc3545; box-shadow: 0 0 15px rgba(220, 53, 69, 0.2);">
          <h3 style="color: #dc3545; margin-top: 0; display: flex; align-items: center; gap: 10px;">🚀 ${dividaStatus.nome}</h3>
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
            <div>
              <p style="color: #888; margin: 0; font-size: 0.8rem;">SALDO DEVEDOR TOTAL</p>
              <h2 style="font-size: 2.2rem; margin: 0; color: #fff;">R$ ${dividaStatus.total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h2>
              <p style="color: #2ecc40; margin-top: 5px; font-weight: bold;">💰 Juros economizados: R$ ${dividaStatus.economizado.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
            </div>
            <div>
                <button id="btn-abatir-divida" style="background: #dc3545; color: white; padding: 12px 20px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-right: 10px;">Registrar Antecipação</button>
                <button id="btn-reset-divida" style="background: #444; color: white; padding: 12px; border: none; border-radius: 8px; cursor: pointer;">⚙️</button>
            </div>
          </div>
        </div>`;
    } else {
        html += `
        <button id="btn-config-divida" style="background: #444; color: #fed71c; margin-bottom: 30px; padding: 15px; border: 1px dashed #fed71c; border-radius: 12px; width: 100%; cursor: pointer; font-weight: bold;">
          + Configurar Dívida Crítica (Esta seção é privada e salva apenas no seu navegador)
        </button>`;
    }

    html += `
        </div>

        <table style="width:100%; border-collapse: collapse; background: #1e1e1e; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: #2a2a2a; color: #fed71c; text-align: left;">
              <th style="padding: 12px;">Mês</th>
              <th style="padding: 12px; text-align: center;">Entrada</th>
              <th style="padding: 12px; text-align: center;">Saída</th>
              <th style="padding: 12px; text-align: center;">Saldo</th>
              <th style="padding: 12px; text-align: center;">Evolução</th>
            </tr>
          </thead>
          <tbody>`;

    for (let m = 1; m <= 12; m++) {
        const mesData = dadosFinancas[ano] && dadosFinancas[ano][m] ? dadosFinancas[ano][m] : { salario: 0, contas: [] };
        const totalContas = mesData.contas.reduce((acc, c) => acc + c.valor, 0);
        const totalPagas = mesData.contas.filter(c => c.pago).reduce((acc, c) => acc + c.valor, 0);
        const totalGuardado = valoresGuardados[ano] && valoresGuardados[ano][m] ? valoresGuardados[ano][m] : 0;
        const saldoLivre = mesData.salario - totalPagas - totalGuardado;

        let tendenciaHtml = `<span style="color: #666;">--</span>`;
        if (prevSaldo !== null && mesData.salario > 0) {
            if (saldoLivre > prevSaldo) tendenciaHtml = `<span style="color: #2ecc40;">▲ Melhora</span>`;
            else if (saldoLivre < prevSaldo) tendenciaHtml = `<span style="color: #bb2222;">▼ Queda</span>`;
        }

        html += `
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 10px; font-weight: bold;">${["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][m-1]}</td>
            <td style="text-align:center;">R$ ${mesData.salario}</td>
            <td style="text-align:center; color: #aaa;">R$ ${totalContas}</td>
            <td style="text-align:center; color:${saldoLivre < 0 ? '#bb2222' : '#2ecc40'}; font-weight: bold;">R$ ${saldoLivre.toFixed(2)}</td>
            <td style="text-align:center;">${tendenciaHtml}</td>
          </tr>`;
        
        if (mesData.salario > 0) prevSaldo = saldoLivre;
    }

    html += `</tbody></table></div>`;
    
    html += `<h4 style="margin-top: 30px;">Progresso das Metas</h4><div id="lista-metas-resumo">`;
    metas.forEach(meta => {
        const guardadoGeral = Object.values(valoresGuardados).reduce((acc, anoObj) => acc + Object.values(anoObj).reduce((a, v) => a + v, 0), 0);
        const percent = Math.min(100, Math.round((guardadoGeral / meta.valor) * 100));
        html += `
          <div style="margin-bottom:15px; background: #252525; padding: 10px; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span><b>${meta.nome}</b></span>
                <span>R$ ${guardadoGeral} / R$ ${meta.valor}</span>
            </div>
            <div style="background:#444; border-radius:10px; overflow:hidden; height:12px; width:100%;">
              <div style="background: linear-gradient(90deg, #a970ff, #fed71c); height:100%; width:${percent}%; transition:width 0.5s;"></div>
            </div>
          </div>`;
    });
    html += `</div>`;
    html += `<button id="criar-meta-btn" class="btn-primary" style="background:#fed71c; color:#232323; width: 100%; margin-top: 10px;">+ Criar Nova Meta</button>`;

    contentFinancas.innerHTML = html;

    if (document.getElementById('btn-config-divida')) {
        document.getElementById('btn-config-divida').onclick = function() {
            const nome = prompt("Nome da dívida (ex: Mercado Pago):");
            const total = parseFloat(prompt("Valor total da dívida atual:"));
            if (nome && !isNaN(total)) {
                dividaStatus = { nome, total, economizado: 0, ativa: true };
                salvarDados('divida_critica', dividaStatus);
                renderResumoAno(ano);
            }
        };
    }

    if (document.getElementById('btn-abatir-divida')) {
        document.getElementById('btn-abatir-divida').onclick = function() {
            const pago = parseFloat(prompt("Quanto você pagou hoje?"));
            const abatido = parseFloat(prompt("Quanto a dívida diminuiu no total?"));
            if (!isNaN(pago) && !isNaN(abatido)) {
                dividaStatus.total -= abatido;
                dividaStatus.economizado += (abatido - pago);
                salvarDados('divida_critica', dividaStatus);
                showToast("Dívida atualizada! 🚀");
                renderResumoAno(ano);
            }
        };
        
        document.getElementById('btn-reset-divida').onclick = function() {
            if(confirm("Deseja resetar ou alterar as configurações desta dívida?")) {
                localStorage.removeItem('divida_critica');
                renderResumoAno(ano);
            }
        };
    }

    document.getElementById('criar-meta-btn').onclick = function () {
        const nome = prompt("Nome da meta:");
        const valor = parseFloat(prompt("Valor desejado:"));
        if (nome && !isNaN(valor)) {
            metas.push({ nome, valor });
            salvarDados('metas', metas);
            renderResumoAno(ano);
        }
    };
}

    document.querySelectorAll('.ano-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const ano = btn.getAttribute('data-ano');
        renderResumoAno(ano); 

        const meses = [
          "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
          "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        let mesesHtml = '<h3>Selecione o mês:</h3><div style="display:flex;flex-wrap:wrap;gap:10px;">';
        meses.forEach((mes, idx) => {
          mesesHtml += `<button class="mes-btn" data-mes="${idx+1}" data-mesnome="${mes}">${mes}</button>`;
        });
        mesesHtml += '</div>';
        document.getElementById('meses-financas').innerHTML = mesesHtml;

        document.querySelectorAll('.mes-btn').forEach(mesBtn => {
          mesBtn.addEventListener('click', function () {
            const mes = mesBtn.getAttribute('data-mes');
            const mesNome = mesBtn.getAttribute('data-mesnome');
            document.getElementById('financas-ano').innerHTML = `
              <h3>Finanças de ${mesNome} / ${ano}</h3>
              <button id="add-salario-btn" type="button" style="background:#bb86fc;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-weight:bold;cursor:pointer;margin-bottom:10px;">Salário mensal +</button>
              <button id="add-conta-btn" type="button" style="background:#a970ff;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-weight:bold;cursor:pointer;margin-bottom:10px;">+ Adicionar conta</button>
              <button id="guardar-btn" style="background:#fed71c;color:#232323;border:none;padding:8px 16px;border-radius:6px;font-weight:bold;cursor:pointer;margin-bottom:10px;">Guardar para meta</button>
              <div id="form-container"></div>
              <div id="lista-financas"></div>
            `;

            const lista = document.getElementById('lista-financas');
            const formContainer = document.getElementById('form-container');

            if (!dadosFinancas[ano]) dadosFinancas[ano] = {};
            if (!dadosFinancas[ano][mes]) dadosFinancas[ano][mes] = { salario: 0, contas: [] };

            function renderContas() {
              const contas = dadosFinancas[ano][mes].contas;
              const salario = dadosFinancas[ano][mes].salario;

              let totalContas = contas.reduce((acc, c) => acc + c.valor, 0);
              let totalPagas = contas.filter(c => c.pago).reduce((acc, c) => acc + c.valor, 0);
              let totalGuardado = valoresGuardados[ano] && valoresGuardados[ano][mes] ? valoresGuardados[ano][mes] : 0;
              let saldo = salario - totalPagas - totalGuardado;

              lista.innerHTML = contas.map((c, idx) =>
                `<p>
                  <b>${c.nome}</b>: R$ ${c.valor} ${c.comentario ? '| ' + c.comentario : ''}
                  ${c.pago ? '<span style="color:#2ecc40;font-weight:bold;margin-left:8px;">✔️ PAGO</span>' : ''}
                  <button class="edit-btn" data-idx="${idx}">Editar</button>
                  <button class="del-btn" data-idx="${idx}">Excluir</button>
                  <button class="pago-btn${c.pago ? ' pago' : ''}" data-idx="${idx}">
                    ${c.pago ? 'Desmarcar pago' : 'Marcar como pago'}
                  </button>
                </p>`
              ).join('');

              lista.innerHTML += `<p><b>Salário:</b> R$ ${salario}</p>`;
              lista.innerHTML += `<p><b>Total contas:</b> <span style="color:${totalContas > salario ? '#bb2222' : '#fff'}">R$ ${totalContas}</span></p>`;
              lista.innerHTML += `<p><b>Guardado:</b> R$ ${totalGuardado}</p>`;
              lista.innerHTML += `<p><b>Saldo:</b> <span style="color:${saldo < 0 ? '#bb2222' : '#2ecc40'}">R$ ${saldo}</span></p>`;

              lista.querySelectorAll('.del-btn').forEach(btn => {
                btn.onclick = function () {
                  const idx = btn.getAttribute('data-idx');
                  contas.splice(idx, 1);
                  salvarDados('financas', dadosFinancas);
                  showToast('Conta excluída!');
                  renderContas();
                };
              });

              lista.querySelectorAll('.edit-btn').forEach(btn => {
                btn.onclick = function () {
                  const idx = btn.getAttribute('data-idx');
                  const conta = contas[idx];
                  formContainer.innerHTML = `
                    <form id="form-financas-edit">
                      <label>Nome da conta:</label>
                      <input type="text" name="nome" value="${conta.nome}" required>
                      <label>Valor:</label>
                      <input type="number" name="valor" value="${conta.valor}" required>
                      <label>Comentário:</label>
                      <input type="text" name="comentario" value="${conta.comentario || ''}">
                      <button type="submit">Salvar edição</button>
                    </form>
                  `;
                  const formEdit = document.getElementById('form-financas-edit');
                  formEdit.onsubmit = function (ev) {
                    ev.preventDefault();
                    conta.nome = formEdit.nome.value;
                    conta.valor = Number(formEdit.valor.value);
                    conta.comentario = formEdit.comentario.value;
                    salvarDados('financas', dadosFinancas);
                    formContainer.innerHTML = '';
                    showToast('Conta editada!');
                    renderContas();
                  };
                };
              });

              lista.querySelectorAll('.pago-btn').forEach(btn => {
                btn.onclick = function () {
                  const idx = btn.getAttribute('data-idx');
                  contas[idx].pago = !contas[idx].pago;
                  salvarDados('financas', dadosFinancas);
                  showToast(contas[idx].pago ? 'Conta marcada como paga!' : 'Conta marcada como não paga!');
                  renderContas();
                };
              });
            }

            document.getElementById('add-salario-btn').onclick = function () {
              formContainer.innerHTML = `
                <form id="form-salario">
                  <label>Salário mensal:</label>
                  <input type="number" name="salario" required>
                  <button type="submit">Salvar salário</button>
                </form>
              `;
              const formSalario = document.getElementById('form-salario');
              formSalario.onsubmit = function (ev) {
                showToast('Salário atualizado com sucesso!');
                ev.preventDefault();
                dadosFinancas[ano][mes].salario = Number(formSalario.salario.value);
                salvarDados('financas', dadosFinancas);
                formContainer.innerHTML = '';
                renderContas();
              };
            };

            document.getElementById('add-conta-btn').onclick = function () {
              formContainer.innerHTML = `
                <form id="form-financas">
                  <label>Nome da conta:</label>
                  <input type="text" name="nome" required>
                  <label>Valor:</label>
                  <input type="number" name="valor" required>
                  <label>Comentário:</label>
                  <input type="text" name="comentario">
                  <button type="submit">Salvar</button>
                </form>
              `;
              const form = document.getElementById('form-financas');
              form.onsubmit = function (ev) {
                showToast('Conta adicionada com sucesso!');
                ev.preventDefault();
                const nome = form.nome.value;
                const valor = Number(form.valor.value);
                const comentario = form.comentario.value;

                dadosFinancas[ano][mes].contas.push({ nome, valor, comentario, pago: false });
                salvarDados('financas', dadosFinancas);
                formContainer.innerHTML = '';
                renderContas();
              };
            };

            document.getElementById('guardar-btn').onclick = function () {
              formContainer.innerHTML = `
                <form id="form-guardar">
                  <label>Valor para guardar:</label>
                  <input type="number" name="valor" required>
                  <button type="submit">Guardar</button>
                </form>
              `;
              document.getElementById('form-guardar').onsubmit = function (ev) {
                ev.preventDefault();
                const valor = Number(this.valor.value);
                if (!valoresGuardados[ano]) valoresGuardados[ano] = {};
                if (!valoresGuardados[ano][mes]) valoresGuardados[ano][mes] = 0;
                valoresGuardados[ano][mes] += valor;
                salvarDados('guardados', valoresGuardados);
                showToast('Valor guardado para meta!');
                formContainer.innerHTML = '';
                renderContas();
              };
            };

            renderContas();
          });
        });
      });
    });
  }

  function exportarDados(chave) {
    const dados = localStorage.getItem(chave);
    if (!dados) return showToast('Nenhum dado para exportar!');
    const blob = new Blob([dados], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = chave + '.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Dados exportados com sucesso!');
  }

  function importarDados(chave, callback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = function (e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (ev) {
        try {
          const dados = JSON.parse(ev.target.result);
          localStorage.setItem(chave, JSON.stringify(dados));
          if (callback) callback();
          showToast('Dados importados com sucesso!');
        } catch {
          showToast('Arquivo Invalido!');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function showPerfil() {
    const el = document.getElementById('content-dashboard');
    let user = carregarDados('user', { nome: 'VersaoTeste', usuario: 'CoreTask User' });
    el.innerHTML = `
      <div class="perfil-area">
        <h2>Perfil</h2>
        <p><b>Nome:</b> ${user.nome}</p>
        <p><b>Usuário:</b> ${user.usuario}</p>
        <p><b>Senha:</b> ******** <br> 
          <small style="color: #fed71c; font-style: italic;">
            (Não é muito legal deixar sua senha aberta assim, né? kk)
          </small>
        </p>
        <hr>
        <h3>Backup dos dados</h3>
        <div class="backup-btns">
          <button id="export-tarefas">Exportar tarefas</button>
          <button id="import-tarefas">Importar tarefas</button>
          <button id="export-treino">Exportar treino</button>
          <button id="import-treino">Importar treino</button>
          <button id="export-refeicoes">Exportar alimentação</button>
          <button id="import-refeicoes">Importar alimentação</button>
          <button id="export-estudos">Exportar estudos</button>
          <button id="import-estudos">Importar estudos</button>
          <button id="export-financas">Exportar finanças</button>
          <button id="import-financas">Importar finanças</button>
          <button id="reset-dados" style="background:#bb2222;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-weight:bold;cursor:pointer;margin-top:10px;">Redefinir todos os dados</button>
        </div>
      </div>      
      <p style="margin-top:20px;font-size:0.9em;color:#aaa;">Desenvolvido por Natasha - 2025</p>
    `;
    document.getElementById('reset-dados').onclick = () => {
      if (confirm('Tem certeza que deseja redefinir todos os dados? Isso não pode ser desfeito.')) {
        localStorage.clear(); 
        showToast('Todos os dados foram redefinidos!');
        setTimeout(() => { location.reload(); }, 2500);
      }
    }
    document.getElementById('export-tarefas').onclick = () => exportarDados('tarefas');
    document.getElementById('import-tarefas').onclick = () => importarDados('tarefas', showTarefas);

    document.getElementById('export-treino').onclick = () => exportarDados('treino');
    document.getElementById('import-treino').onclick = () => importarDados('treino', showTreino);

    document.getElementById('export-refeicoes').onclick = () => exportarDados('refeicoes');
    document.getElementById('import-refeicoes').onclick = () => importarDados('refeicoes', showAlimentacao);

    document.getElementById('export-estudos').onclick = () => exportarDados('estudos');
    document.getElementById('import-estudos').onclick = () => importarDados('estudos', showEstudo);

    document.getElementById('export-financas').onclick = () => exportarDados('financas');
    document.getElementById('import-financas').onclick = () => importarDados('financas', showFinancas);
  }

  function showToast(msg) {
    const toast = document.getElementById('toast-notify');
    toast.textContent = msg;
    toast.classList.add('show');
    toast.style.display = 'block';
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { toast.style.display = 'none'; }, 400);
    }, 2200);
  }

  showTarefas();
  
  window.showToast = showToast;
  window.showPerfil = showPerfil;
  window.showTarefas = showTarefas;
  window.showTreino = showTreino;
  window.showAlimentacao = showAlimentacao;
  window.showEstudo = showEstudo;
  window.showFinancas = showFinancas;
  window.exportarDados = exportarDados;
  window.importarDados = importarDados; 
  window.showResumeMonth = showResumeMonth;
});