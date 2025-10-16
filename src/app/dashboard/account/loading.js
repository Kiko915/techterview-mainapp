import { PageLoader } from "@/components/ui/loading";

export default function AccountLoading() {
  return (
    <PageLoader 
      title="Loading Account Settings"
      subtitle="Preparing your profile and security settings..."
    />
  );
}