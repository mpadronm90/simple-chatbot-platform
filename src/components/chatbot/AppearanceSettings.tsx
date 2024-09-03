import React from 'react';

interface AppearanceSettingsProps {
  appearance: {
    color: string;
    font: string;
    size: string;
  };
  onAppearanceChange: (appearance: { color: string; font: string; size: string }) => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ appearance, onAppearanceChange }) => {
  return (
    <div>
      <h3>Appearance Settings</h3>
      <input
        type="color"
        value={appearance.color}
        onChange={(e) => onAppearanceChange({ ...appearance, color: e.target.value })}
      />
      <select
        value={appearance.font}
        onChange={(e) => onAppearanceChange({ ...appearance, font: e.target.value })}
      >
        <option value="Arial">Arial</option>
        <option value="Helvetica">Helvetica</option>
        <option value="Times New Roman">Times New Roman</option>
      </select>
      <input
        type="range"
        min="12"
        max="24"
        value={appearance.size}
        onChange={(e) => onAppearanceChange({ ...appearance, size: e.target.value })}
      />
    </div>
  );
};

export default AppearanceSettings;
