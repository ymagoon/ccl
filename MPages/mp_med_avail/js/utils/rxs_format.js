
/**
  Number formatter
*/
function NumberFormat() {
    this.NUM_OF_DECIMALS = 2;

    /**
       Rounds and formats the given number.
       End result contains NUM_OF_DECIMALS many digits after the decimal.
       e.g number = 3.3489, NUM_OF_DECIMALS = 2, result = 3.35
           number = 3.2, NUM_OF_DECIMALS = 2, result = 3.2
       Throws an exception if number cannot be parsed to float.
    */
    NumberFormat.method("format", function (number) {

        // validate number if it is numeric
        var parsedNumber = parseFloat(number);
        if (isNaN(parsedNumber)) {
            throw number + " is not a valid number";
        }

        // do not display zeros for whole numbers
        var roundedValue = parsedNumber.toFixed(number % 1 ? this.NUM_OF_DECIMALS : 0);
        return new Number(roundedValue);

    });

}