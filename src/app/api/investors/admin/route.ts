import { NextResponse } from "next/server";
import {
  getStoredInvestorData,
  saveStoredInvestorData,
  type Investor,
  type ExecutiveLetter,
  type PayoutRequest,
  type InvestorConfig,
} from "@/lib/investor-store";

// GET — return full server-side store (includes newly registered investors from OTP flow)
export async function GET() {
  const data = getStoredInvestorData();
  return NextResponse.json({
    success: true,
    data,
  });
}

// POST — update server-side store from admin panel
export async function POST(req: Request) {
  try {
    const body = await req.json();

    saveStoredInvestorData({
      investors: body.investors,
      letters: body.letters,
      payouts: body.payouts,
      config: body.config,
    });

    return NextResponse.json({
      success: true,
      message: "Admin store updated successfully",
      data: getStoredInvestorData(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update admin data" },
      { status: 500 }
    );
  }
}
