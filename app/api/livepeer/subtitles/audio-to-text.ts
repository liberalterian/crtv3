// pages/api/livepeer/audio-to-text.ts
import { fullLivepeer } from '@app/lib/sdk/livepeer/fullClient';
import { Chunk } from 'livepeer/models/components';
import { GenAudioToTextResponse } from 'livepeer/models/operations';
import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Files } from 'formidable';
import fs from 'fs';

interface TextResponse {
  text: string;
  chunks?: Chunk[];
}

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  const form = new formidable.IncomingForm();
  try {
    form.parse(req, async (err: Error, fields: any, files: Files<string>) => {
      if (err) {
        console.error('Error parsing the files:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Error parsing the files' 
        });
      };

      const file = files.file;
    
      // if (!file) {
      //   return res.status(400).json({ 
      //     success: false, 
      //     message: 'Audio file is required' 
      //   });
      // }

      const buffer = fs.readFileSync((file as any).filepath);

      const blob = new Blob([buffer], { type: 'video/mp4' });
      
      // if (typeof blob == undefined) {
      //   return res.status(400).json({ 
      //     success: false, 
      //     message: 'Audio blob is required' 
      //   });
      // }

      const result: GenAudioToTextResponse = await fullLivepeer.generate.audioToText({
        audio: blob
      });

      if (typeof result == undefined) {
        throw new Error(`HTTP error!`);
      }

      if (typeof result.textResponse == undefined) {
        throw new Error('Text response is undefined');
      }

      const data: TextResponse | undefined  = result.textResponse;

      return res.status(200).json({
        success: true,
        data
      });

    });
  } catch (error) {
    console.error('Error in audio-to-text conversion:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
}