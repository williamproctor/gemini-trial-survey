-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query)

create table survey_responses (
  id bigint generated always as identity primary key,
  respondent_name text default 'Anonymous',
  did_use_gemini text not null default '',
  branch text not null default '',
  usage_frequency text default '',
  features_used text default '',
  work_tasks text default '',
  what_liked text default '',
  what_disliked text default '',
  overall_rating integer,
  continue_using text default '',
  reasons_not_used text default '',
  what_would_help text default '',
  open_to_trying text default '',
  additional_thoughts text default '',
  submitted_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Only the server (service role key) can insert; no public/anonymous access
alter table survey_responses enable row level security;

-- Allow inserts from the service role (used by the API route)
create policy "Service role can insert"
  on survey_responses
  for insert
  to service_role
  with check (true);

-- Allow the service role to read all rows (for admin/export)
create policy "Service role can read"
  on survey_responses
  for select
  to service_role
  using (true);
