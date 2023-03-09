import {NextApiRequest, NextApiResponse} from "next";
import {getCurrentUser} from "../../../utils";
import {PrismaClient} from "@prisma/client";
const db: PrismaClient = require('../../../db');

export default async function addableCourses(req: NextApiRequest, res: NextApiResponse) {
    const u = await getCurrentUser(req);
    if(typeof u === "boolean") return res.status(403).json({success: false, msg: "Log in please!"})
    const d = await db.course.findMany({where: {id: {notIn: u.courses.split(/>|</)}}})
    res.send({success: true, data: d.map(d => {return {id: d.id, name: d.name}})})
}
