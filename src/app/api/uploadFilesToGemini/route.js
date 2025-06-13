import { GoogleGenAI } from "@google/genai";

const myApiKey = process.env.Gemini_API_Key;

const ai = new GoogleGenAI({ apiKey: myApiKey });

export async function POST(request) {
    try {

        const formData = await request.formData();

        const clientFiles = formData.getAll('file');
        // here use getAll instead of get to get an array of elements having the same key 'file'
        for (const item of clientFiles) {
            console.log(item, item?.name);
            // ...
        }

        const uploadedFiles_Metadata = [];

        for (const item of clientFiles) {
            let ext = item.name.split('.').pop();

            const uploadResult = await ai.files.upload({
                file: item,
                config: { mimeType: item.type }
            });

            uploadedFiles_Metadata.push({ fileName: item.name, fileURI: uploadResult.uri, mimeType: uploadResult.mimeType });
        }
        return Response.json(uploadedFiles_Metadata);
    } catch (error) {
        console.error("Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

