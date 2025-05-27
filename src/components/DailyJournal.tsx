import React, { useState, useEffect } from 'react';
import MyButton from './MyButton';
import DailyEntry from './DailyEntry';
import AddEntry from './AddEntry';
import { EventInterface } from '../interfaces/EventInterface';
import { CalendarInterface } from '../interfaces/CalendarInterface';
import { getEntriesByCalendar, createEntry, updateEntry, deleteEntry } from '../api/services';
import EditEntryModal from './EditEntryModal';
import ViewEntryModal from './ViewEntryModal';
import { useSnackbar } from 'notistack';

interface Props {
    calendar: CalendarInterface;
}

function normalizeEvent(entry: any): EventInterface {
    return {
        id: BigInt(entry.id),
        calendarId: BigInt(entry.calendar_id),
        title: entry.title,
        description: entry.description,
        startDate: entry.start_date ? new Date(entry.start_date) : new Date(),
        endDate: entry.end_date ? new Date(entry.end_date) : new Date(),
        color: entry.color,
        startTime: entry.start_time,
        endTime: entry.end_time,
        recurrence: entry.recurrence_type ? { frequency: entry.recurrence_type } : undefined,
        recurrence_interval: entry.recurrence_interval,
        recurrence_repeats: entry.recurrence_repeats,
        recurrence_days: entry.recurrence_days,
        parent_event_id: entry.parent_event_id ? BigInt(entry.parent_event_id) : undefined,
        created_at: entry.created_at ? new Date(entry.created_at) : undefined,
        updated_at: entry.updated_at ? new Date(entry.updated_at) : undefined,
    };
}

const DailyJournal: React.FC<Props> = ({ calendar }) => {
    const [entries, setEntries] = useState<EventInterface[]>([]);
    const [addingEntry, setAddingEntry] = useState<boolean>(false);
    const [editingEntry, setEditingEntry] = useState<EventInterface | null>(null);
    const [viewingEntry, setViewingEntry] = useState<EventInterface | null>(null);
    const { enqueueSnackbar } = useSnackbar();

    const fetchEntries = async () => {
        const response = await getEntriesByCalendar(calendar.id);
        const rawData = Array.isArray(response.data?.data) ? response.data.data : Array.isArray(response.data) ? response.data : [];
        const data: EventInterface[] = rawData.map(normalizeEvent);
        setEntries(data);
    };

    useEffect(() => {
        fetchEntries();
    }, [calendar.id]);

    const handleAddEntry = async (newEntry: EventInterface) => {
        const saved = await createEntry(newEntry);
        if (saved && saved.data && saved.data.id) {
            setEntries(entries => [
                ...entries,
                normalizeEvent(saved.data)
            ]);
            setAddingEntry(false);
            enqueueSnackbar('Entrada añadida correctamente', { variant: 'success' });
        } else {
            enqueueSnackbar('Error al añadir la entrada', { variant: 'error' });
        }
    };

    const handleDelete = async (id: bigint) => {
        const deleted = await deleteEntry(id);
        if (deleted && (deleted.status === 1 || deleted.success)) {
            setEntries(entries => entries.filter(e => e.id !== id));
            enqueueSnackbar('Entrada eliminada correctamente', { variant: 'success' });
        } else {
            enqueueSnackbar('Error al eliminar la entrada', { variant: 'error' });
        }
    };

    const handleEdit = (entry: EventInterface) => {
        setEditingEntry(entry);
        console.log('Editar entrada:', entry);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>{calendar.name}</h2>
                <MyButton variant="contained" onClick={() => setAddingEntry(true)}>Añadir entrada</MyButton>
            </div>

            {addingEntry && (
                <AddEntry
                    calendarId={calendar.id}
                    onSave={handleAddEntry}
                    onCancel={() => setAddingEntry(false)}
                />
            )}

            <DailyEntry
                entries={entries}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onView={setViewingEntry}
            />

            <EditEntryModal
                open={!!editingEntry}
                entry={editingEntry}
                onClose={() => setEditingEntry(null)}
                onSave={async (updated) => {
                    const saved = await updateEntry(updated);
                    if (saved && saved.data && saved.data.id) {
                        setEntries(entries =>
                            entries.map(e => e.id === BigInt(saved.data.id) ? normalizeEvent(saved.data) : e)
                        );
                        enqueueSnackbar('Entrada editada correctamente', { variant: 'success' });
                    } else {
                        enqueueSnackbar('Error al editar la entrada', { variant: 'error' });
                    }
                    setEditingEntry(null);
                }}
            />

            <ViewEntryModal
                open={!!viewingEntry}
                entry={viewingEntry}
                onClose={() => setViewingEntry(null)}
            />
        </div>
    );
};

export default DailyJournal;
