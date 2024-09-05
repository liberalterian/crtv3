'use client';
import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ConnectButtonWrapper from '../Button/connectButtonWrapper';
import { SITE_LOGO } from '@app/lib/utils/context';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@app/components/ui/sheet';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Button } from '@app/components/ui/button';
import { useActiveAccount } from 'thirdweb/react';
import { UserMenu } from './userMenu';
import ThemeToggleComponent from '../ThemeToggle/toggleComponent';

export function Navbar() {
  const activeAccount = useActiveAccount();
  return (
    <header className="flex h-20 w-full shrink-0 items-center bg-muted px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>
              <VisuallyHidden.Root>Menu</VisuallyHidden.Root>
            </SheetTitle>
            <SheetDescription>
              <VisuallyHidden.Root>The stage is yours.</VisuallyHidden.Root>
            </SheetDescription>
          </SheetHeader>
          <div>
            <Link href="/" className="mr-6 lg:flex" prefetch={false}>
              <Image
                style={{ width: 'auto', height: 'auto' }}
                src={SITE_LOGO}
                alt="Creative Logo"
                width={80}
                height={80}
                priority
              />
              <span className="mx-auto my-auto">
                <h1 className="text-lg">CREATIVE TV</h1>
              </span>
            </Link>
          </div>
          <div className="grid gap-2 py-6">
            <Link
              href="/discover"
              className="flex w-full items-center py-2 text-lg font-semibold"
              prefetch={false}
            >
              Discover
            </Link>
            <Link
              href="/vote"
              className="flex w-full items-center py-2 text-lg font-semibold"
              prefetch={false}
            >
              Vote
            </Link>
          </div>
          <hr />
          <div className="grid gap-2 py-6">
            <div>
              <ThemeToggleComponent />
            </div>
            <ConnectButtonWrapper />
            {activeAccount && (
              <div className="mt-5">
                <UserMenu />
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
      <Link href="/" className="mr-6 hidden lg:flex" prefetch={false}>
        <Image
          src={SITE_LOGO}
          alt="Creative Logo"
          width={80}
          height={80}
          priority
        />
        <span className="mx-auto my-auto">
          <h1 className="text-lg">CREATIVE TV</h1>
        </span>
      </Link>
      <nav className="ml-auto hidden gap-6 lg:flex">
        <Link
          href="/discover"
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          prefetch={false}
        >
          Discover
        </Link>
        <Link
          href="/vote"
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          prefetch={false}
        >
          Vote
        </Link>
      </nav>
      <div className=" ml-auto hidden lg:flex">
        <div className="my-auto mr-4">
          <ThemeToggleComponent />
        </div>
        <div className="mr-5">
          <ConnectButtonWrapper />
        </div>
        {activeAccount && <UserMenu />}
      </div>
    </header>
  );
}

function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
