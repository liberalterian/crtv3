import { fullLivepeer } from '@app/lib/sdk/livepeer/fullClient';
import { getSrc } from '@livepeer/react/external';
import { Src } from '@livepeer/react';

export const getAllPlaybackSources = async (): Promise<Src[] | null> => {
  try {
    const playbackSources = await fullLivepeer.asset.getAll();
    const src = getSrc(playbackSources?.data) as Src[];
    return src;
  } catch (error) {
    console.error('Error fetching playback sources:', error);
    return null;
  }
};
