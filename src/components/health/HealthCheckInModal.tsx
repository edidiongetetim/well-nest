
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useHealthCheckInModal } from "@/hooks/useHealthCheckInModal";
import { HealthCheckInModalForm } from "./HealthCheckInModalForm";
import { HealthCheckInModalConfirmation } from "./HealthCheckInModalConfirmation";

interface HealthCheckInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HealthCheckInModal = ({ open, onOpenChange }: HealthCheckInModalProps) => {
  const {
    formData,
    errors,
    loading,
    showConfirmation,
    predictionResult,
    handleInputChange,
    handleBlur,
    handleSubmit,
    handleTakeAgain,
    resetForm
  } = useHealthCheckInModal();

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-poppins text-2xl text-primary">
            {showConfirmation ? "✅ Check-In Complete!" : "Physical Health Check-In"}
          </DialogTitle>
        </DialogHeader>
        
        {showConfirmation ? (
          <HealthCheckInModalConfirmation
            formData={formData}
            predictionResult={predictionResult}
            onClose={handleClose}
            onTakeAgain={handleTakeAgain}
          />
        ) : (
          <HealthCheckInModalForm
            formData={formData}
            errors={errors}
            loading={loading}
            onInputChange={handleInputChange}
            onBlur={handleBlur}
            onSubmit={handleSubmit}
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
