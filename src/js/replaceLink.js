export default function replaceLinks(string) {
  if (string.indexOf('http') === -1 || string.indexOf('blob') > -1) {
    return string;
  }
  const arrStr = string.split(' ');
  const replacedArr = [];
  arrStr.forEach((element) => {
    if (element.indexOf('http') > -1) {
      replacedArr.push(`<a href = ${element}> ${element} </a>`);
    } else replacedArr.push(element);
  });
  return replacedArr.join(' ');
}
