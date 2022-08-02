import { makeFrame, style } from "./lib/index"
import { xmulti, xrequired, xtext } from "./lib/xpath"

type User = {
    name: string
    href: string
}

function dms(): User[] {
    const links = xmulti("//nav[contains(@class, 'privateChannels')]//a[contains(@href, 'channels')]")
    const users: User[] = []
    for (const a of links) {
        const name = xtext(".//div[contains(@class, 'name')]//div[contains(@class, 'overflow')]/text()", a)
        if (name.trim().length === 0) {
            continue
        }
        const href = a.getAttribute("href")
        if (!href) {
            console.error("missing href on tag!", a)
            continue
        }
        users.push({ name, href })
    }
    if (users.length === 0) {
        alert("couldn't find any people to watch!")
    }
    return users
}

function controlPanel(
    users: User[],
    onselect: (selected: { [key: string]: User }) => void,
    onexit: () => void,
) {
    makeFrame({
        title: "lurking toolkit",
        onexit,
        resolver: async () => {
            const list = document.createElement("ul")
            style(list, {
                listStyle: "none",
                maxHeight: "400px",
                overflowY: "auto",
                background: "white",
                padding: "0.5rem 1.5rem",
            })

            const selected: { [key: string]: User } = {}
            for (const u of users) {
                const entry = document.createElement("li")
                style(entry, {
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1.5rem"
                })

                const name = document.createElement("p")
                name.innerText = u.name
                entry.append(name)

                const toggle = document.createElement("input")
                toggle.type = "checkbox"
                toggle.addEventListener("change", () => {
                    if (!toggle.checked) {
                        delete selected[u.href]
                    } else {
                        selected[u.href] = u
                    }
                    onselect(selected)
                })
                entry.append(toggle)

                list.append(entry)
            }

            return list
        },
    })
}

function stalk(u: User) {
    const icon = xrequired(
        "user icon",
        `//nav[contains(@class, 'privateChannels')]//a[@href='${u.href}']//div[contains(@aria-label, '${u.name}')]`
    )

    const notify = (state: string) => {
        const message = `${u.name} is now ${state}.`
        console.log(message)
        const notification = new Notification('lurking toolkit', {
            requireInteraction: true,
            body: message,
        })
        notification.onclick = () => {
            window.location.assign(u.href)
        }
    }

    const observer = new MutationObserver(() => {
        const label = icon.getAttribute("aria-label")
        if (!label) return

        const state = label.split(",")[1].trim().toLowerCase()
        if (state !== "offline") {
            notify("online")
            return
        }
        notify("offline")
    })

    observer.observe(icon, { attributes: true })
    return () => observer.disconnect()
}

if (Notification.permission !== "granted") {
    Notification.requestPermission()
    alert("please enable notification permissions and rerun the bookmarklet!")
} else {
    const users = dms()
    const cleanup: { [key: string]: () => void } = {}
    controlPanel(
        users,
        users => {
            for (const u in cleanup) {
                if (u in users) {
                    continue
                }
                cleanup[u]()
                delete cleanup[u]
            }
            for (const u in users) {
                if (u in cleanup) {
                    continue
                }
                cleanup[u] = stalk(users[u])
            }
        },
        () => {
            for (const k in cleanup) {
                cleanup[k]()
            }
        }
    )
}
