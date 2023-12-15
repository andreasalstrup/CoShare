// const { defaults: tsjPreset } = require('ts-jest/presets')
const merge = require('merge')
const ts_preset = require('ts-jest/jest-preset')
const expo_preset = require('jest-expo/jest-preset')

module.exports = merge.recursive(ts_preset, expo_preset, {
    preset: 'Your_Preset',
    transform: expo_preset.transform,
    },
)