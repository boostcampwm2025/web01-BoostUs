import { toast as sonnerToast } from 'sonner';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';

export const toast = {
  success: (message: string) => sonnerToast.success(message),
  error: (error: unknown) => {
    const message = getErrorMessage(error);
    sonnerToast.error(message);
  },
  info: (message: string) => sonnerToast(message),
};
