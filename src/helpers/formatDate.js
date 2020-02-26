export default function formatDate(date) {
    const splittedDate =date.split('-');
    splittedDate.map(d => {return Number.parseInt(d)})
    const formattedDate = new Date(Date.UTC(splittedDate[0], splittedDate[1]-1, splittedDate[2])).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })
    return formattedDate;
  };