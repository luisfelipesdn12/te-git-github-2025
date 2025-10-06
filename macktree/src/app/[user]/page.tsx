import Image from "next/image";
import { readFile } from "node:fs/promises";
import path from "node:path";

type UserLink = {
  name: string;
  url: string;
};

type UserContent = {
  imageUrl: string;
  name: string;
  description: string;
  links: UserLink[];
};

async function loadUserContent(username: string): Promise<UserContent | null> {
  try {
    const filePath = path.join(process.cwd(), "src", "content", `${username}.json`);
    const file = await readFile(filePath, "utf8");
    const data = JSON.parse(file) as UserContent;
    return data;
  } catch (err: unknown) {
    const code = (err as { code?: string } | null)?.code;
    if (code === "ENOENT") return null;
    throw err;
  }
}

export default async function UserPage({ params }: { params: { user: string } }) {
  const username = params.user;
  const data = await loadUserContent(username);

  if (!data) {
    return (
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[16px] row-start-2 items-center text-center max-w-[720px]">
          <h1 className="text-2xl font-semibold">Usuário não encontrado</h1>
          <p className="text-base/6 text-gray-600 dark:text-gray-300">
            Não foi possível localizar o arquivo de conteúdo para {username}.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Crie o arquivo <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">src/content/{username}.json</code> com os campos
            <code className="ml-1 px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">imageUrl</code>,
            <code className="ml-1 px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">name</code>,
            <code className="ml-1 px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">description</code> e
            <code className="ml-1 px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">links</code>.
          </p>
        </main>
      </div>
    );
  }

  const { imageUrl, name, description, links } = data;

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[24px] row-start-2 items-center text-center sm:items-center max-w-[720px] w-full">
        <Image
          src={imageUrl}
          alt={`Avatar de ${name}`}
          width={120}
          height={120}
          className="rounded-full border border-black/10 dark:border-white/20"
          priority
        />
        <div className="flex flex-col gap-[8px] items-center">
          <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
          <p className="text-base/6 text-gray-600 dark:text-gray-300 max-w-[60ch]">
            {description}
          </p>
        </div>

        <ul className="w-full flex flex-col gap-[10px] mt-[8px]">
          {Array.isArray(links) && links.length > 0 ? (
            links.map((link) => {
              const faviconUrl = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=32&url=${encodeURIComponent(
                link.url
              )}`;
              return (
                <li key={link.url} className="w-full">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-black/10 dark:border-white/15 hover:bg-black/[.04] dark:hover:bg-white/[.06] transition-colors"
                  >
                    <Image
                      src={faviconUrl}
                      alt={`Favicon de ${link.name}`}
                      width={20}
                      height={20}
                      className="rounded-sm"
                    />
                    <span className="text-sm sm:text-base font-medium truncate">{link.name}</span>
                  </a>
                </li>
              );
            })
          ) : (
            <li className="text-sm text-gray-500 dark:text-gray-400">
              Nenhum link disponível.
            </li>
          )}
        </ul>
      </main>
    </div>
  );
}
