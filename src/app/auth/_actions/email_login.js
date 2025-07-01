'use server'
import { createClient_server } from "@/utils/supabase/supabaseServer"

export async function loginWithEmail(formData) {

    const supabase = await createClient_server();

    const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (error) {
        console.log(error);
        return { error: error };
    }
    return { data: data };
}