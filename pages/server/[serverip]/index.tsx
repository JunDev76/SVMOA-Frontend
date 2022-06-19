import {MetaGenerate} from "../../../src/MetaGenerator";
import Hstyles from "../../../styles/Home.module.css";
import styles from '../../../styles/server.module.css';
import ErrorPage from 'next/error'

const motdparser = require('mcmotdparser');
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton from 'react-loading-skeleton'
// @ts-ignore
import ReactStars from "react-rating-stars-component";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {
    MDBBtn, MDBCheckbox, MDBCol,
    MDBDropdown,
    MDBDropdownItem,
    MDBDropdownLink,
    MDBDropdownMenu,
    MDBDropdownToggle, MDBInput, MDBListGroup, MDBListGroupItem,
    MDBModal,
    MDBModalBody,
    MDBModalContent,
    MDBModalDialog,
    MDBModalFooter,
    MDBModalHeader,
    MDBModalTitle, MDBRadio, MDBRow, MDBTextArea,
    MDBTooltip
} from "mdb-react-ui-kit";
import fs from 'fs';
import * as url from "url";
import {useEffect, useRef, useState} from "react";

import dynamic from 'next/dynamic'
import axios from "axios";
import {useRouter} from "next/router";
import moment from "moment/moment";
import {getAccountData, isLogged} from "../../../src/SessionManager";
import querystring from "querystring";
import {GreenAlert} from "../../../src/Alerts";
import {useCookies} from "react-cookie";
import Head from "next/head";

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});

let iframe_height: any;
let setiframe_height: any;

let setData: any;

let serverid = -1;

function tag(name: string, tooltip: string | null) {
    return (
        <div className={styles.tag}>
            <MDBTooltip tag='a' wrapperProps={{href: '#'}} title={tooltip}>
                {' '}
                <span className={'tag_r ' + (name === 'EULA 준수' ? 'tag_green' : '')}>{name}</span>
            </MDBTooltip>
        </div>
    );
}

function resize() {
    const element = document.querySelector('#videoplayer');
    if (element === null) {
        return;
    }

    // @ts-ignore
    setiframe_height((9 * element.offsetWidth) / 16);
}

async function motd(text: string) {
    return new Promise((r => {
        motdparser.toHtml(text, (err: any, res: any) => {
            r(res);
        });
    }))
}

