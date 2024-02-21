import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

interface AlertModalProps {
    open: boolean;
    onClose: () => void;
    message: string;
    severity: 'success' | 'error';
}

function CustomAlert({ open, onClose, message, severity }: AlertModalProps) {
    return (
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} autoHideDuration={6000} onClose={onClose}>
            <MuiAlert onClose={onClose} severity={severity} elevation={6} variant="filled">
                {message}
            </MuiAlert>
        </Snackbar>
    );
}

export default CustomAlert;
