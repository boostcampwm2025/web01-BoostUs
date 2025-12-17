import Image from "next/image";

const Home = () => {
  return (
    <div className="flex justify-center items-center bg-zinc-50 dark:bg-black min-h-screen font-sans">
      <main className="flex flex-col justify-between items-center sm:items-start bg-white dark:bg-black px-16 py-32 w-full max-w-3xl min-h-screen">
        <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={100} height={20} priority />
        <div className="flex flex-col items-center sm:items-start gap-6 sm:text-left text-center">
          <h1 className="max-w-xs font-semibold text-black dark:text-zinc-50 text-3xl leading-10 tracking-tight">
            To get started, edit
          </h1>
          <p className="max-w-md text-zinc-600 dark:text-zinc-400 text-lg leading-8">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex sm:flex-row flex-col gap-4 font-medium text-base">
          <a
            className="flex justify-center items-center gap-2 bg-foreground hover:bg-[#383838] dark:hover:bg-[#ccc] px-5 rounded-full w-full md:w-[158px] h-12 text-background transition-colors"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image className="dark:invert" src="/vercel.svg" alt="Vercel logomark" width={16} height={16} />
            Deploy Now
          </a>
          <a
            className="flex justify-center items-center hover:bg-black/[.04] dark:hover:bg-[#1a1a1a] px-5 border border-black/[.08] hover:border-transparent dark:border-white/[.145] border-solid rounded-full w-full md:w-[158px] h-12 transition-colors"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
};

export default Home;
