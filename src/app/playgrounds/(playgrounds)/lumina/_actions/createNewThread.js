'use server'
import { createClient_server } from "@/utils/supabase/supabaseServer"

export async function createNewThread(userPrompt) {
    const supabase = await createClient_server();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
        console.error('Error fetching user:', userError);
        return { error: 'Failed to fetch user' };
    }
    if (!user) return { error: 'User not authenticated' };

    const { data, error } = await supabase
        .from('lumina')
        .insert({
            thread_name: userPrompt,
            role: "user",
            content: userPrompt,
        })
        .eq('user_id', user.id)
        .select();

    if (error) {
        console.error('Second insert failed:', insertError2);
        return { error: 'Failed to add AI response' };
    }

    return { data };
}
