import SparkMD5 from 'spark-md5';

export const hashString = (value) => {
  return SparkMD5.hash(value);
};

export const hashDataObject = (value) => {
  const { hash, ...hashless } = value;
  return hashString(JSON.stringify(hashless));
};
