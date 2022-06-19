import Hstyles from '../styles/Home.module.css'
import styles from '../styles/rank.module.css'
import {MetaGenerate} from "../src/MetaGenerator";
import '../styles/Index.module.css';
import Swal from 'sweetalert2'
import {useEffect, useState} from "react";
// @ts-ignore
import ReactStars from "react-rating-stars-component";
import withReactContent from "sweetalert2-react-content";
import Link from 'next/link';
import {isLogged} from "../src/SessionManager";
import {useRouter} from "next/router";
import ImageAdLoader from "../src/ImageAdLoader";
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

function tag(name: string, tooltip: string | null) {
    return (
        <div className={styles.tag}>
            <span className={'tag_r ' + (name === 'EULA 준수' ? 'tag_green' : '')}>{name}</span>
        </div>
    );
}

function RankBadge(data: any, rank: number) {
    let isImg: boolean | string = false;
    //보기 안좋아서
    /*if (rank <= 3) {
        isImg = '/rank_badge/' + rank + '.svg';
    }*/

    return (
        (isImg ? <div className={styles.rankBadgeImgSt}>
            <img alt={rank + '등'} src={isImg}/>
        </div> : (
            <div className={styles.rankBadgeTextSt}>{(data.staring !== undefined && (
                <span style={{color: 'orange', transform: 'translate(-25px,0)'}}>★</span>
            ))}{(data.warn !== undefined && (
                <span style={{color: 'red', transform: 'translate(-25px,0)'}}>
                    <i className="fa-solid fa-circle-exclamation"/>
                </span>
            ))}<i className="fa-solid fa-ranking-star"/> {rank}위{(data.upbosster !== undefined && (
                <span style={{color: 'red', marginLeft: '5px'}}>▲</span>
            ))}</div>
        ))
    )
}

