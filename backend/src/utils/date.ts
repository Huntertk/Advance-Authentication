export const oneYearFromNow = ():Date => {
    return new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
    )
}
export const thirtyDaysFromNow = ():Date => {
    return new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
    )
}

export const fifteenMinutesFromNow = ():Date => {
    return new Date(
        Date.now() + 15 * 60 * 1000
    )
}

export const ONE_DAY_MS =1000*60*60*24;

export const fiveMinutesAgo = () => {
    return new Date(Date.now() - 5 * 60 * 1000)
}
export const oneHourFromNow = () => {
    return new Date(Date.now() - 60 * 60 * 1000)
}