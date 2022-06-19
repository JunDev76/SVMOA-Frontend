import ErrorPage from "next/error";
import {MetaGenerate} from "../src/MetaGenerator";
import styles from "../styles/404.module.css";

export default function main(props:any) {
    if(props.err !== undefined){
        return <ErrorPage statusCode={404} />
    }

    return (
        <>
            {
                MetaGenerate('404 - 페이지를 찾을 수 없음')
            }

            <div className={styles.main}>
                <span className={styles.code404}>404</span>
                <span> | 해당 페이지를 찾을 수 없음</span>
                <br/>
                <span>해당 페이지가 이동되었거나 삭제되었을 수 있어요.</span>
            </div>
        </>
    )
}