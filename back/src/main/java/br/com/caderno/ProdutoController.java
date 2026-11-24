package br.com.caderno;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {
    private final ProdutoRepository produtos;

    public ProdutoController(ProdutoRepository produtos) { this.produtos = produtos; }

    public record Entrada(
            @NotBlank(message = "Escreva o nome do produto.") String nome,
            @NotNull(message = "Informe o preço.") @DecimalMin(value = "0.01", message = "O preço precisa ser maior que zero.") BigDecimal preco,
            @NotNull(message = "Informe o estoque.") @Min(value = 0, message = "O estoque não pode ser negativo.") Integer estoque) {}

    @GetMapping
    public List<Produto> listar() { return produtos.findAll(Sort.by(Sort.Direction.DESC, "id")); }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Produto criar(@Valid @RequestBody Entrada e) {
        return produtos.save(new Produto(e.nome().trim(), e.preco(), e.estoque()));
    }

    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        if (!produtos.existsById(id)) throw new ErroDeApi(HttpStatus.NOT_FOUND, "Produto não encontrado.");
        produtos.deleteById(id);
    }
}
