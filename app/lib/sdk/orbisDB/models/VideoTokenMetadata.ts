import { ModelDefinition } from '@ceramicnetwork/stream-model';

export type VideoTokenMetadata = {
    assetId: string;
    tokenId: string;
    contractAddress: string;
    creatorAddress: string;
    name: string;
    description: string;   
    image: string;
    properties?: Record<string, VideoTokenRichProperty | VideoTokenArrayProperty | VideoTokenSimpleProperty>;

}

export type VideoTokenRichProperty = {
    propertyId: string;
    tokenId: string;
    name: string;
    display_value: string;
    class: string;
    cass: Record<string, string>
}

export type VideoTokenCssProperty = {
    propertyId: string;
    attr: string;
    value: any;
}

export type VideoTokenArrayProperty = {
    propertyId: string;
    tokenId: string;
    name: string;
    value: VideoTokenArrayPropertyItem[];
}

export type VideoTokenArrayPropertyItem = {
    propertyId: string;
    tokenId: string;
    value: any;
}

export type VideoTokenSimpleProperty = {
    propertyId: string;
    tokenId: string;
    [key: string]: string;
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

export const videoTokenRichPropertyModelDef: ModelDefinition = {
  "name": "CRTVVideoTokenRichProperty",
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
        "propertyId": {
            "type": "string"
        },
        "tokenId": {
            "type": "string"
        },
        "name": {
            "type": "string"
        },
        "value": {
            "type": "string"
        },
        "display_value": {
            "type": "string"
        },
        "class": {
            "type": "string"
        }
    },
    "additionalProperties": false
  }
};

export const modelDefinition: ModelDefinition = {
    "name": "CRTVVideoTokenCSSProperty",
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
        "propertyId": {
            "type": "string"
        },
        "key": {
            "type": "string"
        },
        "value": {
            "type": "string"
        }
        },
        "additionalProperties": false
    }
};

export const videoTokenArrayPropertyModelDef: ModelDefinition = {
    "name": "CRTVVideoTokenArrayProperty",
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
        "propertyId": {
          "type": "string"
        },
        "tokenId": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "class": {
          "type": "string"
        }
      },
      "additionalProperties": false
    }
};

export const videoTokenArrayPropertyItemModelDef: ModelDefinition = {
    "name": "CRTVVideoTokenArrayPropertyItem",
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
        "propertyId": {
          "type": "string"
        },
        "value": {
          "type": "string"
        }
      },
      "additionalProperties": false
    }
};

export const videoTokenSimplePropertyModelDef: ModelDefinition = {
    "name": "CRTVVideoTokenSimpleProperty",
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
        "propertyId": {
            "type": "string"
        },
        "tokenId": {
            "type": "string"
        },
        "key": {
            "type": "string"
        },
        "value": {
            "type": "string"
        }
        },
        "additionalProperties": false
    }
};
