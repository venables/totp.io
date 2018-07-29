"use strict";

import jsSHA from "jssha";

class TOTP {
  constructor(secret) {
    this.key = base32tohex(secret);
  }

  get timeRemaining() {
    const epoch = Math.round(new Date().getTime() / 1000.0);
    const countDown = 30 - (epoch % 30);

    return Math.max(countDown, 0);
  }

  /**
   * @returns {String} - The OTP value
   */
  otpKey() {
    const nowSeconds = Math.round(Date.now() / 1000.0);
    const hexTime = leftpad(dec2hex(Math.floor(nowSeconds / 30)), 16, "0");

    try {
      const hmacObj = new jsSHA(hexTime, "HEX");
      const hmac = hmacObj.getHMAC(this.key, "HEX", "SHA-1", "HEX");
      const offset = hex2dec(hmac.substring(hmac.length - 1));
      const otp =
        (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec("7fffffff")) + "";
      return otp.substr(otp.length - 6, 6);
    } catch (e) {
      return "Invalid Key";
    }
  }
}

/**
 * Converts a decimal value to hex
 *
 * @param {Number} s - The decimal number
 * @returns {String} The hexidecimal value
 */
function dec2hex(s) {
  return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
}

/**
 * Converts a hex value to decimal
 *
 * @param {String} s - The hexadecimal value
 * @returns {Number} the decimal value
 */
function hex2dec(s) {
  return parseInt(s, 16);
}

/**
 * Converts a base32 string to hexadecimal
 *
 * @param {String} base32 - The base32 string
 * @returns {String} The hexadecimal value
 */
function base32tohex(base32) {
  var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  var bits = "";
  var hex = "";

  for (var i = 0; i < base32.length; i++) {
    var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
    bits += leftpad(val.toString(2), 5, "0");
  }

  for (var j = 0; j + 4 <= bits.length; j += 4) {
    var chunk = bits.substr(j, 4);
    hex = hex + parseInt(chunk, 2).toString(16);
  }
  return hex;
}

function leftpad(str, len, pad) {
  if (len + 1 >= str.length) {
    str = Array(len + 1 - str.length).join(pad) + str;
  }
  return str;
}

export default TOTP;
