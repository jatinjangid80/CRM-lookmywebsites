const arr = [{profit: 35000}, {profit: 3700}, {profit: 2732}, {profit: "abc"}];
console.log(arr.reduce((sum, b) => sum + Number(b.profit || 0), 0));
