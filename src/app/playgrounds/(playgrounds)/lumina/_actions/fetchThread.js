'use server'
import { createClient_server } from "@/utils/supabase/supabaseServer"

export async function fetchThread(thread_id) {
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
        .select('role , content, ai_model')
        .eq('thread_id', thread_id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });  // oldest first

    // const messages = (data)=>{
        
    // }

    if (error) {
        console.error('Error Fetching Thread', error);
        return { error: 'Failed to Fetch Thread' };
    }

    return { data };
}