
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface Filter {
    property: string;
    operator: string;
    value?: Unknown;
}

export interface Block {
    id: string;
    type: string;
    content?: BlockContent;
}

export interface CalloutBlockContent {
    format?: Unknown;
    items?: TextBlockItem[];
}

export interface Collection {
    schema?: Unknown;
    pages?: Page[];
}

export interface Format {
    cover?: string;
    font?: string;
}

export interface Metadata {
    properties?: Unknown;
    createdTime?: number;
    lastEditedTime?: number;
    format?: Format;
}

export interface Page {
    id?: string;
    metadata?: Metadata;
    title?: string;
    properties?: Unknown;
    content?: Block[];
}

export interface IQuery {
    page(pageId: string): Page | Promise<Page>;
    collection(collectionId: string, collectionViewId: string, filters?: Filter[], cursor?: string, limit?: string): Collection | Promise<Collection>;
}

export interface SectionBlockContent {
    blocks?: string[];
}

export interface TextBlockContent {
    level?: number;
    items?: TextBlockItem[];
}

export interface TextBlockItem {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    isEquation?: boolean;
    link?: string;
    textColor?: string;
    bgColor?: string;
    text?: string;
}

export interface TextItemsBlockContent {
    items?: TextBlockItem[];
}

export interface TodoBlockContent {
    checked: boolean;
    items?: TextBlockItem[];
}

export type Unknown = any;
export type BlockContent = TextBlockContent | SectionBlockContent | TodoBlockContent | TextItemsBlockContent | CalloutBlockContent;
