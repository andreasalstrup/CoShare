const tintColorLight = '#000';
const tintColorDark = '#fff';
const tintColorTurquoise = 'rgba(92, 188, 169, 0.27)';
const accentColorTurquoise = 'rgba(92, 188, 169)';
const topNavBarIndicatorColorTurquoise = '#5CBCA9';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    tabIconSelectedBackground: tintColorTurquoise,
    accentColor: accentColorTurquoise,
    topNavBarIndicatorColorTurquoise: topNavBarIndicatorColorTurquoise,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    tabIconSelectedBackground: tintColorTurquoise,
    topNavBarIndicatorColorTurquoise: topNavBarIndicatorColorTurquoise,
  },
};
