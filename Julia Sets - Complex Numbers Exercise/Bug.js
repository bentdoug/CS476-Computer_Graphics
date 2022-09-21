// THIS CODE THROWS AN INFINITE LOOP IF sum2DArrays is passed
// an array with two or more rows than columns. Why??

/**
 * Sum all of the elements in a particular row of a 2D array
 * @param {2d array} arr A 2d array of numbers
 * @param {int} row A row index of a 2d array
 */
function sumRow(arr, row) {
    let sum = 0;
    for (i = 0; i < arr[row].length; i++) {
        sum += arr[row][i];
    }
    return sum;
}

/**
 * Sum all of the elements in a 2d array
 * @param {2d array} arr A 2d array of numbers
 */
function sum2DArray(arr) {
    let sum = 0;
    for (i = 0; i < arr.length; i++) {
        sum += sumRow(arr, i);
    }
    return sum;
}