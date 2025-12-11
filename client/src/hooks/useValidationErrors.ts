import { ZodError } from 'zod';

export function useValidationErrors() {
  const processZodError = (error: unknown): Record<string, string> | null => {
    if (error instanceof ZodError) {
      return error.issues.reduce(
        (errors, issue) => {
          const field = issue.path[0] as string;
          errors[field] = issue.message;
          return errors;
        },
        {} as Record<string, string>
      );
    }
    return null;
  };

  const processZodErrorWithFallback = (
    error: unknown,
    fallbackError: Record<string, string>
  ): Record<string, string> => {
    return processZodError(error) || fallbackError;
  };

  return {
    processZodError,
    processZodErrorWithFallback,
  };
}
