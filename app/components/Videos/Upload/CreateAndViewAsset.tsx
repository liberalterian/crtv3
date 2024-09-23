'use client';
import { fullLivepeer } from '@app/lib/sdk/livepeer/fullClient';
import Image from 'next/image';
import React, { useState, useRef } from 'react';
import { BiCloud, BiMusic, BiPlus } from 'react-icons/bi';
import { NewAssetPayload, Asset } from 'livepeer/models/components';
import { useActiveAccount } from 'thirdweb/react';
import { polygon } from 'thirdweb/chains';
import { client } from '@app/lib/sdk/thirdweb/client';
import {
  deploySplitContract,
  prepareDeterministicDeployTransaction,
  deployERC1155Contract,
} from 'thirdweb/deploys';
import { uploadAssetByURL } from '@app/lib/utils/fetchers/livepeer/livepeerApi';
import { ACCOUNT_FACTORY_ADDRESS } from '@app/lib/utils/context';
import { getSrc } from '@livepeer/react/external';
import PreviewVideo from './PreviewVideo';
import { Input } from '@app/components/ui/input';
import { Button } from '@app/components/ui/button';

interface UploadProps {
  video: Asset;
  title: string;
  description: string;
  category: string;
  location: string;
  file: File;
  UploadedDate: number;
}

