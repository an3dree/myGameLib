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
    signInWithPopup, TwitterAuthProvider, FacebookAuthProvider, GoogleAuthProvider
} from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
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
    private facebookProvider;
    private googleProvider;

    constructor(firebaseConfig: FirebaseOptions) {
        this.firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG || '');
        this.app = initializeApp(firebaseConfig);
        this.auth = getAuth(this.app);
        this.db = getFirestore(this.app);
        this.twitterProvider = new TwitterAuthProvider();
        this.facebookProvider = new FacebookAuthProvider();
        this.googleProvider = new GoogleAuthProvider();
    }

    public createUserWithEmailAndPassword(email: string, password: string, displayName: string, age?: number): Promise<User> {
        return createUserWithEmailAndPassword(this.auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const userId = user.uid;
                const signInMethod = 'emailpwd'

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
                                age,
                                signInMethod: signInMethod
                            };

                            return setDoc(userDocRef, userData)
                                .then(() => {
                                    //console.log("Document successfully written!");
                                    const generetedId = userDocRef.id;
                                    return updateDoc(userDocRef, { id: generetedId })
                                        .then(() => {
                                            //console.log("Document successfully updated with generated ID!");
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
                docId: doc.id,
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
            //console.log(userData);
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

            //console.log('Game added successfully to user collection.');


        } catch (e) {
            console.error('Error adding game to user collection:', e);
            throw e;
        }
    };

    public async updateGameToUserCollection(id: string | undefined, game: any) {
        try {
            if (!game.docId) {
                throw new Error('docId is required to update the game.');
            }
            const docRef = doc(this.db, `Users/${id}/Games/${game.docId}`);
            await updateDoc(docRef, game);
            console.log('Game updated successfully in user collection.');
        } catch (e) {
            console.error('Error updating game in user collection:', e);
            throw e;
        };
    }

    public async deleteGameFromUserCollection(id: string | undefined, gameId: string | undefined) {
        try {
            const docRef = doc(this.db, `Users/${id}/Games/${gameId}`);
            await deleteDoc(docRef);
            console.log('Game deleted successfully from user collection.');
        }
        catch (e) {
            console.error('Error updating game in user collection:', e);
        }
    }


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
                //console.log('email verification sent to', email);
            })
            .catch((e) => {
                console.log(e.code);
                console.log(e.message);
                const errorMessage = this.getFirebaseErrorMessage(e.code);
                throw errorMessage;
            })
    };

    public async signInWithGoogle() {
        return signInWithPopup(this.auth, this.googleProvider)
            .then((result) => {
                //const credential = GoogleAuthProvider.credentialFromResult(result);

                //const token = credential?.accessToken;
                // The signed-in user info.
                const signInMethod = 'google';
                const user = result.user;
                const userId = user.uid;
                const email = user.email;
                const displayName = user.displayName;

                return updateProfile(user, {
                    displayName: displayName,
                    photoURL: user.photoURL
                }).then(async () => {
                    const userDocRef = doc(collection(this.db, "Users"));
                    const userData = {
                        userId: userId,
                        email,
                        displayName,
                        signInMethod
                    };

                    const userRef = collection(this.db, "Users");
                    const q = query(userRef, where("userId", "==", `${userData.userId}`));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        console.warn('User alredy exist in collection.');
                        return;
                    }

                    return setDoc(userDocRef, userData)
                        .then(() => {
                            const generetedId = userDocRef.id;
                            return updateDoc(userDocRef, { id: generetedId })
                                .then(() => {
                                    //console.log("Document successfully updated");
                                    return user;
                                })
                                .catch((e) => {
                                    //console.error("Error updating document with generated ID: ", e);
                                    throw e;
                                })
                        })
                        .catch((e) => {
                            //console.error("Error writing document: ", e);
                            throw e;
                        })

                }).catch((e) => { console.error(e); throw e; })


            }).catch((error) => {

                const errorCode = error.code;
                //const errorMessage1 = error.message;

                //const email = error.customData.email;

                //const credential = GoogleAuthProvider.credentialFromError(error)
                //console.log(errorCode, errorMessage1, email, credential)
                const errorMessage = this.getFirebaseErrorMessage(errorCode);
                throw errorMessage;
            })
    }


    public async signInWithTwitter() {
        return signInWithPopup(this.auth, this.twitterProvider)
            .then((result) => {
                //const credential = TwitterAuthProvider.credentialFromResult(result);
                //const token = credential?.accessToken;
                //const secret = credential?.secret;
                const signInMethod = 'twitter';
                const user = result.user;
                const userId = user.uid;
                const email = user.email;
                const displayName = user.displayName
                //console.log(user);
                return updateProfile(user, {
                    displayName: displayName,
                    photoURL: user.photoURL
                }).then(async () => {
                    const userDocRef = doc(collection(this.db, "Users"));
                    const userData = {
                        userId: userId,
                        email,
                        displayName,
                        signInMethod: signInMethod
                    };

                    const userRef = collection(this.db, `Users/`);
                    const q = query(userRef, where('userId', '==', `${userData.userId}`));
                    const querySnapshot = await getDocs(q)

                    if (!querySnapshot.empty) {
                        console.warn('User alredy exist in collection.');
                        return;
                    }


                    return setDoc(userDocRef, userData)
                        .then(() => {
                            const generetedId = userDocRef.id;
                            return updateDoc(userDocRef, { id: generetedId })
                                .then(() => {
                                    //console.log("Document successfully updated with generated ID!");
                                    return user;
                                })
                                .catch((e) => {
                                    //console.error("Error updating document with generated ID: ", e);
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








