import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/crm/services/domestic")({
  component: () => (
    <div className="p-8 flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-3xl font-bold mb-4 capitalize">domestic</h1>
      <p className="text-muted-foreground">This module is part of the upcoming ERP Transformation.</p>
    </div>
  ),
});
