import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import { DefaultProps } from '..'
import styles from '../styles/Home.module.css'
import { getCurrentUser } from '../utils'
import Link from "next/link";

export default class Home extends React.Component<DefaultProps, {v: string}> {
    constructor(props) {
      super(props)
      this.state = {v: "hi"}
      this.props.app.setState({currentUser: this.props.currentUser})
    }

  render() {
    return (
      <div className={styles.container}>
        <Head>
          <title>Learning App</title>
          <meta name="description" content="An app for learning facts!" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className={styles.slogan}>
            Learn <span>quickly</span> and <span>easily</span><br /> with my learning app!
        </div>

          <div className={styles.subslogan}>
              Join over 1 student already using my learning app to learn! We have fairly good results!
          </div>


          <div className={styles.centreBlock}>
              <Link href={"/register"}><div className={styles.getStartedButton}>Get Started</div></Link>
          </div>
      </div>
    )
  }
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const user = await getCurrentUser(ctx.req)
  return {props: {currentUser: user}}
}
