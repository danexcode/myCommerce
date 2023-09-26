function checkListOfObjectSum(items, total) {
  let acum = 0;
  for (let i = 0; i < items.length; i++) {
    const price = items[i].productPrice;
    const amount = items[i].amount;
    acum += price * amount;
  }
  return acum === total;
}

module.exports = {
  checkListOfObjectSum,
}
