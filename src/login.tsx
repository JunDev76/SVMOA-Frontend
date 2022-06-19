import styles from "../styles/login.module.css";
import {MetaGenerate} from "./MetaGenerator";
import {
    MDBInput,
    MDBCol,
    MDBRow,
    MDBCheckbox,
    MDBBtn,
    MDBIcon, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter
} from 'mdb-react-ui-kit';
import {useEffect, useRef, useState} from "react";
import {useCookies} from "react-cookie";
import * as querystring from "querystring";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Script from 'next/script'
import GoogleLogin from "react-google-login";
import {getAccountData} from "./SessionManager";

export function LoginModal(toggleShow: any, basicModal: any, setBasicModal: any) {
    const [loaded, setloaded] = useState(false);

    const [isLogin, setLoginForm] = useState(true);

    const [scriptloaded, setsl] = useState(false);

    const [rc_token, set_rc_token] = useState(null);

    useEffect(() => {
        setloaded(true);
    }, []);

    useEffect(() => {
        if (scriptloaded) {
            // @ts-ignore
            const grecaptcha = window.grecaptcha;
            grecaptcha.ready(function () {
                grecaptcha.execute('6LdN5iYfAAAAALMZmjAaYM5ZphGsHUOkd_XGSKOL', {action: 'homepage'}).then(function (token: any) {
                    set_rc_token(token);
                });
            });
        }
    }, [scriptloaded])


    return <>
        {
            (loaded && !isLogin &&
                <Script onLoad={() => setsl(true)}
                        src="https://www.google.com/recaptcha/api.js?render=6LdN5iYfAAAAALMZmjAaYM5ZphGsHUOkd_XGSKOL"/>)
        }
        {
            (loaded && <MDBModal show={basicModal} setShow={setBasicModal} tabIndex={1}>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>{
                                (isLogin ? '로그인' : '회원가입')
                            }</MDBModalTitle>
                            <MDBBtn className={'btn-close '} color='none'  onClick={toggleShow}/>
                        </MDBModalHeader>
                        <MDBModalBody>
                            {
                                (isLogin ? <LoginForm setLBody={setLoginForm}/> :
                                    <RegisterForm rctoken={rc_token} setLBody={setLoginForm}/>)
                            }
                        </MDBModalBody>

                        {/*<MDBModalFooter>
                            <MDBBtn color='primary' onClick={toggleShow}>
                                닫기
                            </MDBBtn>
                        </MDBModalFooter>*/}
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>)
        }
    </>;
}


