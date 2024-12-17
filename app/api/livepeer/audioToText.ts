'use server';

type AudioToTextParams = {
    formData: FormData;
    modelId?: string;
    returnTimestamps?: string;
};

export const getLivepeerAudioToText = async (
  params: AudioToTextParams,
) => {
    try {
        const file = params.formData.get('audio') as File;

        console.log({ file });

        if (!file) throw new Error('No file uploaded');

        if (!(file.type.startsWith('audio/') || file.type.startsWith('video/'))) {
            throw new Error('File must be an audio or video file');
        }
        
        if (params.modelId) params.formData.append('model_id', params.modelId as string);

        const options = {
            method: 'POST',
            body: params.formData,
            headers: {
                'Authorization': `Bearer ${process.env.LIVEPEER_FULL_API_KEY}`,
                'Accept': 'application/json'
            },
        };

        const formDatas = params.formData.entries();

        for (const [key, value] of formDatas) {
            console.log({ formData: { key, value }});
        }
        
        console.log({ options });

        const res = await fetch(`https://livepeer.studio/api/beta/generate/audio-to-text`, options);

        console.log({ res });

        if (!res.ok) {
            console.error('Livepeer API Error:', {
                status: res.status,
                statusText: res.statusText,
            });
            throw new Error(`API request failed: ${res.status} ${res.statusText}`);
        }

        const contentType = res.headers.get('content-type');

        console.log({ contentType });

        if (!contentType || !contentType.includes('application/json')) {
            const text = await res.text();
            console.error('Unexpected response type:', contentType, text || res.statusText);
            throw new Error('API returned non-JSON response');
        }

        const data = await res.json();

        console.log({ audioToTextResponse: data });

        return data;
    } catch (error: any) {
        console.error('Error generating text from audio:', error);
        throw new Error(error || 'Failed to generate text from audio');
    }
};
