"use client"

import { Button } from "@/ui/components/ui/button"
import { showLoginSuccess, showLoginError, showRegisterSuccess, showRegisterError, showLogoutSuccess } from "@/ui/utils/toast"

export function ToastExample() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-lg font-semibold">Toast Examples</h2>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => showLoginSuccess("John Doe")}>
          Login Success
        </Button>
        <Button variant="destructive" onClick={() => showLoginError("Invalid credentials")}>
          Login Error
        </Button>
        <Button onClick={() => showRegisterSuccess("Jane Smith")}>
          Register Success
        </Button>
        <Button variant="destructive" onClick={() => showRegisterError("Email already exists")}>
          Register Error
        </Button>
        <Button variant="outline" onClick={() => showLogoutSuccess()}>
          Logout Success
        </Button>
      </div>
    </div>
  )
}