import { ModelDefinition } from '@ceramicnetwork/stream-model';

export type VideoTokenMetadata = {
    tokenId: string;
    name: string;
    description: string;   
    image?: string;
    properties?: {
        [s: string]: string;
    } 
}

export const videoTokenMetadataModelDef: ModelDefinition = {
    "name": "CRTVVideoTokenMetadata",
    "version": "2.0",
    "interface": false,
    "immutableFields": [],
    "implements": [],
    "accountRelation": {
        "type": "list"
    },
    "schema": {
        "type": "object",
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "properties": {
            "assetId": {
                "type": "string"
            },
            "tokenId": {
                "type": "string"
            },
            "contractAddress": {
                "type": "string"
            },
            "creatorAddress": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "description": {
                "type": "string"
            },
            "image": {
                "type": "string"
            }
        },
        "additionalProperties": false
    }
};
