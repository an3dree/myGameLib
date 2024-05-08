import { Button, FormControl, FormHelperText, IconButton, Input } from "@mui/material";
import React from "react";
import './SignInPage.css'
import GoogleIcon from '@mui/icons-material/Google';
import { Facebook } from "@mui/icons-material";
import { Twitter } from "@mui/icons-material";
import { Navigate } from 'react-router-dom';
import FirebaseService from "../../services/FirebaseService";
import { SignUpPage } from "../signup/SignUpPage";
import AlertModal from "../../components/CustomAlert/CustomAlert";
import { User } from "firebase/auth";

interface SignInPageProps { firebaseService: FirebaseService }

interface SignInPageState {
    email: string;
    password: string;
    isSignUp: boolean;
    isLoggedIn: boolean;
    openAlert: boolean,
    alertMessage: string;
    alertSeverity: "success" | "error";
    errors: { [key: string]: string };
    user?: User;
}



export default class SignInPage extends React.Component<SignInPageProps, SignInPageState> {
    constructor(props: SignInPageProps) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isSignUp: false,
            alertMessage: '',
            alertSeverity: "error",
            openAlert: false,
            isLoggedIn: false,
            errors: {}
        }
    }


    private handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;
        this.setState((prevState: SignInPageState) => ({
            ...prevState,
            [name]: value,
            errors: {
                ...prevState.errors,
                [name]: '', // Limpar o erro ao digitar
            },
        }));
    };



    private handleSignUpRedir = () => {
        this.setState({ isSignUp: true });
    }

    private handleSignIn = (): void => {
        const { email, password } = this.state;

        if (!email || !password) {
            const errors: { [key: string]: string } = {};
            if (!email) errors.email = 'Email is required'
            if (!password) errors.password = 'Password is required'
            this.setState({ errors });
            return;
        }

        this.props.firebaseService.signInWithEmailAndPassword(email, password)
            .then((user) => {
                this.setState({ isLoggedIn: true, user: user as any });
            })
            .catch((e) => {
                this.handleError(e);
            })

    }

    private handleTwitterSignIn = (): void => {
        this.props.firebaseService.signInWithTwitter().then((user) => {
            this.setState({ isLoggedIn: true, user: user as any });
        })
            .catch(e => {
                this.handleError(e);
            });
    }

    private handleGoogleSignIn = (): void => {
        this.props.firebaseService.signInWithGoogle().then((user) => {
            this.setState({ isLoggedIn: true, user: user as any });
        }).catch(e => {
            this.handleError(e);
        });
    }
    // private handleFacebookSignIn = (): void => {
    //     this.props.firebaseService.signInWithFacebook().then((user) => {
    //         this.setState({ isLoggedIn: true, user: user as any });
    //     })
    //         .catch(e => {
    //             this.handleError(e);
    //         });
    // }


    private handleError = (errorMessage: string): void => {
        this.setState({
            alertMessage: errorMessage,
            alertSeverity: 'error',
            openAlert: true
        })
    }

    private handleCloseAlert = (): void => {
        this.setState({
            openAlert: false
        })
    }

    // componentDidMount(): void {
    //     console.log(this.state);
    // }



    render(): React.ReactNode {

        const { email, password, isSignUp, isLoggedIn,
            alertMessage, alertSeverity, openAlert,
            errors
        } = this.state;



        if (isSignUp) {
            return (
                <>
                    <SignUpPage firebaseService={this.props.firebaseService} />
                </>
            );
        } else if (isLoggedIn) {
            return <Navigate to="/home" />
        } else {
            return (
                <div className="SignInPage">
                    <h1>My Game Lib</h1>
                    <h2>Sign In</h2>
                    <div className="SignInWrapper">
                        <form className='InputWrapper'>
                            <FormControl error={!!errors.email}>
                                <Input
                                    value={email}
                                    required={true}
                                    name="email"
                                    placeholder="Email"
                                    onChange={this.handleInputChange}
                                />
                                <FormHelperText>{errors.email}</FormHelperText>
                            </FormControl>
                            <FormControl error={!!errors.password}>
                                <Input
                                    value={password}
                                    required={true}
                                    name="password"
                                    placeholder="Password"
                                    onChange={this.handleInputChange}
                                    type="password"
                                />
                                <FormHelperText>{errors.password}</FormHelperText>
                            </FormControl>

                            <Button
                                size="small"
                                variant="contained"
                                color="info"
                                onClick={this.handleSignIn}
                            >

                                Sign in
                            </Button>
                        </form>

                        <div className="CreateAccount">

                            <span>
                                Does not have account? Create one
                            </span>
                            <Button
                                color="secondary"
                                variant="outlined"
                                size="small"
                                onClick={this.handleSignUpRedir}
                            >
                                Sign up
                            </Button>
                        </div>

                        <div className="SocialLogin">
                            <span>Or try another way</span>
                            <div className="IconsWrapper">
                                <IconButton
                                    onClick={this.handleGoogleSignIn}
                                > <GoogleIcon /> </IconButton>
                                <IconButton
                                    onClick={this.handleTwitterSignIn}
                                > <Twitter /> </IconButton>
                                {/*
                                <IconButton
                                    onClick={this.handleFacebookSignIn}
                                > <Facebook /> </IconButton>
                                */}

                            </div>


                        </div>
                    </div>


                    <AlertModal
                        message={alertMessage}
                        severity={alertSeverity}
                        onClose={this.handleCloseAlert}
                        open={openAlert}
                    />

                </div>
            );
        }

    }
}