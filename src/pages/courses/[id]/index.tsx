import { Course, Prisma, PrismaClient } from "@prisma/client";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import React from "react";
import {renderPageServerChecks} from "../../../utils";
import {getModelFromDatabaseStructure} from "../../../clientSafeUtils";
const db: PrismaClient = require('../../../db')
import {CurrentUser, DefaultProps, SectionModel} from "../../..";
import {Router, withRouter} from "next/router";
import styles from "../../../styles/ViewCourse.module.css";
import Link from "next/link";

interface Props {
    currentUser: CurrentUser|false
    course?: Omit<Course, "tags">&{modules: {id: string, name: string}[]}
}

class ViewModules extends React.Component<DefaultProps&Props&{router: Router}> {
    parsed: SectionModel[]
    constructor(props) {
        super(props)
        this.props.app.setState({currentUser: props.currentUser})
        const d = getModelFromDatabaseStructure(props.course);
        this.parsed = d.sections
        // TODO: Make progressive courses a thing
    }

    render() {
        if(!this.props.app.state.currentUser) return <div>Loading...</div>
        if(!this.props.course) return <div>Course not found.</div>
        return <div className={styles.body}>
            <div className={styles.return}>
                <Link href={"/courses"}>&lt; Back to Courses</Link>
            </div>


            <div className={styles.courseName}>{this.props.course.name}</div>
            <div className={styles.description}>{this.props.course.description}</div>

            <div className={styles.sectionCardContainer}>
                {this.parsed.map(p => {

                    return <div className={styles.sectionCard} key={this.props.course.id+p.name}>
                        <div className={styles.sectionName}>{p.name}</div>
                        {p.childType === "SUBSECTION" ?
                            <div className={styles.subsectionContainer}>
                                {p.children.map(c => <div key={this.props.course.id+c.name} className={styles.card}>
                                    <h1 className={styles.cardTitle}>{c.name}</h1>
                                    <div className={styles.cardContent}>
                                        {c.children.map(ch => <div className={styles.moduleLink} key={ch.id}>
                                            <Link href={`/courses/${this.props.course.id}/m/${ch.id}`}>{ch.name}</Link>
                                        </div>)}
                                    </div>
                                </div>)}
                            </div>
                        :
                            <div className={styles.subsectionContainer}>
                                {p.children.map(c => <div key={this.props.course.id+c.name} className={styles.card}>
                                    <h1 className={styles.cardTitle}>{c.name}</h1>
                                </div>)}
                            </div>}
                    </div>
                })}
            </div>
        </div>
    }
}

export async function getServerSideProps(ctx: GetServerSidePropsContext): Promise<{props: Props}> {
    const currentUser = await renderPageServerChecks(ctx)
    if(currentUser === false) return {props: {currentUser: false}}

    const course = await db.course.findFirst({where: {id: ctx.params.id as string},
        select: {name: true, type: true, id: true, structure: true, description: true, modules: {select: {id: true, name: true}}}
    })

    if(!course) {
        ctx.res.statusCode = 404
        return {props: {currentUser: {username: currentUser.username}}}
    }

    return {props: {course, currentUser: {username: currentUser.username}}}
}

export default withRouter(ViewModules)
