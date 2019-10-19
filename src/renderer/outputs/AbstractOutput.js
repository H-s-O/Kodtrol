import * as IOStatus from '../../common/js/constants/io';

export default class AbstractOutput {
    _status = null;

    get status() {
        return this._status;
    }

    refreshAndGetStatus = () => {
        this._refreshStatus();
        return this._status;
    }

    _refreshStatus = () => {
        // implement in subclass
    }

    _setStatusInitial = () => {
        this._status = null;
    }

    _setStatusConnected = () => {
        this._status = IOStatus.IO_CONNECTED;
    }

    _setStatusDisconnected = () => {
        this._status = IOStatus.IO_DISCONNECTED;
    }

    _setStatusActivity = () => {
        this._status = IOStatus.IO_ACTIVITY;
    }
}