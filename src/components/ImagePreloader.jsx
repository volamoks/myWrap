import { useEffect } from 'react';

export default function ImagePreloader({ stories }) {
    useEffect(() => {
        if (!stories || stories.length === 0) return;

        const preloadImage = (src) => {
            const img = new Image();
            img.src = src;
        };

        stories.forEach(story => {
            if (story.type === 'photo-grid' && story.images) {
                story.images.forEach(preloadImage);
            }
        });
    }, [stories]);

    return null;
}
