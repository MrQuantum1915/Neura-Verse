'use server'
import { createClient_server } from "@/utils/supabase/supabaseServer"

export async function editThreadVisibility(thread_id, is_public) {
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
        .update({ is_public: is_public })
        .eq('thread_id', thread_id)
        .eq('user_id', user.id)
        .select()

    // console.log('User ID: ', user.id);
    // console.log('Profile update response:', data, error);

    if (error) {
        console.error('Error Editing the Visibility of Thread', error);
        return { error: 'Failed to edit Visibility' };
    }

    return { data };
}