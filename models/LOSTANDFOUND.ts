export interface LOSTANDFOUND {
    ARANAN?: string;
    DATE?: string;
}

export interface LAFRESPONSE {
    items: LOSTANDFOUND[];
    totalCount: number;
    currentPage: number;
}
