// 'use server';

import { NextResponse } from 'next/server';

import { OrbisDB } from '@useorbis/db-sdk';
import { catchError } from '@useorbis/db-sdk/util';

import { v4 as uuidv4 } from 'uuid';

import { VideoTokenArrayProperty, VideoTokenMetadata, VideoTokenRichProperty, VideoTokenSimpleProperty } from '@app/lib/sdk/orbisDB/models/VideoTokenMetadata';

const ceramicNodeUrl = process.env.NEXT_PUBLIC_CERAMIC_NODE_URL as string;
const orbisNodeUrl = process.env.NEXT_PUBLIC_ORBIS_NODE_URL as string;
const orbisEnvironmentId = process.env.NEXT_PUBLIC_ORBIS_ENVIRONMENT_ID as string;

if (!ceramicNodeUrl) {
    throw new Error('CERAMIC_NODE_URL environment variable is required');
}
if (!orbisNodeUrl) {
    throw new Error('ORBIS_NODE_URL environment variable is required');
}
if (!orbisEnvironmentId) {
    throw new Error('ORBIS_ENVIRONMENT_ID environment variable is required');
}

const db = new OrbisDB({
    ceramic: {
        gateway: ceramicNodeUrl,
    },
    nodes: [
        {
            gateway: orbisNodeUrl,
            env: orbisEnvironmentId,
        },
    ],
});

const tokenMetadataModelId = process.env.NEXT_PUBLIC_ORBIS_VIDEO_TOKEN_METADATA_MODEL_ID as string;
const videoTokenSimplePropertyModelId = process.env.NEXT_PUBLIC_ORBIS_VIDEO_TOKEN_SIMPLE_PROPERTY_MODEL_ID as string;
const crtvVideoTokenMetadataContext = process.env.NEXT_PUBLIC_ORBIS_CRTV_VIDEO_TOKEN_METADATA_CONTEXT_ID as string;

if (!tokenMetadataModelId) {
    throw new Error('NEXT_PUBLIC_CRTV_VIDEO_TOKEN_METADATA_MODEL_ID environment variable is required')
}
if (!videoTokenSimplePropertyModelId) {
    throw new Error('NEXT_PUBLIC_CRTV_VIDEO_TOKEN_SIMPLE_PROPERTY_MODEL_ID environment variable is required')
}
if (!crtvVideoTokenMetadataContext) {
    throw new Error('NEXT_PUBLIC_CRTV_VIDEO_TOKEN_METADATA_CONTEXT_ID environment variable is required')
}

export async function GET(request: Request) {
  try {
    const body = await request.json();

    const selectStatement = db
        .select(body.fields && body.fields)
        .from(tokenMetadataModelId)
        .where({ assetId: body.assetId })
        // .join() // TODO: implement join for GET /token-metadata 
        .context(crtvVideoTokenMetadataContext);

    const [result, error] = await catchError(() => selectStatement.run());
    
    if (error) {
        console.log('selectStatement runs', selectStatement.runs);
        console.error(error);
        throw error;
    }

    const { columns, rows } = result;

    let tokenMetadata: VideoTokenMetadata;

    tokenMetadata = rows[0] as VideoTokenMetadata;

    return NextResponse.json(
        {
            success: true,
            body: tokenMetadata
        },
        {
            status: 200
        }
    );
  } catch (error) {
    return NextResponse.json(
        { 
            error: 'Failed to fetch video token metadata' 
        }, 
        { 
            status: 500, 
            statusText: `Error fetching video token metadata: ${error}` 
        }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();


    console.log(`POST /token-metadata: insert -> ${body.tokenMetadata.id}`);

    const insertTokenMetadataStatement  = db
        .insert(tokenMetadataModelId)
        .value(body.tokenMetadata)
        .context(crtvVideoTokenMetadataContext);

    const [result, error] = await catchError(() => insertTokenMetadataStatement.run());

    let tokenMetadata = result as unknown as VideoTokenMetadata;

    console.log('insert metadata result: ', { tokenMetadata });

    if (error) {
        console.log('insertTokenMetadataStatement runs', insertTokenMetadataStatement.runs);
        console.error(error);
        throw error;
    }

    let properties: Record<string, VideoTokenSimpleProperty | VideoTokenArrayProperty | VideoTokenRichProperty> = {};

    for (const [key, value] of Object.entries(body.tokenMetadata.properties)) {
        console.log(`POST /token-metadata: insert property -> ${key}: ${value} for tokenId ${body.tokenMetadata.id} `);

        const property = {
            // propertyId: uuidv4(),
            tokenId: body.tokenMetadata.id,
            key,
            value
        };

        console.log({ property });
        
        const insertPropertyStatement = db
            .insert(videoTokenSimplePropertyModelId)
            .value(property)
            .context(crtvVideoTokenMetadataContext);

        const [result, error] = await catchError(() => insertPropertyStatement.run());

        if (error) {
            console.log('insertPropertyStatement runs', insertPropertyStatement.runs);
            console.error(error);
            throw error;
        }

        console.log('insert property result: ', { result });
        
        Object.assign(properties, { [key]: value } as Record<string, VideoTokenSimpleProperty>);

        console.log({ properties });
    }   

    tokenMetadata.properties = {};
    Object.assign(tokenMetadata.properties, properties);

    console.log('final result: ', { tokenMetadata });

    return NextResponse.json(
        {
            success: true,
            body: tokenMetadata
        },
        {
            status: 200
        }
    );
  } catch (error) {
    return NextResponse.json(
        { 
            error: 'Failed to create video token metadata' 
        }, 
        { 
            status: 500, 
            statusText: `Error creating video token metadata: ${error}` 
        }
    );
  }
}
