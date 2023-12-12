import fs from 'fs'

export default ((path: string) => {
  fs.unlink(path, err => {
    if (err) throw new Error('file_not_found')
  })
})