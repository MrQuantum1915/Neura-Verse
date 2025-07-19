'use server'
import { createClient_server } from "@/utils/supabase/supabaseServer"

export async function deleteWorkspaceFile(thread_id, file_name) {
    const supabase = await createClient_server();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
        console.error('Error fetching user:', userError);
        return { error: 'Failed to fetch user' };
    }
    if (!user) return { error: 'User not authenticated' };

    const filePath = `${user.id}/${thread_id}/${file_name}`;
    const { data, error } = await supabase.storage
        .from('lumina-workspace-files')
        .remove([filePath]);

    if (error) {
        return { error: "Failed to delete workspace file" }
    }
    return { data };
}
