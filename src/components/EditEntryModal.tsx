import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button
} from '@mui/material';
import { EventInterface } from '../interfaces/EventInterface';

interface Props {
    open: boolean;
    entry: EventInterface | null;
    onClose: () => void;
    onSave: (entry: EventInterface) => void;
}

const EditEntryModal: React.FC<Props> = ({ open, entry, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (entry) {
            setTitle(entry.title);
            setDescription(entry.description || '');
        }
    }, [entry]);

    const handleSave = () => {
        if (!entry) return;
        const updatedEntry: EventInterface = {
            ...entry,
            title,
            description
        };
        onSave(updatedEntry);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Editar entrada</DialogTitle>
            <DialogContent>
                <TextField
                    label="Título"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Descripción"
                    fullWidth
                    multiline
                    minRows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSave} variant="contained">Guardar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditEntryModal;
