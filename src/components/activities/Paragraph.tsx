import { CurrentUser } from "../..";

export default function ParagraphActivity(props: {currentUser: CurrentUser, data: string, advance: () => void}) {
    return <div>
        {props.data}
        <button onClick={props.advance}>Move on</button>
    </div>
}
