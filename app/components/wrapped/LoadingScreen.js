"use client"
import Image from 'next/image';
import Poro from '../images/poro-disco.gif';

export default function LoadingPage() {

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="flex flex-col items-center gap-8 px-8">
        <div className="w-64 h-64 flex flex-col items-center justify-center gap-6">
          <Image
            src={Poro}
            alt="Poro disco"
            width={256}
            height={256}
            className="object-contain"
          />
          <img
            src="https://i.gifer.com/ZKZg.gif"
            alt="Spin"
            width={50}
            height={50}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}