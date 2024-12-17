'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { NextPage } from 'next';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import { Input } from '../ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { ROLES, ROLES_ABI } from '@app/lib/utils/context';
import { shortenAddress } from 'thirdweb/utils';
import { getContract, prepareContractCall } from 'thirdweb';
import { CopyIcon } from 'lucide-react';
import { client } from '@app/lib/sdk/thirdweb/client';
import { base } from 'thirdweb/chains';
import {
  useActiveAccount,
  useReadContract,
  TransactionButton,
} from 'thirdweb/react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@app/components/ui/tabs';
import { Label } from '../ui/label';
import MemberCard from './MemberCard';
import { getNFT, getOwnedTokenIds } from 'thirdweb/extensions/erc721';
import { CREATIVE_ADDRESS } from '@app/lib/utils/context';
import CreateMetoken from '../MeToken/createMetoken';
import Unlock from '@app/lib/utils/Unlock.json';
import AssetDetails from './AssetDetails';

const ProfilePage: NextPage = () => {
  const { user } = useParams();
  const [transferAddress, setTransferAddress] = useState('');
  const [lendingAddress, setLendingAddress] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [ownedIds, setOwnedIds] = useState<bigint[]>([]);
  const activeAccount = useActiveAccount();
  const [memberData, setMemberData] = useState<any>(null);
  const [nftData, setNftData] = useState<any>(null);
  const [balance, setBalance] = useState<string>('');

  const unlockAbi = Unlock.abi as any;

  /*******  CONTRACT READING ********/
  const unlockContract = getContract({
    client: client,
    chain: base,
    address: '0xf7c4cd399395d80f9d61fde833849106775269c6',
    abi: unlockAbi,
  });

  const { data: result, isLoading } = useReadContract({
    contract: unlockContract,
    method: 'getHasValidKey',
    params: [activeAccount?.address],
  });

  useEffect(() => {
    const fetchData = async () => {
      if (activeAccount) {
        // Fetch owned token IDs
        const ownedTokenIds = await getOwnedTokenIds({
          contract: unlockContract,
          owner: activeAccount.address,
        });
        setOwnedIds(ownedTokenIds);

        // Fetch NFT metadata
        if (ownedTokenIds.length > 0) {
          const metadata = await getNFT({
            contract: unlockContract,
            tokenId: ownedIds[0], // Use first token ID instead of the whole array
          });
          setNftData(metadata);
        }

        // Set member data and balance (you can customize this based on your logic)
        setMemberData(activeAccount); // Example: setting active account as member data
        setBalance('0'); // Example: set balance to 0 or fetch actual balance
      }
    };

    fetchData();
  }, [activeAccount, ownedIds, unlockContract]);

  return (
    <div className="container mx-auto my-5 px-4">
      <Tabs defaultValue="Membership" className="mx-auto w-full max-w-3xl">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="Membership">Membership</TabsTrigger>
          <TabsTrigger value="MeToken">MeToken</TabsTrigger>
          <TabsTrigger value="Uploads">Uploads</TabsTrigger>
          <TabsTrigger value="Revenue">Revenue</TabsTrigger>
        </TabsList>
        <TabsContent value="Membership">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Membership</CardTitle>
              <CardDescription>
                Make actions on your membership here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <MemberCard
                  member={memberData}
                  nft={nftData}
                  balance={balance}
                />
              </div>
            </CardContent>
            <CardFooter className="space-x-2">
              <TransactionButton
                transaction={() =>
                  prepareContractCall({
                    contract: unlockContract,
                    method: 'renewMembershipFor',
                    params: [ownedIds, CREATIVE_ADDRESS],
                  })
                }
                onClick={() => toast.success('Successful Membership Renewal!')}
                onError={(error: Error) =>
                  toast.error('Error Renewing Membership.')
                }
              >
                Renew
              </TransactionButton>
              <TransactionButton
                transaction={() =>
                  prepareContractCall({
                    contract: unlockContract,
                    method: 'cancelAndRefund',
                    params: [ownedIds],
                  })
                }
                onClick={() =>
                  toast.success('Cancelled Membership Successfully!')
                }
                onError={(error: Error) =>
                  toast.error('Error Cancelling Your Membership.')
                }
              >
                Cancel
              </TransactionButton>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="MeToken">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Create A MeToken</CardTitle>
              <CardDescription>
                Generate your own creator token here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateMetoken />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Uploads">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Upload History</CardTitle>
              <CardDescription>Uploaded videos will show here.</CardDescription>
            </CardHeader>
            <CardContent>
              <AssetDetails />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Revenue">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
              <CardDescription>Your revenue will show here.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Coming Soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
