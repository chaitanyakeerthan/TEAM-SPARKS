// components/LanguageSelector.jsx
import React from "react";
import { SUPPORTED_LANGUAGES } from "../utils/Constants";

export default function LanguageSelector({ selectedLang, onLangChange }) {
   const langs = SUPPORTED_LANGUAGES;

    return (
        <select
            value={selectedLang}
            onChange={(e) => onLangChange(e.target.value)}
            className="p-2 text-sm rounded-md border border-green-600 shadow-sm focus:ring-2 focus:ring-green-400"
        >
            {langs.map(l => (
                <option key={l.code} value={l.code}>{l.label}</option>
            ))}
        </select>
    );
}