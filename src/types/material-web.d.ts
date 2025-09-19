import React from 'react';

declare module '@material/web/*';
declare module '@material/web/all';

// Material Web component type declarations
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'md-filled-button': React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
            'md-outlined-button': React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
            'md-text-button': React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
            'md-fab': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-outlined-text-field': React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
                label?: string;
                type?: string;
                required?: boolean;
                value?: string;
            };
            'md-checkbox': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-radio': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-switch': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-chip': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-dialog': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-menu': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-select': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-slider': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-tabs': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-tab': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}

export { };