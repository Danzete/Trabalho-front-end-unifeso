package br.com.caderno;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VendaRepository extends JpaRepository<Venda, Long> {
    @Query("select v from Venda v where lower(v.clienteNome) like concat('%', :termo, '%') or lower(v.produtoNome) like concat('%', :termo, '%') order by v.id desc")
    List<Venda> buscar(@Param("termo") String termo);

    @Query("select sum(v.total) from Venda v where v.data >= :inicio")
    BigDecimal totalDesde(@Param("inicio") LocalDate inicio);

    long countByDataGreaterThanEqual(LocalDate inicio);
}
