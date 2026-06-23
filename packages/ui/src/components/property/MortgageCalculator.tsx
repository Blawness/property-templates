"use client";

import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";
import { cn, formatPrice } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface MortgageCalculatorProps {
  propertyPrice: number | string;
  className?: string;
}

export function MortgageCalculator({ propertyPrice, className }: MortgageCalculatorProps) {
  const price = (typeof propertyPrice === "string" ? parseFloat(propertyPrice) : propertyPrice) || 0;
  const [dpPercent, setDpPercent] = useState(20);
  const [tenor, setTenor] = useState(15);
  const [interestRate, setInterestRate] = useState(7.5);

  const result = useMemo(() => {
    const dp = price * (dpPercent / 100);
    const loan = price - dp;
    const monthlyRate = interestRate / 100 / 12;
    const months = tenor * 12;

    if (monthlyRate === 0) {
      return { dp, loan, monthlyPayment: loan / months, totalPayment: loan, totalInterest: 0 };
    }

    const monthlyPayment = loan * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - loan;

    return { dp, loan, monthlyPayment, totalPayment, totalInterest };
  }, [price, dpPercent, tenor, interestRate]);

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="size-5" />
          Kalkulator KPR
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label htmlFor="dp">DP (%)</Label>
            <Input
              id="dp"
              type="number"
              min={10}
              max={90}
              value={dpPercent}
              onChange={(e) => setDpPercent(Math.max(10, Math.min(90, Number(e.target.value))))}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="tenor">Tenor (tahun)</Label>
            <Input
              id="tenor"
              type="number"
              min={1}
              max={30}
              value={tenor}
              onChange={(e) => setTenor(Math.max(1, Math.min(30, Number(e.target.value))))}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="rate">Bunga (%/th)</Label>
            <Input
              id="rate"
              type="number"
              min={0}
              max={20}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Math.max(0, Math.min(20, Number(e.target.value))))}
            />
          </div>
        </div>

        <div className="bg-muted space-y-2 rounded-lg p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Uang Muka (DP)</span>
            <span className="font-medium">{formatPrice(result.dp)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Jumlah Pinjaman</span>
            <span className="font-medium">{formatPrice(result.loan)}</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between">
              <span className="font-medium">Cicilan per Bulan</span>
              <span className="text-primary text-xl font-bold">{formatPrice(result.monthlyPayment)}</span>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Bunga</span>
            <span>{formatPrice(result.totalInterest)}</span>
          </div>
        </div>

        <p className="text-muted-foreground text-xs">
          *Perhitungan bersifat estimasi. Hubungi bank untuk informasi lebih lanjut.
        </p>
      </CardContent>
    </Card>
  );
}
