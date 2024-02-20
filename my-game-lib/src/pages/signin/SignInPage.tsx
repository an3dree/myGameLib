import { Button, IconButton, Input } from "@mui/material";
import React from "react";
import './SignInPage.css'
import GoogleIcon from '@mui/icons-material/Google';
import { Navigate, useNavigate } from 'react-router-dom';
import { SignInWithEmailAndPassword } from "../../services/FirebaseService";
import { SignUpPage } from "../signup/SignUpPage";
import AlertModal from "../../components/alertModal/AlertModal";

interface SignInPageProps { }

interface SignInPageState {
    email: string;
    password: string;
    isSignUp: boolean;
    isLoggedIn: boolean;
    openAlert: boolean,
    alertMessage: string;
    alertSeverity: "success" | "error";
}



export default class SignInPage extends React.Component<SignInPageProps, SignInPageState>{
    constructor(props: SignInPageProps) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isSignUp: false,
            alertMessage: '',
            alertSeverity: "error",
            openAlert: false,
            isLoggedIn: false
        }
    }



    private handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ email: event.target.value });
    }

    private handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ password: event.target.value });
    }

    private handleSignUpRedir = () => {
        this.setState({ isSignUp: true });
    }

    private handleSignIn = (): void => {
        const { email, password } = this.state;
        SignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ isLoggedIn: true });
            })
            .catch((e) => {
                this.handleError(e);
            })

    }

    private handleSuccess = (): void => {
        const navigate = useNavigate();
        this.setState({
            isLoggedIn: true
        });
        navigate('/home');
        console.log('sucess');
    };


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


    render(): React.ReactNode {

        const { email, password, isSignUp, isLoggedIn,
            alertMessage, alertSeverity, openAlert
        } = this.state;



        if (isSignUp) {
            return (
                <>
                    <SignUpPage />
                </>
            );
        } else if (isLoggedIn) {
            return <Navigate to="/home" />
        } else {
            return (
                <>
                    <h1>My Game Lib</h1>
                    <h2>Sign In</h2>
                    <div className='InputWrapper'>
                        <Input
                            value={email}
                            placeholder="Email"
                            onChange={this.handleEmailChange}
                        />
                        <Input
                            value={password}
                            placeholder="Password"
                            onChange={this.handlePasswordChange}
                            type="password"
                        />
                    </div>
                    <Button
                        variant="contained"
                        onClick={this.handleSignIn}
                    >

                        Sign in
                    </Button>
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={this.handleSignUpRedir}
                    >
                        Sign up
                    </Button>
                    <IconButton
                        onClick={() => { console.log('icon click') }}
                    > <GoogleIcon /> </IconButton>
                    <AlertModal
                        message={alertMessage}
                        severity={alertSeverity}
                        onClose={this.handleCloseAlert}
                        open={openAlert}
                    />

                </>
            );
        }

    }
}