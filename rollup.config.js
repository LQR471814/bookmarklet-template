import { terser } from "rollup-plugin-terser"
import typescript from "@rollup/plugin-typescript"
import serve from "rollup-plugin-serve"
import copy from "rollup-plugin-copy"
import bookmarklet from "./bookmarklet-plugin"

import fs from "fs"
const files = []
for (const entry of fs.readdirSync("src/")) {
    if (entry.endsWith(".ts")) {
        const entryname = entry.split(".")
        entryname.pop()
        files.push(entryname.join("."))
    }
}
fs.writeFileSync("build/index.txt", files.join("\n"))

const production = !process.env.ROLLUP_WATCH
export default {
    input: files.map(f => `src/${f}.ts`),
    output: {
        dir: "build/",
        format: "es"
    },
    plugins: [
        typescript(),
        copy({
            targets: [
                { src: "public/**", dest: "build/" }
            ]
        }),
        ...(!production ?
            [
                serve({
                    contentBase: "build/",
                    open: true,
                }),
            ] : []),
        ...(production ? [terser(), bookmarklet()] : [])
    ]
}