// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    User,
    sendEmailVerification,
    updateProfile
} from "firebase/auth";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { firebaseConfig } from "../utils/keys";
import { getFirestore } from "firebase/firestore";
import FirebaseCustomError from "../utils/FirebaseCustomError";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export function CreateUserWithEmailAndPassword(email: string, password: string, displayName: string, age?: number): Promise<User> {
    return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userId = user.uid;

            return updateProfile(user, {
                displayName: displayName,
            }).then(() => {
                return sendEmailVerification(user)
                    .then(() => {
                        addDoc(collection(db, "Users"), {
                            userId,
                            email,
                            displayName,
                            age
                        })
                            .then((res) => console.log(res))
                            .catch((e) => { console.error(e); throw e; })
                        return user;
                    })
                    .catch((e) => { console.error(e); throw e; })
            })
                .catch((e) => {
                    console.error(e);
                    throw e;
                })
        })
        .catch((e) => {
            console.log(e.code);
            console.log(e.message);
            const errorMessage = getFirebaseErrorMessage(e.code);
            throw errorMessage;
        });
};

export async function AddGameToUserCollection(userId: string | undefined, game: any) {
    try {

        const userGamesRef = collection(db, `Users/${userId}/Games`);

        const userGamesSnapshot = await getDocs(userGamesRef);
        if (userGamesSnapshot.empty) {
            await addDoc(userGamesRef, { placeholder: true });
        }
        await addDoc(userGamesRef, game);

        console.log('Game added successfully to user collection.');


    } catch (e) {
        console.error('Error adding game to user collection:', e);
        throw e;
    }
}



export function SendEmailVerification(currentUser: User, email: string) {
    sendEmailVerification(currentUser)
        .then(() => {
            console.log('email verification sent to', email);
        })
        .catch((e) => {
            console.log(e.code);
            console.log(e.message);
            const errorMessage = getFirebaseErrorMessage(e.code);
            throw errorMessage;
        })
}

export function SignInWithEmailAndPassword(email: string, password: string): Promise<User | null> {
    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            if (!user.emailVerified) {
                //const errorMessage = 'Email not verified'
                throw new FirebaseCustomError('Email not verified', 'EMAIL_NOT_VERIFIED');
            }
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
        case 'EMAIL_NOT_VERIFIED':
            return 'Email not verified';
        // Adicione outros casos conforme necessário
        default:
            return 'An error occurred while processing your request.';
    }
}

