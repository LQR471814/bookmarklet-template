## bookmarklets

> small javascript snippets that make websites more enjoyable

### catalog

| bookmarklet | description |
| --- | --- |
| [hello](src/hello.ts) | logs "hello" | 
| [lurking toolkit](src/stalker.ts) | tells you when people go on and offline in discord |

### using this repository

one is able to use this repository as a template for one's own bookmark creation.

- fork/clone the repository then remove all the files in `src` besides `lib`.
- all bookmarklets must be programmed in typescript and placed at the root of `src`
- to test your bookmarklets, execute `npm run dev`
- to build your bookmarklets, execute `npm run build`
- if you wish to change the test webpage that the bookmarklet runs on, change `public/view.html`
