import LoadingBar from "react-top-loading-bar";
import {useEffect, useRef} from "react";

export default function TopLoadingBar() {
    const ref = useRef(null)

    useEffect(() => {
        if (ref.current !== null) {
            // @ts-ignore
            ref.current.complete()

            if (document.querySelector('#loadingblack') !== null) {
                const lb = document.querySelector('#loadingblack');
                let opacity = 0.5;
                setInterval(() => {
                    if(opacity < 0){
                        // @ts-ignore
                        lb.style.display = 'none';
                        // @ts-ignore
                        lb.remove();
                        return;
                    }
                    opacity -= 0.01;
                    // @ts-ignore
                    lb.style.opacity = opacity
                }, 3)
            }
        }
    })

    return (
        <div>
            <LoadingBar color='#37CB52' ref={ref}/>
            {
                // @ts-ignore
                (ref.current === null ? '' : (() => {
                    // @ts-ignore
                    ref.current.continuousStart();

                    if (document.querySelector('#loadingblack') === null) {
                        const obj = document.createElement('div');
                        obj.id = "loadingblack";
                        obj.style.cssText = 'position: absolute; top: 0; left; 0; width: 100vw; height: 100vh; background-color: white; z-index:100; opacity: 0.3';

                        const lb = obj;
                        let opacity = 0;
                        setInterval(() => {
                            if(opacity < 0.5){
                                return;
                            }
                            opacity += 0.01;
                            // @ts-ignore
                            lb.style.opacity = opacity
                        }, 4)

                        // @ts-ignore
                        document.querySelector('body').appendChild(obj)
                    }
                })())
            }
        </div>
    )
}