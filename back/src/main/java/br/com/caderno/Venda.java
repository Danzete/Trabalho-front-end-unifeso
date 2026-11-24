package br.com.caderno;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

/** Guarda o nome do cliente e do produto no momento da venda, para o histórico não mudar se o cadastro for apagado. */
@Entity
public class Venda {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String clienteNome;
    private Long produtoId;
    private String produtoNome;
    private int qtd;
    @Column(precision = 12, scale = 2)
    private BigDecimal total;
    @Column(name = "data_venda")
    private LocalDate data;

    protected Venda() {}

    public Venda(String clienteNome, Produto produto, int qtd, LocalDate data) {
        this.clienteNome = clienteNome;
        this.produtoId = produto.getId();
        this.produtoNome = produto.getNome();
        this.qtd = qtd;
        this.total = produto.getPreco().multiply(BigDecimal.valueOf(qtd));
        this.data = data;
    }

    public Long getId() { return id; }
    public String getClienteNome() { return clienteNome; }
    public Long getProdutoId() { return produtoId; }
    public String getProdutoNome() { return produtoNome; }
    public int getQtd() { return qtd; }
    public BigDecimal getTotal() { return total; }
    public LocalDate getData() { return data; }
}
