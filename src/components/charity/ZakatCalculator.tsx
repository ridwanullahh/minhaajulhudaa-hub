import React, { useState, useMemo } from 'react';
import { ModernButton } from '@/components/ui/ModernButton';
import { Calculator, Info } from 'lucide-react';

/**
 * Zakat Calculator
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Calculates Zakat al-Mal (2.5% of qualifying wealth above the nisab
 * threshold). Based on the Hanafi school's gold nisab standard.
 *
 * Nisab: the minimum wealth a Muslim must own before Zakat becomes
 * obligatory. We use the gold nisab (85 grams of gold). The silver
 * nisab (595 grams of silver) is an alternative; scholars differ.
 *
 * Formula: Zakat = max(0, (total_assets - total_liabilities) - nisab) * 0.025
 * If net wealth is below nisab, Zakat is 0.
 */

const GOLD_NISAB_GRAMS = 85;
const SILVER_NISAB_GRAMS = 595;
const ZAKAT_RATE = 0.025; // 2.5%

interface AssetInput {
  label: string;
  key: string;
  desc: string;
}

const ASSET_FIELDS: AssetInput[] = [
  { label: 'Cash on hand & in bank', key: 'cash', desc: 'All liquid cash you own' },
  { label: 'Gold (grams)', key: 'goldGrams', desc: 'Gold jewelry, coins, bars in grams' },
  { label: 'Silver (grams)', key: 'silverGrams', desc: 'Silver jewelry, coins, bars in grams' },
  { label: 'Investments & stocks', key: 'investments', desc: 'Stocks, mutual funds, bonds' },
  { label: 'Business inventory value', key: 'inventory', desc: 'Value of trade goods' },
  { label: 'Receivables (money owed to you)', key: 'receivables', desc: 'Loans you expect to be repaid' },
];

const LIABILITY_FIELDS: AssetInput[] = [
  { label: 'Short-term debts', key: 'shortDebts', desc: 'Due within 1 year' },
  { label: 'Long-term debts', key: 'longDebts', desc: 'Due after 1 year (scholars differ)' },
  { label: 'Other deductible expenses', key: 'otherExpenses', desc: 'Taxes, bills due, etc.' },
];

