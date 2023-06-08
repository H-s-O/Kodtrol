export const extractAdditionalData = () => {
  try {
    const prefix = '--kodtrol='
    const arg = process.argv.find((val) => val.startsWith(prefix))
    if (!arg) return null
    const str = arg.substring(prefix.length)
    const json = JSON.parse(str)
    return json
  } catch (err) {
    return null
  }
}