const fs = require('fs');
let code = fs.readFileSync('src/components/AddBookingModal.tsx', 'utf8');

// The dynamic block to inject
const dynamicBlockStr = (colSpanClass = "") => `
                <div className="space-y-2 ${colSpanClass}">
                  <div className="flex items-center justify-between">
                    <Label>Additional Passenger Names</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => {
                        const current = Array.isArray(details.additionalNames) ? details.additionalNames : [];
                        updateDetail("additionalNames", [...current, ""]);
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Name
                    </Button>
                  </div>
                  {(Array.isArray(details.additionalNames) ? details.additionalNames : []).map((name: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 mt-2">
                      <Input
                        value={name}
                        onChange={(e) => {
                          const newNames = [...(details.additionalNames as string[])];
                          newNames[index] = e.target.value;
                          updateDetail("additionalNames", newNames);
                        }}
                        placeholder="Passenger Name"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          const newNames = [...(details.additionalNames as string[])];
                          newNames.splice(index, 1);
                          updateDetail("additionalNames", newNames);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>`;

const inlineDynamicBlock = `
                      <div className="space-y-2 col-span-1 md:col-span-2 mt-2">
                        <div className="flex items-center justify-between">
                          <Label>Additional Passengers</Label>
                          <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => updateDetail("additionalNames", [...(Array.isArray(details.additionalNames) ? details.additionalNames : []), ""])}>
                            <Plus className="h-3 w-3 mr-1" /> Add Name
                          </Button>
                        </div>
                        {(Array.isArray(details.additionalNames) ? details.additionalNames : []).map((name: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 mt-2">
                            <Input value={name} onChange={(e) => { const n = [...(details.additionalNames as string[])]; n[index] = e.target.value; updateDetail("additionalNames", n); }} placeholder="Passenger Name" />
                            <Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-red-500 hover:bg-red-50" onClick={() => { const n = [...(details.additionalNames as string[])]; n.splice(index, 1); updateDetail("additionalNames", n); }}><X className="h-4 w-4" /></Button>
                          </div>
                        ))}
                      </div>`;

// 1. Replace the inline ones in the package sections
const inlineTarget = `<div className="space-y-2"><Label>Passenger Name</Label><Input value={details.passengerName || ""} onChange={(e) => updateDetail("passengerName", e.target.value)} placeholder="John Doe" /></div>`;
const inlineReplacement = `<div className="space-y-2"><Label>Lead Passenger Name</Label><Input value={details.passengerName || ""} onChange={(e) => updateDetail("passengerName", e.target.value)} placeholder="John Doe" /></div>${inlineDynamicBlock}`;

code = code.split(inlineTarget).join(inlineReplacement);

// 2. Replace Train Ticket passenger name block
const trainTarget = `                <div className="space-y-2">
                  <Label>Passenger Name *</Label>
                  <Input
                    required
                    value={details.passengerName || ""}
                    onChange={(e) => updateDetail("passengerName", e.target.value)}
                    placeholder="Passenger Name"
                  />
                </div>`;
                
const trainReplacement = `                <div className="space-y-2">
                  <Label>Lead Passenger Name *</Label>
                  <Input
                    required
                    value={details.passengerName || ""}
                    onChange={(e) => updateDetail("passengerName", e.target.value)}
                    placeholder="Lead Passenger Name"
                  />
                </div>` + dynamicBlockStr("");

// Because Train, Visa, Bus use the exact same block format in bookingType, we can just replace all of them!
code = code.split(trainTarget).join(trainReplacement);

// 3. Replace Air Ticket textarea block
const airTarget = `                <div className="space-y-2 col-span-1 md:col-span-2">
                  <Label>Passenger Names * (Endless)</Label>
                  <Textarea
                    required
                    value={details.passengerName || ""}
                    onChange={(e) => updateDetail("passengerName", e.target.value)}
                    placeholder="Enter all passenger names here (one per line or comma separated)..."
                    className="min-h-[80px]"
                  />
                </div>`;
                
const airReplacement = `                <div className="space-y-2">
                  <Label>Lead Passenger Name *</Label>
                  <Input
                    required
                    value={details.passengerName || ""}
                    onChange={(e) => updateDetail("passengerName", e.target.value)}
                    placeholder="Lead Passenger Name"
                  />
                </div>` + dynamicBlockStr("col-span-1 md:col-span-2");

code = code.replace(airTarget, airReplacement);

fs.writeFileSync('src/components/AddBookingModal.tsx', code);
console.log('Successfully updated passenger names!');
