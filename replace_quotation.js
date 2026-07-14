const fs = require('fs');

const path = '/Users/jatinjangid/Downloads/crm-lookmywebsites/src/routes/crm.quotations.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update HotelOption Interface
content = content.replace(
`export interface HotelOption {
  name: string;
  rating: string;
}`,
`export interface HotelOption {
  name: string;
  rating: string;
  location?: string;
  checkIn?: string;
  checkOut?: string;
  rooms?: number;
  adults?: number;
  children?: number;
  roomType?: string;
  nights?: number;
  mealType?: string;
}`
);

// 2. Update DEFAULT_FORM
content = content.replace(
`  hotelOptions: [{ name: "", rating: "3 Star" }],`,
`  hotelOptions: [{ name: "", rating: "3 Star", location: "", checkIn: "", checkOut: "", rooms: 1, adults: 2, children: 0, roomType: "", nights: 1, mealType: "" }],`
);

// 3. Update the add hotel button
content = content.replace(
`                  onClick={() => setForm({ ...form, hotelOptions: [...(form.hotelOptions || []), { name: "", rating: "3 Star" }] })}`,
`                  onClick={() => setForm({ ...form, hotelOptions: [...(form.hotelOptions || []), { name: "", rating: "3 Star", location: "", checkIn: "", checkOut: "", rooms: 1, adults: 2, children: 0, roomType: "", nights: 1, mealType: "" }] })}`
);

// 4. Update the Hotel Options form UI
// Find the block:
//               <div className="space-y-3 mb-4">
//                 {(form.hotelOptions || ...).map((hotel, idx) => (
//                   <div key={idx} className="flex gap-2 items-start">
// ...
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     )}
//                   </div>
//                 ))}
//               </div>

const uiBlockOld = `<div className="space-y-3 mb-4">
                {(form.hotelOptions || (form.hotelName ? [{ name: form.hotelName, rating: "3 Star" }] : [{ name: "", rating: "3 Star" }])).map((hotel, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <Input
                      placeholder="Hotel Name"
                      value={hotel.name}
                      onChange={(e) => {
                        const newHotels = [...(form.hotelOptions || [])];
                        if (newHotels[idx]) newHotels[idx].name = e.target.value;
                        setForm({ ...form, hotelOptions: newHotels });
                      }}
                      className="rounded-xl flex-1"
                    />
                    <select
                      value={hotel.rating}
                      onChange={(e) => {
                        const newHotels = [...(form.hotelOptions || [])];
                        if (newHotels[idx]) newHotels[idx].rating = e.target.value;
                        setForm({ ...form, hotelOptions: newHotels });
                      }}
                      className="w-[110px] rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                    >
                      <option value="3 Star">3 Star</option>
                      <option value="4 Star">4 Star</option>
                      <option value="5 Star">5 Star</option>
                      <option value="Boutique">Boutique</option>
                      <option value="Resort">Resort</option>
                      <option value="Villa">Villa</option>
                      <option value="Camp">Camp</option>
                    </select>
                    {((form.hotelOptions?.length || 1) > 1) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          const newHotels = (form.hotelOptions || []).filter((_, i) => i !== idx);
                          setForm({ ...form, hotelOptions: newHotels });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>`;

