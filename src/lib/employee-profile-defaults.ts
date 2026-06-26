export interface CareerItem {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
  achievement: string;
}

export interface AcademicItem {
  institution: string;
  qualification: string;
  specialization: string;
  year: string;
  grade: string;
}

export interface FamilyItem {
  name: string;
  relationship: string;
  dob: string;
  contactNumber: string;
}

export interface EmployeeDetails {
  department: string;
  designation: string;
  employmentType: string;
  workLocation: string;
  manager: string;
  team: string;
  experience: string;
  level: string;
  skills: string[];
  certifications: string[];

  // Reporting structure
  reportingManager: string;
  teamLead: string;
  directReports: string[];

  // Personal Profile
  dob: string;
  gender: string;
  nationality: string;
  maritalStatus: string;
  languages: string[];
  bio: string;

  // Contact Information
  workPhone: string;
  personalPhone: string;
  workEmail: string;
  personalEmail: string;
  currentAddress: string;
  permanentAddress: string;
  emergencyContact: string;

  // Verification Details
  panNumber: string;
  aadhaarNumber: string;
  passportNumber: string;
  verificationStatus: string;

  // Career History
  careerHistory: CareerItem[];

  // Academic Background
  academicBackground: AcademicItem[];

  // Family Information
  familyInformation: FamilyItem[];
}

