package br.com.caderno;

import java.time.LocalDate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VendaService {
    private final VendaRepository vendas;
    private final ProdutoRepository produtos;
    private final ClienteRepository clientes;

    public VendaService(VendaRepository vendas, ProdutoRepository produtos, ClienteRepository clientes) {
        this.vendas = vendas;
        this.produtos = produtos;
        this.clientes = clientes;
    }

    @Transactional
    public Venda registrar(Long clienteId, Long produtoId, int qtd) {
        Produto produto = produtos.buscarParaAtualizar(produtoId)
                .orElseThrow(() -> new ErroDeApi(HttpStatus.BAD_REQUEST, "Esse produto não existe mais. Atualize a página."));
        if (qtd > produto.getEstoque()) {
            throw new ErroDeApi(HttpStatus.BAD_REQUEST, "Só temos " + produto.getEstoque() + " em estoque.");
        }
        String cliente = clienteId == null ? "Cliente avulso"
                : clientes.findById(clienteId).map(Cliente::getNome).orElse("Cliente avulso");
        produto.baixarEstoque(qtd);
        return vendas.save(new Venda(cliente, produto, qtd, LocalDate.now()));
    }

    @Transactional
    public void excluir(Long id) {
        Venda venda = vendas.findById(id)
                .orElseThrow(() -> new ErroDeApi(HttpStatus.NOT_FOUND, "Venda não encontrada."));
        if (venda.getProdutoId() != null) {
            produtos.buscarParaAtualizar(venda.getProdutoId()).ifPresent(p -> p.devolverEstoque(venda.getQtd()));
        }
        vendas.delete(venda);
    }
}
