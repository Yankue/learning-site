import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import {generateId} from "../../../utils";
import crypto from "crypto";
const cache = require('../../../cache')
const db: PrismaClient = require("../../../db")


export default async function FinaliseAccount(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== "POST") return res.status(405).send("POST only.")
    if(!req.body.n || !req.body.un) return res.status(400).send("Bad request")
    const d = await cache.get(req.body.n)
    if(!d) return res.status(400).send("Bad request")

    const p = d.split(";")
    const sendTo = p[5]
    const user = await db.user.create({data: {id: generateId(), username: req.body.un, avatar: (req.body.n || null), password: p[3], email: p[0], registeredWith: p[4].toUpperCase(), courses: ""}})

    const token = crypto.randomBytes(28).toString("base64url")
    await db.authToken.create({data: {token, ownerId: user.id}})
    await cache.del(sendTo)
    await cache.del(req.body.n)
    res.setHeader("Set-Cookie", `auth=${token}; Path=/; Max-Age=252288000; HttpOnly; Secure;`)
    res.send({success: true, sendTo: (await cache.get(sendTo))||"/"})
}
