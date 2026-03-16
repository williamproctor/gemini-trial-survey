import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('[Survey API] Missing Supabase environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const body = req.body;

    const row = {
      respondent_name: body.respondentName || 'Anonymous',
      did_use_gemini: body.didUseGemini || '',
      branch: body.branch || '',
      usage_frequency: body.usageFrequency || '',
      features_used: body.featuresUsed || '',
      work_tasks: body.workTasks || '',
      what_liked: body.whatLiked || '',
      what_disliked: body.whatDisliked || '',
      overall_rating: body.overallRating || null,
      continue_using: body.continueUsing || '',
      reasons_not_used: body.reasonsNotUsed || '',
      what_would_help: body.whatWouldHelp || '',
      open_to_trying: body.openToTrying || '',
      additional_thoughts: body.additionalThoughts || '',
      submitted_at: body.submittedAt || new Date().toISOString(),
    };

    const { error } = await supabase.from('survey_responses').insert([row]);

    if (error) {
      console.error('[Survey API] Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save response' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[Survey API] Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
