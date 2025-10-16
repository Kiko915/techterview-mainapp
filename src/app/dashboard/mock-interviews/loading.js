import { PageLoader } from "@/components/ui/loading";

export default function MockInterviewsLoading() {
  return (
    <PageLoader 
      title="Setting Up Mock Interview"
      subtitle="Preparing interview questions and video setup..."
    />
  );
}