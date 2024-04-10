export default function formatDate(date) {
    const timeObject = new Date(date.getTime() + 2 *60 * 60 * 1000 )
    const iso = timeObject.toISOString()
    const dateArr = iso.split('T')
    const dateStr = dateArr[0]
    
    return dateStr
}