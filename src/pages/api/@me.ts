import { NextApiRequest, NextApiResponse } from "next";
import {getCurrentUser} from "../../utils"
const {User} = require('@prisma/client')

export default async function CurrentUser(req: NextApiRequest, res: NextApiResponse) {
    const u = await getCurrentUser(req)
    if(typeof u === "boolean") return res.status(401).send({error: "Not logged in"})
    return res.status(200).send({username: u.username, registeredWith: u.registeredWith})
}
