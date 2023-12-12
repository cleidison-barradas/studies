export function formatAFE(afe: string) {
  return afe.replace(/^(\d)(\d{1,3})(\d{1,4})(\d?)$/, "$1.$2.$3.$4")
            .replace(/\.$/, "")
}