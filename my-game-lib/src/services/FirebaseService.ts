import { FirebaseOptions, initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    User,
    sendEmailVerification,
    updateProfile,
    signOut,
    signInWithPopup, TwitterAuthProvider
} from "firebase/auth";
import { addDoc, collection, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
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
    private twitterProvider;

    constructor(firebaseConfig: FirebaseOptions) {
        this.firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG || '');
        this.app = initializeApp(firebaseConfig);
        this.auth = getAuth(this.app);
        this.db = getFirestore(this.app);
        this.twitterProvider = new TwitterAuthProvider();
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
                            const userDocRef = doc(collection(this.db, "Users"));
                            const userData = {
                                userId: userId,
                                email,
                                displayName,
                                age
                            };

                            return setDoc(userDocRef, userData)
                                .then(() => {
                                    console.log("Document successfully written!");
                                    const generetedId = userDocRef.id;
                                    return updateDoc(userDocRef, { id: generetedId })
                                        .then(() => {
                                            console.log("Document successfully updated with generated ID!");
                                            return user;
                                        })
                                        .catch((e) => {
                                            console.error("Error updating document with generated ID: ", e);
                                            throw e;
                                        })
                                })
                                .catch((error) => {
                                    console.error("Error writing document: ", error);
                                    throw error;
                                });
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

    public async getUserGames(userId: string | undefined) {
        try {


            const userRef = collection(this.db, `Users/${userId}/Games`);
            const q = query(userRef)
            const querySnapshot = await getDocs(q);
            const gamesData = querySnapshot.docs.map<any>(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return gamesData;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    public async getCurrentUser() {
        return this.auth.currentUser
    }

    public async getUser(userId: string | undefined) {
        if (!userId) {
            throw new Error('User is not authenticated');
        }

        try {
            const userRef = collection(this.db, 'Users/');
            const q = query(userRef, where('userId', '==', userId));
            const querySnapshot = await getDocs(q);
            const userData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log(userData);
            return userData[0];
        } catch (e) {
            console.error(e);
            throw e;
        }


    }

    public async addGameToUserCollection(userId: string | undefined, game: any) {
        try {


            const userGamesRef = collection(this.db, `Users/${userId}/Games`);

            const q = query(userGamesRef, where('id', '==', game.id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {

                console.warn('Game already exists in user collection.');
                throw new FirebaseCustomError('Game already exists in user collection.', 'GAME_ALREDY_EXISTS');
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

    public async signInWithTwitter() {
        return signInWithPopup(this.auth, this.twitterProvider)
            .then((result) => {
                const credential = TwitterAuthProvider.credentialFromResult(result);
                //const token = credential?.accessToken;
                //const secret = credential?.secret;

                const user = result.user;
                const userId = user.uid;
                const email = user.email;
                const displayName = user.displayName
                console.log(user);
                return updateProfile(user, {
                    displayName: displayName,
                    photoURL: user.photoURL
                }).then(() => {
                    const userDocRef = doc(collection(this.db, "Users"));
                    const userData = {
                        userId: userId,
                        email,
                        displayName
                    };

                    return setDoc(userDocRef, userData)
                        .then(() => {
                            const generetedId = userDocRef.id;
                            return updateDoc(userDocRef, { id: generetedId })
                                .then(() => {
                                    console.log("Document successfully updated with generated ID!");
                                    return user;
                                })
                                .catch((e) => {
                                    console.error("Error updating document with generated ID: ", e);
                                    throw e;
                                })
                        })
                        .catch((error) => {
                            console.error("Error writing document: ", error);
                            throw error;
                        });
                })
                    .catch((e) => { console.error(e); throw e; })
                //signInWithRedirect(this.auth, this.twitterProvider);
            })
            .catch(e => {
                console.log(e.code);
                console.log(e.message);
                const email = e.customData.email;
                const credential = TwitterAuthProvider.credentialFromError(e);
                console.log(email, credential);
                const errorMessage = this.getFirebaseErrorMessage(e.code);
                throw errorMessage;
            })
    }

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








