import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import MyButton from '../components/MyButton';
import CalendarButton from '../components/CalendarButton';
import { useNavigate } from 'react-router-dom';
import { Add, Logout } from '@mui/icons-material';
import StandardCalendar from '../components/StandardCalendar';
import { CalendarInterface } from '../interfaces/CalendarInterface';
import DailyJournal from '../components/DailyJournal';
import { createEvent, deleteEvent, getAllUserCalendars, getEventsByCalendar, updateEvent } from '../api/services';
import '../styles/Calendar.css';
import AddCalendar from '../components/AddCalendar';
import { createCalendar, updateCalendar, deleteCalendar } from '../api/services';
import { useSnackbar } from 'notistack';
import { EventInterface } from '../interfaces/EventInterface';

function normalizeEvent(ev: any): EventInterface {
    return {
        id: typeof ev.id === 'bigint' ? ev.id : BigInt(ev.id),
        calendarId: typeof ev.calendar_id === 'bigint' ? ev.calendar_id : BigInt(ev.calendar_id),
        title: ev.title,
        description: ev.description,
        startDate: ev.start_date ? new Date(ev.start_date) : new Date(),
        endDate: ev.end_date ? new Date(ev.end_date) : new Date(),
        color: ev.color,
        startTime: ev.start_time,
        endTime: ev.end_time,
        recurrence: ev.recurrence_type ? { frequency: ev.recurrence_type } : undefined,
        recurrence_interval: ev.recurrence_interval,
        recurrence_repeats: ev.recurrence_repeats,
        recurrence_days: ev.recurrence_days,
        parent_event_id: ev.parent_event_id ? BigInt(ev.parent_event_id) : undefined,
        created_at: ev.created_at ? new Date(ev.created_at) : undefined,
        updated_at: ev.updated_at ? new Date(ev.updated_at) : undefined,
    };
}

