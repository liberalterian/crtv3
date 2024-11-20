import { db } from "../client";

export type AssetMetadata = {
    assetId?: string; // Livepeer Asset ID
    playbackId?: string; // Livepeer Playback ID
    title?: string; 
    description?: string; 
    location?: string; 
    category?: string;
    thumbnailUri?: string; // Thumbnail IPFS URI
    subtitles?: Subtitles;
};

export type Subtitles = Record<string, Chunk[]>

export type Chunk = {
  text: string;
  timestamp: Array<number>;
};


const createAssetMetadataModel = async () => await db.ceramic.createModel({
    "name": "AssetMetadata",
    "version": "2.0",
    "interface": false,
    "immutableFields": [],
    "implements": [],
    "accountRelation": {
        "type": "single"
    },
    "schema": {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "assetId": {
                "type": "string"
            },
            "playbackId": {
                "type": "string"
            },
            "title": {
                "type": "string"
            },
            "description": {
                "type": "string"
            },
            "location": {
                "type": "string"
            },
            "category": {
                "type": "string"
            },
            "thumbnailUri": {
                "type": "string"
            },
            "subtitles": {
                "type": "object",
                "properties": {
                    "additionalProperties": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/Subtitle"
                        }
                    }
                },
                "$defs": {
                    "Subtitle": {
                        "type": "object",
                        "properties": {
                            "text": {
                                "type": "string"
                            },
                            "startTime": {
                                "type": "number"
                            },
                            "endTime": {
                                "type": "number"
                            }
                        }
                    }
                },
                "required": []
            }
        },
        "required": [
            "assetId",
            "title",
            "description",
            "thumbnailUri",
            "subtitles"
        ],
    }
    
});


