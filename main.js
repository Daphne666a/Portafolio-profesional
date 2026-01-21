document.addEventListener('DOMContentLoaded', () => {
    const langButtons = document.querySelectorAll('[data-language-bottom]');
    
    // 1. Cargar idioma inicial (de localStorage o defecto español)
    const initialLang = localStorage.getItem('preferred-lang') || 'es';
    loadLanguage(initialLang);

    // 2. Event Listeners para botones de idioma
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-language-bottom');
            loadLanguage(lang);
        });
    });
});

async function loadLanguage(lang) {
    try {
        const response = await fetch(`./${lang}.json`);
        if (!response.ok) throw new Error(`No se pudo cargar el archivo ${lang}.json`);
        const texts = await response.json();

        // Guardar preferencia
        localStorage.setItem('preferred-lang', lang);
        document.documentElement.lang = lang;

        // 3. Traducir elementos con data-value y data-section
        translateUI(texts);

    } catch (error) {
        console.error("Error en la traducción:", error);
    }
}

// Función para acceder a propiedades anidadas dinámicamente
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : null;
    }, obj);
}

function translateUI(texts) {
    const elements = document.querySelectorAll('[data-value]');

    elements.forEach(el => {
        const key = el.getAttribute('data-value');
        const section = el.getAttribute('data-section');

        // ===== CASO 1: Hero (sin data-section) =====
        if (!section) {
            if (texts.hero && texts.hero[key]) {
                el.textContent = texts.hero[key];
            }
            return;
        }

        // ===== CASO 2: Arrays de servicios, proyectos, soft skills =====
        // Detectamos si es un array por la presencia de .card, .project-card, etc.
        const card = el.closest('.card, .project-card, .skill-card');
        if (card) {
            handleArrays(el, texts, key, section, card);
            return; // Importante: salimos aquí para no ejecutar la lógica normal
        }

        // ===== CASO 3: Objetos anidados normales (contact.info.*, contact.form.*, footer.*, etc.) =====
        const baseObject = texts[key];
        
        if (!baseObject) {
            return; // No hacemos nada si no existe la clave principal
        }

        // Usamos getNestedValue para rutas anidadas como "info.redes", "form.name", etc.
        const translatedText = getNestedValue(baseObject, section);

        if (translatedText) {
            // Manejo especial para inputs, textareas y labels
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translatedText;
            } else if (el.tagName === 'LABEL') {
                // Para labels, solo actualizar el nodo de texto, no destruir el input dentro
                if (el.firstChild && el.firstChild.nodeType === 3) { // nodeType 3 = text node
                    el.firstChild.textContent = translatedText;
                } else {
                    el.textContent = translatedText;
                }
            } else if (el.classList.contains('panel-text') || el.innerHTML.includes('<br')) {
                // Usar innerHTML solo para elementos que explícitamente lo necesiten
                el.innerHTML = translatedText;
            } else {
                // Por defecto, usar textContent para evitar problemas
                el.textContent = translatedText;
            }
        }
    });
}

function handleArrays(el, texts, key, section, card) {
    // Obtenemos el índice de la card respecto a sus hermanos
    const parent = card.parentElement;
    const index = Array.from(parent.children).indexOf(card);

    if (texts[key] && texts[key].items && texts[key].items[index]) {
        const item = texts[key].items[index];
        
        // Si es un string directo (como en softSkills)
        if (typeof item === 'string') {
            el.textContent = item;
        } 
        // Si es un objeto (como en servicios o proyectos)
        else if (item[section]) {
            el.textContent = item[section];
        }
    }
}