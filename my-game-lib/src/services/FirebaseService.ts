// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    User,
} from "firebase/auth";
import { firebaseConfig } from "./FirebaseConfig";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function CreateUserWithEmailAndPassword(email: string, password: string): Promise<User | null> {
    return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return user;
        })
        .catch((e) => {
            console.log(e.code);
            console.log(e.message);
            const errorMessage = getFirebaseErrorMessage(e.code);
            throw errorMessage;
        });
};

export function SignInWithEmailAndPassword(email: string, password: string): Promise<User | null> {
    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return user;
        })
        .catch((e) => {
            console.log(e.code);
            console.log(e.message);
            const errorMessage = getFirebaseErrorMessage(e.code);
            throw errorMessage;
        });

}

export function listenAuthState(callback: (user: User | null) => void): () => void {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        callback(user);
    });

    // Retorne uma função que desinscreve o observador de mudanças de autenticação quando chamada
    return unsubscribe;
}

function getFirebaseErrorMessage(errorCode: string): string {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'Email already in use';
        case 'auth/invalid-email':
            return 'Invalid email';
        case 'auth/weak-password':
            return 'Password is too weak';
        // Adicione outros casos conforme necessário
        default:
            return 'An error occurred while processing your request.';
    }
}

