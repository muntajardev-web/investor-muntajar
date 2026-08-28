'use client';

import * as React from 'react';
import { motion, animate } from 'framer-motion';
import { Check, Minus, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PaymentModal } from '@/components/investors/payment-modal';
import { LiquidMetalButton } from '@/components/ui/liquid-metal-button';

export interface InteractivePricingCardProps {
  planName: string;
  planDescription: string;
  pricePerUnit: number;
  unitName: string;
  minUnits?: number;
  maxUnits?: number;
  initialUnits?: number;
  features: string[];
  ctaText?: string;
  currency?: string;
  className?: string;
  highlighted?: boolean;
}

const TICKET_OPTIONS = [1, 2, 3, 5, 10];

function SmoothPriceCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = React.useState(value);
  const prevValue = React.useRef(value);

  React.useEffect(() => {
    const from = prevValue.current;
    const to = value;
    prevValue.current = value;

    const controls = animate(from, to, {
      duration: 0.38,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        setDisplayValue(Math.round(v));
      },
    });

    return () => controls.stop();
  }, [value]);

  return <>{displayValue.toLocaleString()}</>;
}

export function InteractivePricingCard({
  planName,
  planDescription,
  pricePerUnit = 20000,
  unitName = 'Ticket',
  minUnits = 1,
  maxUnits = 20,
  initialUnits = 1,
  features,
  currency = '৳',
  className,
}: InteractivePricingCardProps) {
  const [units, setUnits] = React.useState(initialUnits);
  const [paymentOpen, setPaymentOpen] = React.useState(false);

  const totalPrice = units * pricePerUnit;

  const handleDecrement = () => {
    if (units > minUnits) setUnits((prev) => prev - 1);
  };

  const handleIncrement = () => {
    if (units < maxUnits) setUnits((prev) => prev + 1);
  };

  return (
    <>
      <div
        className={cn(
          'w-full bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-8 text-left flex flex-col justify-between shadow-xs',
          className
        )}
      >
        <div className="space-y-5 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5 sm:gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                {planName}
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm mt-0.5 sm:mt-1">
                {planDescription}
              </p>
            </div>
            <span className="self-start sm:self-auto shrink-0 text-[11px] sm:text-xs font-semibold text-[#EA580C] bg-[#FFF5ED] border border-[#FDDBC9] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
              Early Seed Round
            </span>
          </div>

          {/* Pricing Section */}
          <div className="pt-2 pb-4 border-b border-stone-100 flex items-center justify-between gap-3">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
                <span className="text-[#EA580C]">{currency}</span>
                <SmoothPriceCounter value={totalPrice} />
                <span className="text-xs sm:text-sm font-medium text-stone-400 ml-1.5 font-sans">BDT</span>
              </div>
              <div className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5">
                {units} {unitName}{units > 1 ? 's' : ''} × {currency}{pricePerUnit.toLocaleString()}
              </div>
            </div>

            {/* Simple +/- Counter */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-stone-50 border border-stone-200 rounded-xl p-1 shrink-0">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={units <= minUnits}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-stone-600 hover:bg-white hover:shadow-2xs disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                aria-label="Decrease tickets"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-bold text-stone-900 select-none">
                {units}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={units >= maxUnits}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-stone-600 hover:bg-white hover:shadow-2xs disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                aria-label="Increase tickets"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Smooth Spring Ticket Selection Pills */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Select Ticket Quantity
            </label>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 relative">
              {TICKET_OPTIONS.map((num) => {
                const isActive = units === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setUnits(num)}
                    className={cn(
                      'relative py-2 sm:py-2.5 px-0.5 sm:px-1 text-center rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer select-none overflow-hidden border',
                      isActive
                        ? 'text-white border-stone-950 bg-stone-950 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTicketPill"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        className="absolute inset-0 bg-stone-950 rounded-xl pointer-events-none"
                      />
                    )}
                    <span className="relative z-10">
                      {num}
                      <span className="hidden sm:inline"> {num === 1 ? 'Ticket' : 'Tickets'}</span>
                      <span className="sm:hidden"> {num === 1 ? 'Tkt' : 'Tkts'}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clean Features Checklist */}
          <div className="pt-1">
            <div className="text-xs font-bold text-stone-900 mb-2.5 uppercase tracking-wider">
              Included Partner Rights:
            </div>
            <ul className="space-y-2.5">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-700 leading-snug">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA & Trust Button */}
        <div className="pt-6 sm:pt-7 space-y-2.5 flex flex-col items-center w-full">
          <button
            type="button"
            onClick={() => setPaymentOpen(true)}
            className="w-full py-4 sm:py-4.5 px-6 rounded-2xl bg-gradient-to-b from-[#18181B] via-[#09090B] to-[#000000] hover:from-stone-900 hover:to-stone-950 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm tracking-tight transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 border border-stone-800 relative overflow-hidden group"
          >
            {/* Subtle Sheen Highlight */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <span className="relative z-10 font-sans">
              Book {units} {units > 1 ? 'Tickets' : 'Ticket'} (৳{totalPrice.toLocaleString()} BDT)
            </span>
            <ArrowRight className="w-4 h-4 text-[#EA580C] group-hover:translate-x-0.5 transition-transform relative z-10 shrink-0" />
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-stone-500 pt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Registered legal deed under Companies Act 1994</span>
          </div>
        </div>
      </div>

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
