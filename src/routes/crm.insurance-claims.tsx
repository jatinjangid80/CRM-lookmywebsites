import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getAuth } from "@/lib/auth";
import { FileText, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/crm/insurance-claims")({
  component: InsuranceClaimsPage,
});

function InsuranceClaimsPage() {
  const auth = getAuth();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex-1 p-4 lg:p-8 pt-6 min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Insurance Claims</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage and track all insurance claims.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="rounded-full shadow-sm hover:shadow-md transition-shadow">
              <Plus className="h-4 w-4 mr-2" /> Add Claim
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search claims..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/50 border-transparent focus:bg-background rounded-xl transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-24 bg-card border border-border rounded-2xl shadow-sm">
          <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-bold mb-2">No claims found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            There are no claims available at the moment. Click "Add Claim" to get started.
          </p>
        </div>
      </div>
    </div>
  );
}
