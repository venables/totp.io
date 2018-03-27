"use strict";

import jsSHA from "jssha";

class TOTP {
  constructor(secret) {
    var key = base32tohex(secret);
    var epoch = Math.round(new Date().getTime() / 1000.0);
    var time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, "0");

    try {
      var hmacObj = new jsSHA(time, "HEX");
      var hmac = hmacObj.getHMAC(key, "HEX", "SHA-1", "HEX");
      var offset = hex2dec(hmac.substring(hmac.length - 1));
      var otp =
        (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec("7fffffff")) + "";
      otp = otp.substr(otp.length - 6, 6);

      $("#otp").text(otp);
    } catch (e) {
      $("#otp").text("Invalid key");
    }
  }
}

export default TOTP;
