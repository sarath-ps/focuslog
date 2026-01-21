/**
 * Calm, focus-oriented color palette.
 * Dark mode first approach.
 */

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    primary: '#2A9D8F', // Calm Teal
    secondary: '#264653', // Deep Blue
    accent: '#E9C46A', // Warm Yellow
    danger: '#E76F51', // Burnt Orange
    surface: '#F4F4F4',
  },
  dark: {
    text: '#fff',
    background: '#121212', // Near Black
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    primary: '#2A9D8F', // Calm Teal
    secondary: '#264653', // Deep Blue
    accent: '#E9C46A', // Warm Yellow
    danger: '#E76F51', // Burnt Orange
    surface: '#1E1E1E',
  },
  // Specific semantic colors
  timer: {
    running: '#2A9D8F',
    paused: '#E9C46A',
    break: '#264653',
  }
};
