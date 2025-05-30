import axios from 'axios';
import { UserInterface } from '../interfaces/UserInterface';
import { CalendarInterface } from '../interfaces/CalendarInterface';
import { EventInterface } from '../interfaces/EventInterface';

export const API_URL = 'http://localhost:8080//api';

/**
 * User Singup
 */
export const register = async (user: UserInterface) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            name: user.name,
            email: user.email,
            date_of_birth: user.birthdate,
            password: user.password
        });

        if (response.data.status === 1) {
            localStorage.setItem('MySchedToken', response.data.token);

            await createCalendar({
                name: 'Calendario de ' + user.name,
                description: 'Calendario personal de ' + user.name,
                type: 'standard_calendar',
                color: '#1976d2'
            } as CalendarInterface);
        }

        return response.data;
    } catch (error: any) {
        // Si la respuesta está disponible, la devuelve
        if (error.response) {
            return error.response.data;
        }
        // Si no, lanza el error
        throw error;
    }
};

/**
 * User Login
 */
export const login = async (user: UserInterface) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            email: user.email,
            password: user.password
        });

        if (response.data.status === 1) {
            localStorage.setItem('MySchedToken', response.data.token);
        }

        return response.data;
    } catch (error: any) {
        // Si la respuesta está disponible, la devuelve
        if (error.response) {
            return error.response.data;
        }
        // Si no, lanza el error
        throw error;
    }
};

/**
 * User Logout
 */
export const logout = async () => {
    try {
        const token = localStorage.getItem('MySchedToken');
        const response = await axios.get(`${API_URL}/logout`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.data.status === 1) {
            localStorage.removeItem('MySchedToken');
        }

        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        }
        throw error;
    }
};

export const getAllUserCalendars = async () => {
    try {
        const token = localStorage.getItem('MySchedToken');
        const response = await axios.get<CalendarInterface[]>(`${API_URL}/calendars`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        }
        throw error;
    }
};

