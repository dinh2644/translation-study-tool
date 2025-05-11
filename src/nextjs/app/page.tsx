
import { auth0 } from "@/lib/auth0"
import Image from "next/image";
export default async function Home() {
  const session = await auth0.getSession();


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-8"
      style={{
        backgroundImage: `url('/images/image_fx.jpg')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-5xl font-bold text-black tracking-wide -mt-12">LiveLingo</h1>
        <p className="text-black ">Learn languages naturally</p>
      </header>

      {/* GIF Placeholder */}
      <div className="max-w-3xl w-full">
        <h2 className="text-2xl font-semibold text-black mb-3">How it works</h2>
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-indigo-200 shadow-sm">
          <p className="text-black ">
            <Image
              src="/images/landing-gif.gif"
              alt="landing page gif"
              width={1920}
              height={1080}
              className="w-full h-auto rounded-lg"
              style={{ objectFit: 'contain' }}
            />
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <a
        className={session ? "px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors mt-4" : "px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors mt-4"}
        href={session ? '/home' : '/auth/login?screen_hint=signup'}
      >
        {session ? 'Go To Home' : 'Get Started'}
      </a>
    </div >
  );
}