import Image from "next/image";
import Link from "next/link";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

type UserSummary = {
  username: string;
  name: string;
  imageUrl?: string;
};

async function getUsersFromContent(): Promise<UserSummary[]> {
  const contentDir = path.join(process.cwd(), "src", "content");
  let files: string[] = [];
  try {
    files = await readdir(contentDir);
  } catch {
    // Sem diretório de conteúdo: retorna vazio
    return [];
  }

  const jsonFiles = files.filter((f) => f.endsWith(".json"));
  const users = await Promise.all(
    jsonFiles.map(async (file) => {
      const username = file.replace(/\.json$/i, "");
      try {
        const raw = await readFile(path.join(contentDir, file), "utf8");
        const data = JSON.parse(raw) as { name?: string; imageUrl?: string };
        return {
          username,
          name: data?.name || username,
          imageUrl: data?.imageUrl,
        } satisfies UserSummary;
      } catch {
        return { username, name: username } satisfies UserSummary;
      }
    })
  );

  // Ordena alfabeticamente pelo nome exibido
  users.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  return users;
}

export default async function Home() {
  const users = await getUsersFromContent();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[24px] row-start-2 items-center sm:items-center w-full max-w-[840px]">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Perfis disponíveis</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Clique em um perfil para ver seus links.
          </p>
        </div>

        {users.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-300">
            Nenhum usuário encontrado em <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">src/content</code>.
          </div>
        ) : (
          <ul className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
            {users.map((u) => (
              <li key={u.username} className="">
                <Link
                  href={`/${u.username}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-black/10 dark:border-white/15 hover:bg-black/[.04] dark:hover:bg-white/[.06] transition-colors"
                >
                  <Image
                    src={u.imageUrl || "/next.svg"}
                    alt={`Avatar de ${u.name}`}
                    width={32}
                    height={32}
                    className="rounded-full border border-black/10 dark:border-white/15 bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-medium truncate">{u.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">/{u.username}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
