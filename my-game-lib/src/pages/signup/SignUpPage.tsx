import React from "react";
import { CreateUserWithEmailAndPassword } from "../../services/FirebaseService";
import { Button, IconButton, Input } from "@mui/material";
import AlertModal from "../../components/alertModal/AlertModal";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SignInPage from "../signin/SignInPage";

interface SignUpPageProps { }

interface SignUpPageState {
    email: string;
    password: string;
    openAlert: boolean;
    alertMessage: string;
    alertSeverity: "success" | "error";
    isSignIn: boolean;

}

export class SignUpPage extends React.Component<SignUpPageProps, SignUpPageState>{
    constructor(props: SignUpPageProps) {
        super(props);
        this.state = {
            email: '',
            password: '',
            openAlert: false,
            alertMessage: '',
            alertSeverity: "success",
            isSignIn: false
        }
    }

    private handleSuccess = (): void => {
        this.setState({
            alertMessage: 'Account created successfully',
            alertSeverity: 'success',
            openAlert: true
        });
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

    private handleGoBack = (): void => {
        this.setState({
            isSignIn: true
        });
    };

    handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ email: event.target.value })
    }

    handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ password: event.target.value })
    }

    handleSignUp = (): void => {
        const { email, password } = this.state;

        CreateUserWithEmailAndPassword(email, password)
            .then(() => {
                this.handleSuccess();
            })
            .catch((e) => {
                this.handleError(e);
            });
    };

    render(): React.ReactNode {
        const { email, password,
            alertMessage, alertSeverity, openAlert,
            isSignIn
        } = this.state;

        if (isSignIn) {
            return (
                <>
                    <SignInPage />
                </>
            );
        } else {
            return (
                <>
                    <IconButton onClick={this.handleGoBack} style={{ position: 'absolute', top: 20, left: 20 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <h1>My Game Lib</h1>
                    <h2>Sign Up</h2>
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
                    <Button color="secondary" variant="contained" onClick={this.handleSignUp}>Sign up</Button>
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
