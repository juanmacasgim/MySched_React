import React from 'react';
import EventItem from './EventItem';

interface EventData {
    id: number | string;
    title: string;
    startDate: string; // formato ISO o Date
    endDate: string; // formato ISO o Date
    color?: string;
}

interface EventsProps {
    events: EventData[];
}

const Events: React.FC<EventsProps> = ({ events }) => {
    // Ordena por hora de inicio
    const sorted = [...events].sort((a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    return (
        <div>
            {sorted.map(ev => (
                <EventItem
                    key={ev.id}
                    title={ev.title}
                    time_start={new Date(ev.startDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                    time_end={new Date(ev.endDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                    color={ev.color}
                />
            ))}
        </div>
    );
};

export default Events;