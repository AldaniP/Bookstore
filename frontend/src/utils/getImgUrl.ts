function getImgUrl (name: string) {
    if (!name) return '';
    if (name.startsWith('http')) return name;
    return new URL(`../assets/books/${name}`, import.meta.url).href;
}

export {getImgUrl}