import {useRouter} from "next/router";
import style from '../../../styles/verify.module.css';
import Link from "next/link";
import axios from "axios";
import {useEffect, useState} from "react";
import {refreshData} from "../../../src/SessionManager";

export default function TokenVerify() {
    const router = useRouter();
    const token = router.query.token;

    const [r, setr] = useState(<></>);

    useEffect(() => {
        if(token === undefined){
            return;
        }
        axios.get('/api/auth/register_verify/?token='+ token).then(data => {
            console.log(data.data);
            if(data.data.err !== undefined){
                setr(<>
                    <div className={style.container + ' ' + style.r}>
                        <h3>인증 실패</h3>
                        <br/>
                        <p>접근 경로가 잘못되었거나, 만료된 링크일 수 있어요.</p>
                        <Link href={'/'}>
                            <a>메인화면</a>
                        </Link>
                    </div>
                </>);
                return;
            }
            if(data.data.data.email !== undefined){
                refreshData();
                setr(<>
                    <div className={style.container + ' ' + style.g}>
                        <h3>{data.data.data.email}</h3>
                        <h3>해당 계정의 이메일이 인증되었습니다.</h3>
                        <br/>
                        <p>자동으로 로그인 되셨습니다.</p>
                        <Link href={'/'}>
                            <a>메인화면</a>
                        </Link>
                    </div>
                </>)
            }
        })
    }, [token])

    return r
}