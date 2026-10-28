const svg = (paths: string): string =>
  `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

/** The icons the app draws next to buttons and due dates. */
export const icons = {
  calendar: svg('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M8.5 13.5l2.5 2.5 4.5-4.5"/>'),
  pencil: svg('<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>'),
  trash: svg('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
};

/** Creates a new SVG element for the icon called `name`. */
export const createIcon = (name: keyof typeof icons): SVGSVGElement => {
  const template = document.createElement('template');
  template.innerHTML = icons[name];
  return template.content.firstElementChild as SVGSVGElement;
};
