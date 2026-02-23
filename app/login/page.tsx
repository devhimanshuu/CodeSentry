"use client";

import { signIn } from "next-auth/react";
import { Github, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background orbs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-sm">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold">CodeSentry</span>
                    </Link>
                    <h1 className="text-3xl font-bold mb-3">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to manage your repository intelligence.</p>
                </div>

                <div className="glass-card p-8 text-center">
                    <button
                        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                        className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-lg"
                    >
                        <Github className="w-6 h-6" />
                        Continue with GitHub
                    </button>

                    <div className="mt-8 pt-8 border-t border-white/5">
                        <p className="text-sm text-gray-500 mb-4">
                            By continuing, you agree to CodeSentry's Terms of Service and Privacy Policy.
                        </p>
                        <Link href="/" className="text-sm text-gray-400 hover:text-white flex items-center justify-center gap-1 transition-colors">
                            <ArrowLeft className="w-3 h-3" />
                            Back to landing page
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
