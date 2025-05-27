import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { EventInterface } from '../interfaces/EventInterface';

interface Props {
    open: boolean;
    event: EventInterface | null;
    onClose: () => void;
    onEdit: (event: EventInterface) => void;
    onDelete: (event: EventInterface) => void;
}

const EventDetailModal: React.FC<Props> = ({ open, event, onClose, onEdit, onDelete }) => {
    if (!event) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>
                {event.title}
                <span style={{ float: 'right' }}>
                    <IconButton onClick={() => onEdit(event)} size="small">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDelete(event)} size="small" color="error">
                        <DeleteIcon />
                    </IconButton>
                </span>
            </DialogTitle>
            <DialogContent>
                <Typography variant="subtitle1" gutterBottom>
                    Descripción: {event.description || 'Sin descripción'}
                </Typography>
                <Typography variant="body2">
                    Inicio: {new Date(event.startDate).toLocaleString('es-ES')}
                </Typography>
                <Typography variant="body2">
                    Fin: {new Date(event.endDate).toLocaleString('es-ES')}
                </Typography>
            </DialogContent>
        </Dialog>
    );
};

export default EventDetailModal;