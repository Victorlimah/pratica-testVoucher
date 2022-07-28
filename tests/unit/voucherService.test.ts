import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";

import voucherService from "../../src/services/voucherService.js";
import voucherRepository from "../../src/repositories/voucherRepository.js";

describe("voucherService test suite", () => {
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

      jest
        .spyOn(voucherRepository, "getVoucherByCode")
        .mockResolvedValueOnce({ id: 1, code: "123", discount: 10, used: false}
        );

      expect(voucherService.createVoucher(code, discount)).rejects.toEqual(
        {message: "Voucher already exist.", type: "conflict"}
      );
    });
  });

  
});
