import {IAccount} from "./account";
import {FileItem} from "ng2-file-upload";

export interface IImportOfx {
  files: FileItem[];
  account: IAccount;
}
