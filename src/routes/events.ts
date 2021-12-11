import { NextFunction, Router, Response, Request } from 'express';
import { Event } from '../shared/models/event.model';
import * as uuid from 'uuid';

const eventsRouter =  Router();

const  testEvents: Event[] = [
    {
        eventId: '123',
        eventName: 'test title',
        startDate: new Date().toString(),
        allDay: false,
        userId: uuid.v4()
    }
];

// Middleware when an id is sent to the API
eventsRouter.param('eventId', (req: Request, res: Response, next: NextFunction, eventId: string) => {
    if(!eventId || eventId === '') {
        res.sendStatus(400);
    };

    let event = testEvents.find(e => e.eventId === eventId);
    if(event) {
        req['event'] = event; // Append the event that was found to the request
        next();
    } else {
        res.status(404).json({ message: 'Event not found'}); // If not, send 404 error message
    }
});

eventsRouter.get('/', (res: Response) => {
    if(testEvents && testEvents.length > 0) {
        res.status(200).json({ events: testEvents });
    } else {
        res.sendStatus(404);
    };
});

eventsRouter.get('/:eventId', (req: Request, res: Response) => {
    const event = req['event'];

    if(event) {
        res.status(200).json({ event: event }); // Further validation that the event exists
    } else {
        res.status(404).json({ message: 'Event not found'}); // If not, send 404 error message
    };
});

eventsRouter.post('/', (req: Request, res: Response) => {
    const { eventName, startDate, endDate, userId, allDay } = req.query && req.query;

    // Validate first that the requester is sennding a userId so the new event can be associated with a user 
    if(!userId || userId === '') {
        res.status(400).json({ message: 'A user id is required to proceed with creating and event' });
    };

    // Validate that the required fields are sent in the request
    if(!eventName || !startDate) {
        res.status(400).json({ message: 'There cannot be missing data when creating a new user' });
    } else {
        let newEvent: Event = {
            eventId: uuid.v4(),
            userId: userId as string,
            eventName: eventName as string,
            startDate: startDate as string,
            ...(endDate && endDate !== '') && {
                endDate: endDate as string
            },
            ...(allDay && allDay !== '') && {
                allDay: allDay === 'true' ? true : false // Since req.query sets the values as strings, I have to do this weird conversion here :c
            }
        };

        testEvents.push(newEvent);

        res.status(201).json({ newEvent: newEvent, message: 'New event was created successfully' })
    };

});

eventsRouter.put('/:eventId', (req: Request, res: Response) => {
    let  event = req['event'];
    const { eventName, startDate, endDate, eventId, allDay } = req.body && req.body as Event;

    if(event) {
        event = {
            eventName: eventName,
            startDate: startDate,
            ...(endDate && endDate !== '') && {
                endDate: endDate
            },
            ...allDay && {
                allDay: allDay
            }
        };

        const eventIndex = testEvents.findIndex(e => e.eventId === eventId);
        testEvents.splice(eventIndex, 1, event);

        res.status(200).json({ updatedEvent: event, message: 'Event has been successfully updated' });
    } else {
        res.sendStatus(400);
    };
});

eventsRouter.delete('/:eventId', (req: Request, res: Response) => {
    const event = req['event'];

    if(event) {
        const eventIndex = testEvents.findIndex(e => e.eventId === event.eventId);
        testEvents.splice(eventIndex, 1);

        res.status(200).json({ deletedEvent: event, message: 'Event was deleted successfully '});
    } else {
        res.sendStatus(400);
    };
});

export default eventsRouter;

