'use server'
import { createClient_server } from "@/utils/supabase/supabaseServer"

export async function deleteMessage(thread_id, nodeId) {
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

    const { data: deletedata, error: deleteerror } = await supabase
        .from('lumina')
        .delete()
        .eq('thread_id', thread_id)
        .eq('id', nodeId)
        .eq('user_id', user.id)
        .select();

    // console.log('User ID: ', user.id);
    // console.log('Profile update response:', data, error);

    if(deleteerror && deleteerror.code==='23503'){
        console.error('Foreign key constraint error:', deleteerror);
        return { error: 'Cannot delete node having child nodes' };
    }
    if (  deleteerror) {
        console.error('Error Deleting Message', deleteerror);
        return { error: 'Failed to Delete Message' };
    }

    return { deletedata };
}