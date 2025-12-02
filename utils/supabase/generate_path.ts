const generateFilePath = (type: string, user_id: string, filename: string) => {
  const filePath = `${type}/${user_id}/${filename}_${Date.now()}`;
  return filePath;
};

export default generateFilePath;
