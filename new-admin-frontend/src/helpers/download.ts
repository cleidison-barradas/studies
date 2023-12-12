export default function download(fileUrl: string, fileName: string) {
  const a = document.createElement('a')
  a.style.display = 'none'

  a.href = fileUrl
  a.setAttribute('download', fileName)
  a.click()
}
