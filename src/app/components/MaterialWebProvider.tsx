'use client';

import { useEffect } from 'react';
import '@material/web/textfield/outlined-text-field';
import '@material/web/button/text-button';
import '@material/web/button/outlined-button';
import '@material/web/button/filled-button';
import '@material/web/iconbutton/icon-button';
import '@material/web/icon/icon';
import '@material/web/all';

export default function MaterialWebProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const importMaterialWeb = async () => {
      // Import Material Web components and styles
      const { Icon } = await import('@material/web/icon/icon.js');
      const { styles: typescaleStyles } = await import('@material/web/typography/md-typescale-styles.js');

      // Register the icon component
      if (!customElements.get('md-icon')) {
        customElements.define('md-icon', Icon);
      }

      // Adopt the typography styles
      if (document.adoptedStyleSheets && typescaleStyles.styleSheet) {
        document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
      }
    };

    importMaterialWeb();
  }, []);

  return <>{children}</>;
}