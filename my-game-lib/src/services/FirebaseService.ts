// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    User,
    UserProfile
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import userEvent from "@testing-library/user-event";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBcCiCq6927CqsW3hhnPMIc1M6cRMM-doo",
    authDomain: "my-game-lib.firebaseapp.com",
    projectId: "my-game-lib",
    storageBucket: "my-game-lib.appspot.com",
    messagingSenderId: "1011142308696",
    appId: "1:1011142308696:web:f94aa50210d65813442b2d",
    measurementId: "G-0TN1B121RV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
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
            return null;
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
            return null;
        });

}

export function listenAuthState(callback: (user: User | null) => void): () => void {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        callback(user);
    });

    // Retorne uma função que desinscreve o observador de mudanças de autenticação quando chamada
    return unsubscribe;
}

