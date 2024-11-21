import { NextRequest, NextResponse } from 'next/server';
import { fullLivepeer } from '@app/lib/sdk/livepeer/fullClient';
import { Chunk } from 'livepeer/models/components';
import { GenAudioToTextResponse } from 'livepeer/models/operations';
import { SubtitleResponse } from '@app/lib/types';

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

    const blob = new Blob([file], { type: 'video/mp4' });

    console.log('blob', blob);

    const result: GenAudioToTextResponse = await fullLivepeer.generate.audioToText({
      audio: blob,
    });

    console.log('result', result);
    
    if (!result || !result.textResponse) {
      throw new Error('Failed to generate text from audio');
    }

    const data: SubtitleResponse | undefined = result.textResponse;

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