import React, { useEffect } from "react"
import * as babel from "babel-standalone";
import ReactDOM from "react-dom/client";

export default function CustomElement(props: {data: string, currentUser, advance: () => void}) {

    useEffect(() => {
        const babelCode = babel.transform(props.data, {
            presets: ["react", "es2017"]
        }).code;

        const code = babelCode.replace('"use strict";', "").trim();
        const system = {advance: props.advance}
        const func = new Function("React", "currentUser", "system", `return (${code})`);
        const App = func(React, props.currentUser, system);
        document.getElementById("WorkFlow").innerHTML = ""
        const root = ReactDOM.createRoot(document.getElementById("WorkFlow"));
        root.render(<App />)

        setTimeout(() => props.advance(), 5000)
    })

    return <div id="WorkFlow">Loading custom code...</div>
}
