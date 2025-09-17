'use client';

import { useEffect } from 'react';

export default function MaterialWebProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Import Material Web components and typography
        const importMaterialWeb = async () => {
            // Import all Material Web components
            await import('@material/web/all.js');

            // Import typography styles
            const { styles: typescaleStyles } = await import('@material/web/typography/md-typescale-styles.js');

            // Adopt the typography styles
            if (document.adoptedStyleSheets && typescaleStyles.styleSheet) {
                document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
            }
        };

        importMaterialWeb();
    }, []);

    return <>{children}</>;
}