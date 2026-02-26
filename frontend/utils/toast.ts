import { toast } from 'sonner';

/** Extract a human-readable message from any API/Axios error */
export function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object') {
    // Axios error shape
    const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
    if (axiosErr.response?.data?.message) return axiosErr.response.data.message;
    if (axiosErr.message) return axiosErr.message;
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong. Please try again.';
}

/** Show an error toast from any thrown error */
export function toastError(err: unknown) {
  toast.error(getErrorMessage(err));
}

/** Show a success toast */
export function toastSuccess(message: string) {
  toast.success(message);
}
