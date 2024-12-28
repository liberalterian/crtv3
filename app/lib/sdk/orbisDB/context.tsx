import { createContext, ReactNode, useContext, useState } from 'react';
import { client } from '@app/lib/sdk/thirdweb/client';
import { catchError } from "@useorbis/db-sdk/util"
import { OrbisEVMAuth } from "@useorbis/db-sdk/auth";
import {  OrbisConnectResult, OrbisDB } from '@useorbis/db-sdk';
import { AssetMetadata } from './models/AssetMetadata';
import { download } from 'thirdweb/storage';
import { CreatorMeToken, CreatorProfile } from './models/CreatorProfile';

declare global {
  interface Window {
    ethereum: any;
  }
}

interface OrbisContextProps {
    authResult: OrbisConnectResult | null;
    setAuthResult: React.Dispatch<React.SetStateAction<OrbisConnectResult | null>>;
    insert: (modelId: string, value: any) => Promise<void>;
    replace: (docId: string, newDoc: any) => Promise<void>;
    update: (docId: string, updates: any) => Promise<void>;
    select: (modelId: string, where?: any, context?: string) => Promise<any>;
    getAssetMetadata: (assetId: string) => Promise<AssetMetadata | null>;
    getCreatorProfile: (address: string) => Promise<CreatorProfile | null>;
    orbisLogin: (privateKey?: string) => Promise<OrbisConnectResult | null>;
    isConnected: (address: string) => Promise<boolean>;
    getCurrentUser: () => Promise<any>;
}

const OrbisContext = createContext<OrbisContextProps | undefined> ({
    authResult: null,
    setAuthResult: () => {},
    insert: async () => {},
    replace: async () => {},
    update: async () => {},
    select: async () => {},
    getAssetMetadata: async () => {},
    getCreatorProfile: async () => {},
    orbisLogin: async () => {},
    isConnected: async () => false,
    getCurrentUser: async () => {}
} as unknown as OrbisContextProps);

