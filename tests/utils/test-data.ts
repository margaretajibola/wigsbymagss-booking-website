export class TestDataGenerator {
  static generateEmail(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `test${timestamp}${random}@example.com`;
  }

  static generatePassword(): string {
    return `Test${Math.floor(Math.random() * 10000)}!`;
  }

  static generateName(): string {
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emma'];
    const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Moore'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const random = Math.floor(Math.random() * 100);
    
    return `${firstName}${lastName}${random}`;
  }

  static generateUserData() {
    return {
      name: this.generateName(),
      email: this.generateEmail(),
      password: this.generatePassword()
    };
  }
}