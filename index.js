var ffi = require('node-ffi');
var bigint = new ffi.Library(__dirname + '/build/default/libbigint', {
    create : [ 'uint32', [] ],
    destroy : [ 'uint32', [ 'uint32' ] ],
    toString : [ 'string', [ 'uint32', 'uint32' ] ],
    fromString : [ 'uint32', [ 'string', 'uint32' ] ],
});

module.exports = BigInt;

function BigInt (num, base) {
    if (!(this instanceof BigInt)) return new BigInt(num, base);
    if (typeof num !== 'string') num = num.toString();
    
    if (num.match(/e\+/)) { // positive exponent
        var pow = Math.floor(Math.log(num) / Math.log(10));
        var n = (pow / Math.pow(10, pow))
            .toString().replace(/0?\./g,'');
        
        for (var i = n.length; i < pow; i++) n += '0';
        
        this.id = bigint.fromString(n, base || 10);
    }
    else if (num.match(/e\-/)) { // negative exponent
        // ...
    }
    else {
        this.id = bigint.fromString(num, base || 10);
    }
}

BigInt.prototype.inspect = function () {
    return '<BigInt ' + this.toString(10) + '>';
};

BigInt.prototype.toString = function (base) {
    return bigint.toString(this.id, base || 10);
};

BigInt.prototype.destroy = function (base) {
    bigint.destroy(this.id);
};