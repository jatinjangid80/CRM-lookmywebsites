import re

with open("src/routes/crm.taxi-booking.tsx", "r") as f:
    content = f.read()

# 1. Update form initial state to include attachments
content = content.replace(
    'remarks: "",\n  });',
    'remarks: "",\n    attachments: initialData?.attachments || {},\n  });'
)

# 2. Update the ATTACHMENTS DETAILS section
old_attachments = """              {[
                { label: "Toll Tax Document" },
                { label: "Parking Tax Document" },
                { label: "State Tax Document" },
                { label: "Duty Slip" },
                { label: "Other Document" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-background p-3 rounded-lg border">
                  <div className="w-1/3 font-semibold text-sm">{item.label}</div>
                  <div className="flex-1">
                    <Input type="file" className="w-full text-xs" />
                  </div>
                </div>
              ))}"""

new_attachments = """              {[
                { label: "Toll Tax Document" },
                { label: "Parking Tax Document" },
                { label: "State Tax Document" },
                { label: "Duty Slip" },
                { label: "Other Document" },
              ].map((item, idx) => {
                const existingFile = form.attachments?.[item.label];
                return (
                  <div key={idx} className="flex items-center gap-4 bg-background p-3 rounded-lg border">
                    <div className="w-1/3 font-semibold text-sm">{item.label}</div>
                    <div className="flex-1 flex flex-col gap-2">
                      <Input 
                        type="file" 
                        className="w-full text-xs" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              handleChange({
                                attachments: {
                                  ...form.attachments,
                                  [item.label]: reader.result
                                }
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {existingFile && (
                        <div className="flex items-center gap-2 mt-1">
                          <a href={existingFile} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline font-medium">
                            View Attached File
                          </a>
                          <button 
                            type="button" 
                            className="text-xs text-red-500 hover:underline"
                            onClick={() => {
                              const newAttachments = { ...form.attachments };
                              delete newAttachments[item.label];
                              handleChange({ attachments: newAttachments });
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}"""

content = content.replace(old_attachments, new_attachments)

with open("src/routes/crm.taxi-booking.tsx", "w") as f:
    f.write(content)

print("Attachments bound to state and rendering correctly.")
