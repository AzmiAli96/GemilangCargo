export const getPagination = (page: number = 1, limit: number = 10) => {
    const currentPage = page < 1 ? 1 : page;
    const take = limit;
    const skip = (currentPage - 1) * take;

    return {
        skip,
        take,
        currentPage,
    };
};

export const getPagingData = (total: number, page: number, limit: number) => {
    return {
        total,
        page,
        lastPage: Math.ceil(total / limit),
    };
};