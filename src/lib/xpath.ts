export function xmulti(path: string, context?: Node) {
    const iterator = document.evaluate(path, context ?? document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE)
    const elements: HTMLElement[] = []
    while (true) {
        const node = iterator.iterateNext()
        if (node === null) {
            return elements
        }
        elements.push(node as HTMLElement)
    }
}

export function xone(path: string, context?: Node) {
    const result = document.evaluate(path, context ?? document, null, XPathResult.FIRST_ORDERED_NODE_TYPE)
    return result.singleNodeValue as HTMLElement | null
}

export function xrequired(name: string, path: string, context?: Node) {
    const element = xone(path, context)
    if (element === null) {
        throw new Error(`could not find node "${name}" with xpath "${path}"`)
    }
    return element
}

export function xtext(path: string, context?: Node) {
    const result = document.evaluate(path, context ?? document, null, XPathResult.STRING_TYPE)
    return result.stringValue
}
