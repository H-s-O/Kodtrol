import path from 'path';

export default (filePath) => {
    const extension = path.extname(filePath);
    if (!extension) {
        return null;
    }
    
    const dotLessExtension = extension.substring(1);
    switch (dotLessExtension) {
        case 'wav':
        case 'aiff':
        case 'mp3':
        case 'aac':
            return 'audio';
            break;

        // @TODO video types

        default:
            return null;
            break;
    }
}
