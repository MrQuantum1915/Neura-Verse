'use server'

import { createClient_server } from '@/utils/supabase/supabaseServer';
import supabaseAdmin from '@/utils/supabase/supabaseAdmin';

export async function deleteAccountServerAction() {
    // First, use the user-level client to get the current user
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

    
    // Use the admin client for deletion
    console.log(user.id);
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(
        user.id
    );

    if (error) {
        console.error('Error deleting user:', error);
        return { error: 'Failed to delete user' };
    }

    return { data };
}
