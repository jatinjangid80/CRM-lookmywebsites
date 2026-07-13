const fs = require('fs');

let file = '/Users/jatinjangid/Downloads/crm-lookmywebsites/src/routes/crm.leads.tsx';
let content = fs.readFileSync(file, 'utf-8');

// 1. Remove leadSection?: string;
content = content.replace(/  leadSection\?: string;\n/g, '');

// 2. Remove leadSection: "B2C", (in EMPTY_FORM and newLead)
content = content.replace(/  leadSection: "B2C",\n/g, '');
content = content.replace(/      leadSection: "B2C",\n/g, '');

// 3. Remove Lead Section block in Add Lead Modal
const selectBlock = `          {/* Lead Section */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Lead Section</label>
            <select
              id="lead-section"
              value={form.leadSection}
              onChange={set("leadSection")}
              className={fieldCls}
            >
              <option value="B2C">B2C</option>
              <option value="B2B">B2B</option>
              <option value="Corporate">Corporate</option>
              <option value="Other">Other</option>
            </select>
          </div>\n`;
content = content.replace(selectBlock, '');

// 4. Remove leadSection: lead.leadSection || "", in handleEditLead
content = content.replace(/    leadSection: lead\.leadSection \|\| "",\n/g, '');

// 5. Remove leadSection in trip details form
const tripSectionBlock = `                      <div>
                        <label className="text-[10px] font-semibold uppercase text-muted-foreground">Section</label>
                        <Input
                          value={tripDetails.leadSection}
                          onChange={(e) => setTripDetails({ ...tripDetails, leadSection: e.target.value })}
                          className="h-8 text-sm"
                        />
                      </div>\n`;
content = content.replace(tripSectionBlock, '');

// 6. Remove Section from summary block 1
const summarySection1 = `                    <DetailRow
                      icon={Briefcase}
                      label="Section"
                      val={lead.leadSection || "—"}
                    />\n`;
content = content.replace(summarySection1, '');

// 7. Remove Section from summary block 2
content = content.replace(summarySection1, ''); // Just run it twice if it's there twice

// 8. Remove from CSV Export
content = content.replace(/"Priority", "Section"/g, '"Priority"');
content = content.replace(/          \`"\${l\.leadSection \|\| ""}"\`,\n/g, '');

// 9. Remove from Print
content = content.replace(/<th>Priority<\/th><th>Section<\/th>/g, '<th>Priority</th>');
content = content.replace(/<td>\${l\.priority}<\/td><td>\${l\.leadSection \|\| ""}<\/td>/g, '<td>${l.priority}</td>');

// 10. Remove the Badge
const badgeBlock = `                          {l.leadSection ? (
                            <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-600 border-green-200">
                              {l.leadSection}
                            </Badge>
                          ) : null}\n`;
content = content.replace(badgeBlock, '');

fs.writeFileSync(file, content);
console.log("Done");
