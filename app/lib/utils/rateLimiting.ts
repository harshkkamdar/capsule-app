const RATE_LIMIT_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

export class RateLimiter {
  private attempts: { [key: string]: number[] } = {};

  isRateLimited(email: string): boolean {
    const now = Date.now();
    if (!this.attempts[email]) {
      this.attempts[email] = [];
    }

    // Clean up old attempts
    this.attempts[email] = this.attempts[email].filter(
      timestamp => now - timestamp < RATE_LIMIT_WINDOW
    );

    return this.attempts[email].length >= RATE_LIMIT_ATTEMPTS;
  }

  addAttempt(email: string): void {
    if (!this.attempts[email]) {
      this.attempts[email] = [];
    }
    this.attempts[email].push(Date.now());
  }
}

export const rateLimiter = new RateLimiter(); 