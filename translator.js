// Translator engine

const input = document.getElementById('input');
const output = document.getElementById('output');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const inputStats = document.getElementById('inputStats');
const outputStats = document.getElementById('outputStats');

function preserveCase(original, replacement) {
    if (original === original.toUpperCase() && original.length > 1) {
        return replacement.toUpperCase();
    }
    if (original[0] === original[0].toUpperCase()) {
        return replacement[0].toUpperCase() + replacement.slice(1);
    }
    return replacement;
}

function translate(text) {
    if (!text.trim()) return '';

    // Split into tokens preserving whitespace and punctuation
    const tokens = text.split(/(\s+|[.,;:!?'"()\[\]{}\-—–\/\\])/);
    let replaced = 0;
    let total = 0;

    const result = tokens.map(token => {
        // Skip whitespace and punctuation tokens
        if (!token || /^(\s+|[.,;:!?'"()\[\]{}\-—–\/\\])$/.test(token)) {
            return token;
        }

        total++;
        const lower = token.toLowerCase();

        if (ANGLISH_DICT[lower]) {
            replaced++;
            return preserveCase(token, ANGLISH_DICT[lower]);
        }

        return token;
    }).join('');

    updateStats(text, result, replaced, total);
    return result;
}

function updateStats(inputText, outputText, replaced, total) {
    const wordCount = inputText.trim().split(/\s+/).filter(w => w).length;
    inputStats.textContent = `${wordCount} word${wordCount !== 1 ? 's' : ''}`;
    outputStats.textContent = `${replaced} of ${total} words swapped`;
}

let debounceTimer;
input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        output.value = translate(input.value);
    }, 150);
});

copyBtn.addEventListener('click', () => {
    if (!output.value) return;
    navigator.clipboard.writeText(output.value).then(() => {
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
        }, 1500);
    });
});

clearBtn.addEventListener('click', () => {
    input.value = '';
    output.value = '';
    inputStats.textContent = '';
    outputStats.textContent = '';
    input.focus();
});

// Translate on page load if there's already text (e.g. browser autofill)
if (input.value) {
    output.value = translate(input.value);
}
