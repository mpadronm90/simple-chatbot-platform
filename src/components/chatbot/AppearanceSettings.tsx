import React from 'react';

interface AppearanceSettingsProps {
  theme: string;
  onThemeChange: (theme: string) => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ theme, onThemeChange }) => {
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = e.target.value;
    if (selectedTheme === 'light' || selectedTheme === 'dark') {
      onThemeChange(selectedTheme);
    }
  };

  return (
    <div className="appearance-settings">
      <h3>Appearance Settings</h3>
      <label htmlFor="theme-select">
        Theme:
        <select id="theme-select" value={theme} onChange={handleThemeChange}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
    </div>
  );
};

export default AppearanceSettings;
