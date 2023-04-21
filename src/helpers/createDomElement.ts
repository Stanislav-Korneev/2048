interface IPayload {
    tagName?: string
    id?: string
    classList?: string[]
    textContent?: string
    parent?: HTMLElement
}

export default function createDomElement({
     tagName = 'div',
     id = '',
     classList = [],
     textContent = '',
     parent,
 }: IPayload): HTMLElement {

    const newEl: HTMLElement = document.createElement(tagName);
    newEl.id = id;
    newEl.classList.add(...classList);
    newEl.textContent = textContent;

    if (parent) parent.append(newEl);
    return newEl;
}
