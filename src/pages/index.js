import Image from "next/image";
import localFont from "next/font/local";
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useState } from 'react';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    console.log('Buscando:', query);
  };


  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center w-full">
      <Image
        aria-hidden
        src="/combofind-logo.png"
        alt="Globe icon"
        width={150}
        height={0}
      />
      <div className="flex items-center w-4/12">
        <Input
          type="text"
          placeholder="Pesquisar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Button
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            <Image
              className="dark:invert"
              src="/search-icon.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Buscar
          </Button>
        </div>
        
        <ol className="list-inside list-decimal text-sm text-center font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Busque a cor ou skin de faca ou luva desejada.
          </li>
          <li className="mb-2">
            Encontraremos um inventário completo com base nessa skin/cor.
          </li>
        </ol>

       
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/coffee-cup.png"
            alt="Window icon"
            width={16}
            height={16}
          />
          Me pague um café
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/admin-icon.png"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Admin →
        </a>
      </footer>
    </div>
  );
}
