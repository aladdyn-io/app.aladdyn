import { toast } from "sonner"

export const showLoginSuccess = (username?: string) => {
  toast.success("Login successful!", {
    description: username ? `Welcome back, ${username}!` : "You have been logged in successfully.",
  })
}

export const showLoginError = (message?: string) => {
  toast.error("Login failed", {
    description: message || "Please check your credentials and try again.",
  })
}

export const showRegisterSuccess = (username?: string) => {
  toast.success("Account created!", {
    description: username ? `Welcome to Aladdyn, ${username}!` : "Your account has been created successfully.",
  })
}

export const showRegisterError = (message?: string) => {
  toast.error("Registration failed", {
    description: message || "Please check your information and try again.",
  })
}

export const showLogoutSuccess = () => {
  toast.success("Logged out", {
    description: "You have been logged out successfully.",
  })
}