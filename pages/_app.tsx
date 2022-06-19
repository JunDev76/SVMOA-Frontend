import '../styles/globals.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import type {AppProps} from 'next/app';
import Navbar from "../src/Navbar";
import TopLoadingBar from "../src/TopLoadingBar";
import Footer from "../src/Footer";
import {init} from "../src/SessionManager";

function MyApp({Component, pageProps}: AppProps) {
    //const router = useRouter();
    {
        init()
    }
    return <>
        <TopLoadingBar/>
        <Navbar/>
        <Component {...pageProps} />
        <Footer/>
    </>
}

export default MyApp
