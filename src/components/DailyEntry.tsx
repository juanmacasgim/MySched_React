import React from 'react';
import { EventInterface } from '../interfaces/EventInterface';
import { IconButton, Card, CardContent, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    entries: EventInterface[];
    onDelete: (id: bigint) => void;
    onEdit: (entry: EventInterface) => void;
    onView: (entry: EventInterface) => void;
}

const DailyEntry: React.FC<Props> = ({ entries, onDelete, onEdit, onView }) => {
    console.log('DailyEntry recibe:', entries);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(Array.isArray(entries) ? entries : []).map(entry => (
                <Card key={entry.id.toString()} variant="outlined">
                    <CardContent>
                        <div
                            style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
                            onClick={() => onView(entry)}
                        >
                            <div>
                                <Typography variant="h6">{entry.title}</Typography>
                                <Typography variant="body2">
                                    {entry.description?.slice(0, 100)}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {entry.created_at && entry.updated_at &&
                                        new Date(entry.created_at).getTime() === new Date(entry.updated_at).getTime() ? (
                                        <>Creado: {new Date(entry.created_at).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</>
                                    ) : (
                                        <>
                                            Creado: {entry.created_at ? new Date(entry.created_at).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''}
                                            {' | '}
                                            Modificado: {entry.updated_at ? new Date(entry.updated_at).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''}
                                        </>
                                    )}
                                </Typography>
                            </div>
                            <div>
                                <IconButton
                                    onClick={e => { e.stopPropagation(); onEdit(entry); }}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    onClick={e => { e.stopPropagation(); onDelete(entry.id); }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default DailyEntry;