// lib/error-handler.ts
import { AppError } from './errors';

// Client-side error handler
export class ErrorHandler {
  static async handleApiCall<T>(
    apiCall: () => Promise<Response>
  ): Promise<T> {
    try {
      const response = await apiCall();
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new AppError(
          errorData.error || 'Request failed',
          response.status
        );
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Network error', 500);
    }
  }

  static handleError(error: unknown): string {
    if (error instanceof AppError) {
      return error.message;
    }
    
    console.error('Unexpected error:', error);
    return 'Something went wrong. Please try again.';
  }
}