"use client";
import "reflect-metadata";
import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";

// Types pour les utilisateurs et les rôles
interface Role {
  role_uuid: string;
  role_name: string;
}

interface User {
  user_uuid: string;
  username: string;
  email:string;
  role: Role;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  // Fonction pour récupérer les utilisateurs avec leurs rôles
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fonction pour récupérer les rôles
  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/roles");
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  return (
    <>
      <Head>
        <title>Users and Roles</title>
        <meta name="description" content="Displaying users and their roles" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Users and Roles</h1>

        {/* Tableau des utilisateurs */}
        <h2>Users</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>UUID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_uuid}>
                <td>{user.user_uuid}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role?.role_name || "No Role Assigned"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tableau des rôles */}
        <h2>Roles</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>UUID</th>
              <th>Role Name</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.role_uuid}>
                <td>{role.role_uuid}</td>
                <td>{role.role_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}
