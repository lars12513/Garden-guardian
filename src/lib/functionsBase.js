// src/lib/functionsBase.js
export const FUNCTIONS_BASE = import.meta.env.VITE_FUNCTIONS_BASE || '';
export const fn = (name) => FUNCTIONS_BASE ? `${FUNCTIONS_BASE.replace(/\/$/, '')}/${name}` : `/${name}`;