const ZakatCalculator: React.FC = () => {
  const [goldPricePerGram, setGoldPricePerGram] = useState<number>(0);
  const [silverPricePerGram, setSilverPricePerGram] = useState<number>(0);
  const [assets, setAssets] = useState<Record<string, number>>({});
  const [liabilities, setLiabilities] = useState<Record<string, number>>({});
  const [nisabType, setNisabType] = useState<'gold' | 'silver'>('gold');

  const num = (v: number) => (isNaN(v) || v < 0 ? 0 : v);

  const calculation = useMemo(() => {
    const cash = num(assets.cash || 0);
    const goldValue = num(assets.goldGrams || 0) * num(goldPricePerGram);
    const silverValue = num(assets.silverGrams || 0) * num(silverPricePerGram);
    const investments = num(assets.investments || 0);
    const inventory = num(assets.inventory || 0);
    const receivables = num(assets.receivables || 0);

    const totalAssets = cash + goldValue + silverValue + investments + inventory + receivables;

    const shortDebts = num(liabilities.shortDebts || 0);
    const longDebts = num(liabilities.longDebts || 0);
    const otherExpenses = num(liabilities.otherExpenses || 0);
    const totalLiabilities = shortDebts + longDebts + otherExpenses;

    const netWealth = totalAssets - totalLiabilities;

    const nisabThreshold =
      nisabType === 'gold'
        ? GOLD_NISAB_GRAMS * num(goldPricePerGram)
        : SILVER_NISAB_GRAMS * num(silverPricePerGram);

    const zakatableAmount = Math.max(0, netWealth - nisabThreshold);
    const zakatDue = netWealth >= nisabThreshold ? netWealth * ZAKAT_RATE : 0;
    const isZakatObligatory = netWealth >= nisabThreshold && nisabThreshold > 0;

    return {
      totalAssets,
      totalLiabilities,
      netWealth,
      goldValue,
      silverValue,
      nisabThreshold,
      zakatableAmount,
      zakatDue,
      isZakatObligatory,
    };
  }, [assets, liabilities, goldPricePerGram, silverPricePerGram, nisabType]);

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleNumChange = (
    setter: React.Dispatch<React.SetStateAction<Record<string, number>>>,
    key: string,
    value: string
  ) => {
    const n = parseFloat(value) || 0;
    setter((prev) => ({ ...prev, [key]: n }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Gold/Silver prices */}
      <div className="rounded-lg border border-border bg-card p-6 mb-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-platform-accent" />
          Current Metal Prices (NGN per gram)
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Gold price per gram</label>
            <input
              type="number"
              value={goldPricePerGram || ''}
              onChange={(e) => setGoldPricePerGram(parseFloat(e.target.value) || 0)}
              placeholder="e.g. 95000"
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Silver price per gram</label>
            <input
              type="number"
              value={silverPricePerGram || ''}
              onChange={(e) => setSilverPricePerGram(parseFloat(e.target.value) || 0)}
              placeholder="e.g. 1200"
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Nisab standard:</span>
          <label className="flex items-center gap-1.5 text-sm">
            <input
              type="radio"
              checked={nisabType === 'gold'}
              onChange={() => setNisabType('gold')}
              className="text-platform-accent"
            />
            Gold (85g)
          </label>
          <label className="flex items-center gap-1.5 text-sm">
            <input
              type="radio"
              checked={nisabType === 'silver'}
              onChange={() => setNisabType('silver')}
              className="text-platform-accent"
            />
            Silver (595g)
          </label>
        </div>
      </div>

      {/* Assets */}
      <div className="rounded-lg border border-border bg-card p-6 mb-6">
        <h3 className="font-semibold text-foreground mb-4">Assets</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {ASSET_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="text-sm font-medium text-foreground mb-1 block">{field.label}</label>
              <input
                type="number"
                value={assets[field.key] || ''}
                onChange={(e) => handleNumChange(setAssets, field.key, e.target.value)}
                placeholder="0"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground mt-1">{field.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Liabilities */}
      <div className="rounded-lg border border-border bg-card p-6 mb-6">
        <h3 className="font-semibold text-foreground mb-4">Liabilities</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {LIABILITY_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="text-sm font-medium text-foreground mb-1 block">{field.label}</label>
              <input
                type="number"
                value={liabilities[field.key] || ''}
                onChange={(e) => handleNumChange(setLiabilities, field.key, e.target.value)}
                placeholder="0"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground mt-1">{field.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="rounded-lg border-2 border-platform-accent bg-platform-accent-soft p-6">
        <h3 className="font-semibold text-foreground mb-4">Zakat Calculation</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Assets</span>
            <span className="font-medium text-foreground">{formatNaira(calculation.totalAssets)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Liabilities</span>
            <span className="font-medium text-foreground">- {formatNaira(calculation.totalLiabilities)}</span>
          </div>
          <div className="flex justify-between text-sm pb-3 border-b border-border">
            <span className="font-medium text-foreground">Net Wealth</span>
            <span className="font-bold text-foreground">{formatNaira(calculation.netWealth)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Nisab threshold ({nisabType})</span>
            <span className="text-foreground">{formatNaira(calculation.nisabThreshold)}</span>
          </div>
          <div className="flex justify-between text-sm pb-3 border-b border-border">
            <span className="text-muted-foreground">Zakatable amount</span>
            <span className="text-foreground">{formatNaira(calculation.zakatableAmount)}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-semibold text-foreground">Zakat Due (2.5%)</span>
            <span className="text-2xl font-bold text-platform-accent">
              {formatNaira(calculation.zakatDue)}
            </span>
          </div>
          {!calculation.isZakatObligatory && calculation.nisabThreshold > 0 && (
            <p className="text-sm text-muted-foreground flex items-start gap-2 mt-2">
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              Your net wealth is below the nisab threshold. Zakat is not obligatory this year.
            </p>
          )}
          {calculation.nisabThreshold === 0 && (
            <p className="text-sm text-muted-foreground flex items-start gap-2 mt-2">
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              Please enter the {nisabType} price per gram to calculate the nisab threshold.
            </p>
          )}
        </div>
        {calculation.zakatDue > 0 && (
          <ModernButton className="w-full mt-6" size="lg">
            Pay Zakat: {formatNaira(calculation.zakatDue)}
          </ModernButton>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        This calculator is for guidance only. For complex situations (businesses,
        agricultural produce, mining, etc.) please consult a qualified scholar.
      </p>
    </div>
  );
};

export default ZakatCalculator;
