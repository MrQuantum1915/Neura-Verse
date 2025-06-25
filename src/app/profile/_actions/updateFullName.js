'use server'

import { createClient_server } from "@/utils/supabase/supabaseServer"

export async function updateFullName(fullName) {
    console.log('Updating profile with FullName:', fullName);

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
        .from('profiles')
        .update({
            full_name: fullName,
        })
        .eq('user_id', user.id)
        .select();

    // console.log('User ID: ', user.id);
    // console.log('Profile update response:', data, error);

    if (error) {
        console.error('Error updating profile:', error);
        return { error: 'Failed to update profile' };
    }

    return { data };
}