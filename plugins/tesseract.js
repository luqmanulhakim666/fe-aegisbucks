// plugins/tesseract.js
import * as Tesseract from "tesseract.js";

export default (_, inject) => {
  inject("tesseract", Tesseract);
};
