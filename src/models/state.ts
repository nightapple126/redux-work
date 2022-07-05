export interface AppState {
    form : any;
    grid: GridState,
    loadedDesign: IDesignData
}

export interface GridState {
    catalog: GridDataState,
    approval: GridDataState,
}

export interface GridDataState {
    data: IDesignData[],
    skip: number,
    hasMore: boolean
}

export interface IDesignData {
    _id: string;
    url:string;
    added: Date;
    tags: string[];
    title: string;
    description: string;
    imageData: string;
    likes: number;
    submitterId: string;
    pending: boolean;
}