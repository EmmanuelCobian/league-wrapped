/**
 * If API dies, route to this page.
 */
"use client"

export default function ErrorPage({ errorMessage, handleReset }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black">
        <div className="text-4xl font-bold text-black dark:text-white">
          RIOT WRAPPED
        </div>

        <div className="flex flex-col items-center gap-6 text-center w-full">
            <div className="w-30 h-30 rounded-full flex items-center justify-center mb-4">
                <img
                src="https://wiki.leagueoflegends.com/en-us/images/Enemy_Missing_ping.png?4ebe8"
                alt="Error"
                className="w-30 h-30 object-contain"
                />
            </div>

          <h1 className="text-3xl font-semibold text-black dark:text-white">
            Oops! Something went wrong
          </h1>

          <div className="max-w-md w-full p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm font-mono text-zinc-600 dark:text-zinc-400">
              {errorMessage}
            </p>
          </div>

          <button
            onClick={handleReset}
            className="mt-4 flex h-12 w-full max-w-xs items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Try Again
          </button>
        </div>

      </main>
    </div>
  );
}