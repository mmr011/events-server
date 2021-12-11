export interface Event {
    eventId: string;
    userId: string;
    eventName: string; // This would be the title of the event.
    allDay: boolean;
    startDate: string;
    endDate?: string;
}
