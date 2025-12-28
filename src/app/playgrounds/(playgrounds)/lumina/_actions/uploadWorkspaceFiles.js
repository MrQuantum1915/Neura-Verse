'use server'
import { createClient_server } from "@/utils/supabase/supabaseServer"
import { fetchListOfWorkspaceFiles } from "./fetchListOfWorkspaceFiles";
import { GoogleGenAI } from "@google/genai";

const myApiKey = process.env.Gemini_API_Key;

const ai = new GoogleGenAI({ apiKey: myApiKey });


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


    // for (const item of clientFiles) {
    //     console.log(item, item?.name);
    //     // ...
    // }

    const uploadedFiles_Metadata = [];

    for (const item of files) {
        // let ext = item.name.split('.').pop();

        const uploadResult = await ai.files.upload({
            file: item,
            config: { mimeType: item.type }
        });

        uploadedFiles_Metadata.push({ fileName: item.name, fileURI: uploadResult.uri, mimeType: uploadResult.mimeType });
    }

    for (let i = 0; i < uploadedFiles_Metadata.length; i++) {
        await supabase
            .from('workspace')
            .update([
                {
                    user_id: user.id,
                    thread_id: thread_id,
                    file_name: uploadedFiles_Metadata[i].fileName,
                    file_uri: uploadedFiles_Metadata[i].fileURI,
                    mime_type: uploadedFiles_Metadata[i].mimeType
                }
            ]).upsert(true);
    }


    // getting data in format needed by us.
    const { data: listData, error: listError } = await fetchListOfWorkspaceFiles(thread_id)
    if (listError) {
        console.error(listError);
        return { error: 'Failed to fetch updated file list' };
    }
    return { data: listData, uploadedFiles_Metadata: uploadedFiles_Metadata };
}
