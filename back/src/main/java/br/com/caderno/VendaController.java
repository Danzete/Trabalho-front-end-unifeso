package br.com.caderno;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendas")
public class VendaController {
    private final VendaRepository vendas;
    private final VendaService servico;

    public VendaController(VendaRepository vendas, VendaService servico) {
        this.vendas = vendas;
        this.servico = servico;
    }

    public record Entrada(
            Long clienteId,
            @NotNull(message = "Escolha um produto para registrar a venda.") Long produtoId,
            @NotNull(message = "Informe a quantidade.") @Min(value = 1, message = "A quantidade precisa ser de pelo menos 1.") Integer qtd) {}

    public record Resumo(BigDecimal totalMes, long vendasMes) {}

    @GetMapping
    public List<Venda> listar(@RequestParam(required = false) String busca) {
        return vendas.buscar(busca == null ? "" : busca.trim().toLowerCase());
    }

    @GetMapping("/resumo")
    public Resumo resumo() {
        LocalDate inicio = LocalDate.now().withDayOfMonth(1);
        BigDecimal total = vendas.totalDesde(inicio);
        return new Resumo(total == null ? BigDecimal.ZERO : total, vendas.countByDataGreaterThanEqual(inicio));
    }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Venda registrar(@Valid @RequestBody Entrada e) {
        return servico.registrar(e.clienteId(), e.produtoId(), e.qtd());
    }

    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) { servico.excluir(id); }
}
