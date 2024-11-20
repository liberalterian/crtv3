import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { text, source, target } = req.body;

    const translateResponse = await fetch('https://dream-gateway.livepeer.cloud/llm', {
      method: 'POST',
      body: JSON.stringify({
        text: `Translate the string literal ${text} from ${source} to ${target}. Only provide the exact translation, no additional text is required.`,
        source: source,
        target: target
      }),
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LIVEPEER_API_KEY}`
      }
    });

    if (!translateResponse.ok) {
      console.error(translateResponse);
      throw new Error(`HTTP error! status: ${translateResponse.status}`);
    }
    const data = await translateResponse.json();
    res.status(200).json({
      success: true,
      response: data.response.replace('assistant\n\n', '')
    });
  } catch (error: any) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Translation failed' 
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}