const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function saveScore({rows, cols, difficulty, playerName, time_ms}) {
    const {data, error} = await supabase
        .from('rankings')
        .insert([{rows, cols, difficulty, player_name: playerName, time_ms}])
        .select()
        .single();
    if (error) throw error;
    console.log("Datos guardados");
    return data;
}

export async function getTopScores({rows, cols, difficulty, limit = 5}) {
    const { data, error } = await supabase
        .from('rankings')
        .select('player_name, time_ms, created_at')
        .eq('rows', rows)
        .eq('cols', cols)
        .eq('difficulty', difficulty)
        .order('time_ms', { ascending: true})
        .limit(limit);
    if (error) throw error;
    return data;
}
