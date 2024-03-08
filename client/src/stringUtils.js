export function normalizeWord(word) {
    // Convert the word to lowercase for case-insensitive comparison
    const wordLower = word.toLowerCase();

    // Remove accent marks from the word using normalize and replace
    const normalizedWord = wordLower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Ignore certain word endings, ambiguous in spanish  (e.g., 'o', 'a', 's')
    const trimmedWord = normalizedWord.replace(/[oas]$/g, "");

    return trimmedWord;
}