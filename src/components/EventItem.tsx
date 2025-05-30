import React from 'react';

interface EventItemProps {
    title: string;
    time_start: string; // formato 'HH:mm' o similar
    time_end?: string; // opcional, formato 'HH:mm'
    color?: string;
    onClick?: () => void;
}

const EventItem: React.FC<EventItemProps> = ({ title, time_start, time_end, color, onClick }) => {
    return (
        <div
            style={{
                background: color,
                color: '#fff',
                borderRadius: 8,
                padding: '8px 16px',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                minHeight: 40,
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}
            onClick={onClick}
        >
            <span style={{ fontWeight: 600, marginRight: 12 }}>{time_start}-{time_end}</span>
            <span>{title}</span>
        </div>
    );
};

export default EventItem;