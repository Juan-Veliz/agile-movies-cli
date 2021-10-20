export class Session {
    expire?: number;
    refresh?: string;
    token_type?:String;

    constructor(model: any = null){
        this.expire = model?.expire;
        this.refresh = model?.refresh;
        this.token_type = model?.token_type;
    }
}
