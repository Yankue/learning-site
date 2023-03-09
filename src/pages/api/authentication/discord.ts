import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import crypto from "crypto";
import db from "../../../db";
const cache = require("../../../cache");

const CLIENT_ID = "732997942193160222"
const CLIENT_SECRET = "-odrmaZwI9hrvO1i74mlL-0ryoe2jTCx"
const REDIRECT = "http://localhost:3000/api/authentication/discord"

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
    if(!req.query.code) return res.redirect("https://discord.com/api/oauth2/authorize?client_id=732997942193160222&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauthentication%2Fdiscord&response_type=code&scope=identify%20email")
    
    const data = new URLSearchParams()
    data.append("client_id", CLIENT_ID)
    data.append("client_secret", CLIENT_SECRET)
    data.append("grant_type", "authorization_code")
    data.append("code", req.query.code as string)
    data.append("redirect_uri", REDIRECT)
    const resp = await axios.post("https://discord.com/api/v10/oauth2/token", data, {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
    
    if(resp.status === 200 && resp.data.access_token) {
        
        const accessToken = resp.data.access_token
        const r = await axios.get("https://discord.com/api/v10/users/@me", {headers: {Authorization: `Bearer ${accessToken}`}})
        if(!r.data.email) return res.send("Error B.")
        const existingUser = await db.user.findFirst({where: {password: r.data.id}})
        if(existingUser) {
            const token = crypto.randomBytes(28).toString("base64url")
            await db.authToken.create({data: {token, ownerId: existingUser.id}})
            res.setHeader("Set-Cookie", `auth=${token}; Path=/; Max-Age=252288000; HttpOnly; Secure;`)
            if(typeof req.query.state !== "undefined") {
                res.redirect(await cache.get("login"+req.query.state))
            } else res.redirect('/')
        } else {
            await cache.del("login"+req.query.state)
            const k = crypto.randomBytes(28).toString("base64url")
            await cache.setex(k, 3600, `${r.data.email.replace(/;/g, "")};${r.data.username.replace(/;/g, "")};${r.data.avatar||""};${r.data.id};discord;${req.query.state}`)
            res.redirect('/register/discord?n='+k)
        }

    } else res.send("Error.")
}