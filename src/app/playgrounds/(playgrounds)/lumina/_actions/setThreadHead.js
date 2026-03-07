"use server"
import { createClient_server } from "@/utils/supabase/supabaseServer"

export async function setThreadHead(thread_id, node_id) {
    const supabase = await createClient_server();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error('Error fetching user:', userError);
        return { error: 'Failed to authenticate user.' };
    }

    // unset all is_head to false
    const { error: resetError } = await supabase
        .from('lumina')
        .update({ is_head: false })
        .eq('thread_id', thread_id)
        .eq('user_id', user.id);

    if (resetError) {
        console.error('Error resetting is_head', resetError);
        return { error: 'Failed to reset thread head state.' };
    }

    const { data, error: setError } = await supabase
        .from('lumina')
        .update({ is_head: true })
        .eq('id', node_id)
        .eq('thread_id', thread_id)
        .eq('user_id', user.id)
        .select();

    if (setError) {
        console.error('Error setting is_head', setError);
        return { error: 'Failed to set new thread head.' };
    }

    return { data };
}
