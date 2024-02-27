import { FirebaseOptions, initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    User,
    sendEmailVerification,
    updateProfile,
    signOut
} from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import FirebaseCustomError from "../utils/FirebaseCustomError";


// const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG || '');
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

export default class FirebaseService {
    private app
    private auth;
    private db;
    private firebaseConfig;

    constructor(firebaseConfig: FirebaseOptions) {
        this.firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG || '');
        this.app = initializeApp(firebaseConfig);
        this.auth = getAuth(this.app);
        this.db = getFirestore(this.app);
    }

    public createUserWithEmailAndPassword(email: string, password: string, displayName: string, age?: number): Promise<User> {
        return createUserWithEmailAndPassword(this.auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const userId = user.uid;

                return updateProfile(user, {
                    displayName: displayName,
                }).then(() => {
                    return sendEmailVerification(user)
                        .then(() => {
                            addDoc(collection(this.db, "Users"), {
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
                const errorMessage = this.getFirebaseErrorMessage(e.code);
                throw errorMessage;
            });
    };

    public async addGameToUserCollection(userId: string | undefined, game: any) {
        try {

            if (!userId) {
                throw new Error('User is not authenticated');
            }

            const userGamesRef = collection(this.db, `Users/${userId}/Games`);

            const q = query(userGamesRef, where('id', '==', game.id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {

                console.warn('Game already exists in user collection.');
                throw new FirebaseCustomError('Game already exists in user collection.', 'GAME_ALREDY_EXISTS');
            }

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
    };

    public async signOut() {
        try {
            await signOut(this.auth);
            return true;
        } catch (error) {
            console.error('Error signing out:', error);
            return false;
        }
    }
    public emailVerification(currentUser: User, email: string) {
        sendEmailVerification(currentUser)
            .then(() => {
                console.log('email verification sent to', email);
            })
            .catch((e) => {
                console.log(e.code);
                console.log(e.message);
                const errorMessage = this.getFirebaseErrorMessage(e.code);
                throw errorMessage;
            })
    };

    public signInWithEmailAndPassword(email: string, password: string): Promise<User | null> {
        return signInWithEmailAndPassword(this.auth, email, password)
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
                const errorMessage = this.getFirebaseErrorMessage(e.code);
                throw errorMessage;
            });

    }

    public listenAuthState(callback: (user: User) => void): () => void {
        const unsubscribe = onAuthStateChanged(this.auth, (user) => {
            if (user) {
                return callback(user);
            }
        });

        return unsubscribe;
    }

    public getFirebaseErrorMessage(errorCode: string): string {
        switch (errorCode) {
            case 'auth/email-already-in-use':
                return 'Email already in use';
            case 'auth/invalid-email':
                return 'Invalid email';
            case 'auth/weak-password':
                return 'Password is too weak';
            case 'EMAIL_NOT_VERIFIED':
                return 'Email not verified';
            case 'GAME_ALREDY_EXISTS':
                return 'Game already exists in user collection.';
            // Adicione outros casos conforme necessário
            default:
                return 'An error occurred while processing your request.';
        }
    }
}








