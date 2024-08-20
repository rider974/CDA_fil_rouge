"use client";

export default function Pdf() {
  return (
    <main className="bg-[#ECEFF1] flex flex-col items-start justify-start h-screen p-4 mt-10">
      <section className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-pink-600 text-white rounded-lg shadow-lg flex items-center justify-center">
          <h1 className="text-2xl font-bold">PDF</h1>
        </div>
      </section>
    </main>
  );
}
