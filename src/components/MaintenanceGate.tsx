import React from "react";

interface Props { children: React.ReactNode }
const MaintenanceGate:React.FC<Props> = ({ children }) => {
  const maintenance = import.meta.env.VITE_MAINTENANCE_MODE === "true";

  if (maintenance) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-gray-50">
        <section className="mx-4 max-w-lg w-full rounded-2xl border bg-white p-8 shadow">
          <h1 className="text-2xl font-bold tracking-tight">
            ただいまメンテナンス中です
          </h1>
          <p className="mt-3 text-gray-600">
            ご不便をおかけして申し訳ありません。しばらくしてから再度アクセスしてください。
          </p>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}

export default MaintenanceGate;
