const { useState, useEffect } = React;
const html = htm.bind(React.createElement);

const dinheiro = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const novoId = () => Math.random().toString(36).slice(2, 9);
const diasAtras = n => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };
const diaMes = data => data.split('-').reverse().slice(0, 2).join('/');

const DADOS_INICIAIS = {
  produtos: [
    { id: 'p1', nome: 'Café torrado 500g', preco: 24.9, estoque: 40 },
    { id: 'p2', nome: 'Pão de queijo congelado 1kg', preco: 32, estoque: 18 },
    { id: 'p3', nome: 'Doce de leite caseiro', preco: 18.5, estoque: 25 },
    { id: 'p4', nome: 'Queijo minas frescal', preco: 29, estoque: 3 },
    { id: 'p5', nome: 'Goiabada cascão', preco: 14, estoque: 30 },
  ],
  clientes: [
    { id: 'c1', nome: 'Dona Marlene', telefone: '(21) 98877-1020' },
    { id: 'c2', nome: 'Padaria do Seu Antônio', telefone: '(24) 99123-4567' },
    { id: 'c3', nome: 'Camila Rezende', telefone: '(21) 97766-5544' },
    { id: 'c4', nome: 'Mercadinho São Jorge', telefone: '(24) 3642-1188' },
  ],
  vendas: [
    { id: 'v1', clienteNome: 'Padaria do Seu Antônio', produtoNome: 'Pão de queijo congelado 1kg', qtd: 6, total: 192, data: diasAtras(0) },
    { id: 'v2', clienteNome: 'Dona Marlene', produtoNome: 'Doce de leite caseiro', qtd: 2, total: 37, data: diasAtras(1) },
    { id: 'v3', clienteNome: 'Mercadinho São Jorge', produtoNome: 'Café torrado 500g', qtd: 10, total: 249, data: diasAtras(2) },
    { id: 'v4', clienteNome: 'Camila Rezende', produtoNome: 'Queijo minas frescal', qtd: 2, total: 58, data: diasAtras(4) },
    { id: 'v5', clienteNome: 'Cliente avulso', produtoNome: 'Goiabada cascão', qtd: 3, total: 42, data: diasAtras(6) },
  ],
};

// Se o navegador bloquear o LocalStorage, o app continua funcionando, só não guarda nada.
function useLocalStorage(chave, inicial) {
  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(chave);
      return guardado ? JSON.parse(guardado) : inicial;
    } catch { return inicial; }
  });
  useEffect(() => {
    try { localStorage.setItem(chave, JSON.stringify(valor)); } catch {}
  }, [chave, valor]);
  return [valor, setValor];
}

function Lista({ itens, mensagemVazia, children }) {
  if (!itens.length) return html`<p className="vazio">${mensagemVazia}</p>`;
  return html`<ul className="lista">${itens.map(item => html`<li key=${item.id}>${children(item)}</li>`)}</ul>`;
}

function BotaoExcluir({ onExcluir }) {
  const confirmar = () => { if (window.confirm('Excluir mesmo?')) onExcluir(); };
  return html`<button className="botao-simples" onClick=${confirmar}>Excluir</button>`;
}

function FormProduto({ onSalvar }) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [erro, setErro] = useState('');

  function enviar(e) {
    e.preventDefault();
    const precoNumero = parseFloat(preco.replace(',', '.'));
    const estoqueNumero = parseInt(estoque, 10);
    if (!nome.trim() || !(precoNumero > 0) || !(estoqueNumero >= 0)) {
      return setErro('Preencha o nome, um preço maior que zero e a quantidade em estoque.');
    }
    onSalvar({ id: novoId(), nome: nome.trim(), preco: precoNumero, estoque: estoqueNumero });
    setNome(''); setPreco(''); setEstoque(''); setErro('');
  }

  return html`
    <form className="form" onSubmit=${enviar}>
      <input placeholder="Nome do produto" value=${nome} onChange=${e => setNome(e.target.value)} />
      <input placeholder="Preço (R$)" inputMode="decimal" value=${preco} onChange=${e => setPreco(e.target.value)} />
      <input placeholder="Estoque" inputMode="numeric" value=${estoque} onChange=${e => setEstoque(e.target.value)} />
      <button className="botao">Cadastrar</button>
      ${erro && html`<p className="erro">${erro}</p>`}
    </form>`;
}

function FormCliente({ onSalvar }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [erro, setErro] = useState('');

  function enviar(e) {
    e.preventDefault();
    if (!nome.trim()) return setErro('Escreva o nome do cliente.');
    onSalvar({ id: novoId(), nome: nome.trim(), telefone: telefone.trim() });
    setNome(''); setTelefone(''); setErro('');
  }

  return html`
    <form className="form" onSubmit=${enviar}>
      <input placeholder="Nome do cliente" value=${nome} onChange=${e => setNome(e.target.value)} />
      <input placeholder="Telefone (opcional)" value=${telefone} onChange=${e => setTelefone(e.target.value)} />
      <button className="botao">Cadastrar</button>
      ${erro && html`<p className="erro">${erro}</p>`}
    </form>`;
}

