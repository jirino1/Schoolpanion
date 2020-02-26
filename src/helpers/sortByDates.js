export default function sortByDates (tasks) {
    let sortedTasks = tasks.sort(function(a, b) {
        a = a.date.split('-').join('');
        b = b.date.split('-').join('');
        return a.localeCompare(b);
      })
    return sortedTasks
}