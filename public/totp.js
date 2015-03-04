function dec2hex(s) { return (s < 15.5 ? '0' : '') + Math.round(s).toString(16); }
function hex2dec(s) { return parseInt(s, 16); }

function base32tohex(base32) {
  var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  var bits = "";
  var hex = "";

  for (var i = 0; i < base32.length; i++) {
    var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
    bits += leftpad(val.toString(2), 5, '0');
  }

  for (var i = 0; i+4 <= bits.length; i+=4) {
    var chunk = bits.substr(i, 4);
    hex = hex + parseInt(chunk, 2).toString(16) ;
  }
  return hex;

}

function leftpad(str, len, pad) {
  if (len + 1 >= str.length) {
    str = Array(len + 1 - str.length).join(pad) + str;
  }
  return str;
}

function updateOtp() {

  var key = base32tohex($('#secret').val());
  var epoch = Math.round(new Date().getTime() / 1000.0);
  var time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, '0');

  var hmacObj = new jsSHA(time, 'HEX');
  var hmac = hmacObj.getHMAC(key, 'HEX', 'SHA-1', "HEX");

  //$('#qrImg').attr('src', 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=200x200&chld=M|0&cht=qr&chl=otpauth://totp/user@host.com%3Fsecret%3D' + $('#secret').val());
  //$('#secretHex').text(key);
  //$('#secretHexLength').text((key.length * 4) + ' bits');
  //$('#epoch').text(time);
  //$('#hmac').empty();

  if (hmac == 'KEY MUST BE IN BYTE INCREMENTS') {
    $('#hmac').append($('<span/>').addClass('label important').append(hmac));
  } else {
    var offset = hex2dec(hmac.substring(hmac.length - 1));
    var part1 = hmac.substr(0, offset * 2);
    var part2 = hmac.substr(offset * 2, 8);
    var part3 = hmac.substr(offset * 2 + 8, hmac.length - offset);
    if (part1.length > 0 ) $('#hmac').append($('<span/>').addClass('label label-default').append(part1));
    $('#hmac').append($('<span/>').addClass('label label-primary').append(part2));
    if (part3.length > 0) $('#hmac').append($('<span/>').addClass('label label-default').append(part3));
  }

  var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec('7fffffff')) + '';
  otp = (otp).substr(otp.length - 6, 6);

  $('#otp').text(otp);
}

function timer() {
  var epoch = Math.round(new Date().getTime() / 1000.0);
  var countDown = 30 - (epoch % 30);
  if (epoch % 30 == 0) updateOtp();
  $('#updatingIn').text(countDown);

}

$(function () {
  $('form#home-submit').submit(function(e) {
    e.preventDefault();
    document.location.href = "/" + $('#totp-token').val();
  });

  if ($('.token-show').length) {
    updateOtp();
    timer();
    setInterval(timer, 1000);
  }
});
