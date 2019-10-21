/*! 
* numeral.js language configuration
* language : french (fr)
* author : Adam Draper : https://github.com/adamwdraper
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
        return number === 1 ? 'er' : 'e';
    },
    currency: {
        symbol: '€'
    }
}
);

   