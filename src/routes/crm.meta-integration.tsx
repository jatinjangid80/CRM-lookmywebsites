import { createFileRoute } from "@tanstack/react-router";
import { PlugZap } from "lucide-react";

export const Route = createFileRoute("/crm/meta-integration")({
  component: MetaIntegrationPage,
});

function MetaIntegrationPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center animate-in fade-in zoom-in duration-500">
      <div className="bg-primary/10 p-6 rounded-full mb-6 text-primary">
        <PlugZap className="w-16 h-16" />
      </div>
      <h1 className="text-4xl font-bold font-display mb-4">Meta Integration</h1>
      <p className="text-muted-foreground max-w-md text-lg mb-8">
        This module is currently under development. Soon you'll be able to sync leads directly from Facebook and Instagram!
      </p>
      
      <div className="inline-flex items-center justify-center rounded-md bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground">
        Work in Progress
      </div>
    </div>
  );
}
