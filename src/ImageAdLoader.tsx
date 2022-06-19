import {useCookies} from "react-cookie";
import styles from '../styles/ImageAdLoader.module.css';
import {inspect} from "util";
import {useEffect, useState} from "react";

const ads: any = {
    wantregister: {
        imgurl: '/imgnotice/wantregister.png'
    }
}

export default function ImageAdLoader(props: any) {
    const adname = props.adname;

    if (ads[adname] === undefined) {
        return <></>;
    }

    const ad = ads[adname];

    const [cookies, setcookie, removecookies] = useCookies(['ImageAD']);

    const [isClosed, setClosed] = useState(false);

    // @ts-ignore
    useEffect(() => {
        try {
            if (cookies['ImageAD'][adname] !== undefined) {
                if (new Date().getTime() - cookies['ImageAD'][adname] < 259200000) {
                    setClosed(true);
                    return <></>;
                }
            }
        } catch (e: any) {

        }
    });

    const notshow = () => {
        let cookie;
        try {
            cookie = JSON.parse(cookies['ImageAD']);
        } catch (e: any) {
            cookie = {};
        }

        cookie[adname] = new Date().getTime();

        setcookie('ImageAD', JSON.stringify(cookie));
    };

    useEffect(() => {
        if (!isClosed) {
            window.scrollTo(0, 0);
            setTimeout(() =>
                window.scrollTo(0, 0)
            );
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    return <>
        {
            (!isClosed && <>
                <div className={styles.adBackground}/>
                <div className={styles.adBody}>
                    <img alt={'로딩 실패'} src={ad.imgurl}/>
                    <span/>
                    <div>
                        <div>
                            <span onClick={() => {
                                notshow();
                                setClosed(true);
                            }}><i className="fa-solid fa-square-check"/> 3일간 보지 않기</span>
                        </div>
                        <div>
                            <i onClick={() => {
                                setClosed(true);
                            }
                            } className="fa-solid fa-xmark"/>
                        </div>
                    </div>
                </div>
            </>)
        }
    </>;
}