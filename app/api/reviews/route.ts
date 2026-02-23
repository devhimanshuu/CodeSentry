import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
	try {
		const pullRequests = await prisma.pullRequest.findMany({
			orderBy: { createdAt: "desc" },
			take: 50,
			include: {
				repository: { select: { fullName: true, name: true } },
				issues: { select: { severity: true, category: true } },
				reviews: {
					select: { summary: true, createdAt: true },
					orderBy: { createdAt: "desc" },
					take: 1,
				},
			},
		});

		return NextResponse.json({ pullRequests });
	} catch (err) {
		console.error("Reviews API error:", err);
		return NextResponse.json(
			{ error: "Failed to fetch reviews" },
			{ status: 500 },
		);
	}
}
