'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaExclamationTriangle } from 'react-icons/fa';

import { nextTokenIdToMint, updateMetadata } from "thirdweb/extensions/erc1155";
import { lazyMint } from "thirdweb/extensions/erc1155";
import { sendTransaction } from "thirdweb";

import { toast } from 'sonner';
import { useActiveAccount } from 'thirdweb/react';
import { Asset } from 'livepeer/models/components';

import {
  StepperFormValues,
} from '@app/types/hook-stepper';
import { client } from '@app/lib/sdk/thirdweb/client';
import { useOrbisContext } from '@app/lib/sdk/orbisDB/context';
import { hasAccess } from '@app/api/auth/thirdweb/gateCondition';
import StepperIndicator from '@app/components/Stepper-Indicator';
import { authedOnly } from '@app/api/auth/thirdweb/authentication';
import FileUpload from '@app/components/Videos/Upload/FileUpload';
import CreateInfo from '@app/components/Videos/Upload/Create-info';
import CreateThumbnail from '@app/components/Videos/Upload/Create-thumbnail';
import { Alert, AlertDescription, AlertTitle } from '@app/components/ui/alert';
import type { TVideoMetaForm } from '@app/components/Videos/Upload/Create-info';
import { VIDEO_TOKEN_ABI, VIDEO_TOKEN_ADDRESS } from '@app/lib/utils/context';
import {
  AssetMetadata,
  createAssetMetadata,
} from '@app/lib/sdk/orbisDB/models/AssetMetadata';
import { VideoTokenMetadata } from '@app/lib/sdk/orbisDB/models/VideoTokenMetadata';
import { getContract } from 'thirdweb';
import { base } from 'thirdweb/chains';

const contract = getContract({
  client,
  chain: base,
  address: VIDEO_TOKEN_ADDRESS, 
  abi: VIDEO_TOKEN_ABI
});

