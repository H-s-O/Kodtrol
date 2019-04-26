export default (state = {}, {type, payload}) => {
    switch (type) {
        case 'UPDATE_IO_STATUS':
        return {
            ...state,
            ...payload,
        };
        break;
        
        default:
        return state;
        break;
    }
};