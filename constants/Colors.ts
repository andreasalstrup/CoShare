const tintColorLight = '#000';
const tintColorDark = '#fff';
const tintColorTurquoise = 'rgba(92, 188, 169, 0.27)';
const accentColorTurquoise = 'rgba(92, 188, 169)';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    tabIconSelectedBackground: tintColorTurquoise,
    accentColor: accentColorTurquoise,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    tabIconSelectedBackground: tintColorTurquoise,
  },
};
