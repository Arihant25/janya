/// <reference types="react" />

declare namespace JSX {
  interface IntrinsicElements {
    'md-filled-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      disabled?: boolean;
      dense?: boolean;
    }, HTMLElement>;
    'md-outlined-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      disabled?: boolean;
      dense?: boolean;
    }, HTMLElement>;
    'md-text-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      disabled?: boolean;
      dense?: boolean;
    }, HTMLElement>;
    'md-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      slot?: string;
    }, HTMLElement>;
    'md-outlined-text-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      label?: string;
      value?: string;
      type?: string;
      disabled?: boolean;
      required?: boolean;
      rows?: number;
      error?: boolean;
      errorText?: string;
    }, HTMLElement>;
    [elemName: string]: any;
  }
}

declare module '@material/web/all';
declare module '@material/web/textfield/outlined-text-field';
declare module '@material/web/button/text-button';
declare module '@material/web/button/outlined-button';
declare module '@material/web/iconbutton/icon-button';
declare module '@material/web/icon/icon';

interface CustomEventTarget extends EventTarget {
  value: string;
}

interface CustomEvent extends Event {
  target: CustomEventTarget;
}