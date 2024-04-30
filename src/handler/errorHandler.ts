import { NextFunction, Request, Response } from "express";
import { ErrorPage, renderErrorPage } from "../views/view";

export function pageNotFoundHandler(req: Request, res: Response) {
  const pathSlice = req.path.split("/");
  const path = pathSlice[pathSlice.length - 1];
  const errorData: ErrorPage = {
    res,
    statusCode: 404,
    subject: `ບໍ່ມີໜ້າ ${path}`,
    message: `ຫາຫຍັງ? ບໍ່ມີເດີ້ໜ້າ "${path}" ນະ.`,
  };
  renderErrorPage(errorData);
}

export function internalServerErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const errorData: ErrorPage = {
    res,
    statusCode: 500,
    subject: "ລະບົບມີປັນຫາ",
    message:
      "ລະບົບມີປັນຫານ້ອຍໜຶ້ງ ລອງໃໝ່ອີກເທຶ່ອ, ຖ້າຍັງບໍ່ໄດ້ລົບກວນຕີດຕໍ່ fb: inthava xaiyaloun ຫຼື email: inthava.xaiyaloun@gmail.com ຂອບໃຈ.",
  };
  renderErrorPage(errorData);
  console.error("Internal Error: ", err);
}
