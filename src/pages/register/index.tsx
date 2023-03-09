import React from "react";
import styles from "../../styles/Register.module.css";
import Image from "next/image";
import {DefaultProps} from "../../index";

export default class RegisterPage extends React.Component<DefaultProps, {confirmed: boolean}> {
    constructor(props) {
        super(props);
        this.state = {confirmed: false}

        this.continueWithEmail = this.continueWithEmail.bind(this)
    }

    continueWithEmail() {
        fetch("/api/authentication/register-email", {
            method: "POST",
            body: JSON.stringify({email: (document.getElementById("email-input-www") as HTMLInputElement).value}),
            headers: {"Content-Type":"application/json"}
        }).then(r => r.json()).then(r => {
            console.log(r)
        })
    }

    render() {
        return <div className={styles.registerHomepage}>

            <div className={styles.sectionBox}>
                <div className={styles.sectionTitle} style={{marginBottom: "10px"}}>Register</div>

                    <div className={"rc"}><div className={styles.buttonBox}>
                        <img src={"/icons/google.png"} width={40} height={40} className={styles.providerIcon} />
                        <span className={styles.buttonText}>Continue with Google</span>
                    </div></div>

                    <div className={"rc"}   ><div className={styles.buttonBox}>
                        <img src={"/icons/facebook.png"} width={40} height={40} className={styles.providerIcon} />
                        <span className={styles.buttonText}>Continue with Facebook</span>
                    </div></div>

                <div className={"rc"}><div className={styles.buttonBox}>
                    <img src={"/icons/twitter.png"} width={40} height={40} className={styles.providerIcon} />
                    <span className={styles.buttonText}>Continue with Twitter</span>
                </div></div>

                <div className={"rc"} style={{marginBottom: "10px"}}><div className={styles.buttonBox} onClick={() => window.open("/api/authentication/discord","_self")}>
                    <img src={"/icons/discord.png"} width={40} height={40} className={styles.providerIcon} />
                    <span className={styles.buttonText}>Continue with Discord</span>
                </div></div>

                <div className={styles.inputLabel} style={{marginTop: "25px"}}>Or continue with email</div>
                <input className={styles.inputField} placeholder={"Email address"} id={"email-input-www"} /><br />
                <button className={styles.continueWithEmail} onClick={this.continueWithEmail}>Continue</button>
            </div>

        </div>
    }

}
