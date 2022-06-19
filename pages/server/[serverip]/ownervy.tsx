import Swal from 'sweetalert2'
import {useRouter} from "next/router";
import {YellowAlert} from "../../../src/Alerts";
import styles from '../../../styles/ownervy.module.css'
import {useEffect, useState} from "react";
import axios from "axios";
import {getAccountData, isLogged} from "../../../src/SessionManager";
import withReactContent from "sweetalert2-react-content";
import {MDBBtn} from "mdb-react-ui-kit";

export default function ownervy() {
    if (!isLogged()) {
        return <></>
    }

    const serverip = useRouter().query.serverip;
    if (typeof serverip !== 'string') {
        return <></>;
    }
    const domain = serverip.split(':')[0];
    const port = parseInt((serverip.split(':')[1] ?? 19132));

    const [data, setdata]: any = useState({});
    const isLoaded = () => {
        return Object.entries(data).length > 0;
    }

    useEffect(() => {
        axios.get(`/api/client?get&domain=${domain}&port=${port}`).then(res => {
            setdata(res.data);
        })
    }, [domain]);

    const [example1show, setexample1show] = useState(false);

    const toggleexample1show = () => {
        setexample1show(!example1show);
    }

    return ((isLoaded() ? <>
        <div className={styles.body}>
            <h3>{data.name}</h3><p>해당 서버의 주인임을 인증합니다.</p>
            <div className={'line'}/>

            <div className={styles.step_circle}>
                <div>
                    1
                </div>
            </div>

            <div>
                <div>
                    <span className='md'>server.properties</span>
                    파일을 열어,
                </div>
                <div>
                    <span className='md'>motd</span>란을 다음과 같이 변경해주세요.
                </div>
                <div style={{color: 'red', fontSize: '0.8rem'}}>* 인증 완료 후 다시 변경가능하오니, 안심하세요!</div>
                <br/>
                <div>
                        <span><span className='md'>motd=svmoa-live-verify-owner--owner={getAccountData().id}</span><i
                            style={{cursor: 'pointer'}} onClick={() => {
                            navigator.clipboard.writeText(`motd=svmoa-live-verify-owner--owner=${getAccountData().id}`).then(() => {
                            });

                            const swal = withReactContent(Swal);
                            swal.fire({
                                icon: 'success',
                                title: '복사 성공',
                                text: '클립보드에 복사하였어요!'
                            });
                        }} className="fa-solid fa-copy"/></span>
                </div>
                <div style={{marginTop: '0.1rem'}}>
                    <a href={''} onClick={(event) => {
                        event.preventDefault();
                        toggleexample1show();
                    }}>{((!example1show) ? '예시보기' : '예시닫기')}</a>
                </div>
                {
                    (example1show && (<>
                            <div style={{width: '100%'}} className={'md'}>
                                #Pocketmine-MP example<br/>
                                #Properties Config file<br/>
                                language=kor<br/>
                                <span
                                    style={{backgroundColor: "yellow"}}>motd=svmoa-live-verify-owner--owner={getAccountData().id}</span><br/>
                                server-name=svmoalive<br/>
                                server-port=19132<br/>
                                gamemode=0<br/>
                                max-players=10<br/>
                                white-list=off<br/>
                                <span style={{backgroundColor: "yellow"}}>enable-query=on</span><br/>
                                server-portv6=19133<br/>
                                enable-ipv6=on<br/>
                                force-gamemode=off<br/>
                                hardcore=off<br/>
                                pvp=on<br/>
                                difficulty=2<br/>
                                generator-settings=<br/>
                                level-name=world<br/>
                                level-seed=<br/>
                                level-type=DEFAULT<br/>
                                auto-save=on<br/>
                                view-distance=8<br/>
                                xbox-auth=on
                            </div>
                        </>
                    ))
                }
                <br/>
                <div style={{color: 'red', fontSize: '0.8rem'}}>* 변경 완료 후 꼭 "저장" 하고 "재부팅" 해주세요!!</div>
                <MDBBtn onClick={() => {
                    const swal = withReactContent(Swal);

                    swal.fire({
                        title: '저장 후 재부팅 하셨나요?',
                        icon: 'question',
                        iconHtml: 'Q',
                        confirmButtonText: '당연하죠!',
                        cancelButtonText: '아니요.',
                        showCancelButton: true
                    }).then(res => {
                        if (res.isConfirmed) {
                            axios.get('/api/auth/motdcheck/' + data.id).then(res_ => {
                                const res = res_.data;
                                if (res.status === 201) {
                                    swal.fire({
                                        title: `${res.left}초 뒤에 다시 시도해주세요.`,
                                        icon: 'warning',
                                        confirmButtonText: '네',
                                    });
                                    return;
                                }
                                if (res.status === 202) {
                                    swal.fire({
                                        title: `서버가 켜져있는지, 'enable-query'가 'on' 인지 확인해주세요.`,
                                        icon: 'error',
                                        confirmButtonText: '네',
                                    });
                                    return;
                                }
                                if (res.status === 203) {
                                    swal.fire({
                                        title: `motd가 다릅니다.`,
                                        icon: 'error',
                                        confirmButtonText: '네',
                                    });
                                    return;
                                }
                                if (res.status !== 200) {
                                    return;
                                }

                                swal.fire({
                                    title: `완료! 주인인증을 성공하셨습니다.`,
                                    icon: 'success',
                                    confirmButtonText: '네',
                                }).then(() => {
                                    location.href = '/server/' + (data.domain + ':' + data.port) + '/edit';
                                });
                            })
                        }
                    })
                }} style={{width: '100%'}} outline className='mx-2' color='success'>
                    인증하기
                </MDBBtn>
            </div>
        </div>
    </> : ''))
}