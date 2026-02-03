import { FormEvent, JSX, ReactNode } from 'react';
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
import Button from '@/shared/ui/Button/Button';
import { cn } from '@/lib/utils';

interface customDialogProps {
  dialogTrigger: ReactNode;
  dialogTitle?: ReactNode;
  dialogDescription?: ReactNode;
  dialogContent?: ReactNode;
  dialogFooter?: ReactNode;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  cancelLabel?: string;
  submitLabel?: string;
  footerClassName?: string;
}

const CustomDialog = ({
  dialogTrigger,
  dialogTitle,
  dialogDescription,
  dialogContent,
  dialogFooter,
  onSubmit,
  cancelLabel = '닫기',
  submitLabel = '저장',
  footerClassName,
}: customDialogProps): JSX.Element => {
  return (
    <Dialog>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          {dialogContent}
          <DialogFooter
            className={cn('flex gap-2 justify-end', footerClassName)}
          >
            {dialogFooter ?? (
              <>
                <DialogClose asChild>
                  <Button buttonStyle="outlined" className="w-fit">
                    {cancelLabel}
                  </Button>
                </DialogClose>
                <Button type="submit" className="w-fit">
                  {submitLabel}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
