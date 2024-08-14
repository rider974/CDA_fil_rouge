"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "./../app/utils/axios"; 

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      const roleName = session?.user?.role.role_name; // Extraire le role_name pour la comparaison

      switch (roleName) {
        case "admin":
          router.push("/dashboard/admin");
          break;
        case "member":
          router.push("/dashboard/member");
          break;
        case "moderator":
          router.push("/dashboard/moderator");
          break;
        default:
          router.push("/dashboard");
      }
    } else if (status === "unauthenticated") {
      const fetchUsers = async () => {
        try {
          const res = await axios.get<any[]>("http://localhost:3001/api/users");
          setUsers(res.data);
        } catch (error: any) {
          setError(error.response?.data?.message || error.message);
        } finally {
          setLoadingData(false);
        }
      };

      const fetchRoles = async () => {
        try {
          const res = await axios.get<any[]>("http://localhost:3001/api/roles");
          setRoles(res.data);
        } catch (error: any) {
          setError(error.response?.data?.message || error.message);
        } finally {
          setLoadingData(false);
        }
      };

      fetchUsers();
      fetchRoles();
    }
  }, [status, session, router]);

  if (loadingData) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (

      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="w-full flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="mt-10 mb-4 text-4xl font-bold text-white">
        Welcome to BeginnersAppDev
      </h1>
      </div>
      <button
        onClick={() => router.push("/authentification/signin")}
        className={`w-50 flex items-center font-semibold justify-center h-14 px-6 mt-4 text-xl transition-colors duration-300 ${
          status === "loading" ? "bg-gray-200" : "bg-white"
        } border-2 border-black text-black rounded-lg focus:shadow-outline hover:bg-slate-200`}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Loading..." : "Sign In"}
      </button>
        <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:text-left">
          <div className="mb-6">
            <h2 className="mb-3 text-2xl font-semibold">Users List</h2>
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">UUID</th>
                  <th className="border border-gray-300 p-2">Username</th>
                  <th className="border border-gray-300 p-2">Email</th>
                  <th className="border border-gray-300 p-2">Role</th>
                  <th className="border border-gray-300 p-2">Active</th>
                  <th className="border border-gray-300 p-2">Date de création</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.user_uuid}>
                    <td className="border border-gray-300 p-2">{user.user_uuid}</td>
                    <td className="border border-gray-300 p-2">{user.username}</td>
                    <td className="border border-gray-300 p-2">{user.email}</td>
                    <td className="border border-gray-300 p-2">
                      {user.role ? user.role.role_name : "No Role"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {user.is_active ? "Yes" : "No"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h2 className="mb-3 mt-6 text-2xl font-semibold">Roles List</h2>
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">UUID</th>
                  <th className="border border-gray-300 p-2">Role Name</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.role_uuid}>
                    <td className="border border-gray-300 p-2">{role.role_uuid}</td>
                    <td className="border border-gray-300 p-2">{role.role_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

  );
}