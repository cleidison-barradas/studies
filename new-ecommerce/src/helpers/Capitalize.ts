export default function Capitalize(text: string = '') {
  let output = ''

  text
    .toLowerCase()
    .split(' ')
    .forEach((str) => {
      output += str.charAt(0).toUpperCase() + str.slice(1) + ' '
    })

  return output.slice(0, output.length - 1)
}