function serverdiv(server: any, rank: number) {
    const dynamic = dynamic_data[server.id];
    const copy = (click: any) => {
        click.preventDefault();
        let args = '';
        if (server.port !== 19132) {
            args = ':' + server.port;
        }
        navigator.clipboard.writeText(server.view_domain + args).then(() => {
        });

        const swal = withReactContent(Swal);
        swal.fire({
            icon: 'success',
            title: '복사 성공',
            text: '클립보드에 복사하였어요!'
        });
    };

    const play = (click: any) => {
        click.preventDefault();
        const url = server.view_domain + ':' + server.port;

        const swal = withReactContent(Swal);
        swal.fire({
            icon: 'success',
            title: '완료',
            text: '마인크래프트를 실행했어요!'
        });

        setTimeout(() => (location.href = 'minecraft://?addExternalServer=§a§l[SVMOA] §r§f' + server.name + '|' + url), 1000);
    };

    return (
        <Link href={'/server/' + server.domain + ':' + server.port}>
            <div className={styles.server}>
                <div className={styles.rankBadge}>
                    <span className={dynamic.online ? styles.serverOn : styles.serverOff}>●</span>
                    {RankBadge(server, rank)}
                </div>
                <div className={'line'}/>
                <div className={styles.serverDown}>
                    <div className={styles.serverHeader}>
                        <span className={styles.serverName}>{server.name.substr(0, 8)}</span>
                        {/*<span className={server.isbe && styles.be}>{server.isbe ? 'BE' : 'JE'}</span>*/}
                    </div>
                    <div>
                        <div className={styles.tags}>
                            {
                                (server.tags.map((tag_: string) => {
                                    // @ts-ignore
                                    return tag(tag_, null);
                                }))
                            }
                        </div>
                    </div>
                    <div className={styles.stars}>
                        <div className={styles.starsStar}>
                            <ReactStars
                                count={5}
                                value={dynamic.rating}
                                isHalf={true}
                                edit={false}
                                size={24}
                                activeColor="#ffd700"
                            />
                            <div>{dynamic.rating}점</div>
                        </div>
                        <div className={styles.onlinePlayer}>
                            <i className="fa-solid fa-person-biking"/>
                            <div>{dynamic.numPlayer}명 플레이중!</div>
                        </div>
                    </div>
                    <div className={styles.serverBanner}>
                        <img alt={server.name + '의 배너'}
                             src={`/api/serverdata/banner?domain=${server.domain}&port=${server.port}`}/>
                    </div>
                    <div className={'line'}/>
                    <div className={styles.serverDomain}>
                        <span>{server.view_domain} : {server.port}</span>
                        <span className={styles.copyAndPlay}><i onClick={copy} className="fa-solid fa-copy"/><i
                            onClick={play} className="fa-solid fa-play"/></span>
                    </div>
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

function resizeBanner() {
    document.querySelectorAll('.' + styles.serverBanner).forEach(element => {
        // @ts-ignore
        const pWidth = element.offsetWidth;
        // @ts-ignore
        element.children[0].style.width = pWidth + 'px';
        // @ts-ignore
        element.children[0].style.height = (pWidth * 60 / 348) + 'px';
    });
}

async function dataRefresh() {
    axios.get('/api/query?listpg&page=' + page).then(async res_ => {
        const res = res_.data;

        if (res === 'err2') {
            return;
        }

        let dynamics: any = {};

        dynamics = await axios.get(`/api/query?dynamicdataall`).then(res => {
            if (res.data.status === 199) {
                return null;
            }

            return res.data;
        });

        set_dynamic_data(dynamics);

        // @ts-ignore
        setList([...res.data].sort((a_: any, b_: any) => {
            const a = dynamics[a_.id];
            const b = dynamics[b_.id];
            if (!b.online) {
                return -1;
            }
            if (!a.online) {
                return 1;
            }
            return (parseFloat(b.numPlayer) * parseFloat(b.rating)) - (parseFloat(a.numPlayer) * parseFloat(a.rating));
        }));
    });
    axios.get('/api/query?total').then(res => {
        console.log(res.data);
        set_total_server(res.data.count);
        set_total_player(res.data.player);
    })
}

let page: number;
let total_server: any;
let set_total_server: any;
let total_player: any;
let set_total_player: any;
let dynamic_data: any;
let set_dynamic_data: any;

export default function Rank(props: any) {
    const query = useRouter();
    // @ts-ignore
    page = (query['page'] !== undefined ? parseInt(query['page']) : 0);

    [list, setList] = useState([]);
    [total_server, set_total_server] = useState(0);
    [total_player, set_total_player] = useState(0);
    [dynamic_data, set_dynamic_data] = useState({});
    useEffect(() => {
        window.addEventListener('resize', () => {
            resizeBanner();
        });
    }, [])

    useEffect(resizeBanner);

    useEffect(() => {
        dataRefresh();
    }, [page])

    useEffect(() => {
        setInterval(() => {
            dataRefresh();
        }, 1000 * 60 * 3 + 5000)
    }, [])

    let rank = 0;
    return (
        <div className={Hstyles.container}>
            <ImageAdLoader adname={'wantregister'}/>
            {
                MetaGenerate('서버랭킹')
            }

            <div className={Hstyles.page + ' ' + styles.ct}>

                <div className={styles.rank}>
                    <div className={styles.rankHeader}>
                        <span style={{zoom: 1.1, fontWeight: "normal"}}>
                            서버 <span style={{color: '#3BD158'}}>{total_server}개</span>가 열려있으며, <span
                            style={{color: '#3BD158'}}>{total_player}</span>명이 플레이 중입니다.
                        </span>
                        <div className={styles.rightp}>
                            {
                                (isLogged() && <span title={'서버 등록'} className={styles.register_server}>
                                <Link href={'/register_server'}>
                                   <i className="fa-solid fa-plus"/>
                                </Link>
                            </span>)
                            }
                            {/*<MDBBtn onClick={() => {
                                dataRefresh();
                                toHome();
                            }} outline color='success'>
                                새로고침
                            </MDBBtn>*/}
                        </div>
                    </div>

                    <br/>

                    {
                        list.map((server) => {
                            return serverdiv(server, (++rank));
                        })
                    }
                </div>
                {/*<div className={styles.search}>
                </div>*/}
            </div>

        </div>
    )
}