function Calendar() {
    const [selectedCalendar, setSelectedCalendar] = useState<CalendarInterface | null>(null);
    const [calendars, setCalendars] = useState<CalendarInterface[]>([]);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EventInterface | null>(null);
    const [editCalendarOpen, setEditCalendarOpen] = useState(false);
    const [calendarToEdit, setCalendarToEdit] = useState<CalendarInterface | null>(null);
    const [events, setEvents] = useState<EventInterface[]>([]);

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('MySchedToken');
        if (!token) {
            navigate('/mysched/login');
        } else {
            const fetchCalendars = async () => {
                try {
                    const data = await getAllUserCalendars();
                    setCalendars(data);
                    const standard = data.find((cal: CalendarInterface) => cal.type === 'standard_calendar');
                    if (standard) setSelectedCalendar(standard);
                    else if (data.length > 0) setSelectedCalendar(data[0]);
                } catch (error) {
                    setCalendars([]);
                }
            };
            fetchCalendars();
        }
    }, [navigate]);

    useEffect(() => {
        const fetchEvents = async () => {
            if (selectedCalendar) {
                try {
                    const data = await getEventsByCalendar(selectedCalendar.id);
                    const eventsArray = Array.isArray(data)
                        ? data
                        : (Array.isArray(data.data) ? data.data : []);
                    const normalized = eventsArray.map(normalizeEvent);
                    setEvents(normalized);
                    console.log('Fetched events:', normalized);
                } catch (error) {
                    setEvents([]);
                }
            } else {
                setEvents([]);
            }
        };
        fetchEvents();
    }, [selectedCalendar]);

    const handleLogout = () => {
        localStorage.removeItem('MySchedToken');
        navigate('/mysched/home');
    };

    const handleCreateCalendar = async (calendar: Omit<CalendarInterface, 'id' | 'user_id'>) => {
        try {
            const saved = await createCalendar(calendar as CalendarInterface);
            // El calendario real está en saved.data
            if (saved && saved.data && saved.data.id) {
                setCalendars([...calendars, saved.data]);
                enqueueSnackbar('Calendario creado correctamente', { variant: 'success' });
            } else {
                enqueueSnackbar('Error al crear el calendario', { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Error al crear el calendario', { variant: 'error' });
        }
    };

    const handleCreateEvent = async (event: Omit<EventInterface, 'id' | 'calendarId'>) => {
        if (!selectedCalendar) {
            enqueueSnackbar('Selecciona un calendario antes de crear un evento', { variant: 'warning' });
            return;
        }
        try {
            const saved = await createEvent({
                ...event,
                calendarId: BigInt(selectedCalendar.id),
            });
            setEvents(prev => [...prev, normalizeEvent(saved.data)]);
            enqueueSnackbar('Evento creado correctamente', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Error al crear el evento', { variant: 'error' });
        }
    };

    const handleEditCalendar = async (calendar: CalendarInterface) => {
        try {
            const saved = await updateCalendar(calendar);
            if (saved && saved.data && saved.data.id) {
                setCalendars(calendars =>
                    calendars.map(c => c.id === saved.data.id ? saved.data : c)
                );
                enqueueSnackbar('Calendario actualizado correctamente', { variant: 'success' });
            } else {
                enqueueSnackbar('Error al actualizar el calendario', { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Error al actualizar el calendario', { variant: 'error' });
        }
        setEditCalendarOpen(false);
        setCalendarToEdit(null);
    };

    const handleUpdateEvent = async (updatedEvent: EventInterface) => {
        try {
            await updateEvent(updatedEvent);
            if (!selectedCalendar) return;
            const data = await getEventsByCalendar(selectedCalendar.id);
            const eventsArray = Array.isArray(data)
                ? data
                : (Array.isArray(data.data) ? data.data : []);
            setEvents(eventsArray.map(normalizeEvent));
            enqueueSnackbar('Evento actualizado correctamente', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Error al actualizar el evento', { variant: 'error' });
        }
        setEditOpen(false);
        setEditingEvent(null);
    };

    const handleDeleteCalendar = async (calendarId: number) => {
        try {
            const deleted = await deleteCalendar(calendarId);
            if (deleted && (deleted.success || deleted.status === 1)) {
                setCalendars(calendars => calendars.filter(c => c.id !== calendarId));
                enqueueSnackbar('Calendario eliminado correctamente', { variant: 'success' });
                if (selectedCalendar?.id === calendarId) {
                    if (calendars.length > 1) {
                        const next = calendars.find(c => c.id !== calendarId);
                        setSelectedCalendar(next || null);
                    } else {
                        setSelectedCalendar(null);
                    }
                }
            } else {
                enqueueSnackbar('Error al eliminar el calendario', { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Error al eliminar el calendario', { variant: 'error' });
        }
    };

    const handleDeleteEvent = async (eventId: bigint) => {
        try {
            const deleted = await deleteEvent(eventId);
            if (deleted && (deleted.success || deleted.status === 1)) {
                setEvents(events => events.filter(ev => ev.id !== eventId));
                enqueueSnackbar('Evento eliminado correctamente', { variant: 'success' });
            } else {
                enqueueSnackbar('Error al eliminar el evento', { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Error al eliminar el evento', { variant: 'error' });
        }
    };

    return (
        <div className='calendar'>
            <Navbar
                logo="MySched"
                actions={[
                    <MyButton key="logout" variant="contained" onClick={handleLogout} endIcon={<Logout />}>
                        Logout
                    </MyButton>
                ]}
            />
            <div style={{ display: 'flex' }}>
                <div style={{
                    width: 260,
                    background: '#f5f5f5',
                    padding: 24,
                    borderRight: '1px solid #ddd',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16
                }}>
                    <h3>Mis calendarios</h3>
                    <MyButton variant="contained" endIcon={<Add />} onClick={() => setAddOpen(true)}>
                        Añadir calendario
                    </MyButton>
                    <AddCalendar
                        open={addOpen}
                        onClose={() => setAddOpen(false)}
                        initialCalendar={null}
                        onSave={handleCreateCalendar}
                    />
                    <AddCalendar
                        open={editCalendarOpen}
                        onClose={() => {
                            setEditCalendarOpen(false);
                            setCalendarToEdit(null);
                        }}
                        initialCalendar={calendarToEdit}
                        onSave={handleEditCalendar}
                    />
                    <ul className="calendar-list">
                        {calendars.length === 0 ? (
                            <li>No tienes calendarios</li>
                        ) : (
                            calendars.map((cal) => (
                                <li key={cal.id}>
                                    <CalendarButton
                                        calendar={cal}
                                        selected={selectedCalendar?.id === cal.id}
                                        onClick={() => setSelectedCalendar(cal)}
                                        onEdit={() => {
                                            setCalendarToEdit(cal);
                                            setEditCalendarOpen(true);
                                        }}
                                        onDelete={() => handleDeleteCalendar(cal.id)}
                                    />
                                </li>
                            ))
                        )}
                    </ul>
                </div>
                <div style={{ flex: 1, padding: 24 }}>
                    {selectedCalendar ? (
                        selectedCalendar.type === 'standard_calendar' ? (
                            <StandardCalendar
                                events={events}
                                calendar={selectedCalendar}
                                onDeleteEvent={handleDeleteEvent}
                                onCreateEvent={handleCreateEvent}
                                onEditEvent={(ev) => { setEditingEvent(ev); setEditOpen(true); }}
                                editingEvent={editingEvent}
                                editOpen={editOpen}
                                setEditOpen={setEditOpen}
                                handleUpdateEvent={handleUpdateEvent}
                            />
                        ) : selectedCalendar.type === 'daily_journal' ? (
                            <DailyJournal key={selectedCalendar.id.toString()} calendar={selectedCalendar} />
                        ) : (
                            <p>Tipo de calendario no soportado</p>
                        )
                    ) : (
                        <p>Selecciona un calendario</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Calendar;