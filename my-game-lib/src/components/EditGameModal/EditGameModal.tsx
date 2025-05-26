import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@mui/material';
import { Game } from '../../models/Game';
import { GameStatus } from '../../models/GameStatus';
import { Platform } from '../../models/SearchPlatformResult';

interface EditGameModalProps {
    open: boolean;
    game: Game | null;
    statuses: GameStatus[];
    onClose: () => void;
    onSave: (game: Game) => void;
}

const EditGameModal: React.FC<EditGameModalProps> = ({
    open, game, statuses, onClose, onSave
}) => {
    const [editedGame, setEditedGame] = useState<Game | null>(null);

    useEffect(() => {
        if (game) {
            let status = game.status;
            console.log(status);
            // if (status && typeof status === 'string') {
            //     const foundStatus = statuses.find(s => s.slug === status || s.name === status);
            //     status = foundStatus || status;
            // }
            setEditedGame({ ...game });
        }
    }, [game]);

    const handleChange = (field: keyof Game, value: any) => {
        console.log(game, editedGame?.docId);
        setEditedGame(prev => prev ? { ...prev, [field]: value } : prev);
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>

            <DialogTitle>Editar Jogo</DialogTitle>
            <DialogContent>
                <TextField
                    disabled
                    label="Nome"
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
                {/* <TextField
                    label="Notas"
                    value={editedGame?.notes || ''}
                    onChange={e => handleChange('notes', e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                /> */}
            </DialogContent>
            <DialogActions>
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