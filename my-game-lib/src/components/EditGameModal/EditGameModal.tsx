import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, Tooltip } from '@mui/material';
import { Game } from '../../models/Game';
import { GameStatus } from '../../models/GameStatus';
import DeleteIcon from '@mui/icons-material/Delete';

interface EditGameModalProps {
    open: boolean;
    openDeleteModal: boolean;
    game: Game | null;
    statuses: GameStatus[];
    onClose: () => void;
    onCloseDeleteModal: () => void;
    onOpenDeleteModal: () => void;
    onSave: (game: Game) => void;
    onDelete: (gameId: string) => void;
}

const EditGameModal: React.FC<EditGameModalProps> = ({
    open, game, statuses,
    onClose, onSave, onDelete,
    openDeleteModal, onCloseDeleteModal,
    onOpenDeleteModal
}) => {
    const [editedGame, setEditedGame] = useState<Game | null>(null);

    useEffect(() => {
        if (game) {
            //let status = game.status;
            //console.log(status);
            // if (status && typeof status === 'string') {
            //     const foundStatus = statuses.find(s => s.slug === status || s.name === status);
            //     status = foundStatus || status;
            // }
            setEditedGame({
                ...game
            });
        } else {
            setEditedGame(null);
        }
    }, [game]);

    const handleChange = (field: keyof Game, value: any) => {
        console.log(game, editedGame?.docId);
        setEditedGame(prev => prev ? { ...prev, [field]: value } : prev);
    }



    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Dialog open={openDeleteModal} onClose={onCloseDeleteModal} maxWidth="sm">
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to remove this game?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCloseDeleteModal}>Cancel</Button>
                    <Button
                        onClick={() => editedGame?.docId && onDelete(editedGame.docId)}
                        variant="contained"
                        color="primary"
                        disabled={!editedGame}
                    >
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>

            <DialogTitle>Edit Game</DialogTitle>
            <DialogContent>
                <TextField
                    disabled
                    label="Name"
                    value={editedGame?.name}
                    onChange={e => handleChange('name', e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Select
                    label="Status"
                    value={typeof editedGame?.status === 'object' ? editedGame.status.slug : editedGame?.status || ''}
                    onChange={e => {
                        const selected = statuses.find(s => s.slug === e.target.value);
                        handleChange('status', selected || e.target.value);
                    }}
                    fullWidth
                    margin="dense"
                >
                    {statuses.map(status => (
                        <MenuItem key={status.id} value={status.slug}>{status.name}</MenuItem>
                    ))}
                </Select>
                <TextField
                    label="Played Time"
                    type="number"
                    value={editedGame?.playedTime ?? ''}
                    onChange={e => handleChange('playedTime', e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="User Score"
                    type="number"
                    value={editedGame?.userScore ?? ''}
                    onChange={e => handleChange('userScore', e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Comments"
                    value={editedGame?.userComments || ''}
                    onChange={e => handleChange('userComments', e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                    <Tooltip title="Delete Game" arrow placement="bottom">
                        <DeleteIcon style={{ color: '#f44336', cursor: 'pointer' }}
                            onClick={() => editedGame?.docId && onOpenDeleteModal()}
                        />
                    </Tooltip>

                </div>

            </DialogContent>
            <DialogActions style={{ justifyContent: 'center' }}>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                    onClick={() => editedGame && onSave(editedGame)}
                    variant="contained"
                    color="primary"
                    disabled={!editedGame}
                >
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );

}

export default EditGameModal;