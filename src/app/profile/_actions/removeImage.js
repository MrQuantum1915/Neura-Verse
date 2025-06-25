'use server'
import { createClient_server } from "@/utils/supabase/supabaseServer"

export async function removeImage(fullName) {

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

    const { data: removeData, error: removeError } = await supabase
        .storage
        .from('users-profile-pics')
        .remove([`${user.id}_profile_picture.jpg`]); // passing an array of file paths to remove :)

    if (removeError) {
        console.error('Error removing profile picture:', removeError);
        return { error: 'Failed to remove profile picture' };
    }

    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({
            profile_pic: null, // remove the profile picture from the profile
        })
        .eq('user_id', user.id)
        .select();
    if (profileError) {
        console.error('Error updating profile after removing image:', profileError);
        return { error: 'Failed to update profile after removing image' };
    }
    // console.log('User ID: ', user.id);
    // console.log('Profile update response:', data, error);

    return { data: profileData };
}