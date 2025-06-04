import React, { useState } from 'react';
import { EventInterface } from '../interfaces/EventInterface';
import MyButton from './MyButton';
import { TextField } from '@mui/material';

interface Props {
    calendarId: number;
    onSave: (entry: EventInterface) => void;
    onCancel: () => void;
}

const AddEntry: React.FC<Props> = ({ calendarId, onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSave = () => {
        const newEntry: EventInterface = {
            id: BigInt(Date.now()),
            calendarId: BigInt(calendarId),
            title,
            description,
            startDate: new Date(),
            endDate: new Date(),
        };
        onSave(newEntry);
        setTitle('');
        setDescription('');
    };

    return (
        <div style={{ marginBottom: 16 }}>
            <TextField
                label="Título"
                fullWidth
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{ marginBottom: 12 }}
            />
            <TextField
                label="Descripción"
                fullWidth
                multiline
                minRows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{ marginBottom: 12 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
                <MyButton variant="contained" onClick={handleSave}>Guardar</MyButton>
                <MyButton variant="outlined" onClick={onCancel}>Cancelar</MyButton>
            </div>
        </div>
    );
};

export default AddEntry;
