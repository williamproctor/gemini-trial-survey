# Gemini Enterprise Trial Survey

Interactive Typeform-style survey for Audio/Video Services. Hosted on Vercel with Supabase (Postgres) for response storage.

## Live Site

After deployment: **https://gemini-trial-survey.vercel.app** (or your custom domain)

---

## Setup Guide (15 minutes)

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up (free tier works fine)
2. Click **New Project**
3. Choose a name (e.g., `gemini-survey`), set a database password, pick a region close to your users
4. Wait ~2 minutes for the project to provision

### Step 2: Create the Database Table

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Paste the contents of `supabase-schema.sql` from this repo
4. Click **Run** -- you'll see "Success. No rows returned" (that's correct)
5. Go to **Table Editor** in the sidebar -- you should see `survey_responses` listed

### Step 3: Get Your Supabase Keys

1. In Supabase, go to **Settings** > **API** (left sidebar)
2. Copy these two values (you'll need them in Step 5):
   - **Project URL** -- looks like `https://abcdefgh.supabase.co`
   - **service_role key** (under "Project API keys") -- the longer secret key

> **Important:** Use the `service_role` key, NOT the `anon` key. The service role key is only used server-side in the API route and is never exposed to browsers.

### Step 4: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account
2. Click **Add New** > **Project**
3. Import the `gemini-trial-survey` repository from your GitHub
4. Vercel auto-detects the settings -- just click **Deploy**

### Step 5: Add Environment Variables

1. In Vercel, go to your project **Settings** > **Environment Variables**
2. Add these two variables:

   | Name | Value |
   |---|---|
   | `SUPABASE_URL` | Your Supabase Project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service_role key |

3. Click **Save**
4. Go to **Deployments** and click the **...** menu on the latest deployment > **Redeploy**

### Step 6: Test It

1. Visit your Vercel URL (shown at the top of your project dashboard)
2. Fill out the survey and submit
3. Go to Supabase **Table Editor** > `survey_responses` -- your response should be there!

---

## Viewing & Exporting Responses

### In Supabase Dashboard

- Go to **Table Editor** > `survey_responses`
- Browse, filter, and sort responses directly
- Use the search bar and column filters to find specific responses

### Export to CSV/Excel

- In Table Editor, click the **Export** button (top right) > **Export as CSV**
- Open the CSV in Excel, Google Sheets, or any spreadsheet tool

### Export via SQL

Go to **SQL Editor** and run queries like:

```sql
-- All responses
select * from survey_responses order by submitted_at desc;

-- Just users who tried Gemini
select * from survey_responses where branch = 'user' order by overall_rating desc;

-- Average rating
select avg(overall_rating) as avg_rating, count(*) as total from survey_responses where branch = 'user';

-- Response counts by branch
select branch, count(*) from survey_responses group by branch;
```

---

## Architecture

```
Browser (survey page)
    |
    | POST /api/submit (JSON payload)
    |
Vercel Serverless Function (api/submit.js)
    |
    | Insert row via Supabase client
    |
Supabase (Postgres database)
```

- **Frontend:** Static HTML/CSS/JS -- no build step, no framework
- **Backend:** Single serverless function on Vercel (auto-scales, zero maintenance)
- **Database:** Supabase Postgres with row-level security (only the server can write)
- **Cost:** Both Vercel and Supabase free tiers handle hundreds of survey responses easily

## Project Structure

```
gemini-trial-survey/
├── public/
│   └── index.html          # The survey (static HTML/CSS/JS)
├── api/
│   └── submit.js           # Vercel serverless function (inserts to Supabase)
├── supabase-schema.sql     # Database table + security policies
├── vercel.json             # Vercel routing config
├── package.json            # Supabase JS dependency
└── README.md               # This file
```
