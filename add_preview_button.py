import re

with open("src/routes/crm.taxi-booking.tsx", "r") as f:
    content = f.read()

# Add state for preview
if "const [previewImage, setPreviewImage]" not in content:
    content = content.replace(
        'const [customerOpen, setCustomerOpen] = useState(false);',
        'const [customerOpen, setCustomerOpen] = useState(false);\n  const [previewImage, setPreviewImage] = useState<string | null>(null);'
    )

# Add Preview button
old_buttons = """                          <div className="flex items-center gap-3">
                            <a 
                              href={existingFile} 
                              download={`${item.label}-document`}
                              className="text-xs text-blue-600 hover:underline font-medium bg-blue-50 px-2 py-1 rounded"
                            >
                              Download
                            </a>
                            <button """

new_buttons = """                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              className="text-xs text-purple-600 hover:underline font-medium bg-purple-50 px-2 py-1 rounded"
                              onClick={() => setPreviewImage(existingFile)}
                            >
                              Preview
                            </button>
                            <a 
                              href={existingFile} 
                              download={`${item.label}-document`}
                              className="text-xs text-blue-600 hover:underline font-medium bg-blue-50 px-2 py-1 rounded"
                            >
                              Download
                            </a>
                            <button """

content = content.replace(old_buttons, new_buttons)

# Add Dialog for preview
if "PreviewImageDialog" not in content:
    preview_dialog = """
      {/* Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-4xl p-0 border-0 bg-transparent shadow-none">
          <div className="relative flex items-center justify-center">
            {previewImage?.startsWith("data:image/") ? (
              <img src={previewImage} alt="Preview" className="max-h-[85vh] object-contain rounded-lg shadow-2xl bg-white" />
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center gap-4">
                <FileText className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">Preview not available for this file type.</p>
                <a href={previewImage!} download className="text-primary hover:underline">Download instead</a>
              </div>
            )}
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}"""
    content = content.replace("    </div>\n  );\n}", preview_dialog)

with open("src/routes/crm.taxi-booking.tsx", "w") as f:
    f.write(content)

print("Preview button added.")
