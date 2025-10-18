import { toast as sonnerToast } from "sonner";

// Custom hook that mimics shadcn/ui toast but uses Sonner
export const useToast = () => {
  const toast = ({ title, description, variant = "default" }) => {
    if (variant === "destructive") {
      sonnerToast.error(title, {
        description: description,
      });
    } else {
      sonnerToast.success(title, {
        description: description,
      });
    }
  };

  return { toast };
};