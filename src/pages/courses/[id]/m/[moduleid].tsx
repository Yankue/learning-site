import { PrismaClient } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { renderPageServerChecks } from "../../../../utils";
import {render} from "react-dom";
import styles from "../../../../styles/ViewModule.module.css";
import { CurrentUser, DefaultProps } from '../../../../'
import CustomElement from "../../../../components/activities/Custom";
import ParagraphActivity from "../../../../components/activities/Paragraph";
import MultipleChoiceActivity from "../../../../components/activities/MultipleChoiceActivity";
const db: PrismaClient = require('../../../../db')

interface Props {
    currentUser: {username: string}|false, module?: {id: string, name: string}, course?: {name: string}
}

interface State {
    activityData: {
        contentType: number,
        activityCode: number,
        data: string
    }[]
}

export default class ViewModule extends React.Component<DefaultProps&Props, State> {
    constructor(props) {
        super(props)
        this.state = {activityData: []}
        this.props.app.setState({currentUser: props.currentUser})

        this.advanceActivity = this.advanceActivity.bind(this)
        this.selectActivity = this.selectActivity.bind(this)
    }


    componentDidMount() {
        const BASE_URL = "https://tpowerwebapps.s3.amazonaws.com/modules/"
        fetch(BASE_URL+this.props.module.id).then(async (res) => {
            const data = await res.text() // now we need to parse the text
            const rawActivities = data.split("\n||")
            rawActivities.shift()
            let d = []
            for(const activity of rawActivities) {
                const headerType = activity.split(/ |\n/g)[0]
                const contentType = parseInt(headerType.substring(0, 1))
                const activityCode = parseInt(headerType.substring(1,))
                d.push({contentType, activityCode, data: activity.replace(headerType, "")})
            }
            this.setState({activityData: d})
        })
    }

    advanceActivity() {
        const d = this.state.activityData
        d.shift()
        this.setState({activityData: d})
    }

    selectActivity() {
        const data = this.state.activityData[0].data
        const currentUser = this.props.app.state.currentUser as CurrentUser

        switch(this.state.activityData[0].activityCode) {
            case 0:
                return <CustomElement
                data={data}
                currentUser={currentUser}
                advance={this.advanceActivity} />

            case 1:
                return <ParagraphActivity
                data={data}
                currentUser={currentUser}
                advance={this.advanceActivity} />

            case 2:
                return <MultipleChoiceActivity
                data={data}
                currentUser={currentUser}
                advance={this.advanceActivity} />
        }
    }

    render() {
        if(this.state.activityData.length === 0) { // the page is either half way through initialisation, or we reached the end of the module
            return <div>Loading...</div>
        }


        return <div className={styles.outer}>
            {this.selectActivity()}
        </div>
    }
}


export async function getServerSideProps(ctx: GetServerSidePropsContext): Promise<{props: Props}> {
    const currentUser = await renderPageServerChecks(ctx, true)
    if(currentUser === false) return {props: {currentUser: false}}
    const module = await db.module.findFirst({where: {id: (ctx.params.moduleid as string)}, select: {name: true, id: true, course: {select: {name: true}}}})

    if(!module) {
        ctx.res.statusCode = 404
        return {props: {currentUser: {username: currentUser.username}}}
    }

    return {props: {module: {name: module.name, id: module.id}, course: {name: module.course.name}, currentUser: {username: currentUser.username}}}
}
