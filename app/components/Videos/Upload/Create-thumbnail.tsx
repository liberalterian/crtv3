'use client';
import { useEffect, useState } from 'react';
import { Button } from '@app/components/ui/button';
import { useInterval } from 'react-use';
import { PlayerComponent } from '@app/components/Player/Player';
import { Src } from '@livepeer/react';
import { getSrc } from '@livepeer/react/external';
import {
  getLivepeerAsset,
  getLivepeerPlaybackInfo,
} from '@app/api/livepeer/livepeerActions';
import { Asset, PlaybackInfo } from 'livepeer/models/components';
import { useRouter } from 'next/navigation';
import CreateThumbnailForm from './CreateThumbnailForm';
import { FaSpinner } from 'react-icons/fa';
import { Spinner } from '@chakra-ui/react';
import { upload } from 'thirdweb/storage';

type CreateThumbnailProps = {
  livePeerAssetId: string | undefined;
  thumbnailUri?: string;
  onComplete: (data: { thumbnailUri: string }) => void;
};

export default function CreateThumbnail({
  livePeerAssetId,
  thumbnailUri,
  onComplete,
}: CreateThumbnailProps) {
  const router = useRouter();

  const [progress, setProgress] = useState<number>(0);
  const [livepeerAssetData, setLivepeerAssetData] = useState<Asset>();
  const [livepeerPlaybackData, setLivepeerPlaybackData] = useState<PlaybackInfo>();

  useInterval(
    () => {
      if (livePeerAssetId) {
        getLivepeerAsset(livePeerAssetId)
          .then((data) => {
            console.log(data);
            setLivepeerAssetData(data);
          })
          .catch((e) => {
            console.log(e);
            alert(e?.message || 'Error retrieving livepeer asset');
          });
      }
      if (livepeerAssetData?.status?.phase === 'failed') {
        throw new Error(
          'Error transcoding video: ' + livepeerAssetData?.status?.errorMessage,
        );
      }
    },
    livepeerAssetData?.status?.phase !== 'ready' &&
      livepeerAssetData?.status?.phase !== 'failed'
      ? 5000
      : null,
  );

  useEffect(() => {
    if (
      livepeerAssetData?.status?.phase === 'ready' &&
      livepeerAssetData.playbackId
    ) {
      getLivepeerPlaybackInfo(livepeerAssetData.playbackId).then((data) => {
        setLivepeerPlaybackData(data);
      });
    } else {
      console.log('Not ready to get playback info');
    }
  }, [livepeerAssetData]);

  const handleBack = () => {
    router.back();
  };

  const handleComplete = () => {
    onComplete({ thumbnailUri: thumbnailUri as string });
    router.push('/discover');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="my-6 text-center">
        <h4 className="text-2xl font-bold">Almost Done...</h4>
      </div>
      <div className="my-4">
        <h3 className="text-lg">
          Video Transcoding: {String(livepeerAssetData?.status?.phase)}
        </h3>
      </div>
      {livepeerAssetData?.status?.phase !== 'ready' && (
        <div className="my-4">
          <Spinner className="mx-auto h-5 w-5 animate-pulse" />
        </div>
      )}
      {livepeerAssetData?.status?.phase === 'ready' && livepeerPlaybackData && (
        <div className="my-6">
          <PlayerComponent
            title={livepeerAssetData.name}
            assetId={livepeerAssetData.id}
            src={getSrc(livepeerPlaybackData) as Src[]}
          />
        </div>
      )}
      <div className="my-5">
        <div className="mx-auto my-4">
          <h3 className="text-xl font-bold">Generate a Thumbnail</h3>
        </div>
        <CreateThumbnailForm
          onSelectThumbnailImages={(thumbnailUri: string) => {
            console.log('Use selected image', thumbnailUri);
            onComplete({ thumbnailUri });
          }}
        />
      </div>
      <div className="flex items-center justify-center gap-3">
        <Button
          disabled={livepeerAssetData?.status?.phase === 'processing'}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          disabled={livepeerAssetData?.status?.phase !== 'ready'}
          onClick={handleComplete}
        >
          Complete
        </Button>
      </div>
    </div>
  );
}
