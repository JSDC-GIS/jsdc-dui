import { RefObject } from 'react';
declare type AnyEvent = MouseEvent | TouchEvent;
declare const useOnClickOutside: <T extends HTMLElement = HTMLElement>(ref: RefObject<T>, handler: (event: AnyEvent) => void) => void;
export default useOnClickOutside;
