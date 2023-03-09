

/**
 * Returns an object oriented object following the type structure from the "structure" variable in the database
 * @param {{structure: string, modules: {name: string, id: string}[]}} course
 * @returns {{progressive: boolean, sections: SectionModel[]}}
 */
export function getModelFromDatabaseStructure(course) {
    let progressive = course.structure.startsWith("p")
    let sections = []

    const sectionData = course.structure.split("@")
    sectionData.shift()
    for(const section of sectionData) {
        const [name, contentsOfSection] = section.split("#")
        let sectionObject = {name}

        if(contentsOfSection.includes("{")) { // it has sub-sections
            const [listOfSubSectionNames, listOfSubSectionMembers] = contentsOfSection.split("{")
            const membersOfSubsections = listOfSubSectionMembers.split("}")
            let children = []

            for(const subSectionName of listOfSubSectionNames.split(",")) {
                const memberIds = membersOfSubsections[0].split(",")
                const members = []
                for(const m of memberIds) members.push({id: m, name: course.modules.find(o => o.id === m).name})
                membersOfSubsections.shift()
                children.push({name: subSectionName, children: members})
            }

            sectionObject = {name, childType: "SUBSECTION", children}

        } else { // it has no sub-sections, it is just modules directly in the section
            const moduleIds = contentsOfSection.split(",")
            let children = []
            for(const mod of moduleIds) children.push({id: mod, name: course.modules.find(m => m.id === mod).name})
            sectionObject = {name, childType: "MODULE", children}
        }
        sections.push(sectionObject)
    }

    return {progressive, sections}
}
