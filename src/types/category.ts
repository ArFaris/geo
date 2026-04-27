export type Category = {
    name: string;
    description?: string;
}

export type Subcategory = {
    name: string;
    description?: string;
    parent: Category;
}
