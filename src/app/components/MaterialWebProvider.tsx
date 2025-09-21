'use client';

import { useEffect } from 'react';

// Import all Material Web components
import '@material/web/all';

// Additional explicit imports for better tree-shaking if needed
import '@material/web/button/filled-button';
import '@material/web/button/outlined-button';
import '@material/web/button/text-button';
import '@material/web/button/elevated-button';
import '@material/web/button/filled-tonal-button';

import '@material/web/textfield/filled-text-field';
import '@material/web/textfield/outlined-text-field';

// Cards are in labs
import '@material/web/labs/card/elevated-card';
import '@material/web/labs/card/filled-card';
import '@material/web/labs/card/outlined-card';

import '@material/web/chips/chip-set';
import '@material/web/chips/assist-chip';
import '@material/web/chips/filter-chip';
import '@material/web/chips/input-chip';
import '@material/web/chips/suggestion-chip';

import '@material/web/dialog/dialog';
import '@material/web/divider/divider';
import '@material/web/elevation/elevation';

import '@material/web/fab/fab';
import '@material/web/fab/branded-fab';

import '@material/web/icon/icon';
import '@material/web/iconbutton/icon-button';
import '@material/web/iconbutton/filled-icon-button';
import '@material/web/iconbutton/filled-tonal-icon-button';
import '@material/web/iconbutton/outlined-icon-button';

import '@material/web/list/list';
import '@material/web/list/list-item';

import '@material/web/menu/menu';
import '@material/web/menu/menu-item';
import '@material/web/menu/sub-menu';

// Navigation components are in labs
import '@material/web/labs/navigationbar/navigation-bar';
import '@material/web/labs/navigationtab/navigation-tab';
import '@material/web/labs/navigationdrawer/navigation-drawer';

import '@material/web/progress/circular-progress';
import '@material/web/progress/linear-progress';

import '@material/web/radio/radio';
import '@material/web/checkbox/checkbox';
import '@material/web/switch/switch';

import '@material/web/select/filled-select';
import '@material/web/select/outlined-select';

import '@material/web/slider/slider';
import '@material/web/tabs/tabs';
import '@material/web/tabs/primary-tab';
import '@material/web/tabs/secondary-tab';

export default function MaterialWebProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const setupMaterialWeb = async () => {
      try {
        // Import Material Web typography styles
        const typescaleModule = await import('@material/web/typography/md-typescale-styles.js');

        // Adopt the typography styles if supported
        if (document.adoptedStyleSheets && typescaleModule.styles?.styleSheet) {
          document.adoptedStyleSheets.push(typescaleModule.styles.styleSheet);
        }

        console.log('Material Web components loaded successfully');
      } catch (error) {
        console.error('Error importing Material Web components:', error);
      }
    };

    setupMaterialWeb();
  }, []);

  return <>{children}</>;
}