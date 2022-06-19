import styles from '../styles/alerts.module.css';

export function RedAlert(props: any) {
    return alert(styles.red, props.children);
}

export function BlueAlert(props: any) {
    return alert(styles.blue, props.children);
}

export function GreenAlert(props: any) {
    return alert(styles.green, props.children);
}

export function YellowAlert(props: any) {
    return alert(styles.yellow, props.children);
}

function alert(style: any, content: any) {
    return <div className={styles.alert + ' ' + style}>
        {content}
    </div>
}