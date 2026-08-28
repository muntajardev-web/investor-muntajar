import { NextResponse } from "next/server";

export async function GET() {
  const reportContent = `================================================================================
MUNTAJAR GLOBAL MOBILITY PLATFORM — INVESTOR MARKET RESEARCH REPORT (2026)
Title: Bangladesh Outbound Mobility & Disruption Opportunities
Author: Muntajar Research & Strategy Team
Date: July 2026
================================================================================

1. EXECUTIVE SUMMARY
--------------------------------------------------------------------------------
Muntajar is Bangladesh's pioneer broker-free digital platform for global mobility,
unifying Study Abroad, Overseas Workforce Placement, and Visa & Migration Services into
a single tech-enabled ecosystem. 

The Bangladeshi outbound mobility market represents over $5 Billion annually in direct
spending and fees, currently dominated by 2,600+ traditional, offline, and often exploitative
middlemen ("dalals"). Muntajar captures this market through transparent matching algorithms,
direct university/employer partnerships, and digital application management.

--------------------------------------------------------------------------------
2. KEY MARKET NUMBERS & INDUSTRY DATA
--------------------------------------------------------------------------------
• $30.33 BILLION — Remittance sent home by overseas Bangladeshi workers in FY2024–25 
  (Source: Bangladesh Bank). Remittance is Bangladesh's top GDP contributor (~8% GDP).

• $1.00 BILLION+ — Annual outbound capital flow for student education fees abroad in 
  FY2025–26, growing at ~15% YoY (Source: Bangladesh Bank & UNESCO data).

• $4.20 BILLION — Estimated annual fees extracted by brokers from ~1,000,000 Bangladeshi 
  workers migrating abroad (Average fee: $4,200 / BDT 4.63 Lakh per worker). 
  (Source: ILO & BMET statistics).

• 54.9% — Schengen visa rejection rate for Bangladeshi applicants in 2024, highlighting 
  the critical gap in professional, error-free documentation services. 
  (Source: EU Visa Statistics).

• 40,000,000+ — Expanding Bangladeshi middle-class population with >53.4% internet 
  penetration and mobile-first adoption. (Source: BBS & DataReportal 2025).

• $89.6 BILLION — Projected Global International Student Recruitment Market size by 2034 
  at an 8.6% CAGR. (Source: Coherent Market Insights).

--------------------------------------------------------------------------------
3. THE MARKET PROBLEM: BROKER EXPLOITATION & FRAGMENTATION
--------------------------------------------------------------------------------
- Traditional recruiting agencies (2,600+ licensed) rely on sub-agents charging up to 5-10x 
  legal minimums without guarantee of employment or refund.
- High migration cost: Bangladesh has one of the highest worker migration costs globally 
  (ILO report), taking workers 15-17 months of overseas labor just to break even.
- Zero unified software: No dominant local platform offers integrated study, job, 
  and visa tracking with direct verified entity placement.

--------------------------------------------------------------------------------
4. THE MUNTAJAR SOLUTION & REVENUE MODEL
--------------------------------------------------------------------------------
Muntajar replaces brokers with a transparent digital operating system:

[A] Study Abroad Corridor: Direct university matching, automated document audit, 
    commission model from partner institutions.
[B] Workforce Mobility Corridor: Ethical, ILO-compliant overseas employer matching 
    (Germany, UK, Japan, UAE, Canada) with 0% predatory middleman fees.
[C] Visa & Migration Assistance: High-accuracy visa filing engine reducing rejection rates.

REVENUE MONETIZATION:
1. University Commission Share per student enrollment ($1,500 - $3,500 per placement).
2. Pro & Ultimate Placement Packages paid by applicants ($299 - $699).
3. Employer Placement Fees for verified skilled labor sourcing.

--------------------------------------------------------------------------------
5. INVESTOR VALUE PROPOSITION & PROTECTION
--------------------------------------------------------------------------------
• Lifetime Free Platform Access for Investors & immediate families.
• Real Equity Shares in Muntajar's holding structure.
• Referral Rewards Program for introducing secondary investors.
• Quarterly Performance Dividends & Giveaway Access.
• First-Mover Advantage in Bangladesh's $5B+ mobility market.

================================================================================
For investment inquiries, founder calls, and detailed cap table:
Email: info@muntajar.com
Web: https://muntajar.com/investors
================================================================================
`;

  return new NextResponse(reportContent, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="Muntajar_Global_Mobility_Market_Research_2026.txt"',
    },
  });
}