export default function ServerPage(props: any) {
    const serverip = useRouter().query.serverip;
    if (typeof serverip !== 'string') {
        return <></>
    }
    const domain = serverip.split(':')[0];
    const port = parseInt((serverip.split(':')[1] ?? 19132));

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [genreData, setGenreData] = useState({});
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        axios.get('/genre.json').then((data: any) => {
            setGenreData(data.data);
        })
    }, [])

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isLoaded, setLoaded] = useState(false);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const $_: any = useState();

    const data = $_[0];
    setData = $_[1];

    const [dynamic, setdynamic]: any = useState();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [notfound, setnotfound] = useState(false);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (!isLoaded) {
            axios.get(`/api/client?get&domain=${domain}&port=${port}`).then(res => {
                if (res.data.err !== undefined) {
                    setnotfound(true);
                    return;
                }

                setData(res.data);
                serverid = res.data.id;

                axios.get(`/api/query?dynamicdata&svid=${serverid}`).then(res => {
                    if (res.data.status === 199) {
                        setnotfound(true);
                        return;
                    }

                    setdynamic(res.data);
                    setLoaded(true);
                });
            });
        }
    }, [domain]);

    const copy = (click: any) => {
        let args = '';
        if (data.port !== 19132) {
            args = ':' + data.port;
        }
        navigator.clipboard.writeText(data.view_domain + args).then(() => {
        });

        const swal = withReactContent(Swal);
        swal.fire({
            icon: 'success',
            title: '복사 성공',
            text: '클립보드에 복사하였어요!'
        })

        click.preventDefault();
    };

    const join = (click: any) => {
        const url = data.view_domain + ':' + data.port;

        const swal = withReactContent(Swal);
        swal.fire({
            icon: 'success',
            title: '완료',
            text: '마인크래프트를 실행했어요!'
        });

        setTimeout(() => (location.href = 'minecraft://?addExternalServer=§a§l[SVMOA] §r§f' + data.name + '|' + url), 1000);

        click.preventDefault();
    };

    // @ts-ignore
    // eslint-disable-next-line react-hooks/rules-of-hooks
    [iframe_height, setiframe_height] = useState(0);
    // @ts-ignore
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        resize();
        window.addEventListener('resize', () => {
            resize();
        })
    });

    const [playerHistoryData, setPHL] = useState(false);

    const graphOriginal = () => {
        if (data !== undefined) {
            axios.get('/api/getDynamicData/playerHistory/' + data.id).then((d) => {
                const data = d.data;
                if (data.status !== 200) {
                    return;
                }

                let categories = [];
                let players = [];


                for (const [i, value] of Object.entries(data.playerHistory)) {
                    const time = moment(i);
                    categories.push(time.format('M월 D일 hh시 mm분'));
                    // @ts-ignore
                    players.push(value);
                }

                // @ts-ignore
                setPHL({categories: categories, players: players});
            })
        }
    };

    useEffect(() => {
        if (data !== undefined) {
            axios.get('/api/getDynamicData/playerHistory/' + data.id).then((d) => {
                const data = d.data;
                if (data.status !== 200) {
                    return;
                }

                let categories = [];
                let players = [];

                let cutC = 0;

                for (const [i, value] of Object.entries(data.playerHistory)) {
                    cutC++;
                    if (cutC === 1 || cutC % 15 === 0) {
                        const time = moment(i);
                        categories.push(time.format('M월 D일 hh시 mm분'));
                        // @ts-ignore
                        players.push(value);
                    }
                }

                // @ts-ignore
                setPHL({categories: categories, players: players});
            })
        }
    }, [data])

    const chartData = {
        series: [{
            name: (data === undefined ? '' : data.name),
            // @ts-ignore
            data: (!playerHistoryData ? {} : playerHistoryData.players)
        }],
        options: {
            chart: {
                type: 'area'
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                //type: 'datetime',
                // @ts-ignore
                categories: (!playerHistoryData ? {} : playerHistoryData.categories),
                labels: {
                    show: false
                }
            },
            yaxis: {
                labels: {
                    formatter: (value: any) => {
                        return (Math.floor(value)) + '명'
                    },
                }
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy HH:mm'
                },
            },
        }
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [motdhtml, setmotdhtml] = useState(null);

    if (isLoaded) {
        //motd(data.motd).then((res:any) => {
        motd(dynamic.motd).then((res: any) => {
            setmotdhtml(res);
        })
    }

    const [canwrite, setcanwrite] = useState(false);
    const [comment_count, setCommentCount] = useState(0);
    useEffect(() => {
        if (data !== undefined) {
            axios.get('/api/getDynamicData/review_comment/' + data.id + '/getOnceData').then(data => {
                if (data.data.status === 200) {
                    setCommentCount(data.data.data.count);
                    setcanwrite(data.data.data.canwrite);
                } else {
                    setcanwrite(true);
                }
            });
        }
    }, [data]);


    const [comment_page, setCP] = useState(0);

    const [comment_rating, setCr] = useState(0);

    const [comments, setcomments] = useState([]);

    useEffect(() => {
        if (data !== undefined) {
            axios.get('/api/getDynamicData/review_comment/' + data.id + '/getComments?page=0').then(res => {
                if (res.data.status !== 200) {
                    return;
                }

                setCP(comment_page + 1);
                let bcomment: any = [...comments];
                for (const [, value] of Object.entries(res.data.comments)) {
                    for (const [, v] of Object.entries(bcomment)) {
                        // @ts-ignore
                        if (v.writer === value.writer) {
                            return;
                        }
                    }
                    bcomment.push(value);
                }

                if (isLogged()) {
                    const id = getAccountData().id;
                    bcomment.sort((a: any, b: any) => {
                        if (id === a.writer) {
                            return -1;
                        } else if (id === b.writer) {
                            return 1;
                        }
                        return (b.id - a.id);
                    });
                }
                setcomments(bcomment);
            });
        }
    }, [data]);

    const [lasttime, setlasttime] = useState('갱신중');
    useEffect(() => {
        if (dynamic !== undefined) {
            const time = new Date(dynamic.lastChanged);
            setlasttime(time.toString());
        }
    }, [dynamic])

    if (notfound) {
        return <ErrorPage statusCode={404}/>
    }

    const isOwner = (isLoaded ? (isLogged() ? (data.owner === getAccountData().id) : false) : false);

    // @ts-ignore
    return (
        <>
            {
                (isLoaded && MetaGenerate(data.name, (data.domain + ', ' + data.view_domain)))
            }
            {
                (isLoaded && (
                    <Head>
                        <link rel="canonical" href={`https://svmoa.live/server/${data.domain}:${data.port}`}/>
                    </Head>
                ))
            }
            <div>
                <div className={Hstyles.page + ' ' + styles.ct}>
                    {
                        (isLoaded && isLogged() && data.owner === null && (
                            <GreenAlert>혹시 당신의 서버인가요?<br/>해당 서버의 주인이 등록되어있지 않아요.<br/>주인 등록하러 가기: <a
                                onClick={(event) => {
                                    event.preventDefault();
                                    location.href = location.href += '/ownervy';
                                }} href={''}>주인등록</a></GreenAlert>
                        ))
                    }
                    <div className={styles.top}>
                        <div className={styles.serverheader}>
                            <span className={styles.server_name}>
                            {
                                (isLoaded ? <>
                                <span
                                    className={styles.online_circle + ' ' + (dynamic.online ? styles.online_circle_green : styles.online_circle_red)}><i
                                    className="fa-solid fa-circle"/></span> {data.name}
                                </> : <Skeleton height={'2rem'} width={'357px'}/>)
                            }
                            </span>
                            <span>
                                {
                                    (isLogged() && isOwner && (
                                        <span title={'서버 정보 수정'}
                                              onClick={() => (location.href = location.href + '/edit')}
                                              className={styles.editbtn}>
                                    <i className="fa-solid fa-pen-to-square"/>
                                </span>
                                    ))
                                }
                                {(isLogged() && !isOwner && (
                                    <span title={'주인 인증'} onClick={() => (location.href = location.href + '/ownervy')}
                                          className={styles.editbtn}>
                                    <i className="fa-solid fa-user-pen"/>
                                </span>
                                ))}
                            </span>
                        </div>
                        <div className={'line'}/>

                        <div style={{fontSize: '0.9rem', color: 'grey', transform: 'translate(0, -6px)'}}>
                            마지막 정보갱신: {lasttime}
                        </div>

                        <div className={styles.tags}>
                            {
                                (isLoaded ? data.tags.map((tag_: string) => {
                                    // @ts-ignore
                                    return tag(tag_, (genreData[tag_] ?? null));
                                }) : <Skeleton height={'2rem'} width={'400px'}/>)
                            }
                        </div>

                        {
                            (isLoaded && <span>
                            <div className={styles.motd} onClick={(isLoaded ? join : () => {
                            })}>
                            <span>
                                <span>
                                    {
                                        // @ts-ignore
                                        (<div dangerouslySetInnerHTML={{__html: motdhtml}}/>)
                                    }
                                </span>
                            </span>
                        </div>
                        </span>)
                        }

                        <div className={styles.server_table}>
                            <div className={styles.server_table_item}>
                                <div className={styles.server_table_item_title}>
                                    접속중인 플레이어
                                </div>
                                {
                                    (isLoaded ? <>
                            <span className={styles.server_numPlayer}>{
                                (isLoaded && dynamic.numPlayer)
                            }명</span>
                                        <span
                                            className={styles.server_maxPlayer}> / {(isLoaded && dynamic.maxPlayers)}</span>
                                    </> : <Skeleton height={'2rem'}/>)
                                }
                            </div>

                            <span className={styles.server_table_item + ' ' + styles.server_table_item_center}>
                            <div className={styles.server_table_item_title}>
                                클라이언트 버전
                            </div>
                            <span className={styles.server_numPlayer}>{(isLoaded ? dynamic.mcver :
                                <Skeleton height={'2rem'}/>)}</span>
                        </span>
                            <span className={styles.server_table_item + ' ' + styles.server_table_engine}>
                            <div className={styles.server_table_item_title}>
                                서버 구동기
                            </div>
                            <div className={styles.server_engine}>{(isLoaded ? dynamic.engine :
                                <Skeleton height={'2rem'}/>)}</div>
                        </span>
                        </div>

                        {isLoaded && data.warn !== undefined && (
                            <h1>주의! 해당 서버에는 문제가 있어 관리진이 경고처리를 했습니다. (관리진의 부적절한 태도, 권력남용 등)</h1>
                        )}
                    </div>

                    <div className={styles.svdomain}>
                        <div className={styles.titleinfo}>서버 접속하기</div>
                        <div className={'line'}/>

                        <br/>

                        <div className={styles.server_table}>
                        <span className={styles.serverd_table_item}>
                            <div className={styles.server_table_item_title}>
                                서버주소
                            </div>
                                <MDBTooltip tag='a' title={'해당 서버 주소를 복사합니다.'}>
                {' '}
                                    <a href={""} onClick={copy}>
                                <span className={styles.server_numPlayer}>{(isLoaded ? data.view_domain :
                                    <Skeleton height={'2.3rem'} width={'12rem'}/>)}</span>
                            </a>
                                </MDBTooltip>

                        </span>
                            <span className={styles.serverd_table_item}>
                            <div className={styles.server_table_item_title}>
                                서버포트
                            </div>
                            <div className={styles.server_engine}>{(isLoaded ? data.port :
                                <Skeleton height={'2.3rem'} width={'12rem'}/>)}</div>
                        </span>
                        </div>

                        <div className={styles.join_btn}>
                            <MDBBtn disabled={!isLoaded} color="success" onClick={join}>서버 접속하기</MDBBtn>
                        </div>
                    </div>

                    <div className={styles.info}>
                        <div className={styles.titleinfo}>소개</div>
                        <div className={'line'}/>
                        <div className={styles.information}>
                            {
                                (isLoaded && (data.video !== null && (
                                    <>
                                        <iframe style={{height: iframe_height}} id={'videoplayer'}
                                                src={"https://www.youtube.com/embed/" + data.video}>
                                        </iframe>
                                        <br/>
                                    </>
                                )))
                            }
                            {
                                (isLoaded ? data.introduce : <Skeleton height={'2.0rem'} count={5}/>)
                            }
                        </div>
                        <br/>
                        <span className={styles.information_notice}>
                                        해당 소개글은 작성자(서버등록인)에 의해 첨부되었으며, SVMOA와는 무관합니다.
                                    </span>

                    </div>

                    <div className={styles.chart}>
                        <div className={styles.titleinfo}>동시접속자 그래프</div>
                        <div className={'line'}/>

                        <div className={styles.graph}>
                            {
                                (isLoaded ? (typeof window !== 'undefined') && playerHistoryData &&
                                    <Chart
                                        // @ts-ignore
                                        options={chartData.options}
                                        // @ts-ignore
                                        series={chartData.series}
                                        type="line"
                                        width="100%"
                                        height="250%"
                                    /> : <Skeleton height={'250px'}/>)
                            }
                            {
                                (isLoaded && !playerHistoryData && (
                                    <p>정보를 수집중입니다.</p>
                                ))
                            }
                            <span>　최대 최근 7일의 기록이 단축되어 보여집니다. (로딩속도 개편) <a href={'#'} onClick={(e) => {
                                e.preventDefault();
                                graphOriginal();
                            }}>원본 보기</a></span>
                        </div>
                    </div>

                    <div className={styles.review}>
                        <div className={styles.titleinfo}>리뷰</div>
                        <div className={'line'}/>

                        <br/>

                        {
                            (isLoaded ? <>
                                <div className={styles.review_text}>
                                    해당 서버의 평균 별점은 <span>{(dynamic.rating)}점</span> / 5 입니다.
                                </div>

                                {
                                    (<div className={styles.review_star_top}>
                                        <div className={styles.review_star}>
                                            <ReactStars
                                                count={5}
                                                value={dynamic.rating}
                                                isHalf={true}
                                                edit={false}
                                                size={24}
                                                activeColor="#ffd700"
                                            />
                                        </div>
                                    </div>)
                                }
                            </> : <Skeleton height={'150px'}/>)
                        }
                        {
                            (canwrite) && <div className={styles.writeBox + ' ' + styles.writeBox_disabled}>
                                <div>
                                    {(isLogged()) ? <>
                                        <ReactStars
                                            count={5}
                                            isHalf={true}
                                            size={24}
                                            activeColor="#ffd700"
                                            onChange={(changed: number) => {
                                                setCr(changed);
                                                window.scrollTo(window.scrollX, window.scrollY + 40);
                                                // @ts-ignore
                                                document.querySelector('#commentwrite').focus();
                                            }}
                                        />
                                        <MDBTextArea onChange={(target) => {
                                            // @ts-ignore
                                            document.querySelector('#commentsubmit').style.display = (target.target.value.length > 0 ? '' : 'none');
                                        }} label='서버를 플레이해보고 느낀점을 알려주세요!' id='commentwrite' rows={4}/>

                                        <MDBBtn onClick={() => {
                                            if (comment_rating <= 0) {
                                                const swal = withReactContent(Swal);
                                                swal.fire({
                                                    icon: 'error',
                                                    title: '별점을 매겨주세요.'
                                                });
                                                return;
                                            }

                                            // @ts-ignore
                                            const body = (document.querySelector('#commentwrite').value);

                                            if (body.length > 300) {
                                                const swal = withReactContent(Swal);
                                                swal.fire({
                                                    icon: 'error',
                                                    title: '글자수는 최대 300자 입니다.'
                                                });
                                                return;

                                            }

                                            axios.post('/api/getDynamicData/review_comment/' + data.id + '/write', querystring.stringify({
                                                // @ts-ignore
                                                body: body,
                                                rating: comment_rating
                                            })).then(res => {
                                                if (res.data.status === 200) {
                                                    history.go(0);
                                                }
                                            })
                                        }} style={{display: 'none'}} id={'commentsubmit'}
                                                className={'text-dark ' + styles.writeSubmit} color='light'>
                                            작성완료
                                        </MDBBtn>
                                    </> : <div className={styles.writeBox_login}>
                                        <a onClick={(event) => {
                                            // @ts-ignore
                                            document.querySelector('.googlelogin').click();
                                            event.preventDefault();
                                        }
                                        } href={''}>로그인</a> 하고 리뷰를 남겨보세요!
                                    </div>}
                                </div>
                            </div>
                        }
                        <div className={styles.reviewBox}>
                            <div className={styles.review_monitor}>총 리뷰 {comment_count}개</div>
                            {/*<div className={styles.review_monitor_owner}>서버주인 댓글 {3}개</div>*/}

                            {
                                comments.map((data: any) => {
                                    return (
                                        <Review id={data.writer} star={data.rating} nick={data.name} content={data.body}
                                                date={snstime(data.date)}
                                                img={data.imageUrl}/>)
                                })
                            }
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

function snstime(time: number): string {
    const now = new Date().getTime();

    if (now - time <= 30000) {
        return '조금전';
    }

    if (now - time <= 86400000) {
        return '오늘';
    }

    if (now - time <= (86400000 * 2)) {
        return '어제';
    }

    return String(Math.floor(((now - time) / 86400000)));
}

function Review(props: any) {
    const id: Number = Number(props.id);
    const star: Number = Number(props.star);
    const nick: string = (props.nick);
    const img: string = (props.img);
    const content: string = (props.content);
    const date: string = (props.date);

    const [basicModal, setBasicModal] = useState(false);
    const toggleShow = () => {
        if (!isLogged()) {
            const swal = withReactContent(Swal);
            swal.fire({
                icon: 'error',
                title: '로그인 후 이용해주세요.',
                text: '신고는 로그인 후 사용할 수 있습니다.'
            })
            return;
        }

        setBasicModal(!basicModal)
    };

    return <>
        <MDBModal show={basicModal} setShow={setBasicModal}>
            <MDBModalDialog style={{minWidth: '40%'}}>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>{nick}님의 리뷰 신고하기</MDBModalTitle>
                        <MDBBtn className='btn-close' color='none' onClick={toggleShow}/>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <form>
                            <div>
                                <MDBRadio name='r' value='' label='원치 않는 상업성 콘텐츠 또는 스팸'/>
                                <MDBRadio name='r' value='' label='포르노 또는 음란물'/>
                                <MDBRadio name='r' label='아동 학대'/>
                                <MDBRadio name='r' label='증오심 표현 또는 노골적인 폭력'/>
                                <MDBRadio name='r' label='테러 조장'/>
                                <MDBRadio name='r' label='희롱 또는 괴롭힘'/>
                                <MDBRadio name='r' label='자살 또는 자해'/>
                                <MDBRadio name='r' label='잘못된 정보'/>
                                <MDBRadio name='r' label='기타'/>
                            </div>
                            {/*<p style={{fontStyle: 'italic', color: 'grey', fontSize: '0.8rem'}}>메뉴는 'Youtube Comment
                                Report'를 참고하였습니다.</p>*/}
                            <br/>
                            <MDBTextArea label='추가적으로 하실 말씀이 있으시다면 작성해주세요.' rows={4}/>
                            <br/>
                            <MDBBtn className='mb-4' type='submit' block>
                                신고
                            </MDBBtn>
                        </form>
                    </MDBModalBody>
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>

        <div className={styles.comment + ' ' + (id === 2 ? styles.blue_comment : '')}>
            <div className={styles.profile}>
                <div className={styles.profileimg}>
                    <img src={img} alt={'프로필 이미지'}/>
                </div>
                <div className={styles.profile_side}>
                    <div className={styles.profile_nick}>{nick}
                        <span className={styles.reviewDate}>
                        {date}
                    </span>
                    </div>
                    <div className={styles.profile_review_star}>
                        <ReactStars
                            count={5}
                            value={star}
                            isHalf={true}
                            edit={false}
                            size={15}
                            activeColor="#ffd700"
                        />
                    </div>
                </div>

                <div className={styles.profile_three_dot + ' profile_three_dot'}>
                    <MDBDropdown>
                        <MDBDropdownToggle style={{color: 'grey', cursor: 'pointer'}} tag='a' className='nav-link'>
                            <i className="fa-solid fa-ellipsis-vertical"/>
                        </MDBDropdownToggle>
                        <MDBDropdownMenu>
                            {
                                (!isLogged() && <MDBDropdownItem>
                                    <MDBDropdownLink onClick={toggleShow}>신고하기</MDBDropdownLink>
                                </MDBDropdownItem>)
                            }
                            {
                                isLogged() && (((getAccountData().id === id)) ? ((
                                        <MDBDropdownItem>
                                            <MDBDropdownLink onClick={() => {
                                                const swal = withReactContent(Swal);
                                                swal.fire({
                                                    icon: 'question',
                                                    title: '정말 삭제할까요?',
                                                    showCancelButton: true,
                                                    confirmButtonText: '삭제하기',
                                                    cancelButtonText: '취소'
                                                }).then(res => {
                                                    if (res.isConfirmed && serverid !== -1) {
                                                        axios.get('/api/getDynamicData/review_comment/' + serverid + '/delete').then(res => {
                                                            if (res.data.status === 200) {
                                                                const swal = withReactContent(Swal);
                                                                swal.fire({
                                                                    icon: 'success',
                                                                    title: '리뷰를 삭제했어요.',
                                                                    confirmButtonText: '확인',
                                                                }).then(() => history.go(0));
                                                                return;
                                                            }
                                                            const swal = withReactContent(Swal);
                                                            swal.fire({
                                                                icon: 'error',
                                                                title: '리뷰를 삭제하던중 오류가 발생했어요.',
                                                                confirmButtonText: '확인',
                                                            }).then(() => history.go(0));
                                                        })
                                                    }
                                                })
                                            }}>삭제</MDBDropdownLink>
                                        </MDBDropdownItem>)
                                ) : <MDBDropdownItem>
                                    <MDBDropdownLink onClick={toggleShow}>신고하기</MDBDropdownLink>
                                </MDBDropdownItem>)
                            }
                            <MDBDropdownItem>
                                <MDBDropdownLink>닫기</MDBDropdownLink>
                            </MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                </div>
            </div>

            <div className={styles.reviewContent}>
                {content}
            </div>
        </div>
        <br/>
    </>
}