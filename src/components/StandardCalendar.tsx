import React, { useState } from 'react';
import '../styles/StandardCalendar.css';
import { CalendarInterface } from '../interfaces/CalendarInterface';
import MyButton from './MyButton';
import EventItem from './EventItem';
import { EventInterface } from '../interfaces/EventInterface';
import EventDetailModal from './EventDetailModal';
import AddEvent from './AddEvent';
import EditEvent from './EditEvent';

const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function getMonthMatrix(year: number, month: number) {
    const matrix = [];
    const date = new Date(year, month, 1);
    const firstDay = (date.getDay() + 6) % 7; // lunes = 0

    let current = new Date(year, month, 1 - firstDay);

    for (let week = 0; week < 6; week++) {
        const row = [];
        for (let day = 0; day < 7; day++) {
            row.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        matrix.push(row);
    }

    return matrix;
}

interface StandardCalendarProps {
    events?: EventInterface[];
    calendar: CalendarInterface;
    onDeleteEvent: (eventId: bigint) => void;
    onCreateEvent?: (event: Omit<EventInterface, 'id' | 'calendarId'>) => void;
    onEditEvent?: (event: EventInterface) => void;
    editingEvent?: EventInterface | null;
    editOpen?: boolean;
    setEditOpen?: (open: boolean) => void;
    handleUpdateEvent?: (event: EventInterface) => void; // Añade esto si lo usas así
}

const StandardCalendar: React.FC<StandardCalendarProps> = ({ events = [], calendar, onDeleteEvent,
    onCreateEvent, onEditEvent, editingEvent, editOpen, setEditOpen, handleUpdateEvent }) => {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [addingEvent, setAddingEvent] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<EventInterface | null>(null);
    const [showEventModal, setShowEventModal] = useState(false);


    const handlePrev = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNext = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const monthMatrix = getMonthMatrix(currentDate.getFullYear(), currentDate.getMonth());

    const isSameMonth = (date: Date) => date.getMonth() === currentDate.getMonth();

    // Helper para comparar fechas (sin horas)
    const isSameDay = (date1: Date, date2: Date) =>
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();

    return (
        <div className="calendar-wrapper">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>{calendar.name}</h2>
                <MyButton variant="contained" onClick={() => setAddingEvent(true)}>
                    Añadir evento
                </MyButton>
            </div>
            <div className="calendar-header">
                <button onClick={handlePrev}>←</button>
                <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
                <button onClick={handleNext}>→</button>
            </div>

            <div className="calendar-grid">
                {daysOfWeek.map((day, idx) => (
                    <div key={idx} className="day-label">{day}</div>
                ))}

                {monthMatrix.map((week, i) =>
                    week.map((day, j) => (
                        <div
                            key={`${i}-${j}`}
                            className={`calendar-cell${isSameMonth(day) ? '' : ' other-month'}`}
                        >
                            <div className="calendar-date">{day.getDate()}</div>
                            {events
                                .filter(ev => isSameDay(new Date(ev.startDate), day))
                                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                                .map(ev => (
                                    <EventItem
                                        key={ev.id.toString()}
                                        title={ev.title}
                                        time_start={new Date(ev.startDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit'})}
                                        time_end={new Date(ev.endDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit'})}
                                        color={ev.color}
                                        onClick={() => {
                                            setSelectedEvent(ev);
                                            setShowEventModal(true);
                                        }}
                                    />
                                ))
                            }
                        </div>
                    ))
                )}
                <AddEvent
                    open={addingEvent}
                    onClose={() => setAddingEvent(false)}
                    onSave={(event) => {
                        onCreateEvent && onCreateEvent(event);
                        setAddingEvent(false);
                    }}
                />
                <EventDetailModal
                    open={showEventModal}
                    event={selectedEvent}
                    onClose={() => setShowEventModal(false)}
                    onEdit={(ev) => {
                        setShowEventModal(false);
                        if (onEditEvent) onEditEvent(ev);
                    }}
                    onDelete={(ev) => {
                        setShowEventModal(false);
                        onDeleteEvent(ev.id);
                    }}
                />
                <EditEvent
                    open={!!editOpen}
                    event={editingEvent ?? null}
                    onClose={() => setEditOpen && setEditOpen(false)}
                    onSave={handleUpdateEvent!}
                />
            </div>
        </div>
    );
};

export default StandardCalendar;