import Head from 'next/head'
import dynamic from 'next/dynamic'
import Image from 'next/image';

const ChatComponent = dynamic(() => import('../components/Chat/Chat'), { ssr: false });

export default function Home() {
    return (
        <div className='app-container'>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <ChatComponent />
            </main>

            {/* <footer> */}
                {/* Powered by */}
                {/* <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
                    <Image src="/vercel.svg" alt="Vercel Logo" className="logo" />
                </a>
                and
                <a href="https://ably.com" rel="noopener noreferrer">
                    <Image src="/ably-logo.svg" alt="Ably Logo" className="logo ably" />
                </a> */}
            {/* </footer> */}
        </div>
    );
}