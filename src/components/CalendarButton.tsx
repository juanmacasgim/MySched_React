import React, { useState } from 'react';
import MyButton from './MyButton';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BookIcon from '@mui/icons-material/Book';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { CalendarInterface } from '../interfaces/CalendarInterface';

interface Props {
    calendar: CalendarInterface;
    selected: boolean;
    onClick: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const CalendarButton: React.FC<Props> = ({
    calendar,
    selected,
    onClick,
    onEdit,
    onDelete,
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    let icon = null;
    if (calendar.type === 'standard_calendar') icon = <CalendarMonthIcon />;
    if (calendar.type === 'daily_journal') icon = <BookIcon />;

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (
        event?: React.MouseEvent<HTMLElement> | object,
        reason?: "backdropClick" | "escapeKeyDown"
    ) => {
        if (event && 'stopPropagation' in event && typeof event.stopPropagation === 'function') {
            event.stopPropagation();
        }
        setAnchorEl(null);
    };

    const handleEdit = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        handleMenuClose();
        onEdit && onEdit();
    };

    const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        handleMenuClose();
        onDelete && onDelete();
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <MyButton
                className="calendar-btn"
                variant={selected ? 'contained' : 'outlined'}
                onClick={onClick}
            >
                {icon}
                {calendar.name}
            </MyButton>
            <IconButton
                size="small"
                onClick={handleMenuOpen}
                style={{ marginLeft: 4 }}
                aria-label="Opciones"
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={e => e.stopPropagation()}
            >
                <MenuItem onClick={handleEdit}>Editar</MenuItem>
                <MenuItem onClick={handleDelete}>Eliminar</MenuItem>
            </Menu>
        </div>
    );
};

export default CalendarButton;