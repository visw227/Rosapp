
// example usage; sorting ascending by a specific object property
// myArray.sort(dynamicSort('my_attribute', 1)) 
export function dynamicSort(property, order) {
    var sortOrder = order; // 1 descending, -1 ascending
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
