// tests/utils/date-generator.ts
export class DateGenerator {
  static getNextWeekday(daysFromNow: number = 7): string {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    
    // Skip weekends
    while (date.getDay() === 0 || date.getDay() === 6) {
      date.setDate(date.getDate() + 1);
    }
    
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  static getFormattedDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  static getTimeSlots(): string[] {
    return ['09:00', '12:00', '14:00', '16:00'];
  }

  static getRandomTimeSlot(): string {
    const slots = this.getTimeSlots();
    return slots[Math.floor(Math.random() * slots.length)];
  }
}
