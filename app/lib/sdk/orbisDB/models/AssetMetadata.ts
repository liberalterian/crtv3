import { ModelDefinition } from '@ceramicnetwork/stream-model';
import { Asset } from 'livepeer/models/components';
import { TVideoMetaForm } from '@app/components/Videos/Upload/Create-info';

export type AssetMetadata = {
  assetId?: string;
  playbackId?: string;
  title: string;
  description: string;
  location?: string;
  category?: string;
  tokenGated?: boolean;
  tokenId?: string;
  tokenContractAddress?: string;
  thumbnailUri?: string;
  subtitlesUri?: string;
  subtitles?: Subtitles;
};

export type Subtitles = Record<string, Chunk[]>;

export type Chunk = {
  text: string;
  timestamp: Array<number>;
};

export const createAssetMetadata = (
  livepeerAsset: Asset,
  metadata: TVideoMetaForm,
  thumbnailUri?: string,
  subtitlesUri?: string,
  tokenGated?: boolean,
  tokenId?: string,
  tokenContractAddress?: string,
): AssetMetadata => {
  if (
    !livepeerAsset.id ||
    !livepeerAsset.playbackId ||
    !metadata.title ||
    !metadata.description
  ) {
    throw new Error('Missing required asset metadata fields');
  }

  return {
    assetId: livepeerAsset.id,
    playbackId: livepeerAsset.playbackId,
    title: metadata.title,
    description: metadata.description,
    ...(metadata.location && { location: metadata.location }),
    ...(tokenGated && { tokenGated }),
    ...(tokenId && { tokenId }),
    ...(tokenContractAddress && { tokenContractAddress }),
    ...(metadata.category && { category: metadata.category }),
    ...(thumbnailUri && { thumbnailUri }),
    ...(subtitlesUri && { subtitlesUri }),
  };
};

export const AssetMetadataDef: ModelDefinition = {
  "name": 'CRTVAssetMetadata',
  "version": '2.0',
  "interface": false,
  "immutableFields": [],
  "implements": [],
  "accountRelation": {
    "type": 'list',
  },
  "schema": {
    "type": 'object',
    "$schema": 'https://json-schema.org/draft/2020-12/schema',
    "properties": {
      "assetId": {
        "type": 'string',
      },
      "playbackId": {
        "type": 'string',
      },
      "title": {
        "type": 'string',
      },
      "description": {
        "type": 'string',
      },
      "location": {
        "type": 'string',
      },
      "category": {
        "type": 'string',
      },
      "tokenGated": {
        "type": 'boolean',
      },
      "tokeId": {
        "type": 'string',
      },
      "tokenContractAddress": {
        "type": 'string',
      },
      "thumbnailUri": {
        "type": 'string',
      },
      "subtitlesUri": {
        "type": 'string',
      },
    },
    "additionalProperties": false,
  },
};
