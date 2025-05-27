export interface EventInterface {
    id: bigint;
    calendarId: bigint;
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    color?: string;
    startTime?: string;
    endTime?: string;
    recurrence?: {
        frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'special';
    };
    recurrence_interval?: number;
    recurrence_repeats?: number;
    recurrence_days?: string[];
    parent_event_id?: bigint;
    created_at?: Date;
    updated_at?: Date;
}