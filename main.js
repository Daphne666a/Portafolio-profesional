document.addEventListener('DOMContentLoaded', () => {
    const langButtons = document.querySelectorAll('[data-language-bottom]');
    const initialLang = localStorage.getItem('preferred-lang') || 'es';
    loadLanguage(initialLang);

    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            loadLanguage(btn.getAttribute('data-language-bottom'));
        });
    });
});

async function loadLanguage(lang) {
    try {
        const response = await fetch(`./${lang}.json`);
        if (!response.ok) throw new Error(`No se pudo cargar ${lang}.json`);
        const texts = await response.json();

        localStorage.setItem('preferred-lang', lang);
        document.documentElement.lang = lang;
        translateUI(texts);
    } catch (error) {
        console.error("Error traducción:", error);
    }
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

function translateUI(texts) {
    document.querySelectorAll('[data-value]').forEach(el => {
        const key = el.getAttribute('data-value');
        const section = el.getAttribute('data-section');

        if (!section) {
            if (texts.hero?.[key]) el.textContent = texts.hero[key];
            return;
        }

        const card = el.closest('.card, .project-card, .skill-card');
        if (card) {
            handleArrays(el, texts, key, section, card);
            return;
        }

        const baseObject = texts[key];
        if (!baseObject) return;

        const translatedText = getNestedValue(baseObject, section);
        if (!translatedText) return;

        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = translatedText;
        } else if (el.tagName === 'LABEL') {
            if (el.firstChild?.nodeType === 3) {
                el.firstChild.textContent = translatedText;
            } else {
                el.textContent = translatedText;
            }
        } else if (el.classList.contains('panel-text') || el.innerHTML.includes('<br')) {
            el.innerHTML = translatedText;
        } else {
            el.textContent = translatedText;
        }
    });
}

function handleArrays(el, texts, key, section, card) {
    const index = Array.from(card.parentElement.children).indexOf(card);
    const item = texts[key]?.items?.[index];
    
    if (!item) return;
    
    el.textContent = typeof item === 'string' ? item : item[section];
}