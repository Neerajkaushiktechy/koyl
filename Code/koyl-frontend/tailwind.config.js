const flowbite = require("flowbite-react/tailwind");
const colors = require("tailwindcss/colors")
/**  @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    flowbite.content(),
  ],
  theme: {
    colors: {
      'primary': '#38B6FF',
      'secondary': '#13538A',
      'label': '#E9ECEF',
      'input': '#6C757D',
      'icon': '#212529',
      'outline': '#CED4DA',
      'text-secondary': '#04111C',
      'body-color': '#212529',
      'quinary': '#583375',
      'quinary-l4': '#EEEBF1',
      'quarternary': '#AFDA78',
      'quaternary-l3': '#F7FBF2',
      'neutral-border': '#E4EAEE',
      'neutral-d1': '#788796',
      'neutral-gray': '#96A9BB',
      'primary-l3': '#AFE2FF',
      'primary-l4': '#D7F0FF',
      'primary-l5': '#EBF8FF',
      'tertiary': '#5B85AA',
      'text-danger': '#B02A37',
      'table-stripe': '#F2F2F2',
      'divider': '#21252940',
      'success': '#198754',
      'text-red': '#DC3545',
      'emoji-green':'#0F5132',
      'error' : '#ff1a1a',
      ...colors
    },
    fontFamily: {
      'bigola': ['Bigola Display'],
      'helveticaNeue': ['Helvetica Neue']
    },
    extend: {},
  },
  plugins: [
    // ...
    flowbite.plugin(),
  ],
};