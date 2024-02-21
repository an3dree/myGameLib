
class FirebaseCustomError extends Error {
    code: string;
    constructor(message: string, code: string) {
        super(message);
        this.name = 'FirebaseCustomError';
        this.code = code;
    }
}


export default FirebaseCustomError;
