import FooterStyle from '../styles/Footer.module.css';

export default function Footer() {
    return (
        <>
            <style jsx>
                {
                    `
                    
                    `
                }
            </style>

            <footer className="text-center text-lg-start bg-light text-muted">
                <section
                    className={"d-flex justify-content-center justify-content-lg-between p-4 border-bottom " + FooterStyle.footersns}
                >
                    <div className="me-5 d-none d-lg-block">
                        <span>문의사항</span>
                    </div>

                    <div>
                        <a style={{cursor: 'pointer'}} target={'_blank'} onClick={() => {
                            // @ts-ignore
                            document.querySelector('.launcherIcon').click()
                        }} className="text-reset" rel="noreferrer">
                            <i className="fa-solid fa-comment"/>
                        </a>
                    </div>
                </section>

                <section className="">
                    <div className="container text-center text-md-start mt-5">
                        <div className="row mt-3">
                            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                                <h6 className="text-uppercase fw-bold mb-4">
                                    {'  '}svmoa live
                                </h6>
                                <p>
                                    마인크래프트 BE의 발전을 위해.<br/>
                                    노력하겠습니다.<br/>
{/*
                                    <span style={{fontStyle: 'italic', fontSize: '0.8rem', color: 'lightgrey'}}>사이트의 디자인은 mine.page를 참고하였습니다.</span>
*/}
                                </p>
                            </div>
{/*
                            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                                <h6 className="text-uppercase fw-bold mb-4">
                                    Products
                                </h6>
                                <p>
                                    <a href="#!" className="text-reset">Angular</a>
                                </p>
                                <p>
                                    <a href="#!" className="text-reset">React</a>
                                </p>
                                <p>
                                    <a href="#!" className="text-reset">Vue</a>
                                </p>
                                <p>
                                    <a href="#!" className="text-reset">Laravel</a>
                                </p>
                            </div>

                            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                                <h6 className="text-uppercase fw-bold mb-4">
                                    Useful links
                                </h6>
                                <p>
                                    <a href="#!" className="text-reset">Pricing</a>
                                </p>
                                <p>
                                    <a href="#!" className="text-reset">Settings</a>
                                </p>
                                <p>
                                    <a href="#!" className="text-reset">Orders</a>
                                </p>
                                <p>
                                    <a href="#!" className="text-reset">Help</a>
                                </p>
                            </div>

                            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                                <h6 className="text-uppercase fw-bold mb-4">
                                    Contact
                                </h6>
                                <p><i className="fas fa-home me-3"/> New York, NY 10012, US</p>
                                <p>
                                    <i className="fas fa-envelope me-3"/>
                                    info@example.com
                                </p>
                                <p><i className="fas fa-phone me-3"/> + 01 234 567 88</p>
                                <p><i className="fas fa-print me-3"/> + 01 234 567 89</p>
                            </div>*/}
                        </div>
                    </div>
                </section>

                <div className="text-center p-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.05);'}}>
                    Copyright 2022{'  '}
                    <a className="text-reset fw-bold" href="https://svmoa.live/"><img alt={'logo'} src={'/logo_r.svg'}
                                                                                        width={'60px'}/></a>
                    {' all rights reserved.'}
                </div>
            </footer>
        </>
    )
}