"use client";
import React, { useState } from 'react';
import { Palette, Menu, X, AlertTriangle, AlertCircle, ThumbsUp, ChevronDown, User, Copy } from 'lucide-react';

const ThemePreview = () => {
  const [theme, setTheme] = useState({
    primary: '#1976D2',
    secondary: '#FF4081',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    error: '#D32F2F',
    warning: '#FFA000',
    success: '#388E3C',
    info: '#0288D1',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onBackground: '#000000',
    onSurface: '#000000',
    onError: '#FFFFFF',
    onWarning: '#000000',
    onSuccess: '#FFFFFF',
    onInfo: '#FFFFFF',
    accent: '#7C4DFF',
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Copy Theme');

  // Function to generate a random color within a specific hue range
  const generateColorInRange = (hueStart, hueEnd) => {
    const hue = Math.floor(Math.random() * (hueEnd - hueStart + 1)) + hueStart;
    const saturation = Math.floor(Math.random() * 41) + 60; // 60-100%
    const lightness = Math.floor(Math.random() * 21) + 40; // 40-60%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Convert HSL to HEX
  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const changeTheme = () => {
    const newTheme = {
      primary: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      secondary: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      background: theme.background === '#FFFFFF' ? '#121212' : '#FFFFFF',
      surface: theme.surface === '#F5F5F5' ? '#1E1E1E' : '#F5F5F5',
      error: generateColorInRange(0, 10),    // Red hues
      warning: generateColorInRange(25, 40), // Orange hues
      success: generateColorInRange(100, 140), // Green hues
      info: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      accent: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    };

    // Convert HSL to HEX for error, warning, and success
    newTheme.error = hslToHex(...newTheme.error.match(/\d+/g).map(Number));
    newTheme.warning = hslToHex(...newTheme.warning.match(/\d+/g).map(Number));
    newTheme.success = hslToHex(...newTheme.success.match(/\d+/g).map(Number));

    // Generate contrasting colors for text
    newTheme.onPrimary = getContrastText(newTheme.primary);
    newTheme.onSecondary = getContrastText(newTheme.secondary);
    newTheme.onBackground = newTheme.background === '#FFFFFF' ? '#000000' : '#FFFFFF';
    newTheme.onSurface = newTheme.surface === '#F5F5F5' ? '#000000' : '#FFFFFF';
    newTheme.onError = getContrastText(newTheme.error);
    newTheme.onWarning = getContrastText(newTheme.warning);
    newTheme.onSuccess = getContrastText(newTheme.success);
    newTheme.onInfo = getContrastText(newTheme.info);

    setTheme(newTheme);
  };

  const getContrastText = (bgColor) => {
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
  };

  const copyTheme = () => {
    const themeJson = JSON.stringify(theme, null, 2);
    navigator.clipboard.writeText(themeJson).then(() => {
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy Theme'), 2000);
    });
  };


  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: theme.background, color: theme.onBackground }}>
      <nav className="flex justify-between items-center p-4" style={{ backgroundColor: theme.primary, color: theme.onPrimary }}>
        <div className="text-xl font-bold">Theme Generator</div>
        <div className="flex items-center space-x-4">
          <button onClick={changeTheme} className="p-2 rounded-full" style={{ backgroundColor: theme.accent, color: getContrastText(theme.accent) }}>
            <Palette size={24} />
          </button>
          <button 
            onClick={copyTheme} 
            className="p-2 rounded flex items-center" 
            style={{ backgroundColor: theme.secondary, color: theme.onSecondary }}
          >
            <Copy size={24} />
            <span className="ml-2">{copyStatus}</span>
          </button>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Color Palette</h2>
        <div className="flex flex-wrap justify-center gap-4 px-4">
          {Object.entries(theme).map(([key, value]) => (
            <div key={key} className="w-32 h-32 rounded-lg shadow-md flex flex-col justify-center items-center" style={{ backgroundColor: value, color: getContrastText(value) }}>
              <div className="font-bold">{key}</div>
              <div className="text-sm">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: theme.surface, color: theme.onSurface }}>
        <h2 className="text-3xl font-bold text-center mb-8">Alert Examples</h2>
        <div className="max-w-2xl mx-auto space-y-4 px-4">
          {[
            { type: 'error', icon: AlertCircle, message: 'This is an error alert', color: theme.error, textColor: theme.onError },
            { type: 'warning', icon: AlertTriangle, message: 'This is a warning alert', color: theme.warning, textColor: theme.onWarning },
            { type: 'success', icon: ThumbsUp, message: 'This is a success alert', color: theme.success, textColor: theme.onSuccess },
            { type: 'info', icon: AlertCircle, message: 'This is an info alert', color: theme.info, textColor: theme.onInfo }
          ].map((alert, index) => (
            <div key={index} className="flex items-center p-4 rounded-lg" style={{ backgroundColor: alert.color, color: alert.textColor }}>
              <alert.icon size={24} className="mr-4" />
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ThemePreview;