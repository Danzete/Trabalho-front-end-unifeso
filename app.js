
const { useState, useEffect } = React;
const html = htm.bind(React.createElement);

const dinheiro = n => Number(n).toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const diaMes = data => data.split('-').reverse().slice(0, 2).join('/');

async function api(caminho, opcoes = {}) {
  let resposta;

  try {
    resposta = await fetch('http://localhost:8080/api' + caminho, {
      headers: { 'Content-Type': 'application/json' },
      ...opcoes
    });
  } catch {
    throw new Error('Não consegui falar com o servidor. Ele está ligado?');
  }

  if (resposta.status === 204) return null;

  const corpo = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(corpo.erro || 'Algo deu errado. Tente de novo.');
  }

  return corpo;
}

const enviarJson = (metodo, dados) => ({
  method: metodo,
  body: JSON.stringify(dados)
});

function Lista({ itens, mensagemVazia, children }) {
  if (!itens.length) {
    return html`<p className="vazio">${mensagemVazia}</p>`;
  }

  return html`
    <ul className="lista">
      ${itens.map(item => html`
        <li key=${item.id}>${children(item)}</li>
      `)}
    </ul>
  `;
}

function BotaoExcluir({ onExcluir }) {
  const confirmar = () => {
    if (window.confirm('Excluir mesmo?')) onExcluir();
  };

  return html`
    <button className="botao-simples" onClick=${confirmar}>
      Excluir
    </button>
  `;
}

function FormProduto({ onSalvar }) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [erro, setErro] = useState('');

  async function enviar(e) {
    e.preventDefault();

    const precoNumero = parseFloat(preco.replace(',', '.'));
    const estoqueNumero = parseInt(estoque, 10);

    if (!nome.trim() || !(precoNumero > 0) || !(estoqueNumero >= 0)) {
      return setErro(
        'Preencha o nome, um preço maior que zero e a quantidade em estoque.'
      );
    }

    const mensagem = await onSalvar({
      nome: nome.trim(),
      preco: precoNumero,
      estoque: estoqueNumero
    });

    if (mensagem) return setErro(mensagem);

    setNome('');
    setPreco('');
    setEstoque('');
    setErro('');
  }

  return html`
    <form className="form" onSubmit=${enviar}>
      <input
        placeholder="Nome do produto"
        value=${nome}
        onChange=${e => setNome(e.target.value)}
      />

      <input
        placeholder="Preço (R$)"
        inputMode="decimal"
        value=${preco}
        onChange=${e => setPreco(e.target.value)}
      />

      <input
        placeholder="Estoque"
        inputMode="numeric"
        value=${estoque}
        onChange=${e => setEstoque(e.target.value)}
      />

      <button className="botao">Cadastrar</button>

      ${erro && html`<p className="erro">${erro}</p>`}
    </form>
  `;
}

function FormCliente({ onSalvar }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [erro, setErro] = useState('');

  async function enviar(e) {
    e.preventDefault();

    if (!nome.trim()) {
      return setErro('Escreva o nome do cliente.');
    }

    const mensagem = await onSalvar({
      nome: nome.trim(),
      telefone: telefone.trim()
    });

    if (mensagem) return setErro(mensagem);

    setNome('');
    setTelefone('');
    setErro('');
  }

  return html`
    <form className="form" onSubmit=${enviar}>
      <input
        placeholder="Nome do cliente"
        value=${nome}
        onChange=${e => setNome(e.target.value)}
      />

      <input
        placeholder="Telefone (opcional)"
        value=${telefone}
        onChange=${e => setTelefone(e.target.value)}
      />

      <button className="botao">Cadastrar</button>

      ${erro && html`<p className="erro">${erro}</p>`}
    </form>
  `;
}

function FormVenda({ produtos, clientes, onSalvar }) {
  const [clienteId, setClienteId] = useState('');
  const [produtoId, setProdutoId] = useState('');
  const [qtd, setQtd] = useState('1');
  const [erro, setErro] = useState('');

  async function enviar(e) {
    e.preventDefault();

    if (!produtoId) {
      return setErro('Escolha um produto para registrar a venda.');
    }

    const mensagem = await onSalvar({
      clienteId: clienteId ? Number(clienteId) : null,
      produtoId: Number(produtoId),
      qtd: parseInt(qtd, 10)
    });

    setErro(mensagem || '');

    if (!mensagem) setQtd('1');
  }

  return html`
    <form className="form" onSubmit=${enviar}>
      <select
        value=${clienteId}
        onChange=${e => setClienteId(e.target.value)}
      >
        <option value="">Cliente avulso</option>

        ${clientes.map(c => html`
          <option key=${c.id} value=${c.id}>
            ${c.nome}
          </option>
        `)}
      </select>

      <select
        value=${produtoId}
        onChange=${e => setProdutoId(e.target.value)}
      >
        <option value="">Escolha o produto</option>

        ${produtos.map(p => html`
          <option key=${p.id} value=${p.id}>
            ${p.nome} (${p.estoque} em estoque)
          </option>
        `)}
      </select>

      <input
        type="number"
        min="1"
        value=${qtd}
        onChange=${e => setQtd(e.target.value)}
      />

      <button className="botao">Registrar venda</button>

      ${erro && html`<p className="erro">${erro}</p>`}
    </form>
  `;
}

