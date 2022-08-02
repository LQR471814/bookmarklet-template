export default function bookmarklet() {
    return {
        name: "bookmarklet",
        renderChunk: (code) => {
            return `javascript:(function(){${code}})()`
        }
    }
}