export const INITIAL_EMPLOYEE_DETAILS: Record<string, EmployeeDetails> = {
  "LMH-01": {
    department: "HR & Admin",
    designation: "HR & Admin Manager",
    employmentType: "Permanent",
    workLocation: "JTM Mall Office, Jaipur",
    manager: "Manvendra Singhal (LMH-01)",
    team: "Corporate Operations",
    experience: "14 Year(s) 5 Month(s)",
    level: "L3 - Senior Management",
    skills: ["HR Policies", "Strategic Admin", "Recruiting", "Employee Relations"],
    certifications: ["SHRM Certified Professional", "MBA in HR & Admin"],
    reportingManager: "Manvendra Singhal",
    teamLead: "Suman Yadav",
    directReports: ["Nikita Bairwa (LMH-02)", "Pushplata Kriplani (LMH-03)", "AMAN SHARMA (LMH-04)", "Deepak Kumar (LMH-05)"],
    dob: "1993-07-09",
    gender: "Female",
    nationality: "Indian",
    maritalStatus: "Married",
    languages: ["Hindi", "English", "Rajasthani"],
    bio: "Oversees Human Resources and Administrative operations.",
    workPhone: "+91 9887155570",
    personalPhone: "+91 9414055570",
    workEmail: "insurancesolutions58@gmail.com",
    personalEmail: "suman.yadav@gmail.com",
    currentAddress: "B-202, Jagatpura Heights, Jagatpura, Jaipur, RJ - 302017",
    permanentAddress: "B-202, Jagatpura Heights, Jagatpura, Jaipur, RJ - 302017",
    emergencyContact: "Rajesh Yadav (Husband) - +91 98871XXXXX",
    panNumber: "ABCDE1234F",
    aadhaarNumber: "XXXX-XXXX-1234",
    passportNumber: "Z1234567",
    verificationStatus: "Verified",
    careerHistory: [
      { company: "IDEA", position: "Tele-calling Executive", startDate: "2015-01-01", endDate: "2016-05-31", responsibilities: "Sold mobile plans and add-ons over calls", achievement: "Recognized as Top Closer in Q3 2015" },
      { company: "NIMT Global Institute", position: "Tele-calling Executive", startDate: "2012-01-01", endDate: "2014-12-31", responsibilities: "Handled inbound and outbound customer inquiries", achievement: "Consistently exceeded weekly call quotas by 15%" }
    ],
    academicBackground: [
      { institution: "Rajasthan University", qualification: "M.A.", specialization: "Political Science", year: "2015", grade: "First Division (68%)" },
      { institution: "Rajasthan University", qualification: "B.A.", specialization: "General", year: "2013", grade: "First Division (62%)" }
    ],
    familyInformation: [
      { name: "Rajesh Yadav", relationship: "Husband", dob: "1990-12-12", contactNumber: "+91 98871XXXXX" }
    ]
  },
  "LMH-02": {
    department: "Sales & Marketing",
    designation: "Sales Executive",
    employmentType: "Permanent",
    workLocation: "JTM Mall Office, Jaipur",
    manager: "Suman Yadav (LMH-01)",
    team: "Asia Pacific Sales Group",
    experience: "3 Year(s) 2 Month(s)",
    level: "L1 - Specialist",
    skills: ["B2C Sales", "Destination Pitching", "Customer Negotiation", "Closing Deals"],
    certifications: ["Advanced Destination Expert", "Sales Mastery Certificate"],
    reportingManager: "Suman Yadav (LMH-01)",
    teamLead: "Suman Yadav",
    directReports: ["None"],
    dob: "1995-08-15",
    gender: "Female",
    nationality: "Indian",
    maritalStatus: "Single",
    languages: ["Hindi", "English"],
    bio: "Driving sales and client acquisition.",
    workPhone: "+91 9783395483",
    personalPhone: "+91 90010XXXXX",
    workEmail: "info.insurance58@gmail.com",
    personalEmail: "nikita.bairwa@gmail.com",
    currentAddress: "C-45, Malviya Nagar, Jaipur, RJ - 302017",
    permanentAddress: "C-45, Malviya Nagar, Jaipur, RJ - 302017",
    emergencyContact: "Ram Bairwa (Father) - +91 99823XXXXX",
    panNumber: "FGHIJ5678K",
    aadhaarNumber: "XXXX-XXXX-5678",
    passportNumber: "Y8765432",
    verificationStatus: "Verified",
    careerHistory: [
      { company: "Jaipur Travels Ltd", position: "Junior Sales Agent", startDate: "2023-01-10", endDate: "2024-02-28", responsibilities: "Handled domestic holiday inquiries", achievement: "Closed highest domestic packages in Q2 2023" }
    ],
    academicBackground: [
      { institution: "Rajasthan University", qualification: "B.Com", specialization: "Business Administration", year: "2017", grade: "Second Division (58%)" }
    ],
    familyInformation: [
      { name: "Ram Bairwa", relationship: "Father", dob: "1968-04-10", contactNumber: "+91 99823XXXXX" }
    ]
  },
  "LMH-03": {
    department: "Operations",
    designation: "Executive",
    employmentType: "Permanent",
    workLocation: "JTM Mall Office, Jaipur",
    manager: "Suman Yadav (LMH-01)",
    team: "Asia Pacific Sales Group",
    experience: "4 Year(s) 1 Month(s)",
    level: "L1 - Specialist",
    skills: ["Itinerary Planning", "B2B Sales", "Client Relations", "Ticketing"],
    certifications: ["IATA Travel Agent Certificate", "CRM Specialist"],
    reportingManager: "Suman Yadav (LMH-01)",
    teamLead: "Suman Yadav",
    directReports: ["None"],
    dob: "1994-12-20",
    gender: "Female",
    nationality: "Indian",
    maritalStatus: "Single",
    languages: ["Hindi", "English", "Rajasthani"],
    bio: "Handles reservations and customer support.",
    workPhone: "+91 9928795483",
    personalPhone: "+91 98875XXXXX",
    workEmail: "resv@lookmyholidays.in",
    personalEmail: "pushplata.kriplani@gmail.com",
    currentAddress: "A-501, Ridhi Sidhi Apartments, Gopalpura, Jaipur, RJ - 302018",
    permanentAddress: "A-501, Ridhi Sidhi Apartments, Gopalpura, Jaipur, RJ - 302018",
    emergencyContact: "Harish Kriplani (Father) - +91 94140XXXXX",
    panNumber: "KLMNO9012P",
    aadhaarNumber: "XXXX-XXXX-9012",
    passportNumber: "X7654321",
    verificationStatus: "Verified",
    careerHistory: [
      { company: "SBI Credit Cards", position: "Sales Agent", startDate: "2016-06-01", endDate: "2016-12-31", responsibilities: "Pitched and processed credit card application forms", achievement: "Cleared audit file verifications with zero errors" }
    ],
    academicBackground: [
      { institution: "Rajasthan University", qualification: "B.A.", specialization: "Economics", year: "2016", grade: "First Division (61%)" }
    ],
    familyInformation: [
      { name: "Harish Kriplani", relationship: "Father", dob: "1965-08-15", contactNumber: "+91 94140XXXXX" }
    ]
  },
  "LMH-04": {
    department: "Finance & Accounts",
    designation: "Accounts Manager",
    employmentType: "Permanent",
    workLocation: "JTM Mall Office, Jaipur",
    manager: "Manvendra Singhal (LMH-01)",
    team: "Accounts Group",
    experience: "6 Year(s) 3 Month(s)",
    level: "L2 - Lead Specialist",
    skills: ["GST filing", "Payroll processing", "Tally ERP", "Invoicing"],
    certifications: ["Chartered Accountant (IPCC)", "Tally Certified Expert"],
    reportingManager: "Manvendra Singhal (LMH-01)",
    teamLead: "Suman Yadav",
    directReports: ["None"],
    dob: "1991-05-05",
    gender: "Male",
    nationality: "Indian",
    maritalStatus: "Married",
    languages: ["Hindi", "English"],
    bio: "Manages financial transactions and payroll.",
    workPhone: "+91 9660095483",
    personalPhone: "+91 94142XXXXX",
    workEmail: "accounts@lookmyholidays.in",
    personalEmail: "aman.sharma@gmail.com",
    currentAddress: "D-12, Vaishali Nagar, Jaipur, RJ - 302021",
    permanentAddress: "D-12, Vaishali Nagar, Jaipur, RJ - 302021",
    emergencyContact: "Pooja Sharma (Wife) - +91 98290XXXXX",
    panNumber: "QRSTU3456V",
    aadhaarNumber: "XXXX-XXXX-3456",
    passportNumber: "W6543210",
    verificationStatus: "Verified",
    careerHistory: [
      { company: "Apex Solutions", position: "Account Assistant", startDate: "2018-02-15", endDate: "2021-10-30", responsibilities: "Managed day-to-day accounts bookkeeping", achievement: "Implemented GST portal filing structure" }
    ],
    academicBackground: [
      { institution: "ICA", qualification: "Chartered Accountant (Inter)", specialization: "Commerce", year: "2017", grade: "Cleared Group 1" },
      { institution: "Rajasthan University", qualification: "B.Com", specialization: "Commerce", year: "2013", grade: "First Division (65%)" }
    ],
    familyInformation: [
      { name: "Pooja Sharma", relationship: "Wife", dob: "1993-09-18", contactNumber: "+91 98290XXXXX" }
    ]
  },
  "LMH-05": {
    department: "Operations",
    designation: "Visa Executive",
    employmentType: "Permanent",
    workLocation: "JTM Mall Office, Jaipur",
    manager: "Suman Yadav (LMH-01)",
    team: "Operations Support",
    experience: "2 Year(s) 1 Month(s)",
    level: "L1 - Specialist",
    skills: ["Visa Documentation", "Embassy Liaison", "Schengen Visa Processing", "Customer Briefing"],
    certifications: ["Certified Travel Document Expert"],
    reportingManager: "Suman Yadav (LMH-01)",
    teamLead: "Suman Yadav",
    directReports: ["None"],
    dob: "1996-10-12",
    gender: "Male",
    nationality: "Indian",
    maritalStatus: "Single",
    languages: ["Hindi", "English"],
    bio: "Specializes in international visa processing.",
    workPhone: "+91 9636305562",
    personalPhone: "+91 91160XXXXX",
    workEmail: "visa@lookmyholidays.in",
    personalEmail: "deepak.kumar@gmail.com",
    currentAddress: "E-104, Mansarovar, Jaipur, RJ - 302020",
    permanentAddress: "E-104, Mansarovar, Jaipur, RJ - 302020",
    emergencyContact: "Karan Kumar (Brother) - +91 90011XXXXX",
    panNumber: "WXYZA7890B",
    aadhaarNumber: "XXXX-XXXX-7890",
    passportNumber: "V5432109",
    verificationStatus: "Verified",
    careerHistory: [
      { company: "LookMyHolidays", position: "Intern (Visa)", startDate: "2023-08-12", endDate: "2024-02-12", responsibilities: "Verified customer visa documents", achievement: "Promoted to Full-time Executive within 6 months" }
    ],
    academicBackground: [
      { institution: "Rajasthan University", qualification: "B.Sc", specialization: "General", year: "2018", grade: "First Division (60%)" }
    ],
    familyInformation: [
      { name: "Karan Kumar", relationship: "Brother", dob: "1999-05-14", contactNumber: "+91 90011XXXXX" }
    ]
  }
};

