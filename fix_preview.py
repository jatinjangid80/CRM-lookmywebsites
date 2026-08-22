import re

with open("src/routes/crm.taxi-booking.tsx", "r") as f:
    content = f.read()

old_code = """                          <div className="flex items-center gap-2 text-green-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            <span className="text-xs font-semibold">Document Saved</span>
                          </div>"""

new_code = """                          <div className="flex items-center gap-2 text-green-700">
                            {existingFile.startsWith("data:image/") ? (
                              <img src={existingFile} alt="Preview" className="h-8 w-12 object-cover rounded-sm border border-green-300 cursor-pointer shadow-sm hover:scale-150 transition-transform origin-left" />
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            )}
                            <span className="text-xs font-semibold">Document Saved</span>
                          </div>"""

content = content.replace(old_code, new_code)

with open("src/routes/crm.taxi-booking.tsx", "w") as f:
    f.write(content)

print("Preview thumbnail added.")
