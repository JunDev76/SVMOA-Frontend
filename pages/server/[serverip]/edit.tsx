import {useRouter} from "next/router";
import {MDBBtn, MDBFile, MDBInput, MDBRadio} from "mdb-react-ui-kit";
import styles from '../../../styles/server_edit.module.css';


import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();


import {useEffect, useRef, useState} from "react";
import * as url from "url";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axios from "axios";
import querystring from "querystring";
import {getAccountData, isLogged} from "../../../src/SessionManager";

export default function EditPage() {
    const router = useRouter();
    const serverip = router.query.serverip;
    if (typeof serverip !== 'string') {
        return <></>;
    }

    const colourOptions = [
        {label: 'EULA 준수', value: '1'},
        {label: '마인팜', value: '2'},
        {label: '경제', value: '3'},
        {label: 'PVP', value: '4'},
        {label: 'PVE', value: '5'},
        {label: 'RPG', value: '6'},
        {label: '바닐라', value: '7'},
        {label: '인생약탈', value: '8'},
        {label: '스카이그리드', value: '9'},
        {label: '미니게임', value: '10'},
        {label: '전쟁', value: '11'},
        {label: '국가전쟁', value: '12'},
        {label: '길드전쟁', value: '13'},
        {label: '스카이블록', value: '14'},
        {label: '쿠키런', value: '15'},
        {label: '성인 전용', value: '16'},
        {label: '포켓몬', value: '17'},
        {label: '친목', value: '18'}
    ];

    const [youtubetag, setyoutubetag] = useState('');

    const [genre, setgenre] = useState(['eula']);

    const [img, setimg] = useState('');
    const [base64banner, setbase64banner] = useState('');

    const [ytwarn, setytwarn] = useState('');


    const [serverDomain, setServerDomain] = useState('');
    const [serverPort, setServerPort] = useState(19132);
    const [serverBanner, setServerBanner] = useState('');
    const [serverGenre, setServerGenre] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            if(!isLogged()){
                const swal = withReactContent(Swal);

                swal.fire({
                    icon: 'error',
                    title: '로그인 후 이용해주세요..',
                    showConfirmButton: true,
                    confirmButtonText: '네'
                }).then(r => {
                    location.href = '/';
                });
                return <></>;
            }

            const domain = serverip.split(':')[0];
            const port = serverip.split(':')[1] ?? 19132;

            axios.get(`/api/query?singlepage&domain=${domain}&port=${port}`).then((res_: any) => {
                const res = res_.data;

                if(res.owner !== getAccountData().id){
                    const swal = withReactContent(Swal);

                    swal.fire({
                        icon: 'error',
                        title: '이서버의 주인이 아닙니다.',
                        text: '로그인된 계정을 확인하세요.',
                        showConfirmButton: true,
                        confirmButtonText: '네'
                    }).then(r => {
                        location.href = '/';
                    });
                    return <></>;
                }

                // @ts-ignore
                document.querySelector('#servername').value = res.name;
                // @ts-ignore
                document.querySelector('#ytlink').value = 'https://youtu.be/' + res.video;
                setyoutubetag(res.video);
                // @ts-ignore
                document.querySelector('#introduce').innerText = res.introduce;
                setServerDomain(res.domain);
                setServerPort(res.port);
                setServerBanner('exist');
                let __: any = [];
                res.tags.map((genre: any) => {
                    for (const label of colourOptions) {
                        if (label.label === genre) {
                            __.push(label);
                            return;
                        }
                    }
                    __.push({label: genre, value: (Math.random() / 10000).toString()});
                })
                setgenre(__.map((r: any) => {
                        return r.label
                    }
                ));
                setServerGenre(__)
            });
        });
    }, [serverip])

    // @ts-ignore
    return <>
        <form onSubmit={(event => {
            event.preventDefault();

            // @ts-ignore
            const _name = event.target.name.value;
            // @ts-ignore

            const _videoTag = youtubetag;
            const _base64banner = base64banner;

            // @ts-ignore
            const _introduce = event.target.introduce.value;
            ``
            axios.post('/api/servermanage/serveredit/' + serverip, querystring.stringify({
                name: _name,
                video: _videoTag,
                banner: _base64banner,
                introduce: _introduce,
                tags: genre
            })).then(res => {
                if(res.data.ok === 1){
                    const swal = withReactContent(Swal);

                    swal.fire({
                        icon: 'success',
                        title: '저장 성공!',
                        text: '곧 정보가 갱신됩니다.',
                        showConfirmButton: true,
                        confirmButtonText: '네'
                    }).then(() => {
                        location.href = '/';
                    });
                    return <></>;
                }
            })
        })} className={styles.input_div}>
            <span className={styles.title}>
                서버 이름
            </span>
            <MDBInput id={'servername'} name={'name'} required={true} wrapperClass='mb-4' placeholder={'XX서버'}/>
            <div className={styles.d}>
                <span>서버의 이름을 입력해주세요.<br/>홍보메세지가 아닌, 서버의 이름을 입력해주세요(ex: 하이픽셀)<br/>홍보 메세지가 작성되면, 서버 메세지가 변경될 수 있습니다.</span>
            </div>

            <span className={styles.title}>
                서버 주소
            </span>
            <MDBInput value={serverDomain} disabled={true} required={true} wrapperClass='mb-4'
                      placeholder={'example.kr'}/>
            <div className={styles.d}>
                <span>서버 주소가 잘못될 경우 정보 수집에 문제가 생겨요!</span>
            </div>

            <span className={styles.title}>
                서버 포트
            </span>
            <MDBInput value={serverPort.toString()} disabled={true} required={true} wrapperClass='mb-4'/>
            <div className={styles.d}>
                <span>서버 포트가 잘못될 경우 정보 수집에 문제가 생겨요!</span>
            </div>

            <span className={styles.title}>
                홍보 영상 유튜브 링크
            </span>
            <MDBInput id={'ytlink'} onChange={(e) => {
                let val = e.target.value;
                if (!(val.includes('youtu.be') || val.includes('youtube.com/watch?v='))) {
                    setytwarn('올바른 링크를 게시해주세요.');
                    setyoutubetag('');
                } else {
                    setytwarn('')

                    if (val.includes('youtu.be')) {
                        const tag = val.split('youtu.be/')[1];
                        setyoutubetag(tag);
                        return;
                    }

                    if (val.includes('youtube.com')) {
                        val.replace('wwww.', '').replace('https://', '').replace('http://', '');
                        const tag = url.parse(val, true);
                        // @ts-ignore
                        setyoutubetag(tag.query.v ?? '');
                        return;
                    }
                }
            }
            } wrapperClass='mb-4' placeholder={'https://youtu.be/~~'}/>
            <div className={styles.d}>
                <span>유튜브 링크만 게시해주세요.<br/>* 필수가 아닙니다!<br/></span>
                <span style={{color: 'red'}}>{ytwarn}</span>
            </div>

            <span className={styles.title}>
                배너
            </span>
            {
                (img === '' && serverBanner !== '' && (
                    <div>
                        <div className={styles.img}>
                            <br/>
                            <img
                                src={`/api/serverdata/banner?domain=${serverDomain}&port=${serverPort}`}
                                className={'img-fluid hover-shadow'}
                                alt=''
                            />
                        </div>

                        <br/>
                    </div>
                ))}{
            (img !== '' && (
                <div>
                    <div className={styles.img}>
                        <br/>
                        <img
                            src={img}
                            className={'img-fluid hover-shadow'}
                            alt=''
                        />
                    </div>

                    <br/>
                </div>
            ))
        }
            <div>
                <MDBFile onChange={async (event) => {
                    const obj = event.target;
                    const pathpoint = obj.value.lastIndexOf('.');
                    const filepoint = obj.value.substring(pathpoint + 1, obj.value.length);
                    const filetype = filepoint.toLowerCase();

                    if (!(filetype === 'jpg' || filetype === 'gif' || filetype === 'png' || filetype === 'jpeg')) {
                        event.preventDefault();
                        event.target.value = '';
                        const swal = withReactContent(Swal);
                        swal.fire({
                            icon: 'warning',
                            title: '확장자 오류',
                            text: 'jpeg(jpg), gif, png 형식만 업로드 가능해요.'
                        });
                        setimg('');
                        setbase64banner('');
                        return;
                    }

                    const getBase64 = (file: any) => {
                        return new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = () => resolve(reader.result);
                            reader.onerror = error => reject(error);
                        });
                    }

                    // @ts-ignore
                    setbase64banner(await getBase64(await event.target.files[0]));
                    // @ts-ignore
                    setimg(window.URL.createObjectURL(event.target.files[0] ?? ''));
                }
                } accept={'image/jpeg, image/png, image/gif'} size='lg'/>
            </div>
            <div className={styles.d}>
                <span>348x60 에 최적화 되어있어요.</span>
            </div>

            <br/>

            <span className={styles.title}>
                소개 메세지
            </span>
            <textarea id={'introduce'} name={'introduce'} required={true} style={{minHeight: "150px"}}
                      className="form-control rounded-0"/>

            <br/>

            <span className={styles.title}>
                서버 플랫폼
            </span>
            <div>
                <MDBRadio disabled label='JE (자바에디션)'/>
                <MDBRadio defaultChecked disabled label='BE(베드락에디션)'/>
                <div className={styles.d}>
                    <span>PE는 BE에 포함됩니다.</span>
                </div>
            </div>

            <span className={styles.title}>
                장르
            </span>
            {
                (serverGenre &&
                    <CreatableSelect
                        formatCreateLabel={(inputText) => `"${inputText}" 라는 장르를 등록합니다.`}
                        placeholder={'비어있음'}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        value={serverGenre}
                        isMulti
                        options={colourOptions}
                        onChange={(e: any) => {
                            setServerGenre(e);
                            setgenre(e.map((r: any) => {
                                    return r.label
                                }
                            ));
                            console.log(genre)
                        }}
                    />
                )
            }
            <br/>
            <MDBBtn type={'submit'} className={styles.submit}>저장하기</MDBBtn>
        </form>
    </>
}