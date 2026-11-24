package br.com.caderno;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {
    private final ClienteRepository clientes;

    public ClienteController(ClienteRepository clientes) { this.clientes = clientes; }

    public record Entrada(@NotBlank(message = "Escreva o nome do cliente.") String nome, String telefone) {}

    @GetMapping
    public List<Cliente> listar() { return clientes.findAll(Sort.by(Sort.Direction.DESC, "id")); }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Cliente criar(@Valid @RequestBody Entrada e) {
        String telefone = e.telefone() == null ? "" : e.telefone().trim();
        return clientes.save(new Cliente(e.nome().trim(), telefone));
    }

    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        if (!clientes.existsById(id)) throw new ErroDeApi(HttpStatus.NOT_FOUND, "Cliente não encontrado.");
        clientes.deleteById(id);
    }
}
