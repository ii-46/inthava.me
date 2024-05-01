import { ErrorRequestHandler, RequestHandler } from "express";
import { ErrorPage, renderErrorPage } from "../views/view";

export const pageNotFoundHandler: RequestHandler = (req, res) => {
  const pathSlice = req.path.split("/");
  const path = pathSlice[pathSlice.length - 1];
  const errorData: ErrorPage = {
    res,
    statusCode: 404,
    subject: `ບໍ່ມີໜ້າ ${path}`,
    message: `ຫາຫຍັງ? ບໍ່ມີເດີ້ໜ້າ "${path}" ນະ.`,
  };
  renderErrorPage(errorData);
};

export const internalServerErrorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next,
) => {
  const errorData: ErrorPage = {
    res,
    statusCode: 500,
    subject: "ລະບົບມີປັນຫາ",
    message:
      "ລະບົບມີປັນຫານ້ອຍໜຶ້ງ ລອງໃໝ່ອີກເທຶ່ອ, ຖ້າຍັງບໍ່ໄດ້ລົບກວນຕີດຕໍ່ fb: inthava xaiyaloun ຫຼື email: inthava.xaiyaloun@gmail.com ຂອບໃຈ.",
  };
  renderErrorPage(errorData);
  console.error("Internal Error: ", err);
};
