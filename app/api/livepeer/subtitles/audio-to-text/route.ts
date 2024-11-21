// // pages/api/livepeer/audio-to-text.ts
// import { fullLivepeer } from '@app/lib/sdk/livepeer/fullClient';
// import { Chunk } from 'livepeer/models/components';
// import { GenAudioToTextResponse } from 'livepeer/models/operations';
// import { NextApiRequest, NextApiResponse } from 'next';
// import formidable, { Files } from 'formidable';
// import fs from 'fs';

// interface TextResponse {
//   text: string;
//   chunks?: Chunk[];
// }

// export default async function handler (
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Methods', 'POST');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//   if (req.method !== 'POST') {
//     return res.status(405).json({ 
//       success: false, 
//       message: 'Method not allowed' 
//     });
//   }

//   const form = new formidable.IncomingForm();
//   try {
//     form.parse(req, async (err: Error, fields: any, files: Files<string>) => {
//       if (err) {
//         console.error('Error parsing the files:', err);
//         return res.status(500).json({ 
//           success: false, 
//           message: 'Error parsing the files' 
//         });
//       };

//       const file = files.file;
    
//       if (!file) {
//         return res.status(400).json({ 
//           success: false, 
//           message: 'Audio file is required' 
//         });
//       }

//       const buffer = fs.readFileSync((file as any).filepath);

//       const blob = new Blob([buffer], { type: 'video/mp4' });
      
//       if (typeof blob == undefined) {
//         return res.status(400).json({ 
//           success: false, 
//           message: 'Audio blob is required' 
//         });
//       }

//       const result: GenAudioToTextResponse = await fullLivepeer.generate.audioToText({
//         audio: blob,
//         modelId: 'openai/whisper-large-v3',
//       });

//       if (typeof result == undefined) {
//         throw new Error(`HTTP error!`);
//       }

//       if (typeof result.textResponse == undefined) {
//         throw new Error('Text response is undefined');
//       }

//       const data: TextResponse | undefined  = result.textResponse;

//       return res.status(200).json({
//         success: true,
//         data
//       });

//     });
//   } catch (error) {
//     console.error('Error in audio-to-text conversion:', error);
//     return res.status(500).json({
//       success: false,
//       message: error instanceof Error ? error.message : 'An unknown error occurred'
//     });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { fullLivepeer } from '@app/lib/sdk/livepeer/fullClient';
import { Chunk } from 'livepeer/models/components';
import { GenAudioToTextResponse } from 'livepeer/models/operations';
// import { parse } from 'formidable';
import fs from 'fs/promises';

interface TextResponse {
  text: string;
  chunks?: Chunk[];
}

export async function POST(req: NextRequest) {

  try {
    const formData = await req.formData();
    const file = formData.get('audio') as File;

    console.log('file', file);

    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'Audio file is required'
      }, { 
        status: 400,
      });
    }

    // Convert File to buffer
    // const arrayBuffer = await file.arrayBuffer();
    // const buffer = Buffer.from(arrayBuffer);

    // Create blob
    const blob = new Blob([file], { type: 'video/mp4' });

    console.log('blob', blob);

    // const audioFormData = new FormData();
    // audioFormData.append('audio', blob);
    // audioFormData.append('model_id', 'openai/whisper-large-v3');

    // const options = {
    //   method: 'POST',
    //   body: audioFormData /*{
    //     audio: blob,
    //     model_id: 'openai/whisper-large-v3',
    //   } */,
    //   headers: {
    //     // 'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.LIVEPEER_API_KEY}`
    //   },
    // }; 
    
    // const res = await fetch('https://dream-gateway.livepeer.cloud/audio-to-text', options);

    // if (!res.ok) {
    //   console.error('res', res);
    //   throw new Error(`HTTP error! status: ${res.status}`);
    // }

    // const result = await res.json();

    // Generate text from audio
    const result: GenAudioToTextResponse = await fullLivepeer.generate.audioToText({
      audio: blob,
      // modelId: 'openai/whisper-large-v3',
    });

    console.log('result', result);
    
    if (!result || !result.textResponse) {
      throw new Error('Failed to generate text from audio');
    }

    const data: TextResponse | undefined = result.textResponse;

    console.log('data', data);

    return NextResponse.json({
      success: true,
      data
    }, { 
      status: 200,
    });

  } catch (error) {
    console.error('Error in audio-to-text conversion:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    }, { 
      status: 500,
    });
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}