const uiBlockNew = \`<div className="space-y-3 mb-4">
                {(form.hotelOptions || (form.hotelName ? [{ name: form.hotelName, rating: "3 Star" }] : [{ name: "", rating: "3 Star" }])).map((hotel, idx) => (
                  <div key={idx} className="rounded-xl border border-border p-4 bg-background relative space-y-4">
                    {((form.hotelOptions?.length || 1) > 1) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                        onClick={() => {
                          const newHotels = (form.hotelOptions || []).filter((_, i) => i !== idx);
                          setForm({ ...form, hotelOptions: newHotels });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                      <div>
                        <Label className="text-[10px] uppercase text-muted-foreground">Hotel Name</Label>
                        <Input
                          placeholder="e.g. Hotel Shompen"
                          value={hotel.name}
                          onChange={(e) => {
                            const newHotels = [...(form.hotelOptions || [])];
                            if (newHotels[idx]) newHotels[idx].name = e.target.value;
                            setForm({ ...form, hotelOptions: newHotels });
                          }}
                          className="rounded-lg h-8 mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-[10px] uppercase text-muted-foreground">Rating</Label>
                          <select
                            value={hotel.rating}
                            onChange={(e) => {
                              const newHotels = [...(form.hotelOptions || [])];
                              if (newHotels[idx]) newHotels[idx].rating = e.target.value;
                              setForm({ ...form, hotelOptions: newHotels });
                            }}
                            className="w-full rounded-lg border border-border bg-background px-3 h-8 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                          >
                            <option value="3 Star">3 Star</option>
                            <option value="4 Star">4 Star</option>
                            <option value="5 Star">5 Star</option>
                            <option value="Boutique">Boutique</option>
                            <option value="Resort">Resort</option>
                            <option value="Villa">Villa</option>
                            <option value="Camp">Camp</option>
                          </select>
                        </div>
                        <div>
                          <Label className="text-[10px] uppercase text-muted-foreground">Location</Label>
                          <Input
                            placeholder="e.g. Port Blair"
                            value={hotel.location || ""}
                            onChange={(e) => {
                              const newHotels = [...(form.hotelOptions || [])];
                              if (newHotels[idx]) newHotels[idx].location = e.target.value;
                              setForm({ ...form, hotelOptions: newHotels });
                            }}
                            className="rounded-lg h-8 mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <Label className="text-[10px] uppercase text-muted-foreground">Check-in</Label>
                        <Input
                          type="date"
                          value={hotel.checkIn || ""}
                          onChange={(e) => {
                            const newHotels = [...(form.hotelOptions || [])];
                            if (newHotels[idx]) newHotels[idx].checkIn = e.target.value;
                            setForm({ ...form, hotelOptions: newHotels });
                          }}
                          className="rounded-lg h-8 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] uppercase text-muted-foreground">Check-out</Label>
                        <Input
                          type="date"
                          value={hotel.checkOut || ""}
                          onChange={(e) => {
                            const newHotels = [...(form.hotelOptions || [])];
                            if (newHotels[idx]) newHotels[idx].checkOut = e.target.value;
                            setForm({ ...form, hotelOptions: newHotels });
                          }}
                          className="rounded-lg h-8 mt-1"
                        />
                      </div>
                      <div className="col-span-2 grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-[10px] uppercase text-muted-foreground">Rooms</Label>
                          <Input
                            type="number"
                            value={hotel.rooms || 1}
                            onChange={(e) => {
                              const newHotels = [...(form.hotelOptions || [])];
                              if (newHotels[idx]) newHotels[idx].rooms = Number(e.target.value);
                              setForm({ ...form, hotelOptions: newHotels });
                            }}
                            className="rounded-lg h-8 mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-[10px] uppercase text-muted-foreground">Adults</Label>
                          <Input
                            type="number"
                            value={hotel.adults || 2}
                            onChange={(e) => {
                              const newHotels = [...(form.hotelOptions || [])];
                              if (newHotels[idx]) newHotels[idx].adults = Number(e.target.value);
                              setForm({ ...form, hotelOptions: newHotels });
                            }}
                            className="rounded-lg h-8 mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-[10px] uppercase text-muted-foreground">Children</Label>
                          <Input
                            type="number"
                            value={hotel.children || 0}
                            onChange={(e) => {
                              const newHotels = [...(form.hotelOptions || [])];
                              if (newHotels[idx]) newHotels[idx].children = Number(e.target.value);
                              setForm({ ...form, hotelOptions: newHotels });
                            }}
                            className="rounded-lg h-8 mt-1"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-[10px] uppercase text-muted-foreground">Room Type</Label>
                        <Input
                          placeholder="e.g. 1 De luxe"
                          value={hotel.roomType || ""}
                          onChange={(e) => {
                            const newHotels = [...(form.hotelOptions || [])];
                            if (newHotels[idx]) newHotels[idx].roomType = e.target.value;
                            setForm({ ...form, hotelOptions: newHotels });
                          }}
                          className="rounded-lg h-8 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] uppercase text-muted-foreground">Nights</Label>
                        <Input
                          type="number"
                          value={hotel.nights || 1}
                          onChange={(e) => {
                            const newHotels = [...(form.hotelOptions || [])];
                            if (newHotels[idx]) newHotels[idx].nights = Number(e.target.value);
                            setForm({ ...form, hotelOptions: newHotels });
                          }}
                          className="rounded-lg h-8 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] uppercase text-muted-foreground">Meal Type</Label>
                        <Input
                          placeholder="e.g. Half Board"
                          value={hotel.mealType || ""}
                          onChange={(e) => {
                            const newHotels = [...(form.hotelOptions || [])];
                            if (newHotels[idx]) newHotels[idx].mealType = e.target.value;
                            setForm({ ...form, hotelOptions: newHotels });
                          }}
                          className="rounded-lg h-8 mt-1"
                        />
                      </div>
                    </div>

                  </div>
                ))}
              </div>\`;

content = content.replace(uiBlockOld, uiBlockNew);

fs.writeFileSync(path, content);
