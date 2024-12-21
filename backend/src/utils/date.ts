export const oneYearFromNow = ():Date => {
    return new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
    )
}