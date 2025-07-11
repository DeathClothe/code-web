/**
 * SignInRequest
 * @summary
 * Represents a sign-in request. This is used to authenticate a user.
 */
export class SignInRequest {
    /**
     * Constructor
     * @param {string} username The username of the user.
     * @param {string} password The password of the user.
     */
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}