import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, Button
} from '@mui/material';
import { EventInterface } from '../interfaces/EventInterface';

interface Props {
    open: boolean;
    entry: EventInterface | null;
    onClose: () => void;
}

const ViewEntryModal: React.FC<Props> = ({ open, entry, onClose }) => {
    if (!entry) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>{entry.title}</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {entry.description || 'Sin descripción.'}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewEntryModal;
