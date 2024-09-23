import * as z from 'zod';
import {
  Asset,
  PlaybackInfo,
  Upload,
  ViewershipMetric,
} from 'livepeer/models/components';

export type AssetData = {
  id: string;
  name: string;
  description?: string;
  video: Asset;
  playbackInfo: PlaybackInfo;
  views?: ViewershipMetric;
  details?: MintDetails;
};

export type MintDetails = {
  nftAmountToMint: number;
  pricePerNFT: number;
  currency: Currency;
};

export enum Currency {
  USDC = 'USDC',
  ETH = 'ETH',
  MATIC = 'MATIC',
  DAI = 'DAI',
}

export type UploadAssetData = Upload;

const MAX_FILESIZE = 1073741824;
const ACCEPTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/mov',
  'video/flv',
  'video/avi',
];

export const createAssetSchema = z.object({
  asset: z
    .custom<File>()
    .refine((file) => file, 'Video file must be provided.')
    .refine(
      (file) => file.size <= MAX_FILESIZE,
      'Video file must be less than 1GB.',
    )
    .refine(
      (files) => ACCEPTED_VIDEO_TYPES.includes(files?.type),
      '.mp4, .webm, .ogg, .flv, .avi and .mov files are accepted.',
    ),
  name: z.string().max(100),
  description: z.string().max(1000),
  creatorId: z.string().max(100),
});

export type CreateAssetType = z.infer<typeof createAssetSchema>;
