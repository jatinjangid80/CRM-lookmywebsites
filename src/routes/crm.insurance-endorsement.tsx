import { createFileRoute } from "@tanstack/react-router";
import { FileEdit } from "lucide-react";

export const Route = createFileRoute("/crm/insurance-endorsement")({
  component: InsuranceEndorsementPage,
});

function InsuranceEndorsementPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileEdit className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold">Endorsements</h1>
            <p className="text-muted-foreground">
              Manage and track all insurance endorsements.
            </p>
          </div>
        </div>
      </div>
      <div className="p-8 text-center text-muted-foreground border rounded-lg border-dashed bg-secondary/20">
        <h3 className="text-xl font-bold mb-2">Endorsements Module</h3>
        <p>This module is currently under construction.</p>
      </div>
    </div>
  );
}
