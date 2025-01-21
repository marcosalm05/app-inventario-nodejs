class Response {
    constructor(success, dataOrError) {
        this.success = success;
        if (success) {
            this.data = dataOrError; // Si es un éxito, `dataOrError` es el objeto de respuesta.
        } else {
            this.error = dataOrError; // Si es un error, `dataOrError` es el mensaje de error.
        }
    }

    // Método estático para crear una respuesta de éxito
    static ok(data) {
        return new Response(true, data);
    }

    // Método estático para crear una respuesta de error
    static error(mensajeError) {
        return new Response(false, mensajeError);
    }
}

module.exports = Response;
