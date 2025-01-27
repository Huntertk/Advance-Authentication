export const oneYearFromNow = ():Date => {
    return new Date(Date.now() + 356 *24 * 60 * 60 * 1000)
}

export const thirtyDaysFromNow = ():Date => {
    return new Date(Date.now() + 30 *24 * 60 * 60 * 1000)
}

export const fifteenMinuteFromNow = ():Date => {
    return new Date(Date.now() + 15 * 60 * 1000)
}