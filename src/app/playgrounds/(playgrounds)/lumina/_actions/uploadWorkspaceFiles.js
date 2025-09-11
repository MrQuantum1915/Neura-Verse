'use server'
import { createClient_server } from "@/utils/supabase/supabaseServer"
import { fetchListOfWorkspaceFiles } from "./fetchListOfWorkspaceFiles";

export async function uploadWorkspaceFiles(formData) {
    const supabase = await createClient_server();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
        console.error('Error fetching user:', userError);
        return { error: 'Failed to fetch user' };
    }
    if (!user) return { error: 'User not authenticated' };

    //upload file
    const files = formData.getAll('files');
    const thread_id = formData.get('thread_id');

    let Globaldata = [];
    for (let i = 0; i < files.length; i++) {
        const path = `${user.id}/${thread_id}/${files[i].name}`;
        const { data, error } = await supabase.storage
            .from('lumina-workspace-files')
            .update(path, files[i], {
                contentType: files[i].type,
                upsert: true
            });
        if (error) {
            console.error(error);
            return { error: 'Failed to upload files' };
        }
        Globaldata.push(data);
    }

    // getting data in format needed by us.
    const { data: listData, error: listError } = await fetchListOfWorkspaceFiles(thread_id)
    if (listError) {
        console.error(listError);
        return { error: 'Failed to fetch updated file list' };
    }
    return { data: listData };
}
