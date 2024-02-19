import { Button, IconButton, Input } from "@mui/material";
import React from "react";
import './SignInPage.css'
import GoogleIcon from '@mui/icons-material/Google';



export default class SignInPage extends React.Component<{}>{
    render(): React.ReactNode {
        return (
            <>
                <h1>My Game Lib</h1>
                <div className='InputWrapper'>
                    <Input
                        placeholder="Email"
                    />
                    <Input
                        placeholder="Senha"
                    />
                </div>
                <Button variant="contained">Sign in</Button>
                <Button color="secondary" variant="contained">Sign up</Button>
                <IconButton
                    onClick={() => { console.log('icon click') }}
                > <GoogleIcon /> </IconButton>


            </>
        );
    }
}