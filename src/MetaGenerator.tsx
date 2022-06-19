import Head from "next/head";

export function MetaGenerate(title: string, description: string | null = null) {
    if (description === null) {
        description = '';
    }
    description += ' - 마인크래프트 BE의 서버를 모아놓은 랭킹 사이트! 모든 서버 모아! 섭모아!';
    title += ' - 섭모아 서버모아 SVMOA';
    return (
        <Head>
            <title>{title}</title>
            <meta name="keywords"
                  content="마크PE, 마크BE, 모바일마크, 1.18, 마인크래프트, 마인크래프트 서버목록, 마인크래프트 서버추천, 마인크래프트 서버정보, 마인크래프트 서버 공유방, 서버주소, 모바일, 서버 리뷰, 서버 추천, 순위, 실시간, 랭킹, 정보, 홍보"/>
            <meta name="description" content={description}/>
            <link rel="icon" href="/favicon.ico"/>
            <meta content="width=device-width, initial-scale=1, user-scalable=no" name="viewport"/>

            <meta property="og:title" content={title}/>
            <meta property="og:description" content={description}/>
            <meta property="og:type" content="website"/>
            <meta property="og:image" content="/og/image.png"/>
            <meta property="og:url" content="https://svmoa.live"/>
            <meta property="og:site_name" content="SVMOA 섭모아 서버모아"/>
            <meta property="og:image:secure_url" content="/og/image.png"/>
            <meta property="og:image:width" content="1280"/>
            <meta property="og:image:height" content="640"/>
            <meta property="twitter:card" content={title}/>
            <meta property="twitter:image" content="/og/image.png"/>

            <link rel="canonical" href="https://svmoa.live/"/>
        </Head>
    )
}