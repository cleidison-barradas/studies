function json2csv(items = []) {
    if (items.length === 0) return

    const replacer = (key, value) => (value === null ? '' : value) // specify how you want to handle null values here

    // Get all json keys
    const header = items.reduce((prev, current) => {
        return prev.concat(
            Object.keys(current).filter((key) => !!!prev.includes(key))
        )
    }, [])

    const csv = [
        header.join(';'), // header row first
        ...items.map((row) =>
            header
                .map((fieldName) => JSON.stringify(row[fieldName], replacer))
                .join(';')
        ),
    ].join('\r\n')

    return csv
}

module.exports = json2csv
