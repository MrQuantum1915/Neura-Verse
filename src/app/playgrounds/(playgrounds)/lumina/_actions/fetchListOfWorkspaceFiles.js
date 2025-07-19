'use server'
import { createClient_server } from "@/utils/supabase/supabaseServer"

export async function fetchListOfWorkspaceFiles(thread_id) {
    const supabase = await createClient_server();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
        console.error('Error fetching user:', userError);
        return { error: 'Failed to fetch user' };
    }
    if (!user) return { error: 'User not authenticated' };

    const { data, error } = await supabase.storage
        .from('lumina-workspace-files')
        .list(`${user.id}/${thread_id}`);

    let finalData = [];
    for (let i = 0; i < data.length; i++) {
        finalData.push({
            name: data[i].name,
            id: data[i].id,
            created_at: data[i].created_at,
            updated_at: data[i].updated_at,
            mimeType: data[i].metadata.mimetype,
            size: data[i].metadata.size,
        })
    }

    if (error) {
        return { error: "Failed to fetch workspace data" }
    }
    return { data: finalData };
}
