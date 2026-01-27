import { JSX, ReactNode } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface customDialogProps {
  dialogTrigger: ReactNode;
  dialogTitle?: ReactNode;
  dialogDescription?: ReactNode;
  dialogContent?: ReactNode;
  dialogFooter?: ReactNode;
}

const CustomDialog = ({
  dialogTrigger,
  dialogTitle,
  dialogDescription,
  dialogContent,
  dialogFooter,
}: customDialogProps): JSX.Element => {
  return (
    <Dialog>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <form>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          {dialogContent}
          <DialogFooter>
            {dialogFooter ?? (
              <>
                <DialogClose asChild>
                  <button
                    type="button"
                    className="border border-neutral-border-default px-4 py-2 rounded-lg cursor-pointer text-string-16 text-neutral-text-default hover:text-brand-surface-default hover:border-brand-border-default transition-colors duration-150"
                  >
                    닫기
                  </button>
                </DialogClose>
                <button
                  type="submit"
                  className="bg-brand-surface-default text-string-16 text-brand-text-on-default px-4 py-2 rounded-lg cursor-pointer"
                >
                  저장
                </button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default CustomDialog;
