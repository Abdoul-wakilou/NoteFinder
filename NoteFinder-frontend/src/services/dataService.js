export const parseExtractedText = (text) => {
    if (!text) return [];

    const parsedRows = text.split("\n").map((line, index) => {
        line = line.trim();
        if (!line) return null;

        let textBefore = line;
        let note = '';

        // Séparer le texte et la note si le caractère '»' est présent
        if (line.includes('»')) {
            [textBefore, note] = line.split('»').map(text => text.trim());
        }

        return {
            id: index,
            text: textBefore,
            note: note,
            isSelected: false,
        };
    }).filter(row => row !== null); // Filtrer les lignes vides

    return parsedRows;
};