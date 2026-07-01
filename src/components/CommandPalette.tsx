import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import {
  Search,
  Users,
  CalendarCheck,
  User,
  Package as Pkg,
  LayoutDashboard,
  Plane,
  CreditCard,
  Briefcase,
  Settings,
  ListChecks,
  Building2,
  FileText,
} from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const navigate = useNavigate();

  const [leads, setLeads] = React.useState<any[]>([]);
  const [bookings, setBookings] = React.useState<any[]>([]);
  const [customers, setCustomers] = React.useState<any[]>([]);
  const [packages, setPackages] = React.useState<any[]>([]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    if (!open) return;

    // Fetch lists from Supabase for fast search
    async function loadData() {
      try {
        const [lRes, bRes, cRes, pRes] = await Promise.all([
          supabase.from("leads").select("id, name, destination").limit(5),
          supabase.from("bookings").select("id, customer, package").limit(5),
          supabase.from("customers").select("id, name, phone").limit(5),
          supabase.from("packages").select("id, title, destination").limit(5),
        ]);

        if (lRes.data) setLeads(lRes.data);
        if (bRes.data) setBookings(bRes.data);
        if (cRes.data) setCustomers(cRes.data);
        if (pRes.data) setPackages(pRes.data);
      } catch (err) {
        console.error("Command palette load error:", err);
      }
    }
    loadData();
  }, [open]);

  // Deep search on query change
  React.useEffect(() => {
    if (!open || !query) return;

    const delayDebounce = setTimeout(async () => {
      try {
        const [lRes, bRes, cRes, pRes] = await Promise.all([
          supabase
            .from("leads")
            .select("id, name, destination")
            .ilike("name", `%${query}%`)
            .limit(10),
          supabase
            .from("bookings")
            .select("id, customer, package")
            .ilike("customer", `%${query}%`)
            .limit(10),
          supabase
            .from("customers")
            .select("id, name, phone")
            .ilike("name", `%${query}%`)
            .limit(10),
          supabase
            .from("packages")
            .select("id, title, destination")
            .ilike("title", `%${query}%`)
            .limit(10),
        ]);

        if (lRes.data) setLeads(lRes.data);
        if (bRes.data) setBookings(bRes.data);
        if (cRes.data) setCustomers(cRes.data);
        if (pRes.data) setPackages(pRes.data);
      } catch (err) {
        console.error("Command palette query error:", err);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, open]);

  const runCommand = React.useCallback((action: () => void) => {
    setOpen(false);
    action();
  }, []);

  return (
    <>
      {/* Search trigger helper in header */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/80 transition-colors w-48 text-left cursor-pointer"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search workspace...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
          <span className="text-[9px]">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type a command or search term..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="max-h-[350px]">
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Quick Actions */}
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => runCommand(() => navigate({ to: "/crm" }))}
              className="cursor-pointer"
            >
              <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
              <span>Go to Dashboard</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => navigate({ to: "/crm/leads" }))}
              className="cursor-pointer"
            >
              <Users className="mr-2 h-4 w-4 text-primary" />
              <span>Go to Leads Pipeline</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => navigate({ to: "/crm/bookings" }))}
              className="cursor-pointer"
            >
              <CalendarCheck className="mr-2 h-4 w-4 text-primary" />
              <span>Go to Bookings</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => navigate({ to: "/crm/payments" }))}
              className="cursor-pointer"
            >
              <CreditCard className="mr-2 h-4 w-4 text-primary" />
              <span>Go to Payments Ledger</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => navigate({ to: "/crm/quotations" }))}
              className="cursor-pointer"
            >
              <FileText className="mr-2 h-4 w-4 text-primary" />
              <span>Go to Quotation Builder</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => navigate({ to: "/crm/packages" }))}
              className="cursor-pointer"
            >
              <Pkg className="mr-2 h-4 w-4 text-primary" />
              <span>Go to Packages</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => navigate({ to: "/crm/tasks" }))}
              className="cursor-pointer"
            >
              <ListChecks className="mr-2 h-4 w-4 text-primary" />
              <span>Go to Tasks</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => navigate({ to: "/crm/visa" }))}
              className="cursor-pointer"
            >
              <Plane className="mr-2 h-4 w-4 text-primary" />
              <span>Go to Visa Tracker</span>
            </CommandItem>
          </CommandGroup>

          {/* Leads */}
          {leads.length > 0 && (
            <CommandGroup heading="Leads">
              {leads.map((l) => (
                <CommandItem
                  key={l.id}
                  onSelect={() => runCommand(() => navigate({ to: "/crm/leads" }))}
                  className="cursor-pointer"
                >
                  <Users className="mr-2 h-4 w-4 text-blue-500" />
                  <span>
                    {l.name}{" "}
                    <span className="text-xs text-muted-foreground">
                      ({l.destination || "Inquiry"})
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Bookings */}
          {bookings.length > 0 && (
            <CommandGroup heading="Bookings">
              {bookings.map((b) => (
                <CommandItem
                  key={b.id}
                  onSelect={() => runCommand(() => navigate({ to: "/crm/bookings" }))}
                  className="cursor-pointer"
                >
                  <CalendarCheck className="mr-2 h-4 w-4 text-emerald-500" />
                  <span>
                    {b.customer}{" "}
                    <span className="text-xs text-muted-foreground">({b.package})</span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Customers */}
          {customers.length > 0 && (
            <CommandGroup heading="Customers">
              {customers.map((c) => (
                <CommandItem
                  key={c.id}
                  onSelect={() => runCommand(() => navigate({ to: "/crm/customers" }))}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4 text-indigo-500" />
                  <span>
                    {c.name} <span className="text-xs text-muted-foreground">({c.phone})</span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Packages */}
          {packages.length > 0 && (
            <CommandGroup heading="Packages">
              {packages.map((p) => (
                <CommandItem
                  key={p.id}
                  onSelect={() => runCommand(() => navigate({ to: "/crm/packages" }))}
                  className="cursor-pointer"
                >
                  <Pkg className="mr-2 h-4 w-4 text-amber-500" />
                  <span>
                    {p.title}{" "}
                    <span className="text-xs text-muted-foreground">({p.destination})</span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
