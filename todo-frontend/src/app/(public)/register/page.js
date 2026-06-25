import RegisterForm from "@/components/register-form";

export default function Register() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
