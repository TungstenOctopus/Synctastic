

export enum TO {
    NOONE,
    POPUP,
    BACKGROND,
    TAB
}

export enum CMD {
    INIT,
    FETCH,
    BECOMEHOST,
    VIDEOSTATUS,
    VIDEOCONTROL,
    STOP,
    UPDATE,
    VIDEOINFO,
    CREATEROOM,
    JOINROOM
}

export enum VIDEOSTATUS {
    UNKNOWN,
    PAUSE,
    PLAY,
}

export interface VideoInfo {
    src: string
    width: number
    height: number
    y_offset: number
    index: number
    frame_id: number
}

type ARGS = (ARG)[]
type ARG = string | number | VideoState | VideoInfo

export class VideoState {
    timestamp: number
    status: VIDEOSTATUS

    constructor(st:VIDEOSTATUS|any, ts?:number){
        if (typeof st == "number" && typeof ts == "number"){
            this.timestamp = ts;
            this.status = st;
        }else{
            this.timestamp = st.timestamp;
            this.status = st.status;
        }

        return this;
    }

    broadcast(){
        let m = new WsMessage()
        m.cmd = "broadcast"
        m.strArg = JSON.stringify(this)
        return JSON.stringify(m);
    }
}

export class InternalMessage {
    to: TO
    cmd: CMD
    args: ARGS

    constructor(to:TO|any, cmd?:CMD) {
        if(typeof to == "number" && typeof cmd == "number"){
            this.to = to;
            this.cmd = cmd;
            this.args = []
        }else{
            this.to = to.to;
            this.cmd = to.cmd;
            this.args = to.args;
        }

        return this;
    }


    addArgs(args:ARGS|ARG){
        this.args = this.args.concat(args);
        return this
    }

    send(){
        chrome.runtime.sendMessage(this);
    }

    sendTab(tabId: number, frameId?:number){
        if (typeof frameId == typeof 1){
            chrome.tabs.sendMessage(tabId, this, {frameId:frameId});
        }else{
            chrome.tabs.sendMessage(tabId, this);

        }
    }

    hasArgs(num : number){
        return this.args.length >= num;
    }

    is(cmd:CMD){
        return this.cmd == cmd;
    }


}

export class WsMessage {
    cmd: string|undefined
    strArg: string|undefined
    intArg: number|undefined

    constructor(json?:string){
        if (json != undefined) {
            let x = JSON.parse(json);
            this.cmd = x.cmd;
            if (x.strArg) {
                this.strArg = x.strArg;
            }
            if (x.intArg) {
                this.intArg = x.sntArg;
            }
        }
    }

    json() {
        return JSON.stringify(this);
    }

}