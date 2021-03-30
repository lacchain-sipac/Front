import { IFileListItem } from './file-list-item.interface';
import { IFileListMenuOption } from './file-list-menu-option.interface';

export interface IFileList {
  list: IFileListItem[];
  menuOptions: IFileListMenuOption[];
}
