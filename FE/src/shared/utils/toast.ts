import { toast as sonnerToast } from 'sonner';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';

const isDev = process.env.NODE_ENV === 'development';

export const toast = {
  success: (message: string) => sonnerToast.success(message),
  warning: (message: string) => sonnerToast.warning(message),
  error: (error: unknown) => {
    const message = getErrorMessage(error);
    sonnerToast.error(message);

    if (isDev) console.error('☠️ [Error Details]:', error);
  },
  info: (message: string) => sonnerToast(message),
};
