'use server'
import { createClient_server } from "@/utils/supabase/supabaseServer"

export async function getSignedURLsOfWorkspaceFiles(thread_id,filenames) {
    const supabase = await createClient_server();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
        console.error('Error fetching user:', userError);
        return { error: 'Failed to fetch user' };
    }
    if (!user) return { error: 'User not authenticated' };

    const filepaths = filenames.map(filename => `${user.id}/${thread_id}/${filename}`);
    
    const { data, error } = await supabase.storage
        .from('lumina-workspace-files')
        .createSignedUrls(filepaths, 120);
        
    if (error) {
        return { error: "Failed to fetch workspace data" }
    }

    // console.log('Signed URLs:', data);
    return { data };
}
