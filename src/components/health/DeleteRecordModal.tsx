
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteRecordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  recordType: 'physical' | 'mental';
}

export const DeleteRecordModal = ({ 
  open, 
  onOpenChange, 
  onConfirm,
  recordType 
}: DeleteRecordModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white border border-gray-100 shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-poppins text-xl text-primary">
            Are you sure you want to delete this record?
          </AlertDialogTitle>
          <AlertDialogDescription className="font-poppins text-gray-600 mt-2">
            This action cannot be undone. You will permanently lose access to this {recordType} health entry.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel className="font-poppins bg-transparent border border-gray-200 text-gray-600 hover:bg-gray-50">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className="font-poppins bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white border-none shadow-md"
          >
            Delete Record
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
