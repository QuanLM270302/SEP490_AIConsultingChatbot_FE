"use client";

import { Button, Input } from "@/components/ui";
import Link from "next/link";
import { useState } from "react";

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Implement API call
    console.log("Login data:", formData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    alert("Đăng nhập thành công!");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email"
          name="email"
          type="email"
          required
          placeholder="your.email@company.com"
          value={formData.email}
          onChange={handleChange}
        />

        <Input
          label="Mật khẩu"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-600"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">
              Ghi nhớ đăng nhập
            </label>
          </div>
          <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Quên mật khẩu?
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </div>
  );
}
