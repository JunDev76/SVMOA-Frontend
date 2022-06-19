import Hstyles from '../styles/Home.module.css'
import styles from '../styles/rank.module.css'
import {MetaGenerate} from "../src/MetaGenerator";
import '../styles/Index.module.css';
import Navbar from '../src/Navbar';
import Footer from "../src/Footer";
import Swal from 'sweetalert2'
import {useState} from "react";
// @ts-ignore
import ReactStars from "react-rating-stars-component";
import withReactContent from "sweetalert2-react-content";
import Link from 'next/link';
import config from '../config.json';
import {getAccountData, isLogged} from "../src/SessionManager";
import axios from "axios";

let list: any[];
let setList: any;

interface community {
    openchat: string | null,
    discord: string | null,
    cafe: string | null,
    band: string | null
}

/*interface server {
    name: string,
    motd: string,

    numPlayer: number,
    maxPlayer: number,
    engine: string,

    introduce: string,

    mcver: string,
    isbe: boolean,

    invote: [],

    banner: string,

    communities: community,

    tags: []

    video: string | null,

    rating: number,

    domain: string,
    port: number,

    rank: number,

    //장르
    genre: string,

    ipzone: string,

    online: boolean,

    playerHistory: [],

    lastChanged: string | null
}*/

function escapeHtml(text: string) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function serverdiv(server: any) {
    const copy = (click: any) => {
        let args = '';
        if (server.port !== 19132) {
            args = ':' + server.port;
        }
        navigator.clipboard.writeText(server.domain + args).then(() => {
        });

        const swal = withReactContent(Swal);
        swal.fire({
            icon: 'success',
            title: '복사 성공',
            text: '클립보드에 복사하였어요!'
        });
        click.preventDefault();
    };

    return (
        <Link href={'/server/' + server.domain}>
            <div className={styles.server}>
                <div className={styles.rank_no}>
                    {server.rank}
                </div>
                <div className={styles.name}
                     dangerouslySetInnerHTML={{__html: wordwrap(escapeHtml(server.name), 15, '<br>', true)}}/>
                <div className={styles.banner}>
                    <div>
                        <img alt={'이미지를 불러올 수 없어요.'} src={`/api/serverdata/banner?domain=${server.domain}&port=${server.port}`}/>
                        <div className={styles.banner_footer}>
                        <span className={styles.banner_serverStatus}>
                            <i style={{color: server.online ? '#36C64D' : 'red'}} className="fas fa-circle"/>
                        </span>
                            <span className={styles.banner_serverdomain}>
                                {server.domain + ' : ' + server.port + ' '}
                                <span className={styles.banner_copy_btn} onClick={copy}>
                                    <i className="fa-solid fa-copy"/>
                            </span>
                            </span>
                            <span className={styles.banner_onlineCouont}>
                            {server.numPlayer + '명'}
                        </span>
                        </div>
                    </div>
                </div>
                <div className={styles.rating}>
                    <div className={styles.rating_tt}>
                        <ReactStars
                            count={5}
                            value={server.rating}
                            isHalf={true}
                            edit={false}
                            size={24}
                            activeColor="#ffd700"
                        />
                    </div>
                    <span>
                    {
                        server.rating + '점'
                    }
                </span>
                </div>
            </div>
        </Link>
    )
}

function wordwrap(str: any, width: any, brk: any, cut: any): string {
    brk = brk || '\n';
    width = width || 75;
    cut = cut || false;

    if (!str) {
        return str;
    }

    const regex = '.{1,' + width + '}(\\s|$)' + (cut ? '|.{' + width + '}|.+$' : '|\\S+?(\\s|$)');

    return str.match(RegExp(regex, 'g')).join(brk);
}

export async function getServerSideProps(content: any) {
    const page: number = (content.query.page !== undefined ? parseInt(content.query.page) : 0);

    let data;
    await fetch(config.apiserver + '?listpg&page=' + page).then(res => res.json()).then(res => {
        data = res.data;
    })

    return {
        props: {data: data}
    }
}

export default function Rank(props: any) {
    [list, setList] = useState(props['data']);

    return (
        <div className={Hstyles.container}>
            {
                MetaGenerate('서버랭킹')
            }

            <div className={Hstyles.page + ' ' + styles.ct}>

                <div className={styles.rank}>
                    <div className={styles.rankHeader}>
                        <span style={{zoom: 1.1, fontWeight: "normal"}}>
                            서버 <span style={{color: '#3BD158'}}>{
                                list.length
                            }개</span>가 열려있어요.
                        </span>
                        {
                            (isLogged() && <span className={styles.register_server}>
                                <Link href={'/register_server'}>
                                    <i className="fa-solid fa-pencil"/>
                                </Link>
                            </span>)
                        }
                    </div>

                    <br/>


                    <div className={styles.top}>
                        <div className={styles.top_d}>

                        </div>
                        <div className={styles.top_c}>
                            <div className={styles.rank_no}>
                                순위
                            </div>
                            <div className={styles.name}>
                                이름
                            </div>
                            <div className={styles.top_banner}>
                                배너
                            </div>
                            <div className={styles.top_rating}>
                                평점
                            </div>
                        </div>
                    </div>
                    {
                        list.map((server) => {
                            return serverdiv(server);
                        })
                    }
                </div>
                <div className={styles.search}>

                </div>
            </div>

        </div>
    )
}