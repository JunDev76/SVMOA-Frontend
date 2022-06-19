import NavStyle from '../styles/Navbar.module.css';
import Link from 'next/link';
import {useRouter} from "next/router";
import {
    MDBContainer,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarToggler,
    MDBIcon,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBBtn,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBDropdownLink,
    MDBCollapse
} from 'mdb-react-ui-kit';
import {useState} from "react";
import {inspect} from "util";
import styles from '../styles/Navbar.module.css';
import {LoginModal} from "../src/login";
import {getAccountData, isLogged} from "./SessionManager";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axios from "axios";
import GoogleLogin from "react-google-login";
import querystring from "querystring";

let now: string | null = null;

function isNow(tag: string) {
    return tag === now;
}

function nowClass(tag: string) {
    if (isNow(tag)) {
        return {
            //id: 'now',
            'active': true
        }
    }
    return [];
}

function logout() {
    const swal = withReactContent(Swal);

    swal.fire({
        icon: 'question',
        title: '로그아웃 할까요?',
        text: getAccountData().email + '에서 로그아웃 할까요?',
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: '아니요',
        confirmButtonText: '네'
    }).then(r => {
        if (r.isConfirmed) {
            axios.get('/api/auth/logout').then(() => history.go(0));
        }
    });
}

export function toHome(){
    // @ts-ignore
    document.querySelector('#tohome').click();
}

