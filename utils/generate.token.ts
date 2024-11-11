import {customAlphabet} from "nanoid";

export class VerificatonCode {
    static async generate(){
        return customAlphabet('1234567890',6)();
    }
}