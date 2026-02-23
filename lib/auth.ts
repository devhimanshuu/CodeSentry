import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "./db";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma) as any,
	providers: [
		GitHubProvider({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!,
			allowDangerousEmailAccountLinking: true,
			authorization: {
				params: {
					scope: "read:user user:email repo",
				},
			},
		}),
	],
	callbacks: {
		async session({ session, user }) {
			if (session.user) {
				(session.user as any).id = user.id;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
	},
};
