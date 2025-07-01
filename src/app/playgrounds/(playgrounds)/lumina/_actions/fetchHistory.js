'use server'
import { createClient_server } from "@/utils/supabase/supabaseServer"

export async function fetchHistory() {
    const supabase = await createClient_server();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
        console.error('Error fetching user:', userError);
        return { error: 'Failed to fetch user' };
    }

    if (!user) {
        return { error: 'User not authenticated' };
    }

    const { data, error } = await supabase
        .from('lumina')
        .select('thread_id, thread_name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }); // newest first

    if (error) {
        console.error('Error fetching threads:', error);
        return { error: 'Failed to fetch threads' };
    }

    // filter unique thread_ids
    const uniqueThreads = [];
    const seen = new Set();
    for (const item of data) {
        if (!seen.has(item.thread_id)) {
            seen.add(item.thread_id);
            uniqueThreads.push(item);
        }
    }

    return { data: uniqueThreads };
}