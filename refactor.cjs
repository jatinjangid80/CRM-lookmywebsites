const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "src", "routes");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".tsx"));

const tableMap = {
  '"crm_leads_v2"': '"leads"',
  '"crm_customers_v2"': '"customers"',
  '"crm_bookings"': '"bookings"',
  '"crm_packages"': '"packages"',
  '"crm_employees_v3"': '"employees"',
  '"crm_vendors_v2"': '"vendors"',
  '"crm_tasks_v1"': '"tasks"',
  '"crm_visa_apps_v3"': '"visa_apps"',
  // Map others to themselves as table names just in case
  '"crm_leaves_v1"': '"leaves"',
  '"crm_attendance_v2"': '"attendance"',
  '"crm_feeds_v1"': '"feeds"',
  '"crm_timelogs_v1"': '"timelogs"',
  '"crm_hr_files_v1"': '"hr_files"',
  '"crm_reviews_v1"': '"reviews"',
  '"crm_payroll_v1"': '"payroll"',
  '"crm_assets_v1"': '"assets"',
  '"crm_certificates_v1"': '"certificates"',
};

files.forEach((file) => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, "utf8");

  if (content.includes("useLocalStorage")) {
    // Add import for useSupabaseTable
    if (!content.includes("useSupabaseTable")) {
      content = content.replace(
        /import \{ useLocalStorage \} from "@\/lib\/use-local-storage";/,
        'import { useLocalStorage } from "@/lib/use-local-storage";\nimport { useSupabaseTable } from "@/hooks/useSupabaseTable";',
      );
    }

    // Replace useLocalStorage with useSupabaseTable for the mapped keys
    for (const [key, table] of Object.entries(tableMap)) {
      const regex = new RegExp(`useLocalStorage(<[^>]+>)?\\(${key}`, "g");
      content = content.replace(regex, `useSupabaseTable$1(${table}`);
    }

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});
