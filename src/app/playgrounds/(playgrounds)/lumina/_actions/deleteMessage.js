'use server'
import { createClient_server } from "@/utils/supabase/supabaseServer"

export async function deleteMessage(thread_id, index) {
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
        .select('created_at')
        .eq('thread_id', thread_id)
        .eq('user_id', user.id)
        .order('created_at') // just-optional-to ensure consistent ordering

    const timeStamp = data[index].created_at;

    const { deletedata, deleteerror } = await supabase
        .from('lumina')
        .delete()
        .eq('user_id', user.id)
        .eq('thread_id', thread_id)
        .eq('created_at', timeStamp)
        .select()

    // console.log('User ID: ', user.id);
    // console.log('Profile update response:', data, error);

    if (error || deleteerror) {
        console.error('Error Deleting Message', error);
        return { error: 'Failed to Delete Message' };
    }

    return { deletedata };
}