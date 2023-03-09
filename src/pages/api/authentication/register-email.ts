import {NextApiRequest, NextApiResponse} from "next";
import {PrismaClient} from "@prisma/client";
import crypto from "crypto";
const cache = require('../../../cache')
const db: PrismaClient = require("../../../db")

export default async function registerWithEmail(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== "POST") return res.status(405).send("Method not allowed.")
    const email = req.body.email as string
    const exists = await db.user.findFirst({where: {email}})
    if(exists !== null) return res.status(400).send({success: false, msg: "Email in use"})
    const code = crypto.randomBytes(12).toString("hex")
    await cache.setex(code, 1800, email)
    console.log("SIMULATE THE EMAIL: "+code)
    res.status(200).send({success: true})
}
