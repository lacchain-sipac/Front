export type actions = 'SAVE' | 'DELETE' | 'REPLACE' | 'APPROVE';

export interface IMenuOption {
  shortName: string;
  icon: string;
  action: actions;
}

export interface IMenuEvent {
  action: actions;
  index?: number;
  files?: Event;
}
