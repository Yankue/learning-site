import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import React from "react";
import Image from "next/image";
import styles from "../../styles/Register.module.css";
import {NextRouter, withRouter} from "next/router";
import {DefaultProps} from "../../index";
const cache = require('../../cache')


interface DiscordRegisterProps {
    success: boolean
    n?: string
    user?: {
        id: string
        username: string
        avatarurl: string
        email: string
    }
}

// TODO: Validate username choice
class DiscordFinalisePage extends React.Component<DiscordRegisterProps&DefaultProps&{router: NextRouter}, {username: string}> {
    constructor(props: DiscordRegisterProps&DefaultProps&{router: NextRouter}) {
        super(props)
        if(this.props.success) this.state = {username: props.user.username}

        this.finalise = this.finalise.bind(this)
    }

    async finalise() {
        fetch("/api/authentication/finalise", {method: "POST", body: JSON.stringify({n: this.props.n, un: this.state.username, av: this.props.user.avatarurl}), headers: {"Content-Type": "application/json"}}).then(async t => {
            const d = await t.json()
            if(d.success) {
                this.props.app.setState({currentUser: {username: this.state.username}})
                await this.props.router.push(d.sendTo)
            }
        })
    }

    render() {
        if(!this.props.success) {
            this.props.router.push("/api/authentication/discord")
            return <div/>
        }

        return <div className={styles.innerContent}>
            <div className={styles.sectionTitle}>Finish up your profile</div>

            <div className={styles.inputLabel}>Avatar</div>
            <div className="rc"><div className={styles.avatar}>
                <Image className={styles.avatarImg} fill={true} alt={"Discord avatar"} src={`https://cdn.discordapp.com/avatars/${this.props.user.id}/${this.props.user.avatarurl}`} />
            </div></div>

            <div className={styles.inputLabel}>Username</div>
            <input className={styles.inputField} onChange={(e) => this.setState({username: e.target.value})} type={"text"} defaultValue={this.props.user.username} />
            <div className={styles.inputLabel}>Email</div>
            <input className={styles.inputField} type={"text"} value={this.props.user.email} disabled={true} />
            <br />
            <button className={styles.createAcc} onClick={this.finalise}>Create Account</button>
        </div>
    }
}

export default withRouter(DiscordFinalisePage)

function sendToLogin(ctx: GetServerSidePropsContext): {props: DiscordRegisterProps} {
    ctx.res.setHeader("location", "/api/authentication/discord")
    ctx.res.statusCode = 302
    ctx.res.end()
    return {props: {success: false}}
}

export async function getServerSideProps(ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<DiscordRegisterProps>> {
    const n = ctx.query.n
    if(typeof n !== "string") return sendToLogin(ctx)
    const d = await cache.get(n)

    if(!d) return sendToLogin(ctx)
    const p = d.split(";")
    return {props: {success: true, n, user: {id: p[3], avatarurl: p[2], username: p[1], email: p[0]}}}
}
