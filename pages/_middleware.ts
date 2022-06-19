import {NextResponse,} from 'next/server'

export async function middleware(req: { nextUrl: { pathname: any, origin: any } }, ev: any) {
    const {pathname, origin} = req.nextUrl;
    if (pathname === '/') {
        return NextResponse.redirect(origin + '/rank', 301);
    }
    return NextResponse.next();
}