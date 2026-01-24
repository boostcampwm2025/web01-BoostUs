const extractDate = (dateTimeStr: string | undefined) => {
  if (!dateTimeStr || dateTimeStr.length < 10) {
    return '';
  }
  return dateTimeStr.slice(0, 10);
};

export default extractDate;
