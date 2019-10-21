/*! 
* numeral.js language configuration
* language : German (de) – generally useful in Germany, Austria, Luxembourg, Belgium
* author : Marco Krage : https://github.com/sinky
*/
/*  File modified to suit requirejs/AMD style define
*/
define({
    delimiters: {
        thousands: ' ',
        decimal: ','
    },
    abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
    },
    ordinal: function (number) {
        return '.';
    },
    currency: {
        symbol: '€'
    }
});