import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type AccentColor = 'indigo' | 'blue' | 'rose' | 'green';
type FontFamily = 'inter' | 'poppins' | 'roboto';

interface AppearanceContextType {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

const accentColorMap: Record<AccentColor, Record<string, string>> = {
  indigo: {
    50: '239 246 255', 100: '224 231 255', 200: '199 210 254', 300: '165 180 252',
    400: '129 140 248', 500: '99 102 241', 600: '79 70 229', 700: '67 56 202',
    800: '55 48 163', 900: '49 46 129',
  },
  blue: {
    50: '239 246 255', 100: '219 234 254', 200: '191 219 254', 300: '147 197 253',
    400: '96 165 250', 500: '59 130 246', 600: '37 99 235', 700: '29 78 216',
    800: '30 64 175', 900: '30 58 138',
  },
  rose: {
    50: '255 241 242', 100: '255 228 230', 200: '254 205 211', 300: '253 164 175',
    400: '251 113 133', 500: '244 63 94', 600: '225 29 72', 700: '190 18 60',
    800: '159 18 57', 900: '136 19 55',
  },
  green: {
    50: '240 253 244', 100: '220 252 231', 200: '187 247 208', 300: '134 239 172',
    400: '74 222 128', 500: '34 197 94', 600: '22 163 74', 700: '21 128 61',
    800: '22 101 52', 900: '20 83 45',
  },
};

const fontClassMap: Record<FontFamily, string> = {
  inter: 'font-inter',
  poppins: 'font-poppins',
  roboto: 'font-roboto',
};

export const AppearanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    return (localStorage.getItem('issraedrive-accent-color') as AccentColor) || 'indigo';
  });
  const [fontFamily, setFontFamily] = useState<FontFamily>(() => {
    return (localStorage.getItem('issraedrive-font-family') as FontFamily) || 'inter';
  });

  const applyTheme = useCallback(() => {
    // Apply Accent Color
    const root = document.documentElement;
    const colors = accentColorMap[accentColor];
    for (const [shade, value] of Object.entries(colors)) {
      // FIX: The `value` from Object.entries can be inferred as `unknown`. Explicitly cast it to a string.
      root.style.setProperty(`--color-primary-${shade}`, String(value));
    }
    localStorage.setItem('issraedrive-accent-color', accentColor);

    // Apply Font Family
    // Fix: The type of `Object.values` can be inferred as `unknown[]` in some TypeScript configurations.
    // Casting to `string[]` ensures type safety for `classList.remove`.
    document.body.classList.remove(...(Object.values(fontClassMap) as string[]));
    document.body.classList.add(fontClassMap[fontFamily]);
    localStorage.setItem('issraedrive-font-family', fontFamily);
  }, [accentColor, fontFamily]);

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  const value = {
    accentColor,
    setAccentColor,
    fontFamily,
    setFontFamily,
  };

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
};

export const useAppearance = (): AppearanceContextType => {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error('useAppearance must be used within an AppearanceProvider');
  }
  return context;
};