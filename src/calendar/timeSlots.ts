import {Meeting} from "./dto/meeting";

export class TimeSlots {
  public convertTime(time: string) {
    return new Date(
      new Date(time).getFullYear(),
      new Date(time).getMonth(),
      new Date(time).getDate(),
      new Date(time).getHours(),
      new Date(time).getMinutes(),
      0,
      0
    );
  }

  /**
   * finds the amount of elements which have start time earlier than current one
   * @param calendar - a list with already booked meeting
   * @param meeting - looking meeting slot in form of meeting
   * @param comparator
   *
   * return them as a number which became an index for linear search after that
   */
  private indexBinarySearch(calendar: Meeting[], meeting: Meeting, comparator: (m0: Meeting, m1: Meeting) => number): number {
    let left = 0;
    let right = calendar.length - 1;

    while (left < right) {
      let index = Math.floor((left + right) / 2);
      let bookedMeeting: Meeting = calendar[index];

      if (comparator(bookedMeeting, meeting) == 0) {
        return index;
      } else if (comparator(bookedMeeting, meeting) < 0) {
        left = index + 1;
      } else {
        right = index - 1;
      }
    }
    return left;
  }

  private shiftDesiredMeeting(desiredMeeting: Meeting, startTime: Date = desiredMeeting.end) {
    return {
      eventName: desiredMeeting.eventName,
      start: startTime,
      end: new Date(startTime.getTime() + (desiredMeeting!.end.getTime() - desiredMeeting!.start.getTime()))
    }
  }

  /**
   * searching the first available time slot based on given desired time
   *
   * @param desiredMeeting
   * @param amount - how many slots to search
   * @param calendar - list of already booked slots
   *
   * returns a list of available time slots with given duration with length equals to amount
   */
  public searchAvailableTimeSlots(desiredMeeting: Meeting, amount: number, calendar: Meeting[]): Meeting[] {
    let availableSlots: Meeting[] = []
    let duration = desiredMeeting.end.getTime() - desiredMeeting.start.getTime()

    // find the new index following after the previous meeting
    let index = this.indexBinarySearch(calendar, desiredMeeting,
      (m0: Meeting, m1: Meeting) => {
        return m0.start.getTime() == m1.start.getTime() && m0.end.getTime() == m1.start.getTime() ?
          0 : m0.start.getTime() > m1.start.getTime() && m0.end.getTime() > m1.end.getTime() ?
            1 : -1
      }
    )
    console.log(`Start looking from position: ${index}`)

    while (amount > 0) {
      let previousMeeting = index > 0 ? calendar[index - 1] : null
      let nextMeeting = index < calendar.length ? calendar[index] : null

      if (nextMeeting != null) {
        // there are some meetings afterwards desired one, so need to check them
        if ((nextMeeting!.start.getTime() - previousMeeting!.end.getTime()) < (desiredMeeting.end.getTime() - desiredMeeting.start.getTime())) {
          // duration is not enough, so switching to the next record and
          // shifting desired meeting window accordingly
          index++
          desiredMeeting = this.shiftDesiredMeeting(desiredMeeting, nextMeeting!.end)
        } else if (desiredMeeting!.start.getTime() != previousMeeting!.end.getTime()) {
          // desired meeting started not from the end of previous, duration is enough,
          // so checking for intersections with next meeting
          if (desiredMeeting!.end.getTime() <= nextMeeting!.start.getTime()) {
            availableSlots.push(desiredMeeting)
            desiredMeeting = this.shiftDesiredMeeting(desiredMeeting)
            amount--
          } else {
            // duration is enough, however there is an intersection with another meeting
            console.log("Desired time slot is not available. Looking for next available one...")
            index++
          }
        } else {
          // duration is enough, desired meeting started from the end of the previous
          // one or have been already shifted, no intersections with next meeting
          availableSlots.push(desiredMeeting)
          desiredMeeting = this.shiftDesiredMeeting(desiredMeeting)
          amount--
        }
      } else {
        // duration is enough, no intersections with next meeting,
        // since there are simply no next meetings at all
        availableSlots.push(desiredMeeting)
        desiredMeeting = this.shiftDesiredMeeting(desiredMeeting)
        amount--
      }
    }

    return availableSlots;
  }
}