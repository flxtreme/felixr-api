const resolveMeta = ( total: number = 0, offset: number = 0, limit: number = 10 ) => {

    return {
        total,
        offset,
        limit,
        page: Math.floor(offset / limit) + 1,
    }
}

export default resolveMeta

