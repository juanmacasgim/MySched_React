import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, MenuItem
} from '@mui/material';
import { CalendarInterface } from '../interfaces/CalendarInterface';

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (calendar: CalendarInterface) => void | Promise<void>;
    initialCalendar?: CalendarInterface | null;
}

const AddCalendar: React.FC<Props> = ({ open, onClose, onSave, initialCalendar }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'standard_calendar' | 'daily_journal'>('standard_calendar');

    useEffect(() => {
        if (initialCalendar) {
            setName(initialCalendar.name || '');
            setDescription(initialCalendar.description || '');
            setType(initialCalendar.type as 'standard_calendar' | 'daily_journal');
        } else {
            setName('');
            setDescription('');
            setType('standard_calendar');
        }
    }, [initialCalendar, open]);

const handleSave = () => {
    if (!name.trim()) return;
    onSave({
        id: initialCalendar?.id ?? 0, 
        user_id: initialCalendar?.user_id ?? 0,
        name,
        description: description ?? '',
        type,
        color: initialCalendar?.color || '#1976d2',
    });
    onClose();
};

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>{initialCalendar ? 'Editar calendario' : 'Crear nuevo calendario'}</DialogTitle>
            <DialogContent>
                <TextField
                    label="Título"
                    fullWidth
                    value={name}
                    onChange={e => setName(e.target.value)}
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
                    label="Tipo"
                    select
                    fullWidth
                    value={type}
                    onChange={e => setType(e.target.value as 'standard_calendar' | 'daily_journal')}
                    margin="normal"
                >
                    <MenuItem value="standard_calendar">Standard</MenuItem>
                    <MenuItem value="daily_journal">Diario</MenuItem>
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSave} variant="contained">
                    {initialCalendar ? 'Guardar cambios' : 'Crear'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddCalendar;