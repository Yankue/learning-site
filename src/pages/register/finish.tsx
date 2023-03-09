import React from "react";
import {GetServerSidePropsContext} from "next";
import {renderPageServerChecks} from "../../utils";
import {DefaultProps} from "../../index";
import styles from "../../styles/Register.module.css";
import Image from "next/image";
const cache = require('../../cache')

export default class FinishRegistration extends React.Component<DefaultProps&{success: boolean, email?: string}> {
    constructor(props) {
        super(props);
    }

    finalise() {

    }

    render() {
        if(this.props.success) return <div className={styles.innerContent}>
            <div className={styles.sectionTitle}>Finish up your profile</div>

            <div className={styles.inputLabel}>Avatar</div>
            <div className="rc"><div className={styles.avatar}>
                <Image className={styles.avatarImg} fill={true} alt={"Avatar"} src={``} />
            </div></div>

            <div className={styles.inputLabel}>Username</div>
            <input className={styles.inputField} onChange={(e) => this.setState({username: e.target.value})} type={"text"} defaultValue={""} />
            <div className={styles.inputLabel}>Email</div>
            <input className={styles.inputField} type={"text"} value={this.props.email} disabled={true} />
            <br />
            <button className={styles.createAcc} onClick={this.finalise}>Create Account</button>
        </div>
        else return <div>Fail</div>
    }
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const currentUser = await renderPageServerChecks(ctx, false)
    if(currentUser) return {redirect: {destination: '/', permanent: false}}

    const code = ctx.query.c as string
    const email = await cache.get(code)
    if(!email) return {props: {success: false}}
    await cache.del(code)
    return {props: {success: true, email}}
}
