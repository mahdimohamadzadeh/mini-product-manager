export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (fileType: string): string => {
  const type = fileType.split('/')[0];
  
  switch (type) {
    case 'image':
      return 'image';
    case 'video':
      return 'movie';
    case 'audio':
      return 'music_note';
    case 'application':
      if (fileType.includes('pdf')) return 'picture_as_pdf';
      if (fileType.includes('zip') || fileType.includes('compressed')) return 'folder_zip';
      if (fileType.includes('msword') || fileType.includes('wordprocessingml')) return 'description';
      if (fileType.includes('spreadsheetml') || fileType.includes('excel')) return 'table_chart';
      if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'slideshow';
      return 'insert_drive_file';
    default:
      return 'insert_drive_file';
  }
};