import { clamp, style } from "./common"
import { Window } from "./strategies"

export * from "./common"
export * from "./strategies"
export * from "./xpath"

export async function makeFrame(w: Window) {
    const content = await w.resolver()

    //* style root
    const root = document.createElement("div")
    style(root, {
        position: "fixed",
        top: "50vh",
        left: "50vw",
        transform: "translateX(-50%) translateY(-50%)",
        zIndex: "999999999",
    })

    //* titlebar
    const title = document.createElement("p")
    style(title, { userSelect: "none", margin: "0" })
    title.innerText = w.title

    const buttons = document.createElement("div")
    style(buttons, { display: "flex", gap: "0.5rem" })
    const buttonStyle = {
        border: "0",
        background: "none",
        lineHeight: "10px",
        fontWeight: "semibold",
        fontSize: "1rem",
    }

    const contentDisplay = content.style.display
    let minimized = false
    const minimize = document.createElement("button")
    style(minimize, buttonStyle)
    minimize.textContent = "-"
    minimize.onclick = () => {
        minimized = !minimized
        style(content, { display: minimized ? "none" : contentDisplay })
        minimize.textContent = minimized ? "+" : "-"
    }
    buttons.append(minimize)

    const close = document.createElement("button")
    close.textContent = "x"
    close.onclick = () => {
        root.remove()
        w.onexit?.call(undefined)
    }
    style(close, buttonStyle)
    buttons.append(close)

    const titlebar = document.createElement("div")
    style(titlebar, {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: "1rem 1rem 0 0",
        backgroundColor: "rgb(240, 240, 240)",
        padding: "0.75rem",
        gap: "2rem",
    })
    titlebar.append(title, buttons)

    //* limit the drag region to the window
    let boundsChanged = () => { }
    let bounds = [Infinity, Infinity]
    const calculateBounds = () => {
        bounds[0] = window.innerWidth / 2 - content.offsetWidth / 2 - (
            content.offsetWidth !== titlebar.offsetWidth ?
                titlebar.offsetWidth / 2 : 0
        )
        bounds[1] = window.innerHeight / 2 - content.offsetHeight / 2 - titlebar.offsetHeight / 2
        boundsChanged()
    }
    const observer = new ResizeObserver(() => calculateBounds())
    observer.observe(content)
    observer.observe(titlebar)
    window.addEventListener("resize", () => calculateBounds())

    //* drag logic
    let dragging = false
    let offset = [0, 0]
    let last = [-1, -1]
    titlebar.addEventListener("mousedown", e => {
        dragging = true
    })
    window.addEventListener("mouseup", () => {
        dragging = false
        last = [-1, -1]
    })
    const updatePosition = (delta: [number, number]) => {
        offset[0] = clamp(offset[0] + delta[0], -bounds[0], bounds[0])
        offset[1] = clamp(offset[1] + delta[1], -bounds[1], bounds[1])
        root.style.left = `calc(50vw + ${offset[0]}px)`
        root.style.top = `calc(50vh + ${offset[1]}px)`
    }
    window.addEventListener("mousemove", e => {
        if (dragging) {
            const delta: [number, number] = last[0] > 0 ?
                [e.clientX - last[0], e.clientY - last[1]] :
                [0, 0]

            updatePosition(delta)
            last = [e.clientX, e.clientY]
        }
    })
    boundsChanged = () => updatePosition([0, 0])

    //* final setup
    root.append(titlebar, content)
    document.body.append(root)
}
