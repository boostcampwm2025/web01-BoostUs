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

interface customDialogProps {
  dialogTrigger: ReactNode;
  dialogTitle?: ReactNode;
  dialogDescription?: ReactNode;
  dialogContent?: ReactNode;
  dialogFooter?: ReactNode;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

const CustomDialog = ({
  dialogTrigger,
  dialogTitle,
  dialogDescription,
  dialogContent,
  dialogFooter,
  onSubmit,
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
          <DialogFooter>
            {dialogFooter ?? (
              <>
                <DialogClose asChild>
                  <Button buttonStyle="outlined">닫기</Button>
                </DialogClose>
                <Button type="submit">저장</Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
