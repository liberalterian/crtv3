import { ModelDefinition } from '@ceramicnetwork/stream-model';

export type CreatorProfile = {
    address: string;
    did?: string;
    name?: string;
    username?: string;
    email?: string;
    bio?: string;
    avatarUri?: string;
    meToken?: CreatorMeToken
}

export type CreatorMeToken = {
    name: string;
    symbol: string;
    contractAddress: string;
    creatorAddress?: string;
}

export const CRTVCreatorProfileModelDef: ModelDefinition = {
    "name": "CRTVCreatorProfile",
    "version": "2.0",
    "interface": false,
    "immutableFields": [],
    "implements": [],
    "accountRelation": {
        "type": "single"
    },
        "schema": {
        "type": "object",
        "$defs": {
            "DID": {
                "type": "string",
                "title": "DID",
                "pattern": "^did:[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+:[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]*:?[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]*:?[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]*$",
                "maxLength": 100
            }
        },
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "properties": {
            "address": {
                "type": "string"
            },
            "did": {
                "$ref": "#/$defs/DID"
            },
            "name": {
                "type": "string"
            },
            "username": {
                "type": "string"
            },
            "email": {
                "type": "string"
            },
            "bio": {
                "type": "string"
            },
            "avatarUri": {
                "type": "string"
            }
        },
        "additionalProperties": false
    }
}