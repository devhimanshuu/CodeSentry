"use client";

import { useSession, signIn } from "next-auth/react";
import { Github, Plus, ExternalLink, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReposPage() {
    const { data: session, status } = useSession();
    const [repos, setRepos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const githubAppName = process.env.NEXT_PUBLIC_GITHUB_APP_NAME || "codesentry-ai";

    useEffect(() => {
        async function fetchRepos() {
            try {
                const res = await fetch("/api/repos");
                if (res.ok) {
                    const data = await res.json();
                    setRepos(data);
                }
            } catch (err) {
                console.error("Error fetching repos:", err);
            } finally {
                setLoading(false);
            }
        }

        if (status === "authenticated") {
            fetchRepos();
        }
    }, [status]);

    if (status === "loading" || (status === "authenticated" && loading)) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                    <Github className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Connect your GitHub</h2>
                <p className="text-gray-400 max-w-sm mb-8">
                    To see your repositories and PRs, you need to sign in with GitHub first.
                </p>
                <button
                    onClick={() => signIn("github")}
                    className="btn-primary flex items-center gap-2"
                >
                    <Github className="w-5 h-5" />
                    Login with GitHub
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Repositories</h1>
                    <p className="text-gray-400">Manage your connected repositories and their health.</p>
                </div>

                <Link
                    href={`https://github.com/apps/${githubAppName}/installations/new`}
                    target="_blank"
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Install GitHub App
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {repos.map((repo) => (
                    <div key={repo.id} className="glass-card-hover rounded-2xl p-6 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                <Github className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${repo.healthScore >= 80 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                Score: {repo.healthScore || 'N/A'}
                            </div>
                        </div>
                        <h3 className="font-bold mb-1 truncate group-hover:text-brand-400 transition-colors">{repo.name}</h3>
                        <p className="text-xs text-gray-500 mb-4 line-clamp-1">{repo.fullName}</p>

                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            Monitoring Active
                        </div>
                    </div>
                ))}

                {repos.length === 0 && (
                    <div className="glass-card p-6 border-dashed border-white/10 flex flex-col items-center justify-center text-center py-12 col-span-full">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6 text-gray-500" />
                        </div>
                        <h3 className="font-semibold mb-1">No repositories found</h3>
                        <p className="text-sm text-gray-500 max-w-[200px] mb-6">
                            Install the CodeSentry GitHub app on your repositories to start monitoring.
                        </p>
                        <Link
                            href={`https://github.com/apps/${githubAppName}/installations/new`}
                            target="_blank"
                            className="text-brand-400 text-sm font-medium flex items-center gap-1 hover:underline"
                        >
                            Configure App <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>
                )}
            </div>

            <div className="glass-card p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Shield className="w-32 h-32" />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        How Integration Works
                    </h2>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0 text-brand-400 font-bold text-sm">1</div>
                            <div>
                                <p className="font-medium">Install the App</p>
                                <p className="text-sm text-gray-400">Give CodeSentry access to your repositories through the official GitHub App flow.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0 text-brand-400 font-bold text-sm">2</div>
                            <div>
                                <p className="font-medium">Open a Pull Request</p>
                                <p className="text-sm text-gray-400">GitHub sends a webhook to CodeSentry whenever a PR is created or updated.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0 text-brand-400 font-bold text-sm">3</div>
                            <div>
                                <p className="font-medium">Get Instant Feedback</p>
                                <p className="text-sm text-gray-400">Within seconds, an AI review comment with risk scores will appear on your PR.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
