'use server'
import { createClient_server } from "@/utils/supabase/supabaseServer"

export async function fetchThread(thread_id) {
    const supabase = await createClient_server();
    console.log("received fetch request")
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
        const { data, error } = await supabase
            .from('lumina')
            .select('role , content, ai_model, is_public')
            .eq('thread_id', thread_id)
            .eq('is_public', true)
            .order('created_at', { ascending: true });  // oldest first
        if (error || !data || data.length === 0) {
            return { error: 'No messages found or thread is Private. If this is your thread then please Login to view.' };
        }
        return { data };
    }

    if (!user) {
        return { error: 'User not authenticated' };
    }

    const { data, error } = await supabase
        .from('lumina')
        .select('role , content, ai_model, is_public')
        .eq('thread_id', thread_id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });  // oldest first


    if (error) {
        console.error('Error Fetching Thread', error);
        return { error: 'Unable to fetch thread. It may have been deleted or does not exist.' };
    }
    // console.log(data);
    // console.log("sent");
    return { data };
}