package br.com.caderno;

import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/** Só roda no banco vazio, para a primeira abertura não ficar em branco. */
@Component
public class DadosIniciais implements CommandLineRunner {
    private final ProdutoRepository produtos;
    private final ClienteRepository clientes;
    private final VendaRepository vendas;

    public DadosIniciais(ProdutoRepository produtos, ClienteRepository clientes, VendaRepository vendas) {
        this.produtos = produtos;
        this.clientes = clientes;
        this.vendas = vendas;
    }

    @Override
    public void run(String... args) {
        if (produtos.count() + clientes.count() + vendas.count() > 0) return;

        Produto cafe = produtos.save(new Produto("Café torrado 500g", new BigDecimal("24.90"), 40));
        Produto pao = produtos.save(new Produto("Pão de queijo congelado 1kg", new BigDecimal("32.00"), 18));
        Produto doce = produtos.save(new Produto("Doce de leite caseiro", new BigDecimal("18.50"), 25));
        Produto queijo = produtos.save(new Produto("Queijo minas frescal", new BigDecimal("29.00"), 3));
        Produto goiabada = produtos.save(new Produto("Goiabada cascão", new BigDecimal("14.00"), 30));

        clientes.save(new Cliente("Dona Marlene", "(21) 98877-1020"));
        clientes.save(new Cliente("Padaria do Seu Antônio", "(24) 99123-4567"));
        clientes.save(new Cliente("Camila Rezende", "(21) 97766-5544"));
        clientes.save(new Cliente("Mercadinho São Jorge", "(24) 3642-1188"));

        LocalDate hoje = LocalDate.now();
        vendas.save(new Venda("Padaria do Seu Antônio", pao, 6, hoje));
        vendas.save(new Venda("Dona Marlene", doce, 2, hoje.minusDays(1)));
        vendas.save(new Venda("Mercadinho São Jorge", cafe, 10, hoje.minusDays(2)));
        vendas.save(new Venda("Camila Rezende", queijo, 2, hoje.minusDays(4)));
        vendas.save(new Venda("Cliente avulso", goiabada, 3, hoje.minusDays(6)));
    }
}