export function createDefaultEmployeeDetails(empId: string, name: string, role: string, email: string, phone: string): EmployeeDetails {
  return {
    department: "Operations",
    designation: role,
    employmentType: "Permanent",
    workLocation: "JTM Mall Office, Jaipur",
    manager: "Suman Yadav (LMH-01)",
    team: "Asia Pacific Sales Group",
    experience: "1 Year(s)",
    level: "L1 - Specialist",
    skills: ["Itinerary Planning", "B2B Sales"],
    certifications: ["CRM Specialist"],
    reportingManager: "Suman Yadav (LMH-01)",
    teamLead: "Suman Yadav",
    directReports: ["None"],
    dob: "1995-01-01",
    gender: "Male",
    nationality: "Indian",
    maritalStatus: "Single",
    languages: ["Hindi", "English"],
    bio: "Active system user.",
    workPhone: phone || "+91 XXXXXXXXXX",
    personalPhone: "+91 XXXXXXXXXX",
    workEmail: email || "info@lookmyholidays.in",
    personalEmail: `${name.split(" ")[0].toLowerCase()}@gmail.com`,
    currentAddress: "Jaipur, Rajasthan, India",
    permanentAddress: "Jaipur, Rajasthan, India",
    emergencyContact: "Emergency - +91 XXXXXXXXXX",
    panNumber: "XXXXX0000X",
    aadhaarNumber: "XXXX-XXXX-0000",
    passportNumber: "X0000000",
    verificationStatus: "Verified",
    careerHistory: [],
    academicBackground: [],
    familyInformation: []
  };
}
