import SparkMD5 from 'spark-md5';

export default (value) => {
  if (typeof value === 'string') {
    return SparkMD5.hash(value);
  }
  return SparkMD5.hash(JSON.stringify(value));
}