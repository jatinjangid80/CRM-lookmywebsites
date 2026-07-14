const XLSX = require('xlsx');
const fs = require('fs');

// 1. Vendor Template
const vendorData = [
  {
    "Place": "Dubai, UAE",
    "Vendor Name": "Address Beach Resort",
    "Contact Person": "jatin jangid",
    "Mobile Number": "971501234567",
    "Email ID": "jatinjangid@addressbeach.com",
    "Website": "https://www.addressbeach.com",
    "Office City": "Dubai",
    "Vendor Type": "Hotel",
    "Status": "Active"
  }
];
const vendorSheet = XLSX.utils.json_to_sheet(vendorData);
const vendorWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(vendorWorkbook, vendorSheet, "Vendors");
XLSX.writeFile(vendorWorkbook, './public/Vendor_Import_Template.xlsx');

// 2. Customer Template
const customerData = [
  {
    "Customer Name": "John Doe",
    "Mobile Number": "9876543210",
    "Email ID": "john.doe@example.com",
    "Address": "Mumbai, India",
    "Reference Name": "Jane Smith"
  }
];
const customerSheet = XLSX.utils.json_to_sheet(customerData);
const customerWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(customerWorkbook, customerSheet, "Customers");
XLSX.writeFile(customerWorkbook, './public/Customer_Import_Template.xlsx');

// 3. Attendance Template
const attendanceData = [
  {
    "Employee ID": "EMP-01",
    "Date": "2026-07-11",
    "Clock In": "09:00",
    "Clock Out": "18:00",
    "Location": "JTM Mall Office",
    "Status": "Present",
    "Note": "Morning Shift"
  }
];
const attendanceSheet = XLSX.utils.json_to_sheet(attendanceData);
const attendanceWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(attendanceWorkbook, attendanceSheet, "Attendance");
XLSX.writeFile(attendanceWorkbook, './public/Attendance_Import_Template.xlsx');

console.log("Templates generated successfully in public folder.");
