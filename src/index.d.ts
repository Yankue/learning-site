import App from "./pages/_app";

export interface CurrentUser {
    username: string
}

export interface DefaultProps {
    app: App
    currentUser: CurrentUser|false
}


export type SectionModel = {
    name: string
    children: ModuleModel[]
    childType: "MODULE"
}|{
    name: string
    children: SubsectionModel[]
    childType: "SUBSECTION"
}

export interface SubsectionModel {
    name: string
    children: ModuleModel[]
}
export interface ModuleModel {
    id: string
    name: string
}
