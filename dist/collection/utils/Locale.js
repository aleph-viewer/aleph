function getComponentClosestLanguage(element) {
    const closestElement = element.closest("[lang]");
    return closestElement ? closestElement.lang : "en";
}
function fetchLocaleStringsForComponent(componentName, locale) {
    return new Promise((resolve, reject) => {
        fetch(`/i18n/${componentName}.i18n.${locale}.json`).then(result => {
            if (result.ok) {
                resolve(result.json());
            }
            else {
                reject();
            }
        }, () => reject());
    });
}
export async function getLocaleComponentStrings(element) {
    const componentName = element.tagName.toLowerCase();
    const componentLanguage = getComponentClosestLanguage(element);
    let strings;
    try {
        strings = await fetchLocaleStringsForComponent(componentName, componentLanguage);
    }
    catch (e) {
        console.warn(`no locale for ${componentName} (${componentLanguage}) loading default locale en.`);
        strings = await fetchLocaleStringsForComponent(componentName, "en");
    }
    return strings;
}
