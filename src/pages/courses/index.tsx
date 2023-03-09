import { Course, PrismaClient } from "@prisma/client";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import React, {useState} from "react";
import { CurrentUser, DefaultProps } from "../..";
import { getCurrentUser, renderPageServerChecks } from "../../utils";
import styles from "../../styles/ViewCourses.module.css"
const db: PrismaClient = require('../../db')
import { Router, withRouter } from 'next/router'
import App from "../_app";

interface Props {
    currentUser: {username: string}|false
    isRevision?: boolean
    courses?: Omit<Course, "description"|"structure">[]
}

interface State {
    isAddingCourse: boolean
    addable: {id: string, name: string}[]|null
}


function AddCourseModal(props) {
    if(props.active) {
        document.documentElement.style.backgroundColor = "#000000"
        document.body.style.backgroundColor = "#000000"
    } else {
        document.documentElement.style.backgroundColor = "#121212"
        document.body.style.backgroundColor = "#121212"
    }
    return <div className={props.active ? `${styles.modalOuter} ${styles.modalActive}` : styles.modalOuter}>
        <div className={styles.closeButton}>
            <span style={{cursor: "pointer"}} onClick={props.closeFun}>&times;</span>
        </div>
        <div className={styles.modalTitle}>Add Course</div>
        {props.addable === null ?
            <div>Loading...</div> :
            <div>Loaded!</div>
        }
    </div>
}



class ViewCourses extends React.Component<DefaultProps&Props&{router: Router}, State> {
    constructor(props) {
        super(props)
        this.state = {isAddingCourse: false, addable: null}
        this.props.app.setState({currentUser: this.props.currentUser})
        this.initialiseData = this.initialiseData.bind(this)
    }

    initialiseData() {
        fetch("/api/courses/addable").then(d => d.json()).then(d => {
            if(d.success) this.setState({addable: d.data})
        })
    }

    render() {
        if(!this.props.app.state.currentUser) return <div>Loading...</div>


        if(this.props.courses.length === 0) return <div>
            <AddCourseModal initData={this.initialiseData} addable={this.state.addable} closeFun={() => this.setState({isAddingCourse: false})} active={this.state.isAddingCourse} />
            <div className={styles.pTitle}>Your Courses</div>

            <div style={{textAlign: "center", fontSize: "23px", marginTop: "30px"}}>You don&apos;t have any courses yet!</div>

            <div style={{display: "flex", justifyContent: "center"}}>
            <button style={{
                backgroundColor: "transparent", fontSize: "23px", color: "white", borderRadius: "4px",
                marginTop: "20px", cursor: "pointer", padding: "10px"
            }} onClick={() => {this.setState({isAddingCourse: true});if(this.state.addable === null){this.initialiseData()}}}>
                Add Courses
            </button></div>
        </div>



        return <div>
            <AddCourseModal closeFun={() => this.setState({isAddingCourse: false})} active={this.state.isAddingCourse} />
            <div className={styles.pTitle}>Your Courses</div>

            <div className={styles.courseContainer}>{this.props.courses.map(c => {
                return <div key={c.id} className={styles.courseBox} onClick={() => this.props.router.push(`/courses/${c.id}`)}>
                    <span>{c.name}</span>
                </div>
            })}</div>
        </div>
    }
}

export async function getServerSideProps(ctx: GetServerSidePropsContext): Promise<{props: Props}> {
    const currentUser = await renderPageServerChecks(ctx, true)
    if(currentUser === false) return {props: {currentUser: false}}
    const matches = (currentUser.courses.split(">")).map(c => c.split("<")[0]);

    const courses = await db.course.findMany({select: {name: true, type: true, tags: true, id: true, modules: false}, where: {id: {in: matches}}})
    return {props: {currentUser: {username: currentUser.username}, courses, isRevision: (ctx.query.ctx === "revision")}}
}

export default withRouter(ViewCourses)
