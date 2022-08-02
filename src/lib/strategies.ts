import { Dimensions } from "./common"

export type Window = {
    title: string
    resolver: () => Promise<HTMLElement>
    onexit?: () => void
}

export const resolveIframe = (location: string, dimensions: Dimensions) => {
    return async () => {
        const frame = document.createElement("iframe")
        frame.src = location
        frame.width = dimensions.w()
        frame.height = dimensions.h()
        frame.addEventListener("contextmenu", e => {
            e.preventDefault()
            e.stopPropagation()
        })
        return frame
    }
}

export const resolveHTML = (location: string) => {
    return async () => {
        const response = await window.fetch(location)
        const root = document.createElement("div")
        root.innerHTML = await response.text()
        return root
    }
}
