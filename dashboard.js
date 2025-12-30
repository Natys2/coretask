
const salario = 25000; // Valor fixo do salário mensal ou comentar para usar o valor dinâmico

document.addEventListener('DOMContentLoaded', function () {
  console.log("Dashboard script carregado.");
  console.log("Funções disponíveis: showToast(msg), showPerfil(), showTarefas(), showTreino(), showAlimentacao(), showEstudo(), showFinancas()");
  console.log("Use essas funções no console para testar.");
  console.log("dados carregado:", localStorage);
  console.log("Para redefinir os dados, use localStorage.clear() no console.");
  console.log("Lembre-se de recarregar a página após limpar os dados.");
  console.log("Divirta-se!");
  function salvarDados(chave, dados) {
    localStorage.setItem(chave, JSON.stringify(dados));
  }
  function carregarDados(chave, padrao) {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : padrao;
  }

  // Navegação principal
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const text = link.textContent.trim();
      if (text.includes('Controle pessoal')) showTarefas();
      if (text.includes('Controle Financeiro')) showFinancas();
      if (text.includes('Controle Geral')) showEstudo();
      if (text.includes('Perfil')) showPerfil();
    });
  });

  // Quick links
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

  // TAREFAS
  function showTarefas() {
    const el = document.getElementById('content-dashboard');
    el.innerHTML = `
      <h2>Tarefas de Hoje</h2>
      <button id="add-tarefa-btn">+ Adicionar tarefa</button>
      <div id="form-tarefa"></div>
      <div id="lista-tarefas"></div>
    `;
    let tarefas = carregarDados('tarefas', []);
    renderTarefas();

    document.getElementById('add-tarefa-btn').onclick = function () {
      document.getElementById('form-tarefa').innerHTML = `
        <form id="form-add-tarefa">
          <label>Tarefa:</label>
          <input type="text" name="tarefa" required>
          <button type="submit">Salvar</button>
        </form>
      `;
      document.getElementById('form-add-tarefa').onsubmit = function (ev) {
        ev.preventDefault();
        tarefas.push({ tarefa: this.tarefa.value });
        salvarDados('tarefas', tarefas);
        this.reset();
        document.getElementById('form-tarefa').innerHTML = '';
        renderTarefas();
      };
    };

    function renderTarefas() {
      const lista = document.getElementById('lista-tarefas');
      lista.innerHTML = tarefas.map((t, idx) =>
        `<p>
          ${t.tarefa}
          <button class="edit-btn" data-idx="${idx}">Editar</button>
          <button class="del-btn" data-idx="${idx}">Excluir</button>
        </p>`
      ).join('');
      lista.querySelectorAll('.del-btn').forEach(btn => {
        btn.onclick = function () {
          tarefas.splice(btn.getAttribute('data-idx'), 1);
          salvarDados('tarefas', tarefas);
          renderTarefas();
        };
      });
      lista.querySelectorAll('.edit-btn').forEach(btn => {
        btn.onclick = function () {
          const idx = btn.getAttribute('data-idx');
          document.getElementById('form-tarefa').innerHTML = `
            <form id="form-edit-tarefa">
              <label>Tarefa:</label>
              <input type="text" name="tarefa" value="${tarefas[idx].tarefa}" required>
              <button type="submit">Salvar edição</button>
            </form>
          `;
          document.getElementById('form-edit-tarefa').onsubmit = function (ev) {
            ev.preventDefault();
            tarefas[idx].tarefa = this.tarefa.value;
            salvarDados('tarefas', tarefas);
            document.getElementById('form-tarefa').innerHTML = '';
            renderTarefas();
          };
        };
      });
    }
  }

  // TREINO
  function showTreino() {
    const el = document.getElementById('content-dashboard');
    el.innerHTML = `
      <h2>Treino</h2>
      <button id="add-treino-btn">+ Adicionar exercício</button>
      <div id="form-treino"></div>
      <div id="lista-treino"></div>
    `;
    let treino = carregarDados('treino', []);
    renderTreino();

    document.getElementById('add-treino-btn').onclick = function () {
      document.getElementById('form-treino').innerHTML = `
        <form id="form-add-treino">
          <label>Exercício:</label>
          <input type="text" name="exercicio" required>
          <label>Séries:</label>
          <input type="number" name="series" required>
          <label>Repetições:</label>
          <input type="number" name="repeticoes" required>
          <button type="submit">Salvar</button>
        </form>
      `;
      document.getElementById('form-add-treino').onsubmit = function (ev) {
        ev.preventDefault();
        treino.push({
          exercicio: this.exercicio.value,
          series: this.series.value,
          repeticoes: this.repeticoes.value
        });
        salvarDados('treino', treino);
        this.reset();
        document.getElementById('form-treino').innerHTML = '';
        renderTreino();
      };
    };

    function renderTreino() {
      const lista = document.getElementById('lista-treino');
      lista.innerHTML = treino.map((t, idx) =>
        `<p>
          ${t.exercicio} - ${t.series}x${t.repeticoes}
          <button class="edit-btn" data-idx="${idx}">Editar</button>
          <button class="del-btn" data-idx="${idx}">Excluir</button>
        </p>`
      ).join('');
      lista.querySelectorAll('.del-btn').forEach(btn => {
        btn.onclick = function () {
          treino.splice(btn.getAttribute('data-idx'), 1);
          salvarDados('treino', treino);
          renderTreino();
        };
      });
      lista.querySelectorAll('.edit-btn').forEach(btn => {
        btn.onclick = function () {
          const idx = btn.getAttribute('data-idx');
          document.getElementById('form-treino').innerHTML = `
            <form id="form-edit-treino">
              <label>Exercício:</label>
              <input type="text" name="exercicio" value="${treino[idx].exercicio}" required>
              <label>Séries:</label>
              <input type="number" name="series" value="${treino[idx].series}" required>
              <label>Repetições:</label>
              <input type="number" name="repeticoes" value="${treino[idx].repeticoes}" required>
              <button type="submit">Salvar edição</button>
            </form>
          `;
          document.getElementById('form-edit-treino').onsubmit = function (ev) {
            ev.preventDefault();
            treino[idx].exercicio = this.exercicio.value;
            treino[idx].series = this.series.value;
            treino[idx].repeticoes = this.repeticoes.value;
            salvarDados('treino', treino);
            document.getElementById('form-treino').innerHTML = '';
            renderTreino();
          };
        };
      });
    }
  }

  // ALIMENTAÇÃO
  function showAlimentacao() {
    const el = document.getElementById('content-dashboard');
    el.innerHTML = `
      <h2>Alimentação</h2>
      <button id="add-refeicao-btn">+ Adicionar refeição</button>
      <div id="form-refeicao"></div>
      <div id="lista-refeicao"></div>
    `;
    let refeicoes = carregarDados('refeicoes', []);
    renderRefeicao();

    document.getElementById('add-refeicao-btn').onclick = function () {
      document.getElementById('form-refeicao').innerHTML = `
        <form id="form-add-refeicao">
          <label>Refeição:</label>
          <input type="text" name="refeicao" required>
          <label>Horário:</label>
          <input type="time" name="horario" required>
          <button type="submit">Salvar</button>
        </form>
      `;
      document.getElementById('form-add-refeicao').onsubmit = function (ev) {
        ev.preventDefault();
        refeicoes.push({
          refeicao: this.refeicao.value,
          horario: this.horario.value
        });
        salvarDados('refeicoes', refeicoes);
        this.reset();
        document.getElementById('form-refeicao').innerHTML = '';
        renderRefeicao();
      };
    };

    function renderRefeicao() {
      const lista = document.getElementById('lista-refeicao');
      lista.innerHTML = refeicoes.map((r, idx) =>
        `<p>
          ${r.refeicao} - ${r.horario}
          <button class="edit-btn" data-idx="${idx}">Editar</button>
          <button class="del-btn" data-idx="${idx}">Excluir</button>
        </p>`
      ).join('');
      lista.querySelectorAll('.del-btn').forEach(btn => {
        btn.onclick = function () {
          refeicoes.splice(btn.getAttribute('data-idx'), 1);
          salvarDados('refeicoes', refeicoes);
          renderRefeicao();
        };
      });
      lista.querySelectorAll('.edit-btn').forEach(btn => {
        btn.onclick = function () {
          const idx = btn.getAttribute('data-idx');
          document.getElementById('form-refeicao').innerHTML = `
            <form id="form-edit-refeicao">
              <label>Refeição:</label>
              <input type="text" name="refeicao" value="${refeicoes[idx].refeicao}" required>
              <label>Horário:</label>
              <input type="time" name="horario" value="${refeicoes[idx].horario}" required>
              <button type="submit">Salvar edição</button>
            </form>
          `;
          document.getElementById('form-edit-refeicao').onsubmit = function (ev) {
            ev.preventDefault();
            refeicoes[idx].refeicao = this.refeicao.value;
            refeicoes[idx].horario = this.horario.value;
            salvarDados('refeicoes', refeicoes);
            document.getElementById('form-refeicao').innerHTML = '';
            renderRefeicao();
          };
        };
      });
    }
  }

  // ESTUDO
  function showEstudo() {
    const el = document.getElementById('content-dashboard');
    el.innerHTML = `
      <h2>Estudo</h2>
      <button id="add-estudo-btn">+ Adicionar atividade</button>
      <div id="form-estudo"></div>
      <div id="lista-estudo"></div>
    `;
    let estudos = carregarDados('estudos', []);
    renderEstudo();

    document.getElementById('add-estudo-btn').onclick = function () {
      document.getElementById('form-estudo').innerHTML = `
        <form id="form-add-estudo">
          <label>Matéria/Atividade:</label>
          <input type="text" name="materia" required>
          <label>Duração (min):</label>
          <input type="number" name="duracao" required>
          <button type="submit">Salvar</button>
        </form>
      `;
      document.getElementById('form-add-estudo').onsubmit = function (ev) {
        ev.preventDefault();
        estudos.push({
          materia: this.materia.value,
          duracao: this.duracao.value
        });
        salvarDados('estudos', estudos);
        this.reset();
        document.getElementById('form-estudo').innerHTML = '';
        renderEstudo();
      };
    };

    function renderEstudo() {
      const lista = document.getElementById('lista-estudo');
      lista.innerHTML = estudos.map((e, idx) =>
        `<p>
          ${e.materia} - ${e.duracao} min
          <button class="edit-btn" data-idx="${idx}">Editar</button>
          <button class="del-btn" data-idx="${idx}">Excluir</button>
        </p>`
      ).join('');
      lista.querySelectorAll('.del-btn').forEach(btn => {
        btn.onclick = function () {
          estudos.splice(btn.getAttribute('data-idx'), 1);
          salvarDados('estudos', estudos);
          renderEstudo();
        };
      });
      lista.querySelectorAll('.edit-btn').forEach(btn => {
        btn.onclick = function () {
          const idx = btn.getAttribute('data-idx');
          document.getElementById('form-estudo').innerHTML = `
            <form id="form-edit-estudo">
              <label>Matéria/Atividade:</label>
              <input type="text" name="materia" value="${estudos[idx].materia}" required>
              <label>Duração (min):</label>
              <input type="number" name="duracao" value="${estudos[idx].duracao}" required>
              <button type="submit">Salvar edição</button>
            </form>
          `;
          document.getElementById('form-edit-estudo').onsubmit = function (ev) {
            ev.preventDefault();
            estudos[idx].materia = this.materia.value;
            estudos[idx].duracao = this.duracao.value;
            salvarDados('estudos', estudos);
            document.getElementById('form-estudo').innerHTML = '';
            renderEstudo();
          };
        };
      });
    }
  }

  

  // FINANÇAS
  function showFinancas() {
    const contentDashboard = document.getElementById('content-dashboard');
    let dadosFinancas = carregarDados('financas', {});
    let metas = carregarDados('metas', []);
    let valoresGuardados = carregarDados('guardados', {});

    contentDashboard.innerHTML = `
      <h2>Finanças</h2>
      <div id="anos-financas">
        <button class="ano-btn" data-ano="2025">2025</button>
        <button class="ano-btn" data-ano="2024">2024</button>
      </div>
      <div id="meses-financas"></div>
      <div id="financas-ano"></div>
    `;

    function renderResumoAno(ano) {
      let html = `<h3>Resumo do ano ${ano}</h3><table style="width:100%;margin-bottom:20px;">
        <tr>
          <th>Mês</th>
          <th>Total contas</th>
          <th>Salário</th>
          <th>Saldo</th>
          <th>Guardado</th>
        </tr>`;
      for (let m = 1; m <= 12; m++) {
        const mesData = dadosFinancas[ano] && dadosFinancas[ano][m] ? dadosFinancas[ano][m] : { salario: 0, contas: [] };
        const totalContas = mesData.contas.reduce((acc, c) => acc + c.valor, 0);
        const totalGuardado = valoresGuardados[ano] && valoresGuardados[ano][m] ? valoresGuardados[ano][m] : 0;
        const saldo = mesData.salario - mesData.contas.filter(c => c.pago).reduce((acc, c) => acc + c.valor, 0) - totalGuardado;
        html += `<tr>
        <td>${["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"][m-1]}</td>
        <td>R$ ${totalContas}</td>
        <td>R$ ${mesData.salario}</td>
        <td style="color:${saldo < 0 ? '#bb2222' : '#2ecc40'}">R$ ${saldo}</td>
        <td>R$ ${totalGuardado}</td>
      </tr>`;
      }
      html += `</table>`;
      html += `<h4>Progresso das metas</h4><div style="margin-bottom:20px;">`;
      metas.forEach(meta => {
        const guardado = Object.values(valoresGuardados).reduce((acc, anoObj) => acc + Object.values(anoObj).reduce((a, v) => a + v, 0), 0);
        const percent = Math.min(100, Math.round((guardado / meta.valor) * 100));
        html += `<div style="margin-bottom:10px;">
          <b>${meta.nome}</b> - R$ ${guardado} / R$ ${meta.valor}
          <div style="background:#eee;border-radius:8px;overflow:hidden;height:18px;width:100%;margin-top:4px;">
            <div style="background:#a970ff;height:100%;width:${percent}%;transition:width 0.5s;"></div>
          </div>
          <span style="font-size:0.9em;">${percent}%</span>
        </div>`;
      });
      html += `</div>`;
      html += `<button id="criar-meta-btn" style="background:#fed71c;color:#232323;border:none;padding:8px 16px;border-radius:6px;font-weight:bold;cursor:pointer;margin-bottom:10px;">Criar meta</button>`;
      document.getElementById('financas-ano').innerHTML = html;

      document.getElementById('criar-meta-btn').onclick = function () {
        document.getElementById('financas-ano').innerHTML += `
          <form id="form-meta" style="margin-top:10px;">
            <label>Nome da meta:</label>
            <input type="text" name="nome" required>
            <label>Valor desejado:</label>
            <input type="number" name="valor" required>
            <button type="submit">Salvar meta</button>
          </form>
        `;
        document.getElementById('form-meta').onsubmit = function (ev) {
          ev.preventDefault();
          metas.push({ nome: this.nome.value, valor: Number(this.valor.value) });
          salvarDados('metas', metas);
          showToast('Meta criada!');
          renderResumoAno(ano);
        };
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

        // document.getElementById('financas-ano').innerHTML = '';

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
            //logs para debug no console
            console.log("Dados finanças:", dadosFinancas);
            console.log("Valores guardados:", valoresGuardados);
            console.log("Metas:", metas);
            console.log("Ano selecionado:", ano, "Mês selecionado:", mes);
            console.log("Salário deste mês:", dadosFinancas[ano][mes].salario);
            console.log("Contas deste mês:", dadosFinancas[ano][mes].contas);
            console.log("Funções disponíveis: renderContas() para atualizar a lista de contas após alterações.");
            console.log("Dados salvos do backup:", localStorage.getItem('financas'), localStorage.getItem('guardados'), localStorage.getItem('metas'));
            renderContas();
          });
        });
      });
    });
  }

  // Funções de exportação/importação, perfil e toast 
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

  // Função de perfil com backup
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
        </div>
      </div>      
      <p style="margin-top:20px;font-size:0.9em;color:#aaa;">Desenvolvido por Natasha - 2025</p>
    `;
    
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

  // Toast de notificação
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
 
  console.log("Bem-vindo ao CoreTask Dashboard!");
  
  //imports para debug de console.
  window.showToast = showToast;
  window.showPerfil = showPerfil;
  window.showTarefas = showTarefas;
  window.showTreino = showTreino;
  window.showAlimentacao = showAlimentacao;
  window.showEstudo = showEstudo;
  window.showFinancas = showFinancas;
  window.exportarDados = exportarDados;
  window.importarDados = importarDados; 
});