import React from "react";
import { CreateUserWithEmailAndPassword } from "../../services/FirebaseService";
import { Button, IconButton, Input, FormControl, FormHelperText } from "@mui/material";
import AlertModal from "../../components/CustomAlert/CustomAlert";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SignInPage from "../signin/SignInPage";
import './SignUpPage.css';

interface SignUpPageProps { }

interface SignUpPageState {
    email: string;
    password: string;
    userDisplayName: string;
    openAlert: boolean;
    alertMessage: string;
    alertSeverity: "success" | "error";
    isSignIn: boolean;
    errors: { [key: string]: string };
    age?: number;
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
            isSignIn: false,
            userDisplayName: '',
            errors: {}
        }
    }

    private handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;
        this.setState((prevState: SignUpPageState) => ({
            ...prevState,
            [name]: value,
            errors: {
                ...prevState.errors,
                [name]: '', // Limpar o erro ao digitar
            },
        }));
    };


    private handleSuccess = (): void => {
        this.setState({
            alertMessage: 'Account created successfully',
            alertSeverity: 'success',
            openAlert: true,
            email: '',
            password: '',
            userDisplayName: '',
            age: undefined
        });

        setTimeout(() => {
            this.setState({ isSignIn: true });
        }, 3000);
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


    private handleSignUp = (): void => {
        const { email, password, userDisplayName, age } = this.state;

        if (!email || !password || !userDisplayName) {
            const errors: { [key: string]: string } = {};
            if (!email) errors.email = 'Email is required';
            if (!password) errors.password = 'Password is required';
            if (!userDisplayName) errors.userDisplayName = 'Name is required';
            this.setState({ errors });
            return;
        }

        CreateUserWithEmailAndPassword(email, password, userDisplayName, age)
            .then(() => {
                this.handleSuccess();
            })
            .catch((e) => {
                this.handleError(e);
            });
    };

    public componentDidUpdate(prevProps: Readonly<SignUpPageProps>, prevState: Readonly<SignUpPageState>, snapshot?: any): void {
        console.log(this.state)
    }

    render(): React.ReactNode {
        const { email, password,
            alertMessage, alertSeverity, openAlert,
            isSignIn, userDisplayName, age,
            errors
        } = this.state;

        if (isSignIn) {
            return (
                <>
                    <SignInPage />
                </>
            );
        } else {
            return (
                <div className="SignUpPage">
                    <IconButton onClick={this.handleGoBack} style={{ position: 'absolute', top: 20, left: 20 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <h1>My Game Lib</h1>
                    <h2>Sign Up</h2>

                    <form action="submit" className="FormWrapper">
                        <FormControl error={!!errors.email}>
                            <Input
                                name="email"
                                value={email}
                                placeholder="Email"
                                onChange={this.handleInputChange}
                                required={true}
                            />
                            <FormHelperText>{errors.email}</FormHelperText>
                        </FormControl>

                        <FormControl error={!!errors.password}>
                            <Input
                                name="password"
                                value={password}
                                placeholder="Password"
                                onChange={this.handleInputChange}
                                type="password"
                                required={true}
                            />
                            <FormHelperText>{errors.password}</FormHelperText>
                        </FormControl>

                        <FormControl error={!!errors.userDisplayName}>
                            <Input
                                name="userDisplayName"
                                value={userDisplayName}
                                placeholder={'Your name'}
                                onChange={this.handleInputChange}
                                required={true}
                            />
                            <FormHelperText>{errors.userDisplayName}</FormHelperText>
                        </FormControl>

                        <FormControl error={!!errors.userDisplayName}>
                            <Input
                                type="number"
                                name="age"
                                value={age}
                                placeholder={'Your age'}
                                onChange={this.handleInputChange}
                            />

                        </FormControl>


                        <Button color="info" variant="contained" onClick={this.handleSignUp}>Sign up</Button>
                    </form>


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
