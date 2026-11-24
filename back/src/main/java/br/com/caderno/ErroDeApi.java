package br.com.caderno;

import org.springframework.http.HttpStatus;

public class ErroDeApi extends RuntimeException {
    private final HttpStatus status;

    public ErroDeApi(HttpStatus status, String mensagem) {
        super(mensagem);
        this.status = status;
    }

    public HttpStatus getStatus() { return status; }
}