function FormVenda({ produtos, clientes, onSalvar }) {
  const [clienteId, setClienteId] = useState('');
  const [produtoId, setProdutoId] = useState('');
  const [qtd, setQtd] = useState('1');
  const [erro, setErro] = useState('');

  function enviar(e) {
    e.preventDefault();
    const mensagem = onSalvar({ clienteId, produtoId, qtd: parseInt(qtd, 10) });
    setErro(mensagem || '');
    if (!mensagem) setQtd('1');
  }

  return html`
    <form className="form" onSubmit=${enviar}>
      <select value=${clienteId} onChange=${e => setClienteId(e.target.value)}>
        <option value="">Cliente avulso</option>
        ${clientes.map(c => html`<option key=${c.id} value=${c.id}>${c.nome}</option>`)}
      </select>
      <select value=${produtoId} onChange=${e => setProdutoId(e.target.value)}>
        <option value="">Escolha o produto</option>
        ${produtos.map(p => html`<option key=${p.id} value=${p.id}>${p.nome} (${p.estoque} em estoque)</option>`)}
      </select>
      <input type="number" min="1" value=${qtd} onChange=${e => setQtd(e.target.value)} />
      <button className="botao">Registrar venda</button>
      ${erro && html`<p className="erro">${erro}</p>`}
    </form>`;
}

function App() {
  const [produtos, setProdutos] = useLocalStorage('caderno:produtos', DADOS_INICIAIS.produtos);
  const [clientes, setClientes] = useLocalStorage('caderno:clientes', DADOS_INICIAIS.clientes);
  const [vendas, setVendas] = useLocalStorage('caderno:vendas', DADOS_INICIAIS.vendas);
  const [aba, setAba] = useState('vendas');
  const [busca, setBusca] = useState('');

  const mes = new Date().toISOString().slice(0, 7);
  const vendasDoMes = vendas.filter(v => v.data.startsWith(mes));
  const totalDoMes = vendasDoMes.reduce((soma, v) => soma + v.total, 0);

  const vendasFiltradas = vendas.filter(v => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return true;
    return (
      v.clienteNome.toLowerCase().includes(termo) ||
      v.produtoNome.toLowerCase().includes(termo)
    );
  });

  // Devolve a mensagem de erro, ou nada se a venda foi registrada.
  function registrarVenda({ clienteId, produtoId, qtd }) {
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) return 'Escolha um produto para registrar a venda.';
    if (!(qtd > 0)) return 'A quantidade precisa ser de pelo menos 1.';
    if (qtd > produto.estoque) return `Só temos ${produto.estoque} em estoque.`;

    const cliente = clientes.find(c => c.id === clienteId);
    setProdutos(produtos.map(p => p.id === produto.id ? { ...p, estoque: p.estoque - qtd } : p));
    setVendas([{
      id: novoId(),
      clienteNome: cliente ? cliente.nome : 'Cliente avulso',
      produtoNome: produto.nome,
      qtd,
      total: qtd * produto.preco,
      data: diasAtras(0),
    }, ...vendas]);
  }

  function excluirVenda(venda) {
    setProdutos(produtos.map(p => p.nome === venda.produtoNome ? { ...p, estoque: p.estoque + venda.qtd } : p));
    setVendas(vendas.filter(v => v.id !== venda.id));
  }

  return html`
    <div className="pagina">
      <h1>Caderno de Vendas</h1>
      <p className="suave">Quem comprou, o que saiu e quanto ainda tem na prateleira.</p>

      <div className="resumo">
        <div className="cartao"><span className="suave">Vendido neste mês</span><strong>${dinheiro(totalDoMes)}</strong></div>
        <div className="cartao"><span className="suave">Vendas no mês</span><strong>${vendasDoMes.length}</strong></div>
      </div>

      <div className="abas">
        ${['vendas', 'produtos', 'clientes'].map(nome => html`
          <button key=${nome} className=${'aba' + (aba === nome ? ' ativa' : '')} onClick=${() => setAba(nome)}>${nome[0].toUpperCase() + nome.slice(1)}</button>`)}
      </div>

      ${aba === 'vendas' && html`
        <${FormVenda} produtos=${produtos} clientes=${clientes} onSalvar=${registrarVenda} />
        <div className="form">
          <input
            placeholder="Buscar venda por cliente ou produto..."
            value=${busca}
            onInput=${e => setBusca(e.target.value)}
          />
        </div>
        <${Lista} itens=${vendasFiltradas} mensagemVazia=${busca.trim() ? 'Nenhuma venda encontrada para esse filtro.' : 'Nenhuma venda ainda. Quando você registrar a primeira, ela aparece aqui.'}>
          ${v => html`
            <div className="info">
              <p>${v.qtd}× ${v.produtoNome}</p>
              <p className="suave">${v.clienteNome} · ${diaMes(v.data)}</p>
            </div>
            <strong>${dinheiro(v.total)}</strong>
            <${BotaoExcluir} onExcluir=${() => excluirVenda(v)} />`}
        <//>`}

      ${aba === 'produtos' && html`
        <${FormProduto} onSalvar=${p => setProdutos([p, ...produtos])} />
        <${Lista} itens=${produtos} mensagemVazia="Nenhum produto cadastrado. Use o formulário acima para começar.">
          ${p => html`
            <div className="info">
              <p>${p.nome}</p>
              <p className="suave">${dinheiro(p.preco)} · ${p.estoque === 0 ? 'Esgotado' : p.estoque + ' em estoque'}</p>
            </div>
            <${BotaoExcluir} onExcluir=${() => setProdutos(produtos.filter(x => x.id !== p.id))} />`}
        <//>`}

      ${aba === 'clientes' && html`
        <${FormCliente} onSalvar=${c => setClientes([c, ...clientes])} />
        <${Lista} itens=${clientes} mensagemVazia="Nenhum cliente cadastrado. Use o formulário acima para começar.">
          ${c => html`
            <div className="info">
              <p>${c.nome}</p>
              <p className="suave">${c.telefone || 'Sem telefone'}</p>
            </div>
            <${BotaoExcluir} onExcluir=${() => setClientes(clientes.filter(x => x.id !== c.id))} />`}
        <//>`}
    </div>`;
}

ReactDOM.createRoot(document.getElementById('root')).render(html`<${App} />`);
