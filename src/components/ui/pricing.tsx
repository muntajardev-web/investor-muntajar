'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { PaymentModal } from '@/components/investors/payment-modal';

export interface InteractivePricingCardProps {
  planName: string;
  planDescription: string;
  pricePerUnit: number;
  unitName: string;
  minUnits: number;
  maxUnits: number;
  initialUnits: number;
  features: string[];
  ctaText: string;
  currency?: string;
  className?: string;
  highlighted?: boolean;
}

export function InteractivePricingCard({
  planName,
  planDescription,
  pricePerUnit,
  unitName,
  minUnits,
  maxUnits,
  initialUnits,
  features,
  ctaText,
  currency = '৳',
  className,
  highlighted = false,
}: InteractivePricingCardProps) {
  const [units, setUnits] = React.useState(initialUnits);
  const [paymentOpen, setPaymentOpen] = React.useState(false);

  const totalPrice = units * pricePerUnit;

  return (
    <>
      <Card
        className={cn(
          'flex w-full flex-col border border-stone-200 bg-white rounded-3xl p-5 sm:p-7 shadow-sm hover:shadow-md transition-all relative overflow-hidden',
          highlighted ? 'border-orange-500 ring-2 ring-orange-500/30 shadow-xl' : '',
          className
        )}
      >
        <CardHeader className="pb-4 border-b border-stone-100 mb-4 p-0">
          <div className="flex items-start sm:items-center justify-between gap-2">
            <CardTitle className="text-xl sm:text-2xl font-black text-stone-950 leading-tight">{planName}</CardTitle>
            {highlighted && (
              <Badge variant="default" className="bg-orange-500 text-white font-extrabold px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] uppercase tracking-wider shrink-0">
                Popular
              </Badge>
            )}
          </div>
          <CardDescription className="text-stone-500 text-xs mt-1.5 leading-relaxed">{planDescription}</CardDescription>
        </CardHeader>

        <CardContent className="flex-1 space-y-5 p-0">
          {/* Sleek Price Display */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl sm:text-4xl font-black text-stone-950 tracking-tight">
                {currency} {totalPrice.toLocaleString()} <span className="text-xs sm:text-sm font-bold text-stone-500">BDT</span>
              </span>
            </div>
            <span className="text-xs font-bold text-stone-400 block">
              {units} {unitName}{units > 1 ? 's' : ''} Selected
            </span>
          </div>

          {/* Interactive Slider */}
          <div className="space-y-3 bg-[#FAF9F7] p-3.5 sm:p-4 rounded-2xl border border-stone-200/80">
            <div className="flex items-center justify-between text-xs font-extrabold text-stone-700">
              <span>{units} {unitName}{units > 1 ? 's' : ''}</span>
              <span className="text-orange-600 font-extrabold">
                {currency}{pricePerUnit.toLocaleString()} / {unitName}
              </span>
            </div>
            <Slider
              value={[units]}
              onValueChange={(value) => setUnits(value[0])}
              min={minUnits}
              max={maxUnits}
              step={1}
              aria-label={`Select number of ${unitName}s`}
            />
          </div>

          {/* Features List */}
          <ul className="space-y-2.5 text-xs pt-1">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start sm:items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
                <span className="text-stone-700 font-bold leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="pt-5 border-t border-stone-100 mt-4 p-0">
          <button
            id="investment-pay-button"
            type="button"
            onClick={() => setPaymentOpen(true)}
            className={cn(
              "w-full py-3.5 sm:py-4 px-3 sm:px-4 rounded-2xl text-center font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer block leading-normal",
              highlighted ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-stone-950 hover:bg-stone-800 text-white"
            )}
          >
            {ctaText} ({currency}{totalPrice.toLocaleString()}) →
          </button>
        </CardFooter>
      </Card>

      {/* SSLCommerz Payment Modal */}
      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        tickets={units}
        amount={totalPrice}
        currency={currency}
      />
    </>
  );
}
