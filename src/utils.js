import {NextApiRequest, GetServerSidePropsContext} from "next"
import db from "./db"
import crypto from "crypto"
const cache = require('./cache')
const {User} = require('@prisma/client')


/**
 *
 * @param {NextApiRequest|IncomingMessage} req Next API request object
 * @returns {Promise<Boolean|User>}
 */
export async function getCurrentUser(req) {
    if(typeof req.cookies.auth === "undefined") return false
    const token = await db.authToken.findFirst({where: {token: req.cookies.auth}, include: {owner: true}})
    if(token === null) return false
    return token.owner
}


/**
 * Fetches the current user, to be sent to client and used by getServerSideProps. It caches session tokens, so we don't have to
 * fetch the relations of access tokens for every page they visit.
 * @param {GetServerSidePropsContext} ctx Context
 * @param {Boolean} requireLogin Redirect them and force them to login if they haven't already?
 * @returns {Promise<User|false>}
 */
export async function renderPageServerChecks(ctx, requireLogin=false) {
    let currentUser
    let reset = false
    const s = await cache.get(ctx.req.cookies.session)

    if(!ctx.req.cookies.session || !s) {
        currentUser = await getCurrentUser(ctx.req)
        if(typeof currentUser === "boolean") {
            if(requireLogin === true) {
                ctx.res.setHeader("location", "/login")
                ctx.res.statusCode = 302
                ctx.res.end()
            }
            return false
        }
        reset = true
    } else {
        currentUser = await db.user.findFirst({where: {id: s}})
        if(!currentUser) {
            currentUser = await getCurrentUser(ctx.req)
            if(typeof currentUser === "boolean") {
                ctx.res.setHeader("location", "/login")
                ctx.res.statusCode = 302
                ctx.res.end()
                return false
            }
            reset = true
        }
    }

    if(reset) {
        const key = crypto.randomBytes(24).toString("base64url")
        ctx.res.setHeader("Set-Cookie", "session="+key+"; Path=/")
        await cache.setex(key, 1800, currentUser.id)
    }
    return currentUser
}


export function generateId() {
    return new Date().getTime().toString()+"1"
}
