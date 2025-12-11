import type { AxiosInstance } from 'axios';

let globalToastError: ((message: string) => void) | null = null;

export const setGlobalToastError = (toastError: (message: string) => void) => {
  globalToastError = toastError;
};

export function setupApiErrorHandling(api: AxiosInstance) {
  api.interceptors.response.use(
    response => response,
    error => {
      let errorMessage = 'Something went wrong';

      if (error.response) {
        const { status, data, config } = error.response;

        const isAuthCheck = config?.url?.includes('/auth/me') && status === 401;

        if (status === 401 && !isAuthCheck) {
          errorMessage = 'Please log in to continue';
        } else if (status === 403) {
          errorMessage = 'You do not have permission to do this';
        } else if (status === 404) {
          errorMessage = 'The requested resource was not found';
        } else if (status === 422) {
          errorMessage = 'Please check your input and try again';
        } else if (status >= 500) {
          errorMessage = 'Server error - please try again later';
        } else if (data?.message) {
          errorMessage = data.message;
        }

        if (globalToastError && !isAuthCheck) {
          globalToastError(errorMessage);
        }
      } else if (error.request) {
        errorMessage = 'Network error - please check your connection';

        if (globalToastError) {
          globalToastError(errorMessage);
        }
      }

      const customError = new Error(errorMessage);
      customError.cause = error;

      throw customError;
    }
  );
}
