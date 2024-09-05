'use client';
import { useEffect, useRef } from 'react';
import { Button } from '@app/components/ui/button'; // Assuming this is the Shadcn-UI button component
import { setupCheckout } from '@app/lib/utils/checkout'; // Import your existing checkout setup
import { Paywall } from '@unlock-protocol/paywall'; // Import the Unlock Protocol Paywall
import { polygon, base, optimism, sepolia } from 'thirdweb/chains';
import { useActiveAccount } from 'thirdweb/react';
import { toast } from 'sonner';

// Setting global paywall config in React component lifecycle
const PaywallButton: React.FC = () => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const activeAccount = useActiveAccount();

  useEffect(() => {
    if (buttonRef.current) {
      setupCheckout(buttonRef.current);
    }

    // Paywall config setup
    window.unlockProtocolConfig = {
      icon: 'https://storage.unlock-protocol.com/7b2b45eb-ed97-4a1a-b460-b31ce79d087d',
      locks: {
        '0xad597e5b24ad2a6032168c76f49f05d957223cd0': {
          name: 'Annual Creator Pass',
          order: 2,
          network: 137,
          recipient: '',
          dataBuilder: '',
          emailRequired: true,
          maxRecipients: 1,
          skipRecipient: true,
          recurringPayments: 'forever',
        },
        '0xb6b645c3e2025cf69983983266d16a0aa323e2b0': {
          name: 'Creator Pass (3 months)',
          order: 2,
          network: 137,
          recipient: '',
          dataBuilder: '',
          emailRequired: true,
          maxRecipients: 1,
          recurringPayments: 'forever',
        },
      },
      title: 'The Creative Membership',
      referrer: '0x1Fde40a4046Eda0cA0539Dd6c77ABF8933B94260',
      skipSelect: false,
      hideSoldOut: false,
      pessimistic: true,
      redirectUri: 'https://tv.creativeplatform.xyz',
      messageToSign:
        "Welcome to The Creative, Where Creativity Meets Opportunity!\n\n🌟 Your Creative Space Awaits!\nDive into a world where your art transforms into opportunity. By joining our platform, you're not just accessing tools; you're amplifying your creative voice and reaching audiences who value your work.\n\n🔗 Connect & Collaborate\nEngage with a network of fellow creatives. Share, collaborate, and grow together. Our community thrives on the diversity of its members and the strength of its connections.\n\n💡 Tools for Every Creator\nFrom seamless transactions to intuitive marketing tools, everything you need is right here. Focus on creating—we handle the rest, ensuring your creations are protected and your earnings are secure.\n\n✨ Support on Your Creative Journey\nOur dedicated support team is just a message away, ready to assist you with any questions or to provide guidance as you navigate your creative path.\n\nThank You for Choosing The Creative\nTogether, we’re building a thriving economy of artists, by artists. Let’s create and inspire!",
      skipRecipient: false,
      endingCallToAction: 'Complete Checkout',
      persistentCheckout: false,
    };

    // Load Unlock Protocol script if it hasn't been loaded already
    const script = document.createElement('script');
    script.src =
      'https://paywall.unlock-protocol.com/static/unlock.latest.min.js';
    document.body.appendChild(script);

    return () => {
      // Cleanup script when the component is unmounted
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const networkConfigs = {
    137: {
      provider: `https://137.rpc.thirdweb.com/${process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}`,
    },
    10: {
      provider: `https://10.rpc.thirdweb.com/${process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}`,
    },
    8453: {
      provider: `https://8453.rpc.thirdweb.com/${process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}`,
    },
    11155111: {
      provider: `https://11155111.rpc.thirdweb.com/${process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}`,
    },
  };

  const paywall = new Paywall(networkConfigs);

  const handleButtonClick = async () => {
    paywall.connect(activeAccount);
    const response = await paywall.loadCheckoutModal(
      window.unlockProtocolConfig,
    );
    toast(response); // Handle the response as needed
  };

  return (
    <Button ref={buttonRef} type="button" onClick={() => handleButtonClick}>
      Buy Pass
    </Button>
  );
};

export default PaywallButton;
