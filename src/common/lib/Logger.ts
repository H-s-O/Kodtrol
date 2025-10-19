export default class Logger {
  private readonly _prefix: string;
  private readonly _separator: string = "|";

  constructor(prefix: string) {
    this._prefix = prefix;
  }

  private _getDateTime() {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
  }

  public debug(...args: any[]) {
    console.debug(this._prefix, this._separator, this._getDateTime(), this._separator, ...args);
  }

  public log(...args: any[]) {
    console.log(this._prefix, this._separator, this._getDateTime(), this._separator, ...args);
  }
}
