"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BarChart, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RoleSelection() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"athlete" | "client" | null>(
    null
  );

  const handleRoleSelection = async (role: "athlete" | "client") => {
    try {
      setIsLoading(true);
      setSelectedRole(role);

      const response = await fetch("/api/user-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        const redirectPath = role === "athlete" ? "/dashboard" : "/company";
        router.push(redirectPath);
      } else {
        console.error("Failed to set user role");
        setSelectedRole(null);
      }
    } catch (error) {
      console.error("Error setting user role:", error);
      setSelectedRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center mb-4"
          >
            <BarChart className="h-12 w-12 text-primary" />
          </motion.div>
          <CardTitle className="text-3xl font-bold">
            Welcome to AthleDger
          </CardTitle>
          <CardDescription>
            Choose how you want to use our platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="lg"
              className={`w-full py-8 text-left flex items-center ${
                selectedRole === "athlete" ? "border-primary" : ""
              }`}
              onClick={() => handleRoleSelection("athlete")}
              disabled={isLoading}
            >
              <User className="h-6 w-6 mr-4" />
              <div>
                <h3 className="font-semibold">I am an Athlete</h3>
                <p className="text-sm text-muted-foreground">
                  Track and manage your performance data
                </p>
              </div>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="lg"
              className={`w-full py-8 text-left flex items-center ${
                selectedRole === "client" ? "border-primary" : ""
              }`}
              onClick={() => handleRoleSelection("client")}
              disabled={isLoading}
            >
              <Building2 className="h-6 w-6 mr-4" />
              <div>
                <h3 className="font-semibold">I am a Client</h3>
                <p className="text-sm text-muted-foreground">
                  Track and manage your performance data
                </p>
              </div>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
