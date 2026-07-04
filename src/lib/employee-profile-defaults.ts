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
  username?: string;
  password?: string;
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
    department: "Management",
    designation: "Ceo Founder",
    employmentType: "Permanent",
    workLocation: "Jaipur Office",
    manager: "Self",
    team: "Management",
    experience: "18 Year(s)",
    level: "CEO",
    skills: ["Leadership", "Travel Industry", "Business Strategy"],
    certifications: ["CEO Founder Certificate"],
    reportingManager: "Self",
    teamLead: "Self",
    directReports: ["Suman Yadav (LMH-02)"],
    dob: "1980-01-01",
    gender: "Male",
    nationality: "Indian",
    maritalStatus: "Married",
    languages: ["Hindi", "English"],
    bio: "CEO Founder of LookMyHolidays.",
    workPhone: "9413095483",
    personalPhone: "9529155562",
    workEmail: "bookings@lookmyholidays.in",
    personalEmail: "lookmyholidays@gmail.com",
    currentAddress: "krishna Appartment Mahal road jagatpura -302017",
    permanentAddress: "krishna Appartment Mahal road jagatpura -302017",
    emergencyContact: "Family",
    panNumber: "XXXXX0000X",
    aadhaarNumber: "XXXX-XXXX-0000",
    passportNumber: "X0000000",
    verificationStatus: "Verified",
    careerHistory: [],
    academicBackground: [],
    familyInformation: [],
  },
  "LMH-02": {
    department: "Insurance & Travel",
    designation: "HR & Admin Manager",
    employmentType: "Permanent",
    workLocation: "Jaipur Office",
    manager: "Manvendra Singhal (LMH-01)",
    team: "HR",
    experience: "9 Year(s)",
    level: "Manager",
    skills: ["HR", "Administration", "Operations"],
    certifications: ["HR Management Professional"],
    reportingManager: "Manvendra Singhal (LMH-01)",
    teamLead: "Suman Yadav",
    directReports: [
      "Nikita Birwa (LMH-04)",
      "Aman Sharma (LMH-03)",
      "Pushplata Kriplani (LMH-05)",
      "Deepak Yogi (LMH-06)",
      "Jatin Jangid (LMH-07)",
    ],
    dob: "1993-01-01",
    gender: "Female",
    nationality: "Indian",
    maritalStatus: "Single",
    languages: ["Hindi", "English"],
    bio: "HR & Admin Manager.",
    workPhone: "9887155570",
    personalPhone: "9549441214",
    workEmail: "insurancesolutions58@gmail.com",
    personalEmail: "Sumanyadav1993sy@gmail.com",
    currentAddress: "Mehta ki dhani kokawas Sanganer jaipur 302029",
    permanentAddress: "Mehta ki dhani kokawas Sanganer jaipur 302029",
    emergencyContact: "Family",
    panNumber: "XXXXX0000X",
    aadhaarNumber: "XXXX-XXXX-0000",
    passportNumber: "X0000000",
    verificationStatus: "Verified",
    careerHistory: [],
    academicBackground: [],
    familyInformation: [],
  },
  "LMH-04": {
    department: "Insurance",
    designation: "Insurance Sales",
    employmentType: "Permanent",
    workLocation: "Jaipur Office",
    manager: "Suman Yadav (LMH-02)",
    team: "Insurance",
    experience: "1 Year(s)",
    level: "L1 - Specialist",
    skills: ["Tele-calling", "Insurance Sales", "Customer Support"],
    certifications: ["Insurance Agent Certificate"],
    reportingManager: "Suman Yadav (LMH-02)",
    teamLead: "Suman Yadav",
    directReports: ["None"],
    dob: "1995-01-01",
    gender: "Female",
    nationality: "Indian",
    maritalStatus: "Single",
    languages: ["Hindi", "English"],
    bio: "Insurance Sales Representative.",
    workPhone: "9783395483",
    personalPhone: "9694544609",
    workEmail: "info.insurance58@gmail.com",
    personalEmail: "nikita.bairwa5361@gmail.com",
    currentAddress: "MKB 1378, Jagatpura,Jaipur, Rajasthan, INDIA, 302017.",
    permanentAddress: "MKB 1378, Jagatpura,Jaipur, Rajasthan, INDIA, 302017.",
    emergencyContact: "Family",
    panNumber: "XXXXX0000X",
    aadhaarNumber: "XXXX-XXXX-0000",
    passportNumber: "X0000000",
    verificationStatus: "Verified",
    careerHistory: [],
    academicBackground: [],
    familyInformation: [],
  },
  "LMH-03": {
    department: "Accounting",
    designation: "Accounts Manager",
    employmentType: "Permanent",
    workLocation: "Jaipur Office",
    manager: "Suman Yadav (LMH-02)",
    team: "Accounts",
    experience: "4 Year(s)",
    level: "Manager",
    skills: ["Accounting", "GST Filing", "Financial Audit"],
    certifications: ["Certified Accountant"],
    reportingManager: "Suman Yadav (LMH-02)",
    teamLead: "Suman Yadav",
    directReports: ["None"],
    dob: "1991-01-01",
    gender: "Male",
    nationality: "Indian",
    maritalStatus: "Married",
    languages: ["Hindi", "English"],
    bio: "Accounts Manager.",
    workPhone: "9660095483",
    personalPhone: "8740891090",
    workEmail: "Accounts@lookmyholidays.in",
    personalEmail: "",
    currentAddress: "Malviya nagar Girdhar marg",
    permanentAddress: "Malviya nagar Girdhar marg",
    emergencyContact: "Family",
    panNumber: "XXXXX0000X",
    aadhaarNumber: "XXXX-XXXX-0000",
    passportNumber: "X0000000",
    verificationStatus: "Verified",
    careerHistory: [],
    academicBackground: [],
    familyInformation: [],
  },
  "LMH-05": {
    department: "Travel",
    designation: "Sales Executive",
    employmentType: "Permanent",
    workLocation: "Jaipur Office",
    manager: "Suman Yadav (LMH-02)",
    team: "Travel Sales",
    experience: "1 Year(s)",
    level: "L1 - Specialist",
    skills: ["B2C Sales", "Itinerary Pitching"],
    certifications: ["Travel Consultant Certificate"],
    reportingManager: "Suman Yadav (LMH-02)",
    teamLead: "Suman Yadav",
    directReports: ["None"],
    dob: "1994-01-01",
    gender: "Female",
    nationality: "Indian",
    maritalStatus: "Single",
    languages: ["Hindi", "English"],
    bio: "Sales Executive.",
    workPhone: "9928795483",
    personalPhone: "7976325186",
    workEmail: "resv@lookmyholidays.in",
    personalEmail: "",
    currentAddress: "",
    permanentAddress: "",
    emergencyContact: "Family",
    panNumber: "XXXXX0000X",
    aadhaarNumber: "XXXX-XXXX-0000",
    passportNumber: "X0000000",
    verificationStatus: "Verified",
    careerHistory: [],
    academicBackground: [],
    familyInformation: [],
  },
  "LMH-06": {
    department: "Visa Exctive",
    designation: "Executive",
    employmentType: "Permanent",
    workLocation: "Jaipur Office",
    manager: "Suman Yadav (LMH-02)",
    team: "Visa",
    experience: "1 Year(s)",
    level: "L1 - Specialist",
    skills: ["Visa Processing", "Embassy Coordination"],
    certifications: ["Certified Visa Expert"],
    reportingManager: "Suman Yadav (LMH-02)",
    teamLead: "Suman Yadav",
    directReports: ["None"],
    dob: "1996-01-01",
    gender: "Male",
    nationality: "Indian",
    maritalStatus: "Single",
    languages: ["Hindi", "English"],
    bio: "Visa Processing Executive.",
    workPhone: "9636305562",
    personalPhone: "8000385610",
    workEmail: "visa@lookmyholidays.in",
    personalEmail: "deepakpilani0852@gmail.com",
    currentAddress: "krishna nagar -2 near by Kailash tower Lal khoti",
    permanentAddress: "krishna nagar -2 near by Kailash tower Lal khoti",
    emergencyContact: "Family",
    panNumber: "XXXXX0000X",
    aadhaarNumber: "XXXX-XXXX-0000",
    passportNumber: "X0000000",
    verificationStatus: "Verified",
    careerHistory: [],
    academicBackground: [],
    familyInformation: [],
  },
  "LMH-07": {
    department: "Internship",
    designation: "Web Design Internship",
    employmentType: "Intern",
    workLocation: "Jaipur Office",
    manager: "Suman Yadav (LMH-02)",
    team: "Design",
    experience: "1 Month",
    level: "Intern",
    skills: ["Web Design", "UI/UX", "HTML/CSS"],
    certifications: ["Web Designer Intern"],
    reportingManager: "Suman Yadav (LMH-02)",
    teamLead: "Suman Yadav",
    directReports: ["None"],
    dob: "2000-01-01",
    gender: "Male",
    nationality: "Indian",
    maritalStatus: "Single",
    languages: ["Hindi", "English"],
    bio: "Web Design Intern.",
    workPhone: "NA",
    personalPhone: "7340098982",
    workEmail: "NA",
    personalEmail: "Jatinjangid72973@gmail.com",
    currentAddress: "plot no -44 Banshipuri-1 jagatpura jaipur -302017",
    permanentAddress: "plot no -44 Banshipuri-1 jagatpura jaipur -302017",
    emergencyContact: "Family",
    panNumber: "XXXXX0000X",
    aadhaarNumber: "XXXX-XXXX-0000",
    passportNumber: "X0000000",
    verificationStatus: "Verified",
    careerHistory: [],
    academicBackground: [],
    familyInformation: [],
  },
};

export function createDefaultEmployeeDetails(
  empId: string,
  name: string,
  role: string,
  email: string,
  phone: string,
): EmployeeDetails {
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
    personalEmail: `${(name || "").split(" ")[0].toLowerCase()}@gmail.com`,
    currentAddress: "Jaipur, Rajasthan, India",
    permanentAddress: "Jaipur, Rajasthan, India",
    emergencyContact: "Emergency - +91 XXXXXXXXXX",
    panNumber: "XXXXX0000X",
    aadhaarNumber: "XXXX-XXXX-0000",
    passportNumber: "X0000000",
    verificationStatus: "Verified",
    careerHistory: [],
    academicBackground: [],
    familyInformation: [],
  };
}