export default function Upload() {
  // Creating state for the input field
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [video, setVideo] = useState<Asset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [tusUrl, setTusUrl] = useState<string>('');  

  //  Creating a ref for thumbnail and video
  const thumbnailRef = useRef();
  const videoRef = useRef();

  const chain = polygon;
  const activeAccount = useActiveAccount();
  
  // Go back to the previous page
  const goBack = () => {
    window.history.back();
  };

  // Create Asset
  const createAsset = async (e: NewAssetPayload) => {
    setIsUploading(true);
    const output = await fullLivepeer?.asset.create(e);
    const cid = output?.data;
    const sign = fullLivepeer?.accessControl.create();
    const tusUpload = cid?.tusEndpoint;
    
    console.log('Your TUS URL is:', tusUpload);
    setTusUrl(tusUpload || '');

    console.log('asset:', cid?.asset);
    setVideo(cid?.asset || null);

    setIsUploading(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = document.getElementById('fileInput');
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  // Upload to URL
  const uploadVideo = async () => {
    if (video === null) {
      throw new Error('Video asset is null');
    }
    const upload = await uploadAssetByURL(
      video?.name,
      tusUrl,
    );
    console.log('upload', upload);
    return upload;
  };

  const upload = new tus.Upload(file, {
    endpoint: tusEndpoint, // URL from `tusEndpoint` field in the
  `/request-upload` response
    metadata: {
      filename,
      filetype: 'video/mp4',
    },
    uploadSize: file.size,
    onError(err) {
      console.error('Error uploading file:', err);
    },
    onProgress(bytesUploaded, bytesTotal) {
      const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
      console.log('Uploaded ' + percentage + '%');
    },
    onSuccess() {
      console.log('Upload finished:', upload.url);
    },
  });
  
  const previousUploads = await upload.findPreviousUploads();
  
  if (previousUploads.length > 0) {
    upload.resumeFromPreviousUpload(previousUploads[0]);
  }
  
  upload.start()

  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) =>
    event.preventDefault();
    const data = {
      video,
      title,
      description,
      location,
      category,
      file,
      UploadedDate: Date.now(),
    };

    if (data?.video?.name) {
      await createAsset({ name: data.video.name } as NewAssetPayload,);
    } else {
      throw new Error('Video name is undefined');
    }
    //await saveVideo(data);
    // await getSplits(collabs, shares);
    // await determineVideoAddress();
    // await generateVideoNFT(description, title, video);
  };

  const getSplits = async (collabs: string[], shares: bigint[]) => {
    const splits = await deploySplitContract({
      chain: chain,
      client: client,
      account: activeAccount,
      params: {
        name: 'Split Contract',
        payees: [activeAccount?.address, ...collabs],
        shares: [1000n, ...shares],
      },
    });
    console.log('splits', splits);
    return splits;
  };

  const determineVideoAddress = async () => {
    const tx = prepareDeterministicDeployTransaction({
      client: client,
      chain: chain,
      contractId: ACCOUNT_FACTORY_ADDRESS.polygon,
      constructorParams: [],
    });
    console.log('tx', tx);
    return tx;
  };

  const generateVideoNFT = async (
    description: string,
    name: string,
    image: string,
  ) => {
    const videoNFT = await deployERC1155Contract({
      chain: chain,
      client: client,
      account: activeAccount,
      type: 'DropERC1155',
      params: {
        name: name,
        image: image,
        description: description,
        symbol: 'CRTVV',
      },
    });
    console.log('videoNFT', videoNFT);
    return videoNFT;
  };

  //   const saveVideo = async (data) => {
  //     let contract = await getContract();
  //     await contract.uploadVideo(
  //       data.video,
  //       data.title,
  //       data.description,
  //       data.location,
  //       data.category,
  //       data.thumbnail,
  //       false,
  //       data.UploadedDate,
  //     );
  //   };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex-1 p-4 md:p-10">
        <div className="m-10 mt-5 flex flex-col lg:flex-row">
          <div className="flex flex-col lg:w-3/4 ">
            <label className="text-sm  text-[#9CA3AF]">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Rick Astley - Never Gonna Give You Up (Official Music Video)"
              className="mt-2 h-12 w-[90%]  rounded-md border border-[#444752] p-2 placeholder:text-gray-600 focus:outline-none"
            />
            <label className="mt-10 text-[#9CA3AF]">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Never Gonna Give You Up was a global smash on its release in July 1987, topping the charts in 25 countries including Rick’s native UK and the US Billboard Hot 100.  It also won the Brit Award for Best single in 1988. Stock Aitken and Waterman wrote and produced the track which was the lead-off single and lead track from Rick’s debut LP “Whenever You Need Somebody."
              className="mt-2 h-32 w-[90%] rounded-md  border border-[#444752] p-2 placeholder:text-gray-600 focus:outline-none"
            />

            <div className="mt-10 flex w-[90%] flex-row  justify-between">
              <div className="flex w-2/5 flex-col    ">
                <label className="text-sm  text-[#9CA3AF]">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  type="text"
                  placeholder="Bali - Indonesia"
                  className="mt-2 h-12 w-[90%]  rounded-md border border-[#444752] p-2 placeholder:text-gray-600 focus:outline-none"
                />
              </div>
              <div className="flex w-2/5 flex-col    ">
                <label className="text-sm  text-[#9CA3AF]">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-2 h-12 w-[90%]  rounded-md border border-[#444752] p-2 placeholder:text-gray-600 focus:outline-none"
                >
                  <option>Music</option>
                  <option>Sports</option>
                  <option>Gaming</option>
                  <option>News</option>
                  <option>Entertainment</option>
                  <option>Education</option>
                  <option>Science & Technology</option>
                  <option>Travel</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <label className="mt-10  text-sm text-[#9CA3AF]">Thumbnail</label>

            <div
              onClick={() => {
                thumbnailRef?.current;
              }}
              className="mt-2 flex h-36  w-64 items-center justify-center rounded-md  border-2 border-dashed border-gray-600 p-2"
            >
              {thumbnail ? (
                <Image
                  onClick={() => {
                    if (thumbnailRef?.current) {
                      (thumbnailRef.current as HTMLElement).click();
                    }
                  }}
                  src={
                    typeof thumbnail === 'string'
                      ? thumbnail
                      : URL.createObjectURL(thumbnail)
                  }
                  alt="thumbnail"
                  className="h-full rounded-md"
                />
              ) : (
                <BiPlus size={40} color="gray" />
              )}
            </div>

            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e?.target?.files ? e.target.files[0] : null;
                if (file) {
                  setThumbnail(file);
                }
              }}
            />
          </div>

          <div
            onClick={() => {
              videoRef?.current;
            }}
            className={
              video
                ? ' flex   h-64  w-96 items-center justify-center rounded-md'
                : 'mt-8 flex  h-64 w-96 items-center justify-center   rounded-md border-2 border-dashed border-gray-600'
            }
          >
            {video && <PreviewVideo video={video} />}
          </div>
        </div>
        <Input
          type="file"
          id="fileInput"
          className="hidden"
          accept={'video/*'}
          onChange={(e) => {
            const file = e?.target?.files ? e.target.files[0] : null;
            if (file) {
              const videoAsset: Asset = {
                id: video?.id || '', // Replaced with a real unique id generator
                source: getSrc(video?.playbackId || null),
                // Add other properties of Asset if needed
              };
              setVideo(videoAsset);
              console.log(videoAsset);
            }
          }}
        />
      </div>
      <div className="flex justify-end p-4 md:p-10">
        <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
          <Button className="w-full rounded-lg border border-gray-600 bg-transparent px-6 py-2 sm:w-auto">
            Discard
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex w-full flex-row items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 sm:w-auto"
          >
            <BiCloud />
            <p className="ml-2">Upload</p>
          </Button>
        </div>
      </div>
    </div>
  );
}
