import LZString from 'lz-string';

// Compress and encode JSON for URL
export const encodeConfig = (jsonObj) => {
    try {
        const jsonString = JSON.stringify(jsonObj);
        return LZString.compressToEncodedURIComponent(jsonString);
    } catch (e) {
        console.error("Encoding failed", e);
        return null;
    }
};

// Decode and decompress from URL
export const decodeConfig = (encodedString) => {
    try {
        const jsonString = LZString.decompressFromEncodedURIComponent(encodedString);
        if (!jsonString) return null;
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Decoding failed", e);
        return null;
    }
};
