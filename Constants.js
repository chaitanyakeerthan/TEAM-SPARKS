// utils/constants.js
// Just keeping a few shared constants here. 
// (Might expand later if we start adding more settings or config.)

export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', label: 'English' },
  { code: 'hi-IN', label: 'हिन्दी (Hindi)' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)' },
  { code: 'bn-IN', label: 'বাংলা (Bengali)' },
  { code: 'mr-IN', label: 'मराठी (Marathi)' },
  { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml-IN', label: 'മലയാളം (Malayalam)' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'or-IN', label: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'as-IN', label: 'অসমীয়া (Assamese)' },
  { code: 'ur-IN', label: 'اردو (Urdu)' }
];

// Default language – English for most users
export const DEFAULT_LANG = 'en-US';

// Placeholder API endpoints (we could centralize them later)
export const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

// For now, leaving keys empty for secure environments (don’t hardcode!)
export const API_KEY = "";

// Note: Might add voice models or sample rates here later.
export const DEFAULT_SAMPLE_RATE = 24000;