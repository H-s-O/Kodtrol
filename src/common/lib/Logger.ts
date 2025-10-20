export default class Logger {
  private readonly _prefix: string;
  private readonly _separator: string = "|";

  constructor(prefix: string) {
    this._prefix = prefix;
  }

  private _getDateTime() {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth().toString().padStart(2, "0")}-${date
      .getDate()
      .toString()
      .padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}.${date.getMilliseconds()}`;
  }

  public debug(...args: any[]) {
    console.debug(this._prefix, this._separator, this._getDateTime(), this._separator, ...args);
  }

  public log(...args: any[]) {
    console.log(this._prefix, this._separator, this._getDateTime(), this._separator, ...args);
  }
}
