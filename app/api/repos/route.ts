import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const repos = await prisma.repository.findMany({
			include: {
				installation: true,
			},
			orderBy: {
				updatedAt: "desc",
			},
		});

		return NextResponse.json(repos);
	} catch (err) {
		console.error("Failed to fetch repos:", err);
		return NextResponse.json(
			{ error: "Failed to fetch repositories" },
			{ status: 500 },
		);
	}
}
