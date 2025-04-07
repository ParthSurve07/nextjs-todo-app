import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
            <AuthForm type="login" />
        </main>
    );
}