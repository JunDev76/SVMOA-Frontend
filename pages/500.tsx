import ErrorPage from "next/error";
import {MetaGenerate} from "../src/MetaGenerator";
import Navbar from "../src/Navbar";
import styles from "../styles/404.module.css";
import Footer from "../src/Footer";

export default function main(props:any) {
    if(props.err !== undefined){
        return <ErrorPage statusCode={404} />
    }

    return (
        <>
            {
                MetaGenerate('500 - 잘못된 접근 또는 서버오류')
            }

            <div className={styles.main}>
                <span className={styles.code404}>500</span>
                <span> | 잘못된 접근 또는 서버오류</span>
                <br/>
                <span>잘못된 접근일 수 있어요.</span>
            </div>
        </>
    )
}