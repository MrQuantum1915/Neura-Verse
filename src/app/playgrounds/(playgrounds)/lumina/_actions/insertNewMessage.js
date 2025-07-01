'use server'
import { createClient_server } from "@/utils/supabase/supabaseServer"

export async function insertNewMessage(thread_id, thread_name, message) { // receiving three arguements first is id second is name and third is object having role,content and ai_model entries

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


    //the below operation is expensive because for every message this runs, so i implemented inserting dummy chat in creaetNewThread() function

    // // creating new thread using button inserts a row with role == null and content = null.
    // // and when passing context array of messages in the chat, this element having role=null and content= null creaets problem as it needs some value. 
    // //so here i am checking if last message is NULL , if so delete that row and insert the new one after that operation.

    // const { data: precheckData, error: precheckError } = await supabase
    //     .from('lumina')
    //     .select('role,content,created_at')
    //     .eq('thread_id', thread_id)
    //     .eq('user_id', user.id)
    //     .order('created_at', { ascending: false }); //newest first


    // if (precheckData[0].role === null || precheckData[0] === null) {
    //     const timeStamp = precheckData[0].created_at;
    //     const { data, error } = await supabase
    //         .from('lumina')
    //         .delete()
    //         .eq('thread_id', thread_id)
    //         .eq('created_at', timeStamp)
    //         .eq('user_id', user.id)
    //         .select();
    // }

    const { data, error } = await supabase
        .from('lumina')
        .insert({
            thread_id: thread_id,
            thread_name: thread_name,
            role: message.role,
            content: message.content,
            ai_model: message.ai_model,
        })
        .eq('user_id', user.id)
        .select()

    // const messages = (data)=>{

    // }

    if (error) {
        console.error('Error inserting new message', error);
        console.log({thread_id,thread_name, message})
        return { error: 'Failed saving new Message' };
    }

    return { data };
}