interface IPayload {
    tagName?: string,
    classList?: string[],
    textContent?: string,
    parent?: HTMLElement,
}

export default function createDomElement(payload: IPayload): HTMLElement {
    const {
        tagName = 'div',
        classList = [],
        textContent = '',
        parent
    } = payload;

    const newEl: HTMLElement = document.createElement(tagName);
    newEl.classList.add(...classList);
    newEl.textContent = textContent;

    if (parent) parent.append(newEl);
    return newEl;
}
