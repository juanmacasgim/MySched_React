import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid } from '@mui/material';
import { EventInterface } from '../interfaces/EventInterface';

interface AddEventProps {
    open: boolean;
    onClose: () => void;
    onSave: (event: Omit<EventInterface, 'id' | 'calendarId'>) => void;
    initialEvent?: Partial<EventInterface>;
}

const AddEvent: React.FC<AddEventProps> = ({ open, onClose, onSave, initialEvent }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');

    useEffect(() => {
        setTitle(initialEvent?.title || '');
        setDescription(initialEvent?.description || '');
        setStartDate(initialEvent?.startDate ? new Date(initialEvent.startDate).toISOString().slice(0, 10) : '');
        setStartTime(initialEvent?.startDate ? new Date(initialEvent.startDate).toISOString().slice(11, 16) : '');
        setEndDate(initialEvent?.endDate ? new Date(initialEvent.endDate).toISOString().slice(0, 10) : '');
        setEndTime(initialEvent?.endDate ? new Date(initialEvent.endDate).toISOString().slice(11, 16) : '');
    }, [initialEvent, open]);

    const handleSave = () => {
        if (!title.trim() || !startDate || !startTime || !endDate || !endTime) return;
        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);
        console.log('Saving event:', {
            title,
            description,
            startDate: start,
            endDate: end,
            color: initialEvent?.color || '#1976d2',
        });
        onSave({
            title,
            description,
            startDate: start,
            endDate: end,
            color: initialEvent?.color || '#1976d2',
        } as Omit<EventInterface, 'id' | 'calendarId'>);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>{initialEvent ? 'Editar evento' : 'Añadir evento'}</DialogTitle>
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
                <Grid spacing={2}>
                    <Grid size={6}>
                        <TextField
                            label="Fecha inicio"
                            type="date"
                            fullWidth
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label="Hora inicio"
                            type="time"
                            fullWidth
                            value={startTime}
                            onChange={e => setStartTime(e.target.value)}
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label="Fecha fin"
                            type="date"
                            fullWidth
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label="Hora fin"
                            type="time"
                            fullWidth
                            value={endTime}
                            onChange={e => setEndTime(e.target.value)}
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSave} variant="contained">
                    {initialEvent ? 'Guardar cambios' : 'Crear'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddEvent;