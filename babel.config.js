module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@screens': './src/screens',
          '@components': './src/components',
          '@navigation': './src/navigation',
          '@utils': './src/utils',
          '@store': './src/store/',
          '@api': './src/api/'
        }
      }
    ],
    'react-native-reanimated/plugin'
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel']
    }
  }
}
