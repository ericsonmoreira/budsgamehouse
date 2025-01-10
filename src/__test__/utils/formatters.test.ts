import { describe, it, expect } from "vitest";
import {
  formatterCurrencyBRL,
  formatterDecimal,
  formatterPercentage,
} from "../../utils/formatters";

describe("Number Formatters", () => {
  it("should format numbers as BRL currency", () => {
    const value = 100;

    const formattedValue = formatterCurrencyBRL.format(value);

    // Problema de formatação de caracteres
    expect(formattedValue.replace(/\u00A0/g, " ")).toBe("R$ 100,00"); // Verifique o uso do espaço no formato local
  });

  it("should format numbers as decimal with 2 fraction digits", () => {
    const value = 1234.57;

    const formattedValue = formatterDecimal.format(value);

    expect(formattedValue).toBe("1.234,57");
  });

  it("should format numbers as percentage with 2 fraction digits", () => {
    const value = 0.1234; // 12.34%

    const formattedValue = formatterPercentage.format(value);

    expect(formattedValue).toBe("12,34%");
  });
});
