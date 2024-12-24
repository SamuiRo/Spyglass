async function sleep(time) {
    return new Promise((resolve, reject) => {
        console.log("Wait for " + time)
        setTimeout(() => {
            resolve(time)
        }, time)
    })
}

module.exports = {
    sleep
}