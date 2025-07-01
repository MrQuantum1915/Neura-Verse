'use server'
import { createClient_server } from "@/utils/supabase/supabaseServer"
import { redirect } from "next/navigation";

export async function oAuth(providerID) {
    const supabase = await createClient_server();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: providerID,
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/oAuthCallback`,
        },
    })

    if (data.url) {
        return redirect(data.url);
    }
    else {
        console.error('Error during OAuth login:', error);
        return redirect("/auth/error");
    }
}
// gotcha explain how it worked out.

// first i had misunderstanding that oAuth can't be handles from server.
// like [we can't use server actions to handle OAuth because Server actions ('use server') run on the server and cannot open a browser window or redirect the user. OAuth requires the user to be redirected to the provider (Google, etc.) and then back to your app.]
// however in the supabase docs there's a way written to handle this server side.

// So this is it :
// the client clicks on the button, then this server action is called on the server by internal nextjs framework (via an HTTP request, not just a "guess"), then this action provides a URL. now we use next/navigation to redirect the "browser" to that url. This is done by nextjs which gives the redirect URL to the browser as a response from the server, and the browser nextjs code performs the redirect to that link. This URL is the provider's login page.
// After authentication, the provider sends back some code, and the provider redirects the request to the endpoint we specified as the callback function/action, which is on the server itself. This server side action handles the code exchange and session setup; Supabase manages the cookie data, which is set automatically by the server and sent to the client browser via HTTP response headers, not via client-side Supabase code setting cookies manually