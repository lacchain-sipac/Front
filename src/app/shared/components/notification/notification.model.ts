export class Alert {
  type: AlertType;
  icon: Icon;
  messages: Array<string>;
}

export class Dialog {
  type: AlertType;
  message: string;
  msgSi: string;
  msgNo: string;
  event: () => void;
}

export enum AlertType {
  success,
  error,
  info,
  warning,
  confirm
}

export enum Icon {
  success,
  info,
  warning,
  error
}