export const OrbisProvider = ({ children }: { children: ReactNode }) => {
  const [authResult, setAuthResult] = useState<OrbisConnectResult | null>(null);

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

  const assetMetadataModelId: string = process.env.NEXT_PUBLIC_ORBIS_ASSET_METADATA_MODEL_ID as string;
  const creatorProfileModelId: string = process.env.NEXT_PUBLIC_ORBIS_CREATOR_PROFILE_MODEL_ID as string;
  const creatorMeTokenModelId: string = process.env.NEXT_PUBLIC_ORBIS_CREATOR_ME_TOKEN_MODEL_ID as string;
  const crtvContextId: string = process.env.NEXT_PUBLIC_ORBIS_CRTV_CONTEXT_ID as string;
  const creatorProfileContextId: string = process.env.NEXT_PUBLIC_ORBIS_CREATOR_PROFILE_ID as string;
  
  const validateDbOperation = (id: string, value?: any, select: boolean = false) => {
    if (!id) throw new Error('No id provided');
    if (!select) {
      if (!value) throw new Error('No value provided');
    }
    if (!assetMetadataModelId) throw new Error('No assetMetadataModelId provided');
    if (!creatorProfileModelId) throw new Error('No creatorProfileModelId provided');
    if (!creatorMeTokenModelId) throw new Error('No creatorProfileModelId provided');
    if (!crtvContextId) throw new Error('No crtvContextId provided');
    if (!creatorProfileContextId) throw new Error('No creatorProfileContextId provided');
    if (!db) throw new Error('No db client found');
  };
  
  const insert = async (modelId: string, value: any, context?: string): Promise<void> => {
    validateDbOperation(modelId, value);

    const insertStatement: any = db
      .insert(modelId)
      .value(value)
      .context(!context ? crtvContextId : context);

    const validation = await insertStatement.validate();

    if (!validation.valid) {
      throw 'Error during validation: ' + validation.error;
    }

    const [result, error] = await catchError(() => insertStatement.run());

    if (error) {
      console.error(error);
      throw error;
    }

    // console.log('result', result);

    console.log('insertStatement runs', insertStatement.runs);
  };

  const replace = async (docId: string, newDoc: any): Promise<void> => {
    console.log('update', { docId, newDoc, db });

    validateDbOperation(docId, newDoc);

    const replaceStatement: any = db
      .update(docId)
      .replace(newDoc)   

    const query = replaceStatement.build();

    console.log('Query that will be run', query);

    const [result, error] = await catchError(() => query.run());

    if (error) {
      console.error(error);
      throw error;
    }

    console.log('result', result);

    console.log(replaceStatement.runs);
  };

  const update = async (docId: string, updates: any): Promise<void> => {
    console.log('update', { docId, updates, db });

    validateDbOperation(docId, updates);

    const updateStatement: any = db
      .update(docId)
      .set(updates)

    const query = updateStatement.build();

    console.log('Query that will be run', query);

    const [result, error] = await catchError(() => query.run());

    if (error) {
      console.error(error);
      throw error;
    }

    console.log('result', result);

    console.log(updateStatement.runs);
  };

  const select = async (modelId: string, where?: any, context?: string): Promise<any> => {
    validateDbOperation(modelId, true);

    const selectStatement = db
      .select()
      .from(modelId)
      .where(where)
      .context(!context ? crtvContextId : context);

    const [result, error] = await catchError(() => selectStatement.run());

    if (error) {
      console.log('selectStatement runs', selectStatement.runs);
      console.error(error);
      throw error;
    }

    const { rows } = result;

    const value = rows[0];

    console.log({ value });

    return value;
  }

  const getAssetMetadata = async (assetId: string): Promise<AssetMetadata> => {
    validateDbOperation(assetId, true);

    const selectStatement = db
      .select()
      .from(assetMetadataModelId)
      .where({
        assetId,
      })
      .context(crtvContextId);

    const [result, error] = await catchError(() => selectStatement.run());

    if (error) {
      console.log('selectStatement runs', selectStatement.runs);
      console.error(error);
      throw error;
    }

    const { columns, rows } = result;

    const assetMetadata = rows[0] as AssetMetadata;
    
    if (assetMetadata?.subtitlesUri) {
      try {
        const res = await download({
          client,
          uri: assetMetadata.subtitlesUri
        });
        const data = await res.json()
        assetMetadata.subtitles = data;
      } catch (error) {
        console.error('Failed to download subtitles', { 
          uri: assetMetadata.subtitlesUri, 
          error 
        });
      }
    };

    return assetMetadata;
  };

  const getCreatorProfile = async (address: string): Promise<CreatorProfile> => {
    validateDbOperation(address, true);

    const profileSelectStatement = db
      .select()
      .from(creatorProfileModelId)
      .where({ address })
      .context(crtvContextId);

    const [result, error] = await catchError(() => profileSelectStatement.run());

    if (error) {
      console.log('profileSelectStatement runs', profileSelectStatement.runs);
      console.error(error);
      throw error;
    }

    const meTokenSelectStatement = db
      .select()
      .from(creatorMeTokenModelId)
      .where({ creatorAddress: address })
      .context(crtvContextId);

    const [meTokenResult, meTokenError] = await catchError(() => meTokenSelectStatement.run());

    if (meTokenError) {
      console.log('meTokenSelectStatement runs', meTokenSelectStatement.runs);
      console.error(meTokenError);
      throw meTokenError;
    }  

    const creatorProfile: CreatorProfile = {
      address,
      ...result.rows[0],
      meToken: meTokenResult?.rows[0] as CreatorMeToken
    };

    return creatorProfile;
  }

  const orbisLogin = async (privateKey?: string): Promise<OrbisConnectResult> => {
    
    let provider; 

    if (typeof window !== 'undefined' && window.ethereum) {
      provider = window.ethereum;
    } else {
      throw new Error('No Ethereum provider found. Please install MetaMask or another Web3 wallet.');
    }

    const auth = new OrbisEVMAuth(provider);

    const authResult: OrbisConnectResult = await db.connectUser({ auth });

    const connected = await db.isUserConnected()

    if (!connected) {
      throw new Error('User is not connected.');
    }

    return authResult;
  };

  const isConnected = async (address: string = ''): Promise<boolean> => {
    let connected;

    if (address !== '') {
      connected = await db.isUserConnected(address);
    } else {
      connected = await db.isUserConnected();
    }

    return connected;
  };

  const getCurrentUser = async (): Promise<any> => {
    const currentUser = await db.getConnectedUser();

    if (!currentUser) {
      throw new Error('No active user session. Please connect your wallet and sign in first.');

    }

    return currentUser;
  };

  return (
      <OrbisContext.Provider value={{ 
          authResult,
          setAuthResult,
          insert,
          replace,
          update,
          select,
          getAssetMetadata,
          getCreatorProfile,
          orbisLogin,
          isConnected,
          getCurrentUser
      }}>
          {children}
      </OrbisContext.Provider>
  );
};

export const useOrbisContext = () => {
  const context = useContext(OrbisContext);
  if (context === undefined) {
    throw new Error('useOrbisContext must be used within a OrbisProvider');
  }
  return context;
};
