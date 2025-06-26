import { toast } from "@/components/ui/sonner";

export const handleApiError = (error: any) => {
  const message = error.response?.data?.message || 'An error occurred';
  toast.error(message);
  return message;
};