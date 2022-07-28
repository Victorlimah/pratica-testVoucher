import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";

import voucherService from "../../src/services/voucherService.js";
import voucherRepository from "../../src/repositories/voucherRepository.js";

describe("voucherService test suite", () => {
  jest
    .spyOn(voucherRepository, "getVoucherByCode")
    .mockResolvedValue({ id: 1, code: "123", discount: 10, used: false });

  describe("Create voucher tests suites", () => {
    it("Sucess in create voucher", async () => {
      const code = faker.random.alphaNumeric(10);
      const discount = Number(faker.random.numeric(20));

      jest
        .spyOn(voucherRepository, "getVoucherByCode")
        .mockResolvedValueOnce(null);

      jest
        .spyOn(voucherRepository, "createVoucher")
        .mockResolvedValueOnce({ id: 1, code: "123", discount: 10, used: false });

      await voucherService.createVoucher(code, discount);
      expect(voucherRepository.getVoucherByCode).toHaveBeenCalledWith(code);
      expect(voucherRepository.createVoucher).toHaveBeenCalledTimes(1);
    });

    it("Fail in create voucher", async () => {
      const code = faker.random.alphaNumeric(10);
      const discount = Number(faker.random.numeric(20));

      expect(voucherService.createVoucher(code, discount)).rejects.toEqual(
        { message: "Voucher already exist.", type: "conflict" }
      );
    });
  });

  describe("Apply voucher tests suites", () => {
    it("Sucess in apply a voucher", async () => {
      const code = faker.random.alphaNumeric(10);
      const amount = Number(faker.random.numeric(20));

      jest
        .spyOn(voucherRepository, "getVoucherByCode")
        .mockResolvedValueOnce({ id: 1, code: "123", discount: 10, used: false });

      jest
        .spyOn(voucherRepository, "useVoucher")
        .mockResolvedValueOnce({ id: 1, code: "123", discount: 10, used: true });

      const result = await voucherService.applyVoucher(code, amount);
      expect(voucherRepository.getVoucherByCode).toHaveBeenCalledWith(code);
      expect(voucherRepository.useVoucher).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        amount,
        discount: 10,
        finalAmount: amount - (amount * (10 / 100)),
        applied: true
      });
    });

    it("Error in apply a voucher", async() => {
      const code = faker.random.alphaNumeric(10);
      const amount = Number(faker.random.numeric(20));

      jest
        .spyOn(voucherRepository, "getVoucherByCode")
        .mockResolvedValueOnce(null);

      expect(voucherService.applyVoucher(code, amount)).rejects.toEqual(
        { message: "Voucher does not exist.", type: "conflict" }
      );
    });
  });
  
});
