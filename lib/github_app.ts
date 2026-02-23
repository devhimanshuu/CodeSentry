import { Octokit } from "octokit";
import jwt from "jsonwebtoken";

export async function getGitHubAppToken() {
	const appId = process.env.GITHUB_APP_ID;
	const privateKey = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, "\n");

	if (!appId || !privateKey) {
		throw new Error("GITHUB_APP_ID or GITHUB_APP_PRIVATE_KEY not set");
	}

	const payload = {
		iat: Math.floor(Date.now() / 1000) - 60,
		exp: Math.floor(Date.now() / 1000) + 10 * 60,
		iss: appId,
	};

	return jwt.sign(payload, privateKey, { algorithm: "RS256" });
}

export async function getInstallationToken(installationId: number) {
	const appToken = await getGitHubAppToken();
	const octokit = new Octokit({ auth: appToken });

	const { data } = await octokit.rest.apps.createInstallationAccessToken({
		installation_id: installationId,
	});

	return data.token;
}

export async function getInstallationOctokit(installationId: number) {
	const token = await getInstallationToken(installationId);
	return new Octokit({ auth: token });
}
