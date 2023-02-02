export interface Meeting {
  eventName: string;
  start: Date;
  end: Date;
}

export class TimeSlotsData {
  constructor(calendar: Meeting[]) {
    let meeting1: Meeting = {
      eventName: "meeting 1",
      start: new Date("2023-01-28T08:00:00.000Z"),
      end: new Date("2023-01-28T09:00:00.000Z"),
    }
    let meeting2: Meeting = {
      eventName: "meeting 2",
      start: new Date("2023-01-28T10:00:00.000Z"),
      end: new Date("2023-01-28T11:00:00.000Z"),
    }
    let meeting3: Meeting = {
      eventName: "meeting 3",
      start: new Date("2023-01-28T12:00:00.000Z"),
      end: new Date("2023-01-28T14:00:00.000Z"),
    }
    let meeting4: Meeting = {
      eventName: "meeting 4",
      start: new Date("2023-01-28T16:00:00.000Z"),
      end: new Date("2023-01-28T17:00:00.000Z"),
    }
    let meeting5: Meeting = {
      eventName: "meeting 5",
      start: new Date("2023-01-28T18:00:00.000Z"),
      end: new Date("2023-01-28T19:00:00.000Z"),
    }
    calendar.push(meeting2, meeting1, meeting3, meeting4, meeting5);
    calendar.sort((m0, m1) => m0.start == m1.start ? 0 : m0.start < m1.start ? -1 : 1)
  }
}