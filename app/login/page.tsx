"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import PageContainer from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function loginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleFormSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isLogin) {
      await registerUser();
    } else {
      await loginUser();
    }
  };

  const loginUser = async () => {
    signIn("credentials", {
      ...data,
      redirect: false,
    });
    router.push("/");
  };

  const registerUser = async () => {
    if (data.password !== data.confirmPassword) return;

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
    const user = await response.json();
    console.log(user);
    setIsLogin(true);
  };

  return (
    <PageContainer>
      <div className="p-10 w-[30%] mx-auto">
        <h1 className="text-4xl font-semibold text-center mb-5">
          {isLogin ? "Connexion" : "Inscription"}
        </h1>
        <form
          className="mx-auto flex flex-col gap-2"
          onSubmit={handleFormSubmit}
        >
          {!isLogin && (
            <div>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Nom d'utilisateur"
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>
          )}
          <div>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>
          <div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Mot de passe"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </div>
          {!isLogin && (
            <div>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirmez votre mot de passe"
                onChange={(e) =>
                  setData({ ...data, confirmPassword: e.target.value })
                }
              />
            </div>
          )}
          <Button
            type="submit"
            className="bg-blue-500 text-white font-semibold hover:bg-blue-400"
          >
            Valider
          </Button>
          <div className="flex items-center justify-center text-[12px] gap-2 font-semibold">
            <p>Mot de passe oublié ?</p>
            <Link href="/resetPassword" className="text-blue-500">
              Cliquez-ici
            </Link>
          </div>
        </form>
        {isLogin && (
          <>
            <div className="relative my-2 h-5">
              <div className="absolute top-[50%] w-[100%] h-[1px] bg-slate-600 z-5"></div>
              <p className="flex items-center justify-center w-[10%] h-full left-[50%] translate-x-[-50%] absolute bg-slate-950 z-10 text-center">
                ou
              </p>
            </div>
            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              <Button
                onClick={() => signIn("google")}
                className="flex items-center gap-3 py-7 font-semibold"
              >
                <Image
                  src="/img/google.png"
                  width={30}
                  height={30}
                  alt="logo google"
                />
                Signin with Google
              </Button>
            </div>
          </>
        )}
        <div onClick={() => setIsLogin((prev) => !prev)} className="my-3">
          <p className="text-[12px] text-center text-black dark:text-slate-300 cursor-pointer">
            {isLogin ? "Je n'ai pas de compte" : "J'ai déjà un compte"}
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