function App() {
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [vendas, setVendas] = useState([]);

  const [resumo, setResumo] = useState({
    totalMes: 0,
    vendasMes: 0
  });

  const [aba, setAba] = useState('vendas');
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erroGeral, setErroGeral] = useState('');

  async function carregarCadastros() {
    try {
      const [p, c, r] = await Promise.all([
        api('/produtos'),
        api('/clientes'),
        api('/vendas/resumo')
      ]);

      setProdutos(p);
      setClientes(c);
      setResumo(r);
      setErroGeral('');
    } catch (e) {
      setErroGeral(e.message);
    }

    setCarregando(false);
  }

  async function carregarVendas() {
    try {
      setVendas(
        await api('/vendas?busca=' + encodeURIComponent(busca.trim()))
      );
    } catch (e) {
      setErroGeral(e.message);
    }
  }

  useEffect(() => {
    carregarCadastros();
  }, []);

  useEffect(() => {
    const espera = setTimeout(carregarVendas, 250);

    return () => clearTimeout(espera);
  }, [busca]);

  async function executar(acao) {
    try {
      await acao();

      await Promise.all([
        carregarCadastros(),
        carregarVendas()
      ]);
    } catch (e) {
      return e.message;
    }
  }

  async function excluir(acao) {
    const mensagem = await executar(acao);

    if (mensagem) setErroGeral(mensagem);
  }

  return html`
    <div className="pagina">
      <h1>Caderno de Vendas</h1>

      <p className="suave">
        Quem comprou, o que saiu e quanto ainda tem na prateleira.
      </p>

      ${erroGeral && html`
        <p className="erro">${erroGeral}</p>
      `}

      <div className="resumo">
        <div className="cartao">
          <span className="suave">Vendido neste mês</span>
          <strong>${dinheiro(resumo.totalMes)}</strong>
        </div>

        <div className="cartao">
          <span className="suave">Vendas no mês</span>
          <strong>${resumo.vendasMes}</strong>
        </div>
      </div>

      <div className="abas">
        ${['vendas', 'produtos', 'clientes'].map(nome => html`
          <button
            key=${nome}
            className=${'aba' + (aba === nome ? ' ativa' : '')}
            onClick=${() => setAba(nome)}
          >
            ${nome[0].toUpperCase() + nome.slice(1)}
          </button>
        `)}
      </div>

      ${carregando
        ? html`<p className="vazio">Carregando...</p>`
        : html`

          ${aba === 'vendas' && html`
            <${FormVenda}
              produtos=${produtos}
              clientes=${clientes}
              onSalvar=${dados =>
                executar(() => api('/vendas', enviarJson('POST', dados)))
              }
            />

            <div className="form">
              <input
                placeholder="Buscar venda por cliente ou produto..."
                value=${busca}
                onChange=${e => setBusca(e.target.value)}
              />
            </div>

            <${Lista}
              itens=${vendas}
              mensagemVazia=${busca.trim()
                ? 'Nenhuma venda encontrada para esse filtro.'
                : 'Nenhuma venda ainda. Quando você registrar a primeira, ela aparece aqui.'}
            >
              ${v => html`
                <div className="info">
                  <p>${v.qtd}× ${v.produtoNome}</p>
                  <p className="suave">
                    ${v.clienteNome} · ${diaMes(v.data)}
                  </p>
                </div>

                <strong>${dinheiro(v.total)}</strong>

                <${BotaoExcluir}
                  onExcluir=${() =>
                    excluir(() =>
                      api('/vendas/' + v.id, { method: 'DELETE' })
                    )
                  }
                />
              `}
            <//>
          `}

          ${aba === 'produtos' && html`
            <${FormProduto}
              onSalvar=${dados =>
                executar(() => api('/produtos', enviarJson('POST', dados)))
              }
            />

            <${Lista}
              itens=${produtos}
              mensagemVazia="Nenhum produto cadastrado. Use o formulário acima para começar."
            >
              ${p => html`
                <div className="info">
                  <p>${p.nome}</p>
                  <p className="suave">
                    ${dinheiro(p.preco)} ·
                    ${p.estoque === 0
                      ? 'Esgotado'
                      : p.estoque + ' em estoque'}
                  </p>
                </div>

                <${BotaoExcluir}
                  onExcluir=${() =>
                    excluir(() =>
                      api('/produtos/' + p.id, { method: 'DELETE' })
                    )
                  }
                />
              `}
            <//>
          `}

          ${aba === 'clientes' && html`
            <${FormCliente}
              onSalvar=${dados =>
                executar(() => api('/clientes', enviarJson('POST', dados)))
              }
            />

            <${Lista}
              itens=${clientes}
              mensagemVazia="Nenhum cliente cadastrado. Use o formulário acima para começar."
            >
              ${c => html`
                <div className="info">
                  <p>${c.nome}</p>
                  <p className="suave">
                    ${c.telefone || 'Sem telefone'}
                  </p>
                </div>

                <${BotaoExcluir}
                  onExcluir=${() =>
                    excluir(() =>
                      api('/clientes/' + c.id, { method: 'DELETE' })
                    )
                  }
                />
              `}
            <//>
          `}
        `}
    </div>
  `;
}

ReactDOM.createRoot(
  document.getElementById('root')
).render(html`<${App} />`);
