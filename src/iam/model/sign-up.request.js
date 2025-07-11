/**
 * Sign up request model extendido
 * Representa todos los datos necesarios para registrar un usuario.
 */
export class SignUpRequest {
    /**
     * Constructor
     * @param {string} nombre
     * @param {string} apellidos
     * @param {string} email
     * @param {string} password
     * @param {string} direccion
     * @param {string} tipo
     */
    constructor(nombre, apellidos, email, password, direccion, tipo = "comprador") {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.password = password;
        this.direccion = direccion;
        this.tipo = tipo;
    }
}
