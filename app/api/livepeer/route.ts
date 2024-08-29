'use server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const livepeerUrl = 'https://livepeer.studio/api/asset';
  const headers = {
    Authorization: `Bearer ${process.env.LIVEPEER_FULL_API_KEY}`,
  };
  const options = { headers };
  const response = await fetch(livepeerUrl, options);
  const json = await response.json();
  return NextResponse.json(json);
}
