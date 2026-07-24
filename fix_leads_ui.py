import re

with open("src/routes/crm.insurance-leads.tsx", "r") as f:
    content = f.read()

# Replace Kanban Card Content
kanban_old = r"""<div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {lead\.destination || 'No destination'}
                          </div>
                          {lead\.start_date && \(
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {format\(new Date\(lead\.start_date\), "MMM d"\)}
                              {lead\.end_date && ` - ${format\(new Date\(lead\.end_date\), "MMM d"\)}`}
                            </div>
                          \)}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary/50 text-secondary-foreground">
                                {lead\.budget ? `₹${lead\.budget\.toLocaleString\(\)}` : 'No budget'}
                              </span>
                            </div>
                            {lead\.assigned_to && \(
                              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary" title={lead\.assigned_to}>
                                {lead\.assigned_to\.charAt\(0\)}
                              </div>
                            \)}
                          </div>"""

kanban_new = """<div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Shield className="h-3 w-3" />
                            {lead.insurance_type || 'N/A'} - {lead.insurance_company || 'N/A'}
                          </div>
                          {lead.expiry_date && (
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              Exp: {format(new Date(lead.expiry_date), "MMM d, yyyy")}
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary/50 text-secondary-foreground">
                                {lead.premium ? `₹${lead.premium.toLocaleString()}` : 'No Premium'}
                              </span>
                            </div>
                            {lead.executive && (
                              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary" title={lead.executive}>
                                {lead.executive.charAt(0)}
                              </div>
                            )}
                          </div>"""

content = re.sub(kanban_old, kanban_new, content, flags=re.DOTALL)

# Replace Table Header
table_header_old = r"""<TableHead>Customer</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Pax</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Executive</TableHead>"""

table_header_new = """<TableHead>Customer</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Premium</TableHead>
                    <TableHead>Renewal Date</TableHead>
                    <TableHead>Executive</TableHead>"""

content = re.sub(table_header_old, table_header_new, content, flags=re.DOTALL)

# Replace Table Body
table_body_old = r"""<TableCell>
                          <div className="font-medium text-foreground">{lead\.customer_name}</div>
                          <div className="text-xs text-muted-foreground">{lead\.mobile}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {lead\.destination || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          {lead\.start_date ? \(
                            <div className="text-sm text-foreground">
                              {format\(new Date\(lead\.start_date\), "MMM d"\)}
                              {lead\.end_date && ` - ${format\(new Date\(lead\.end_date\), "MMM d"\)}`}
                            </div>
                          \) : <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-foreground">
                            {lead\.pax_adults || 0}A {lead\.pax_children ? `, ${lead\.pax_children}C` : ''}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium text-foreground">
                            {lead\.budget ? `₹${lead\.budget\.toLocaleString\(\)}` : '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-foreground">{lead\.source || '-'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-foreground">{lead\.assigned_to || '-'}</div>
                        </TableCell>"""

table_body_new = """<TableCell>
                          <div className="font-medium text-foreground">{lead.customer_name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-foreground">{lead.mobile || '-'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            {lead.insurance_type || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-foreground">{lead.insurance_company || '-'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium text-foreground">
                            {lead.premium ? `₹${lead.premium.toLocaleString()}` : '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          {lead.expiry_date ? (
                            <div className="text-sm text-foreground">
                              {format(new Date(lead.expiry_date), "dd MMM yyyy")}
                            </div>
                          ) : <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-foreground">{lead.executive || '-'}</div>
                        </TableCell>"""

content = re.sub(table_body_old, table_body_new, content, flags=re.DOTALL)

with open("src/routes/crm.insurance-leads.tsx", "w") as f:
    f.write(content)