const HookMultiStepForm = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [erroredInputName, setErroredInputName] = useState('');

  const methods = useForm<StepperFormValues>({
    mode: 'onTouched',
  });

  const [metadata, setMetadata] = useState<TVideoMetaForm>();
  const [livepeerAsset, setLivepeerAsset] = useState<Asset>();
  const [subtitlesUri, setSubtitlesUri] = useState<string>();
  const [thumbnailUri, setThumbnailUri] = useState<string>();

  const [tokenGateVideo, setTokenGateVideo] = useState<boolean>(false);
  const [tokenId, setTokenId] = useState<string>('');

  const { insert, isConnected } = useOrbisContext();

  const activeAccount = useActiveAccount();

  const router = useRouter();

  useEffect(() => {
    const tokenGate = async (address: string) => {
      try {
        const [isAuthed, hasUserAccess, isUserConnected] = await Promise.all([
          authedOnly(),
          hasAccess(address),
          isConnected(address),
        ]);

        if (!isAuthed || !hasUserAccess || !isUserConnected) {
          toast.error(
            'Access denied. Please ensure you are connected and have an active Creator Pass in your wallet.',
          );
          router.push('/');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        toast.error('Failed to verify access. Please try again.');
        router.push('/');
      }
    };
    if (!activeAccount?.address) {
      toast.error('Please connect your wallet');
      router.push('/');
      return;
    }
    tokenGate(activeAccount.address);
  }, [activeAccount, isConnected, router]);

  const {
    trigger,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = methods;

  // focus errored input on submit
  useEffect(() => {
    const erroredInputElement =
      document.getElementsByName(erroredInputName)?.[0];
    if (erroredInputElement instanceof HTMLInputElement) {
      erroredInputElement.focus();
      setErroredInputName('');
    }
  }, [erroredInputName]);

  const handleCreateInfoSubmit = async (data: TVideoMetaForm) => {
    console.log('handleCreateInfoSubmit(): ', { data });

    setMetadata(data);
    setTokenGateVideo(data.tokenGateVideo);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

    if (data.tokenGateVideo) {
      const id = (await nextTokenIdToMint({ contract })).toString();
      setTokenId(id);

      console.log({ tokenId: id });

      const tokenMetadata: VideoTokenMetadata = {
        tokenId: id,
        name: data.title,
        description: data.description,
        properties: {
          location: data?.location || '',
          category: data?.category || '',
          creatorAddress: activeAccount?.address!,
        }
      }

      console.log({ tokenMetadata });

      const transaction = lazyMint({
        contract,
        nfts: [
          tokenMetadata
        ],
      });
      
      console.log({ transaction });

      const result = await sendTransaction({ transaction, account: activeAccount! });

      console.log({ result });
    }
  }

  return (
    <>
      <StepperIndicator activeStep={activeStep} />
      {errors.root?.formError && (
        <Alert variant="destructive" className="mt-[28px]">
          <FaExclamationTriangle className="h-4 w-4" />
          <AlertTitle>Form Error</AlertTitle>
          <AlertDescription>{errors.root?.formError?.message}</AlertDescription>
        </Alert>
      )}
      <div className={activeStep === 1 ? 'block' : 'hidden'}>
        <CreateInfo
          onPressNext={handleCreateInfoSubmit}
        />
      </div>
      <div className={activeStep === 2 ? 'block' : 'hidden'}>
        <FileUpload
          newAssetTitle={metadata?.title}
          metadata={metadata}
          tokenId={tokenId}
          tokenGateVideo={tokenGateVideo}
          onFileSelect={(file) => {}}
          onFileUploaded={(videoUrl: string) => {}}
          onSubtitlesUploaded={(subtitlesUri?: string) => {
            setSubtitlesUri(subtitlesUri);
          }}
          onPressBack={() =>
            setActiveStep((prevActiveStep) => prevActiveStep - 1)
          }
          onPressNext={(livepeerAsset: any) => {
            setLivepeerAsset(livepeerAsset);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
          }}
        />
      </div>
      <div className={activeStep === 3 ? 'block' : 'hidden'}>
        <CreateThumbnail
          livePeerAssetId={livepeerAsset?.id}
          thumbnailUri={thumbnailUri}
          onComplete={async (data) => {
            console.log('onComplete() -> ', { data });
            
            setThumbnailUri(data.thumbnailUri);
            
            if (!livepeerAsset || !metadata) {
              throw new Error(
                'Error saving assetMetadata: Missing asset metadata',
              );
            }
            
            const assetMetadata: AssetMetadata = createAssetMetadata(
              livepeerAsset,
              activeAccount?.address!,
              metadata,
              data.thumbnailUri,
              subtitlesUri,
              tokenGateVideo ? tokenGateVideo : undefined,
              tokenId ? tokenId : undefined,
              tokenGateVideo ? VIDEO_TOKEN_ADDRESS : undefined
            );
            
            await insert(
              process.env.NEXT_PUBLIC_ORBIS_ASSET_METADATA_MODEL_ID as string,
              assetMetadata,
            );

            console.log({ tokenGateVideo });

            if (tokenGateVideo) {
              const tokenMetadata: VideoTokenMetadata = {
                tokenId: tokenId,
                name: metadata!.title,
                description: metadata!.description,
                image: data.thumbnailUri,
                properties: {
                  location: metadata?.location || '',
                  category: metadata?.category || '',
                  creatorAddress: activeAccount?.address!,
                  assetId: livepeerAsset.id,
                  playackUrl: livepeerAsset.playbackUrl || '',
                  subtitlesUri: subtitlesUri || '' ,
                }
              }

              const transaction = updateMetadata({ 
                contract, 
                targetTokenId: BigInt(tokenId), 
                newMetadata: tokenMetadata 
              });

              console.log({ tokenMetadata, transaction });

              const result = await sendTransaction({ transaction, account: activeAccount! });

              console.log({ result });
            }
          }}
        />
      </div>
    </>
  );
};

export default HookMultiStepForm;
