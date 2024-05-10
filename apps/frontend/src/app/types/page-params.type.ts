export type PageParams = {
    orderField: string;
    orderDir: "asc" | "desc";
    lastId?: string;
    itemsPerPage?: number;
};