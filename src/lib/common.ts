export class Dimensions {
    width: number
    height: number

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
    }

    w(): string {
        return `${this.width}px`
    }

    h(): string {
        return `${this.height}px`
    }
}

export function style(element: HTMLElement, style: Partial<CSSStyleDeclaration>) {
    Object.assign(element.style, style)
}

export function clamp(value: number, min: number, max: number) {
    if (value < min) {
        return min
    }
    if (value > max) {
        return max
    }
    return value
}
