import { PageLoader } from "@/components/ui/loading";

export default function SettingsLoading() {
  return (
    <PageLoader 
      title="Loading Settings"
      subtitle="Preparing your preferences and configuration..."
    />
  );
}