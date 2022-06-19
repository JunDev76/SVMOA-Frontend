import {useRouter} from "next/router";
import {MDBBtn, MDBFile, MDBInput, MDBRadio, MDBTooltip} from "mdb-react-ui-kit";
import styles from '../styles/server_register.module.css';


import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();


import {useEffect, useRef, useState} from "react";
import * as url from "url";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axios from "axios";
import querystring from "querystring";
import {getAccountData} from "../src/SessionManager";

function NotNow() {
    return <MDBTooltip tag={'span'} title='서버 주인 인증 후 수정 할 수 있습니다.'>
        <i className={"fa-solid fa-ban " + styles.notnow}/>
    </MDBTooltip>

}

export default function EditPage() {
    const [disableBtn, setDisableBtn] = useState(false);

    // @ts-ignore
    return <>
        <form onSubmit={(event => {
            event.preventDefault();

            // @ts-ignore
            const _name = event.target.name.value;
            // @ts-ignore
            const _domain = event.target.domain.value;
            // @ts-ignore
            const _port = event.target.port.value;

            setDisableBtn(true);
            axios.get('/api/servermanage/checkServerStat?domain=' + _domain + '&port=' + _port).then(res => {
                if (res.data.return === 'fail') {
                    setDisableBtn(false);
                    const swal = withReactContent(Swal);

                    swal.fire({
                        icon: 'error',
                        title: '상태 확인',
                        text: '서버가 꺼져있거나, 주소가 잘못되었거나 `enable-query`가 off 인것 같아요.',
                        showConfirmButton: true,
                        confirmButtonText: '확인하기'
                    }).then(() => {
                        // @ts-ignore
                        document.querySelector("[name='domain']").focus();
                        window.scrollTo(0, 0)
                    });
                    return;
                }

                axios.get('/api/servermanage/isRegistered?domain=' + _domain + '&port=' + _port).then(res => {
                    if (res.data.return === 'fail') {
                        setDisableBtn(false);
                        const swal = withReactContent(Swal);

                        swal.fire({
                            icon: 'error',
                            title: '이미...',
                            text: '이미 등록되어있는 서버예요.',
                            showConfirmButton: true,
                            confirmButtonText: '해당 페이지로'
                        }).then(() => {
                            location.href = '/server/' + _domain + ':' + _port;
                        });
                        return;
                    }
                    axios.post('/api/servermanage/register_server', querystring.stringify({
                        name: _name,
                        domain: _domain,
                        port: _port
                    })).then(r => {
                        if (r.data.ok !== undefined) {
                            const swal = withReactContent(Swal);

                            swal.fire({
                                icon: 'success',
                                title: 'SUCCESS!',
                                text: '서버가 등록되었습니다..',
                                showConfirmButton: true,
                                confirmButtonText: '홈으로'
                            }).then(() => {
                                location.href = '/server/' + _domain + ':' + _port + '/ownervy';
                            });
                        }
                    })
                })
            })
        })} className={styles.input_div}>
            <span className={styles.title}>
                <span className={'md'}>server.properties</span> 파일을 열어, 노랗게 칠해진 부분이 같은지 확인하세요.<span
                className={styles.require_star}>*</span>
            </span>
            {
                (<>
                        <div style={{width: '100%'}} className={'md'}>
                            #Pocketmine-MP example<br/>
                            #Properties Config file<br/>
                            language=kor<br/>
                            motd=svmoalive<br/>
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
                )
            }
            <div className={styles.d}>
                <span>모든 포트가 열려있지 않은 상태(포트포워딩, 방화벽)라면 서버가 열려있는 포트를 TCP/UDP 모두 개방 해주셔야 합니다. (Query)</span>
            </div>
            <br/>
            <span className={styles.title}>
                서버 이름<span className={styles.require_star}>*</span>
            </span>
            <MDBInput name={'name'} required={true} wrapperClass='mb-4' placeholder={'XX서버'}/>
            <div className={styles.d}>
                <span>서버의 이름을 입력해주세요.<br/>홍보메세지가 아닌, 서버의 이름을 입력해주세요(ex: 하이픽셀)<br/>홍보 메세지가 작성되면, 서버 메세지가 변경될 수 있습니다.</span>
            </div>

            <span className={styles.title}>
                서버 주소<span className={styles.require_star}>*</span>
            </span>
            <MDBInput required={true} name={'domain'} wrapperClass='mb-4'
                      placeholder={'example.kr'}/>
            <div className={styles.d}>
                <span>서버 주소가 잘못될 경우 정보 수집에 문제가 생겨요!</span>
            </div>

            <span className={styles.title}>
                서버 포트<span className={styles.require_star}>*</span>
            </span>
            <MDBInput defaultValue={"19132"} name={'port'} required={true} wrapperClass='mb-4'/>
            <div className={styles.d}>
                <span>서버 포트가 잘못될 경우 정보 수집에 문제가 생겨요!</span>
            </div>

            <span className={styles.title}>
                홍보 영상 유튜브 링크<NotNow/>
            </span>
            <MDBInput disabled={true} wrapperClass='mb-4' placeholder={'https://youtu.be/~~'}/>

            <span className={styles.title}>
                배너<NotNow/>
            </span>
            <div>
                <MDBFile disabled={true} size='lg'/>
            </div>
            <div className={styles.d}>
                <span>348x60 에 최적화 되어있어요.</span>
            </div>

            <br/>

            <span className={styles.title}>
                소개 메세지<NotNow/>
            </span>
            <textarea disabled={true} style={{minHeight: "150px"}}
                      className="form-control rounded-0"/>

            <br/>

            <span className={styles.title}>
                서버 플랫폼<NotNow/>
            </span>
            <div>
                <MDBRadio disabled label='JE (자바에디션)'/>
                <MDBRadio defaultChecked disabled label='BE(베드락에디션)'/>
                <div className={styles.d}>
                    <span>PE는 BE에 포함됩니다.</span>
                </div>
            </div>

            <span className={styles.title}>
                장르<NotNow/>
            </span>
            <MDBInput disabled={true} value={'비어있음'} wrapperClass='mb-4'/>
            <br/>
            <MDBBtn type={'submit'} disabled={disableBtn} className={styles.submit}>저장하기</MDBBtn>
        </form>
    </>
}