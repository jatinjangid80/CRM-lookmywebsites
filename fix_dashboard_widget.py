import re

with open("src/routes/crm.index.tsx", "r") as f:
    content = f.read()

old_widget = """              {taxiBookingsList.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-start justify-between p-3 rounded-xl border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors group">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground truncate">{booking.customer_name}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        booking.status === "Confirmed" ? "bg-green-100 text-green-700" :
                        booking.status === "Cancelled" ? "bg-red-100 text-red-700" :
                        booking.status === "Completed" ? "bg-blue-100 text-blue-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{booking.pickup_location} → {booking.drop_location}</span>
                    </div>
                  </div>
                </div>
              ))}"""

new_widget = """              {taxiBookingsList.slice(0, 5).map((booking) => (
                <div key={booking.id} className="rounded-[1.25rem] border border-[#E5E5E5] bg-[#FAF5F0]/50 p-4 shadow-sm relative">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-gray-900 truncate">{booking.customer_name}</span>
                    <span className="text-yellow-300 font-black px-1 shrink-0">—</span>
                    <span className="text-sm font-medium text-gray-700 truncate">{booking.vehicle_type || ""}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {booking.from_location && booking.to_location ? (
                      <>
                        <span className="truncate">{booking.from_location}</span>
                        <ArrowRight className="h-3 w-3 shrink-0" />
                        <span className="truncate">{booking.to_location}</span>
                      </>
                    ) : (
                      <span className="truncate">{booking.route || booking.from_location || "No route specified"}</span>
                    )}
                  </div>
                </div>
              ))}"""

content = content.replace(old_widget, new_widget)

with open("src/routes/crm.index.tsx", "w") as f:
    f.write(content)

print("Dashboard widget updated.")
