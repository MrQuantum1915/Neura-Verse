'use server'
import { createClient_server } from "@/utils/supabase/supabaseServer"

export async function signUpNewUser(formData) {

    const supabase = await createClient_server();

    const { data, error } = await supabase.auth.signUp({
        email: formData.get('email'),
        password: formData.get('password'),
        options: {
            emailRedirectTo: process.env.NEXT_PUBLIC_BASE_URL,
        },
    })

    if (error) {
        console.error(error);
        return { error: error };
    }
    return { data: data };
}