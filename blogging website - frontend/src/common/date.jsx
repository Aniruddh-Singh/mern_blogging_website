
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let days = ["Sunday", "Monday", "Tueday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const getDay = (timeStamp) => {
    let date = new Date(timeStamp);
    return `${date.getDate()} ${months[date.getMonth()]}`;
}

export const getFullDay = (timeStamp) => {
    let date = new Date(timeStamp);

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}