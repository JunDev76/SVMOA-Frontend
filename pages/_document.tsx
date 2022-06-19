import {Head, Main, NextScript} from "next/document";

export default function document() {
    return (
        <html>
        <Head>
            <title>섭모아 서버모아 SVMOA</title>

            <link href={'/mcmotd.css'} rel={'stylesheet'}/>
            <link href={'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css'}
                  rel={'stylesheet'}/>
            <link href={'/fonts/pretendard/style.css'} rel={'stylesheet'}/>

            <script src={'/channelio.js'}/>
        </Head>
        <body>

        <Main/>
        <NextScript/>
        </body>
        </html>
    )
}