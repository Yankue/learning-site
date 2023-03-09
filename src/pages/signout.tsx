import { GetServerSidePropsContext } from "next";
import { DefaultProps } from "..";

export default function Signout(props: DefaultProps) {
    props.app.setState({currentUser: props.currentUser})
    return <div>
        Successfully signed out.
    </div>
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    ctx.res.setHeader("Set-Cookie", "auth=deleted; session=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT")
    return {props: {currentUser: false}}
}