import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white">
      <nav className="flex max-h-[10vh] w-full items-center justify-center bg-pink-500 shadow-md">
        <Image
          src="/icon/logo.png"
          alt="JAFIKA"
          width={200}
          height={200}
          className="-mb-14 w-[200px]"
        />
      </nav>

      <div className="flex min-h-screen w-full items-center justify-center px-3 text-center md:px-6">
        <div className="flex flex-col">
          <h1 className="text-4xl font-extrabold text-pink-500">
            Halaman Tidak Ditemukan
          </h1>
          <div className="mt-2 text-lg text-gray-700">
            Ups.. Halaman yang Anda cari tidak ditemukan
          </div>
          <Link
            href="/"
            className="shadow-3d mt-5 cursor-pointer rounded-lg border-2 border-pink-500 bg-white px-5 py-2 font-semibold text-pink-500 transition-all duration-300"
          >
            Kembali Ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
