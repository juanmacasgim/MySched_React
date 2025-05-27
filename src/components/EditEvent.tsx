import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { EventInterface } from '../interfaces/EventInterface';

interface EditEventProps {
    open: boolean;
    event: EventInterface | null;
    onClose: () => void;
    onSave: (event: EventInterface) => void;
}

const EditEvent: React.FC<EditEventProps> = ({ open, event, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');

    useEffect(() => {
        if (event) {
            setTitle(event.title || '');
            setDescription(event.description || '');
            setStartDate(event.startDate ? new Date(event.startDate).toISOString().slice(0, 10) : '');
            setStartTime(event.startDate ? new Date(event.startDate).toISOString().slice(11, 16) : '');
            setEndDate(event.endDate ? new Date(event.endDate).toISOString().slice(0, 10) : '');
            setEndTime(event.endDate ? new Date(event.endDate).toISOString().slice(11, 16) : '');
        }
    }, [event, open]);

    const handleSave = () => {
        if (!title.trim() || !startDate || !startTime || !endDate || !endTime || !event) return;
        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);

        const startUTC = new Date(start.getTime() - start.getTimezoneOffset() * 60000);
        const endUTC = new Date(end.getTime() - end.getTimezoneOffset() * 60000);
        onSave({
            ...event,
            title,
            description,
            startDate: startUTC,
            endDate: endUTC,
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Editar evento</DialogTitle>
            <DialogContent>
                <TextField
                    label="Título"
                    fullWidth
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Descripción"
                    fullWidth
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Fecha inicio"
                    type="date"
                    fullWidth
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Hora inicio"
                    type="time"
                    fullWidth
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Fecha fin"
                    type="date"
                    fullWidth
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Hora fin"
                    type="time"
                    fullWidth
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSave} variant="contained">
                    Guardar cambios
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditEvent;