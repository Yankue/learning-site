import Image from "next/image";
import Link from "next/link";
import React from "react";
import App from "../pages/_app";
import styles from "../styles/Header.module.css"

export default class Header extends React.Component<{app: App}> {
    constructor(props) {
        super(props)
    }

    render() {
        if(this.props.app.state.currentUser === false) { // loading, let's not show the full header, but hog the space ready
            return <div className={styles.outerHeader}>
                <div className={styles.headerLeft}>
                    <span className={styles.title}>Learning</span>
                </div>

                <div className={styles.headerRight}>
                    <div className={styles.navigation}>
                        <Link href={"/login"}><div className={styles.navB}><b>Login</b></div></Link>
                        <Link href={"/register"}><div className={`${styles.navB} ${styles.boldButton}`}>Register</div></Link>
                    </div>
                </div>

            </div>
        }

        return <div className={styles.outerHeader}>
            <div className={styles.headerLeft}>
                <span className={styles.title}>Learning</span>
            </div>

            <div className={styles.headerRight}>
                <div className={styles.navigation}>
                    <Link href={"/"}><div className={styles.navB}>Home</div></Link>
                    <Link href={"#"}><div className={styles.navB}>Friends</div></Link>
                    <Link href={"#"}><div className={styles.navB}>Organisations</div></Link>
                    <Link href={"/courses?ctx=revise"}><div className={styles.navB}>Exam Prep</div></Link>
                    <Link href={"/courses"}><div className={`${styles.navB} ${styles.boldButton}`}>Learn</div></Link>
                </div>

                <div className={styles.identification}>
                    <div className={styles.avatarRegulator}>
                        <Image className={styles.avatar}
                                alt={"Avatar"}
                                src={"https://cdn.discordapp.com/avatars/611987847641038851/a_22a5ea75f0b5835ea908bd80e380f066.gif?size=1024"}
                                fill={true}
                                sizes={"100vw"} />
                    </div>
                    <div className={styles.usernameDisplay}>
                        {typeof this.props.app.state.currentUser !== "undefined" ? (this.props.app.state.currentUser ? this.props.app.state.currentUser.username : "not logged in") : "loading"}
                    </div>
                    <div className={styles.dropdownContent}>
                        <Link href={"#"}><div>Help</div></Link>
                        <Link href={"#"}><div>Contact</div></Link>
                        <Link href={"#"}><div>Settings</div></Link>
                        <Link href={"/signout"}><div>Log out</div></Link>
                    </div>
                </div>
            </div>

        </div>
    }
}