export const createCalendar = async (calendar: CalendarInterface) => {
    const token = localStorage.getItem('MySchedToken');
    const payload = {
        name: calendar.name,
        description: calendar.description,
        type: calendar.type,
        color: calendar.color,
    };
    console.log('Creating calendar with payload:', payload);

    const response = await axios.post(`${API_URL}/calendars`, payload, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

export const updateCalendar = async (calendar: CalendarInterface) => {
    const token = localStorage.getItem('MySchedToken');
    const payload = {
        name: calendar.name,
        description: calendar.description,
        type: calendar.type,
        color: calendar.color,
    };
    console.log('Updating calendar with payload:', payload);
    const response = await axios.put(`${API_URL}/calendars/${calendar.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

export const deleteCalendar = async (calendarId: number) => {
    const token = localStorage.getItem('MySchedToken');
    const response = await axios.delete(`${API_URL}/calendars/${calendarId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getEventsByCalendar = async (calendarId: number) => {
    const token = localStorage.getItem('MySchedToken');
    const response = await axios.get(`${API_URL}/calendars/${calendarId}/events`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

export const createEvent = async (event: Omit<EventInterface, 'id'>) => {
    const token = localStorage.getItem('MySchedToken');
    const {
        calendarId,
        title,
        description,
        startDate,
        endDate,
        color,
        startTime,
        endTime,
        recurrence,
        recurrence_interval,
        recurrence_repeats,
        recurrence_days,
        parent_event_id,
    } = event;

    const payload = {
        calendar_id: typeof calendarId === 'bigint' ? calendarId.toString() : calendarId,
        title,
        description,
        start_date: startDate instanceof Date
            ? startDate.toISOString().slice(0, 19).replace('T', ' ')
            : startDate,
        end_date: endDate instanceof Date
            ? endDate.toISOString().slice(0, 19).replace('T', ' ')
            : endDate,
        color,
        start_time: startTime ?? null,
        end_time: endTime ?? null,
        recurrence_type: recurrence ?? null,
        recurrence_interval: recurrence_interval ?? null,
        recurrence_repeats: recurrence_repeats ?? null,
        recurrence_days: recurrence_days ?? null,
        parent_event_id: typeof parent_event_id === 'bigint'
            ? parent_event_id.toString()
            : parent_event_id ?? null,
    };

    const response = await axios.post(`${API_URL}/events`, payload, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateEvent = async (event: EventInterface) => {
    const token = localStorage.getItem('MySchedToken');
    const {
        id,
        calendarId,
        title,
        description,
        startDate,
        endDate,
        color,
        startTime,
        endTime,
        recurrence,
        recurrence_interval,
        recurrence_repeats,
        recurrence_days,
        parent_event_id,
    } = event;

    const payload = {
        calendar_id: typeof calendarId === 'bigint' ? calendarId.toString() : calendarId,
        title,
        description,
        start_date: startDate instanceof Date
            ? startDate.toISOString().slice(0, 19).replace('T', ' ')
            : startDate,
        end_date: endDate instanceof Date
            ? endDate.toISOString().slice(0, 19).replace('T', ' ')
            : endDate,
        color,
        start_time: startTime ?? null,
        end_time: endTime ?? null,
        recurrence_type: recurrence?.frequency ?? null,
        recurrence_interval: recurrence_interval ?? null,
        recurrence_repeats: recurrence_repeats ?? null,
        recurrence_days: recurrence_days ?? null,
        parent_event_id: typeof parent_event_id === 'bigint'
            ? parent_event_id.toString()
            : parent_event_id ?? null,
    };

    const response = await axios.put(`${API_URL}/events/${typeof id === 'bigint' ? id.toString() : id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteEvent = async (eventId: bigint) => {
    const token = localStorage.getItem('MySchedToken');
    const response = await axios.delete(`${API_URL}/events/${eventId.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getEntriesByCalendar = async (calendarId: number) => {
    const token = localStorage.getItem('MySchedToken');
    const response = await axios.get(`${API_URL}/calendars/${calendarId}/events`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const createEntry = async (entry: EventInterface) => {
    const token = localStorage.getItem('MySchedToken');
    const {
        calendarId,
        title,
        description,
        startDate,
        endDate,
        color,
        startTime,
        endTime,
        recurrence,
        recurrence_interval,
        recurrence_repeats,
        recurrence_days,
        parent_event_id,
    } = entry;

    const payload = {
        calendar_id: typeof calendarId === 'bigint' ? calendarId.toString() : calendarId,
        title,
        description,
        start_date: startDate instanceof Date
            ? startDate.toISOString().slice(0, 19).replace('T', ' ')
            : startDate,
        end_date: endDate instanceof Date
            ? endDate.toISOString().slice(0, 19).replace('T', ' ')
            : endDate,
        color,
        start_time: startTime ?? null,
        end_time: endTime ?? null,
        recurrence_type: recurrence ?? null,
        recurrence_interval: recurrence_interval ?? null,
        recurrence_repeats: recurrence_repeats ?? null,
        recurrence_days: recurrence_days ?? null,
        parent_event_id: typeof parent_event_id === 'bigint'
            ? parent_event_id.toString()
            : parent_event_id ?? null,
    };

    const response = await axios.post(`${API_URL}/events`, payload, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateEntry = async (entry: EventInterface) => {
    const token = localStorage.getItem('MySchedToken');
    const {
        id,
        calendarId,
        title,
        description,
        startDate,
        endDate,
        color,
        startTime,
        endTime,
        recurrence,
        recurrence_interval,
        recurrence_repeats,
        recurrence_days,
        parent_event_id,
    } = entry;

    const payload = {
        calendar_id: typeof calendarId === 'bigint' ? calendarId.toString() : calendarId,
        title,
        description,
        start_date: startDate instanceof Date
            ? startDate.toISOString().slice(0, 19).replace('T', ' ')
            : startDate,
        end_date: endDate instanceof Date
            ? endDate.toISOString().slice(0, 19).replace('T', ' ')
            : endDate,
        color,
        start_time: startTime ?? null,
        end_time: endTime ?? null,
        recurrence_type: recurrence?.frequency ?? null,
        recurrence_interval: recurrence_interval ?? null,
        recurrence_repeats: recurrence_repeats ?? null,
        recurrence_days: recurrence_days ?? null,
        parent_event_id: typeof parent_event_id === 'bigint'
            ? parent_event_id.toString()
            : parent_event_id ?? null,
    };

    const response = await axios.put(`${API_URL}/events/${typeof id === 'bigint' ? id.toString() : id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteEntry = async (id: bigint) => {
    const token = localStorage.getItem('MySchedToken');
    const response = await axios.delete(`${API_URL}/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};