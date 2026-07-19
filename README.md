# CRM Look My Holidays

A role-based operations CRM built to centralize lead funnels, employee task management, payment approvals, and visa/insurance tracking. Built for real-time synchronization across an agency's workflow.

## Tech Stack
* **Frontend:** React, TanStack Start
* **Backend & Database:** Supabase (PostgreSQL, Auth, Realtime)
* **Deployment:** Vercel

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jatinjangid80/CRM-lookmywebsites.git

```

2. **Install dependencies:**
```bash
npm install

```


3. **Environment Setup:**
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

```


4. **Run the development server:**
```bash
npm run dev

```


The application will be available at `http://localhost:3000`.


Once you commit that, your repo officially meets the submission requirements and you can proceed with the form. 

However, you still have real admin passwords publicly visible in your `src/lib/auth.ts` file. 

