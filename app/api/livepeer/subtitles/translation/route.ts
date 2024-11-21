// import type { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Methods', 'POST');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   try {
//     const { text, source, target } = req.body;

//     const translateResponse = await fetch('https://dream-gateway.livepeer.cloud/llm', {
//       method: 'POST',
//       body: JSON.stringify({
//         text: `Translate the string literal ${text} from ${source} to ${target}. Only provide the exact translation, no additional text is required.`,
//         source: source,
//         target: target
//       }),
//       headers: { 
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.LIVEPEER_API_KEY}`
//       }
//     });

//     if (!translateResponse.ok) {
//       console.error(translateResponse);
//       throw new Error(`HTTP error! status: ${translateResponse.status}`);
//     }
//     const data = await translateResponse.json();
//     res.status(200).json({
//       success: true,
//       response: data.response.replace('assistant\n\n', '')
//     });
//   } catch (error: any) {
//     console.error('Translation error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: error.message || 'Translation failed' 
//     });
//   }
// }

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: '10mb',
//     },
//   },
// }

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    console.log('Request body:', body);
    const { text, source, target } = body;
    console.log('Text:', text);
    console.log('Source:', source);
    console.log('Target:', target);

    // Validate required fields
    // if (!text || !source || !target) {
    //   return NextResponse.json({ 
    //     success: false, 
    //     message: 'Missing required fields' 
    //   }, { 
    //     status: 400,
    //   });
    // }

    const formData = new FormData();
    formData.append('text', `Translate '${text}' from ${source} to ${target}. Do not include any other words than the exact, grammatically correct translation.`);
    formData.append('model_id', 'meta-llama/Meta-Llama-3.1-8B-Instruct');
    formData.append('max_tokens', '256');

    console.log('Translation request:', formData);

    // Make translation request
    const translateResponse = await fetch('https://dream-gateway.livepeer.cloud/llm', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${process.env.LIVEPEER_API_KEY}`
      }
    });

    if (!translateResponse.ok) {
      console.error(translateResponse);
      throw new Error(`HTTP error! status: ${translateResponse.status}`);
    }

    const data = await translateResponse.json()
    
    console.log('Translation response:', data);

    return NextResponse.json({
      success: true,
      response: data.response
    }, { 
      status: 200,
    });

  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Translation failed'
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
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

// Next.js 13+ App Router doesn't need explicit body parser config
// Size limits are now handled differently