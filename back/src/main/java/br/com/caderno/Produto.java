
package br.com.caderno;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(precision = 12, scale = 2)
    private BigDecimal preco;

    private int estoque;

    protected Produto() {}

    public Produto(String nome, BigDecimal preco, int estoque) {
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoque;
    }

    public void baixarEstoque(int qtd) {
        estoque -= qtd;
    }

    public void devolverEstoque(int qtd) {
        estoque += qtd;
    }

    // Adiciona quantidade ao estoque existente
    public void adicionarEstoque(int qtd) {
        estoque += qtd;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public int getEstoque() {
        return estoque;
    }
}
