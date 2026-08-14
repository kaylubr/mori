function info<T> (...message: T[]): void {
    console.log(...message)
}

function error<T> (...message: T[]): void {
    console.error(...message)
}

export default { info, error } 