function RegisterForm(p: any) {
    const [email, setEmail] = useState('v');
    const [pw, setpw] = useState('');

    const [no_disable, setdisable] = useState(true);

    const [pw_match_message, setpwmatch_message] = useState('이메일 주소를 입력해주세요.');

    const [r, setr] = useState(<></>);

    useEffect(() => {
        // @ts-ignore
        setr(<>
            <form className={styles.form} method={'post'} action={'/api/auth/login'}>
                <MDBInput onChange={(event) => {
                    const val = event.target.value;
                    if (!(/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i).test(val)) {
                        setpwmatch_message('이메일 형태로 입력해주세요.');
                        setdisable(true);
                    } else {
                        setdisable(false);
                        setpwmatch_message('');
                    }
                    setEmail(val)
                }} className={'mb-4'} type='email' name={'email'} label='이메일 주소'/>
                <MDBInput className='mb-4' onChange={(event) => {
                    const val = event.target.value;
                    if (!(/^[A-Za-z0-9`~!@#\$%\^&\*\(\)\{\}\[\]\-_=\+\\|;:'"<>,\./\?]{8,20}$/).test(val)) {
                        setpwmatch_message('8~20자 영문 대소문자, 숫자, 특수문자를 사용하세요.');
                        setdisable(true);
                        // @ts-ignore
                        setpw(false)
                    } else {
                        setpwmatch_message('');
                        setdisable(false);
                        setpw(val)
                    }
                }} type='password' name={'pw'} label='비밀번호'/>
                <MDBInput className='mb-4' onChange={(event) => {
                    if (event.target.value !== pw) {
                        setpwmatch_message('비밀번호가 위와 일치하지 않아요.');
                        setdisable(true);
                    } else {
                        setpwmatch_message('');
                        setdisable(false);
                    }
                }} type='password' label='비밀번호 재입력'/>
                <span className={styles.alert}>{pw_match_message}</span>

                <div className={styles.gr_protect}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt={'구글 리캡챠로 부터 보호받고 있습니다.'} src={'/gr-protect.png'}/>
                </div>

                <MDBBtn disabled={no_disable} type='submit' onClick={(event) => {
                    event.preventDefault();

                    axios.post('/api/auth/register', querystring.stringify({
                        email: email,
                        pw: pw,
                        gr: p.rctoken
                    })).then(r => {
                        console.log(r.data)
                        const swal = withReactContent(Swal);
                        if (r.data.err !== undefined && r.data.err === 3) {
                            swal.fire({
                                icon: 'error',
                                title: '오류',
                                text: '이미 등록된 이메일 입니다.'
                            });
                            return;
                        }
                        if (r.data.err !== undefined && r.data.err === 5) {
                            swal.fire({
                                icon: 'error',
                                title: '오류',
                                text: '다시 시도해주세요.'
                            }).then(r => {
                                history.go(0);
                            });
                            return;
                        }
                        if (r.data.err !== undefined && r.data.err === 4) {
                            swal.fire({
                                icon: 'error',
                                title: '잠시만 기다려주세요.',
                                html: ('너무 많은 이메일 요청이 감지됐어요.<br/>' + (r.data.time + '초 뒤에 다시 시도해주세요.'))
                            });
                            return;
                        }
                        if (r.data.email !== undefined) {
                            // @ts-ignore
                            setr(<>
                                <div className={styles.email}>
                                    <i className="fa-solid fa-envelope"/>
                                </div>
                                <div className={styles.email_text}>
                                    <span>인증 이메일을 보냈어요.</span>
                                    <p>이메일이 보이지 않는다면 <b>스펨메일함</b>을 꼭 확인해주세요.<br/>메일 발송은 최대 3분이 소요될 수 있습니다.</p>
                                </div>
                            </>);
                            return;
                        }
                        swal.fire({
                            icon: 'question',
                            title: '알 수 없음',
                            text: '서버에 문제가 있는것 같아요. 다음에 다시 시도해주세요.'
                        });
                        return;
                    });
                }
                } className='mb-4' block>
                    회원가입
                </MDBBtn>

                <div className='text-center'>
                    <p>
                        계정이 있으신가요? <a href='' onClick={(e) => {
                        e.preventDefault();
                        p.setLBody(true);
                    }
                    }>로그인</a>
                    </p>
                </div>
            </form>
        </>)
    }, [pw_match_message, p, no_disable, pw, email])

    return r;
}

function LoginForm(p: any) {
    const [cookies, setcookie, removecookies] = useCookies(['emailcookie']);

    const v = cookies.emailcookie ?? '';

    const [email, setEmail] = useState(v);
    const [active, setActive] = useState(false);

    const [rememberid, setrememberid] = useState(true);

    const [pw, setpw] = useState('');

    useEffect(() => {
        setEmail(v);
        setActive(v);
    }, [v])

    return <form className={styles.form} method={'post'} action={'/api/auth/login'}>
        <MDBInput tabIndex={1} defaultValue={v} onChange={(event) => {
            setEmail(event.target.value)
        }} className={'mb-4 ' + (active ? 'active' : '')} type='email' name={'email'} label='이메일 주소'/>
        <MDBInput className='mb-4' onChange={(event) => {
            setpw(event.target.value)
        }} type='password' name={'passwd'} label='비밀번호'/>

        <MDBRow className='mb-4'>
            <MDBCol className='d-flex justify-content-center'>
                <MDBCheckbox id='rememberID' label='이메일 기억하기' onChange={() => setrememberid(!rememberid)}
                             defaultChecked/>
            </MDBCol>
            <MDBCol>
                <a href='#!'>비밀번호를 잊으셨나요?</a>
            </MDBCol>
            <div className={'text-center'}>
                <GoogleLogin
                    className={styles.hidden + ' googlelogin'}
                    clientId="694742479607-go7te4r2d6a8lqookrgoo3o0dakh62e9.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={(res) => {
                        if(!("accessToken" in res)){
                            return;
                        }
                        const token = res.accessToken;

                        axios.get('/api/auth/register_google?token=' + token).then((res:any) => {
                            const swal = withReactContent(Swal);
                            if(res.data.ok !== undefined){
                                swal.fire({
                                    icon: 'success',
                                    title: '로그인 완료!',
                                    text: '구글 계정으로 로그인 되었어요.',
                                    confirmButtonText: '네'
                                }).then(() => {
                                    history.go(0);
                                });
                                return;
                            }
                            if(res.data.data.email !== undefined){
                                swal.fire({
                                    icon: 'success',
                                    title: '소셜 회원가입 완료!',
                                    text: res.data.data.email + ' 계정으로 로그인 되었어요.',
                                    confirmButtonText: '네'
                                }).then(() => {
                                    history.go(0);
                                });
                                return;
                            }
                        });
                    }}
                    onFailure={() => {}}
                    cookiePolicy={'single_host_origin'}
                />
                <br/>
                <p>소셜 계정으로 로그인 하기:</p>

                <MDBBtn onClick={(event) => {
                    event.preventDefault();

                    // @ts-ignore
                    document.querySelector('.googlelogin').click()
                }
                } floating className='mx-1'>
                    <MDBIcon fab icon='google' />
                </MDBBtn>
            </div>
        </MDBRow>

        <MDBBtn type='submit' onClick={(event) => {
            event.preventDefault();

            if (rememberid) {
                setcookie('emailcookie', email);
            } else {
                removecookies('emailcookie');
            }

            axios.post('/api/auth/login', querystring.stringify({
                email: email,
                pw: pw
            })).then(r => {
                const swal = withReactContent(Swal);
                if (r.data.err !== undefined) {
                    swal.fire({
                        icon: 'error',
                        title: 'Login ERR',
                        text: '이메일 또는 비밀번호를 확인해주세요.'
                    });
                    return;
                }
                if (r.data.ok !== undefined) {
                    swal.fire({
                        icon: 'success',
                        title: 'Login Success',
                        text: email + '(으)로 로그인 되었어요.'
                    }).then(r => {
                        history.go(0);
                    });
                    return;
                }
                swal.fire({
                    icon: 'question',
                    title: '알 수 없음',
                    text: '서버에 문제가 있는것 같아요. 다음에 다시 시도해주세요.'
                });
                return;
            });
        }
        } className='mb-4' block>
            로그인
        </MDBBtn>

        <div className='text-center'>
            <p>
                계정이 없으신가요? <a href='' onClick={(e) => {
                e.preventDefault();
                p.setLBody(false);
            }
            }>가입하기</a>
            </p>
        </div>
    </form>
}

export default function login() {
    return (
        <div className={styles.container}>
            {
                MetaGenerate('서버랭킹')
            }


        </div>
    )
}