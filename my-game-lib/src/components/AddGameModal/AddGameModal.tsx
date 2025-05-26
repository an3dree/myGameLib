import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { SearchGameResult } from '../../models/SearchGameResult';
import './AddGameModal.css';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Platform } from '../../models/SearchPlatformResult';
import { GameStatus } from '../../models/GameStatus';



// Componente do Modal
const AddGameModal = (
    {
        open,
        handleClose,
        handlePlatformChange,
        handleStatusChange,
        addGame, game, platforms, statuses, platform, status,
    }:
        {
            open: boolean,
            handleClose: () => void,
            handlePlatformChange: (event: SelectChangeEvent<any>) => void,
            handleStatusChange: (event: SelectChangeEvent<any>) => void,
            addGame: () => Promise<void>,
            game?: SearchGameResult | null,
            platforms: Platform[];
            statuses: GameStatus[];
            platform?: Platform;
            status?: GameStatus;
        }
) => {


    return (
        <Modal
            open={open}
            onClose={handleClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            aria-labelledby="game modal"
            aria-describedby="add new game to collection"

        >
            <Box
                sx={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    outline: 'none',
                    boxShadow: 24,
                    padding: '24px',
                    maxWidth: '80%',
                    maxHeight: '80%',
                    overflow: 'auto',
                    position: 'relative',

                }}
            >
                <Box sx={{ position: 'absolute', top: '8px', right: '8px' }}>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Typography align='center' variant="h5" id="modal-title" marginTop={2}>
                    {game?.name}
                </Typography>
                {!!game?.background_image &&
                    <img src={game.background_image} alt={game.name} style={{ maxWidth: '100%', height: 'auto' }} />
                }
                <form action="submit">

                    <FormControl fullWidth>
                        <InputLabel id="platform">Platform</InputLabel>
                        <Select
                            labelId="platform"
                            id="platform-select"
                            value={platform ? platform.name : ''}
                            label="Platform"
                            onChange={handlePlatformChange}
                        >
                            {
                                platforms.map((i: any) => {
                                    return (
                                        <MenuItem key={i.platform.id} value={i.platform.name}>
                                            {i.platform.name}
                                        </MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel id="status">Status</InputLabel>
                        <Select
                            labelId="status"
                            id="status-select"
                            value={status ? status.name : ''}
                            label="Status"
                            onChange={handleStatusChange}
                        >
                            {
                                statuses.map(i => {
                                    return (
                                        <MenuItem key={i.id} value={i.name}>
                                            {i.name}
                                        </MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                </form>

                <IconButton onClick={handleClose} style={{ position: 'absolute', top: '8px', right: '8px' }}>

                </IconButton>
                <Typography variant="body1" id="modal-description">
                    Do you want to add this game to your collection?
                </Typography>
                <Button onClick={() => game && addGame()} variant="contained" color="primary">
                    Yes
                </Button>
                <Button onClick={handleClose} variant="contained" color="secondary">
                    Cancel
                </Button>

            </Box>
        </Modal>
    );
};

export default AddGameModal;
