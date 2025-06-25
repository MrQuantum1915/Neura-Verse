'use server'
import { createClient_server } from "@/utils/supabase/supabaseServer";

export async function updateImage(formData) {

    const ext = formData.get('profile_pic').name.split('.').pop();

    if (formData.get('profile_pic').size > 1 * 1024 * 1024) { // 1MB limit
        return { error: 'File size exceeds 1MB limit' };
    }
    const supabase = await createClient_server();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser(); // here we are using this just to authenticate the user and also use userid for image file naming

    if (userError) {
        console.error('Error fetching user:', userError);
        return { error: 'Failed to fetch user' };
    }

    if (!user) {
        return { error: 'User not authenticated' };
    }

    //upload file
    const { data, error: uploadError } = await supabase.storage
        .from('users-profile-pics')
        .upload(`${user.id}_profile_picture.${ext}`, formData.get('profile_pic'), // upload('file_path', file)
            {
                contentType: 'image/*',
                upsert: true, // overwrite if file already exists
            })


    if (uploadError) {
        console.error('Error uploading profile picture:', uploadError);
        return { error: 'Failed to upload profile picture' };
    }

    // get public url
    const { data: urlData, error: urlError } = supabase.storage
        .from('users-profile-pics')
        .getPublicUrl(`${user.id}_profile_picture.${ext}`);

    // console.log('Public URL:', publicURL);

    // update profile with public URL
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({
            profile_pic: urlData.publicUrl,
        })
        .eq('user_id', user.id)
        .select();

    if (urlError) {
        console.error('Error getting public URL:', urlError);
        return { error: 'Failed to get public URL' };
    }

    // console.log('User ID: ', user.id);
    // console.log('Profile update response:', data, error);

    return { publicUrl: urlData.publicUrl };
}