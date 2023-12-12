interface ShareProps {
  title: string
  text: string
  url: string
}

export function share({ title, text, url }: ShareProps) {
  if (navigator.share !== undefined) {
    navigator.share({
      title,
      text,
      url,
    })
  }
}
