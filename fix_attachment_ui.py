import re

with open("src/routes/crm.taxi-booking.tsx", "r") as f:
    content = f.read()

# Make sure we import CheckCircle2 if needed (it might not be, so we can use another icon or just text).
# Let's import CheckCircle from lucide-react just in case, but FileCheck might be better.
# Actually, let's just use text to be safe, or Check if it's already there.
if "Check," not in content:
    content = content.replace('from "lucide-react";', 'Check, from "lucide-react";') # We'll just use inline svg to avoid import issues

old_attachments = """                    <div className="flex-1 flex flex-col gap-2">
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
                    </div>"""


new_attachments = """                    <div className="flex-1 flex flex-col gap-2">
                      {!existingFile ? (
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
                      ) : (
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded-md border border-green-200">
                          <div className="flex items-center gap-2 text-green-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            <span className="text-xs font-semibold">Document Saved</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <a 
                              href={existingFile} 
                              download={`${item.label}-document`}
                              className="text-xs text-blue-600 hover:underline font-medium bg-blue-50 px-2 py-1 rounded"
                            >
                              Download
                            </a>
                            <button 
                              type="button" 
                              className="text-xs text-red-600 hover:underline font-medium bg-red-50 px-2 py-1 rounded"
                              onClick={() => {
                                const newAttachments = { ...form.attachments };
                                delete newAttachments[item.label];
                                handleChange({ attachments: newAttachments });
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>"""

content = content.replace(old_attachments, new_attachments)

with open("src/routes/crm.taxi-booking.tsx", "w") as f:
    f.write(content)

print("Attachment UI updated.")