export default function Navbar() {
    return (<>
        <nav className={styles.nav}>
            <div>
                <div>
                    <div>
                        <div className={styles.alignLeft}>
                            <Link href={'/rank'}>
                                <a id={'tohome'} href={'/'} className={styles.logo}>
                                    <MDBNavbarBrand><img alt={'LOGO'} src={'/logo_r.svg'} width={'90px'}/></MDBNavbarBrand>
                                </a>
                            </Link>
                        </div>

                        <div className={styles.alignRight}>
                            {
                                (isLogged() ? (
                                    <MDBBtn color={'danger'} onClick={logout} style={{width: '100px'}}>로그아웃</MDBBtn>
                                ) : (
                                    /*<MDBBtn onClick={toggleShow} style={{width: '80px'}}>로그인</MDBBtn>*/

                                    <span>
                                        <GoogleLogin
                                            className={styles.hidden + ' googlelogin'}
                                            clientId="133127489029-0o57nc3pfao6uo5f2nmhnjeaemvc7ica.apps.googleusercontent.com"
                                            buttonText="로그인"
                                            render={renderProps => (
                                                <span onClick={renderProps.onClick} dangerouslySetInnerHTML={{
                                                    __html: `<button type="button" class="undefined googlelogin" style="background-color: rgb(255, 255, 255); display: inline-flex; align-items: center; color: rgba(0, 0, 0, 0.54); box-shadow: rgba(0, 0, 0, 0.24) 0px 2px 2px 0px, rgba(0, 0, 0, 0.24) 0px 0px 1px 0px; text-align: center;width: 110px !important; padding: 0px; border-radius: 2px; border: 1px solid transparent; font-size: 14px; font-weight: 500; font-family: Roboto, sans-serif;"><div style="margin-right: 10px; background: rgb(255, 255, 255); padding: 10px; border-radius: 2px;"><svg width="18" height="18" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fill-rule="evenodd"><path d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" fill="#EA4335"></path><path d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4"></path><path d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z" fill="#FBBC05"></path><path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z" fill="#34A853"></path><path fill="none" d="M0 0h18v18H0z"></path></g></svg></div><span style="padding: 10px 10px 10px 0px; font-weight: 500;">로그인</span></button>`
                                                }}/>
                                            )}
                                            onSuccess={(res) => {
                                                if (!("accessToken" in res)) {
                                                    return;
                                                }
                                                const token = res.accessToken;

                                                axios.post('/api/auth/register_google?token=' + token, querystring.stringify({
                                                    // @ts-ignore
                                                    profileObj: JSON.stringify(res.profileObj)
                                                })).then((res: any) => {
                                                    const swal = withReactContent(Swal);
                                                    if (res.data.ok !== undefined) {
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
                                                    if (res.data.data.email !== undefined) {
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
                                            onFailure={() => {
                                            }}
                                            cookiePolicy={'single_host_origin'}
                                        />
                                    </span>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </>);
}

function UNUSED_Navbar() {
    const [showBasic, setShowBasic] = useState(false);

    const router = useRouter();
    now = router.pathname;

    const [basicModal, setBasicModal] = useState(false);
    const toggleShow = () => setBasicModal(!basicModal);

    return (
        <>
            {
                LoginModal(toggleShow, basicModal, setBasicModal)
            }
            <MDBNavbar className={styles.navbar} expand='lg' light bgColor='light'>
                <MDBContainer fluid className={styles.container}>
                    <Link href={'/'}>
                        <a href={'/'}>
                            <MDBNavbarBrand><img alt={'LOGO'} src={'/logo_r.svg'} width={'90px'}/></MDBNavbarBrand>
                        </a>
                    </Link>

                    <MDBNavbarToggler
                        aria-controls='navbarSupportedContent'
                        aria-expanded='false'
                        aria-label='Toggle navigation'
                        onClick={() => setShowBasic(!showBasic)}
                    >
                        <MDBIcon icon='bars' fas/>
                    </MDBNavbarToggler>

                    <MDBCollapse navbar show={showBasic}>
                        <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
                            <MDBNavbarItem>
                                <Link href={'/rank'}>
                                    <MDBNavbarLink {...nowClass('/rank')} aria-current='page' href='/rank'>
                                        서버 랭킹
                                    </MDBNavbarLink>
                                </Link>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                <Link href={'#'}>
                                    <MDBNavbarLink href='#'>Link</MDBNavbarLink>
                                </Link>
                            </MDBNavbarItem>

                            <MDBNavbarItem>
                                <MDBDropdown>
                                    <MDBDropdownToggle tag='a' className='nav-link'>
                                        Dropdown
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu>
                                        <MDBDropdownItem>
                                            <MDBDropdownLink>Action</MDBDropdownLink>
                                        </MDBDropdownItem>
                                        <MDBDropdownItem>
                                            <MDBDropdownLink>Another action</MDBDropdownLink>
                                        </MDBDropdownItem>
                                        <MDBDropdownItem>
                                            <MDBDropdownLink>Something else here</MDBDropdownLink>
                                        </MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            </MDBNavbarItem>

                            <MDBNavbarItem>
                                <MDBNavbarLink disabled href='#' tabIndex={-1} aria-disabled='true'>
                                    Disabled
                                </MDBNavbarLink>
                            </MDBNavbarItem>
                        </MDBNavbarNav>

                        <span>
                            {
                                (isLogged() ? (
                                    <MDBBtn color={'danger'} onClick={logout} style={{width: '100px'}}>로그아웃</MDBBtn>
                                ) : (
                                    /*<MDBBtn onClick={toggleShow} style={{width: '80px'}}>로그인</MDBBtn>*/

                                    <GoogleLogin
                                        className={styles.hidden + ' googlelogin'}
                                        clientId="694742479607-go7te4r2d6a8lqookrgoo3o0dakh62e9.apps.googleusercontent.com"
                                        buttonText="로그인"
                                        render={renderProps => (
                                            <span onClick={renderProps.onClick} dangerouslySetInnerHTML={{
                                                __html: `<button type="button" class="undefined googlelogin" style="background-color: rgb(255, 255, 255); display: inline-flex; align-items: center; color: rgba(0, 0, 0, 0.54); box-shadow: rgba(0, 0, 0, 0.24) 0px 2px 2px 0px, rgba(0, 0, 0, 0.24) 0px 0px 1px 0px; text-align: center;width: 110px !important; padding: 0px; border-radius: 2px; border: 1px solid transparent; font-size: 14px; font-weight: 500; font-family: Roboto, sans-serif;"><div style="margin-right: 10px; background: rgb(255, 255, 255); padding: 10px; border-radius: 2px;"><svg width="18" height="18" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fill-rule="evenodd"><path d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" fill="#EA4335"></path><path d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4"></path><path d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z" fill="#FBBC05"></path><path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z" fill="#34A853"></path><path fill="none" d="M0 0h18v18H0z"></path></g></svg></div><span style="padding: 10px 10px 10px 0px; font-weight: 500;">로그인</span></button>`
                                            }}/>
                                        )}
                                        onSuccess={(res) => {
                                            if (!("accessToken" in res)) {
                                                return;
                                            }
                                            const token = res.accessToken;

                                            axios.post('/api/auth/register_google?token=' + token, querystring.stringify({
                                                // @ts-ignore
                                                profileObj: JSON.stringify(res.profileObj)
                                            })).then((res: any) => {
                                                const swal = withReactContent(Swal);
                                                if (res.data.ok !== undefined) {
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
                                                if (res.data.data.email !== undefined) {
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
                                        onFailure={() => {
                                        }}
                                        cookiePolicy={'single_host_origin'}
                                    />
                                ))
                            }
                        </span>

                    </MDBCollapse>
                </MDBContainer>
            </MDBNavbar>
        </>
    )
}