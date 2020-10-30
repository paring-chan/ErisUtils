import {Client} from "eris";

export default class ErisUtilClient extends Client {
    constructor(token: string) {
        super(token);
    }
}