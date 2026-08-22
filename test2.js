const fs = require('fs');
const content = fs.readFileSync('src/routes/crm.taxi-booking.tsx', 'utf8');
// This is a UI file so it doesn't contain the DB rows. I can't read the DB easily.
