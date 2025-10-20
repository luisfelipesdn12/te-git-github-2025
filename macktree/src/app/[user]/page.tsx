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
  theme?: string;
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

async function loadThemeContent(theme: string): Promise<ThemeContent | null> {
  try {
    const filePath = path.join(process.cwd(), "src", "themes", `${theme}.json`);
    const file = await readFile(filePath, "utf8");
    const data = JSON.parse(file) as ThemeContent;
    return data;
  } catch (err: unknown) {
    const code = (err as { code?: string } | null)?.code;
    if (code === "ENOENT") return null;
    throw err;
  }
}

interface ThemeContent {
  container: string;
  mainNotFound: string;
  headingNotFound: string;
  descriptionNotFound: string;
  hintNotFound: string;
  codeInline: string;
  codeInlineSpaced: string;
  main: string;
  avatar: string;
  header: string;
  title: string;
  subheading: string;
  linksList: string;
  listItem: string;
  link: string;
  favicon: string;
  linkText: string;
  emptyState: string;
}

const defaultStyles: ThemeContent = {
  container:
    "font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20",
  mainNotFound:
    "flex flex-col gap-[16px] row-start-2 items-center text-center max-w-[720px]",
  headingNotFound: "text-2xl font-semibold",
  descriptionNotFound: "text-base/6 text-gray-600 dark:text-gray-300",
  hintNotFound: "text-sm text-gray-500 dark:text-gray-400",
  codeInline: "px-1 py-0.5 rounded bg-black/5 dark:bg-white/10",
  codeInlineSpaced: "ml-1 px-1 py-0.5 rounded bg-black/5 dark:bg-white/10",
  main:
    "flex flex-col gap-[24px] row-start-2 items-center text-center sm:items-center max-w-[720px] w-full",
  avatar: "rounded-full border border-black/10 dark:border-white/20",
  header: "flex flex-col gap-[8px] items-center",
  title: "text-2xl font-semibold tracking-tight",
  subheading: "text-base/6 text-gray-600 dark:text-gray-300 max-w-[60ch]",
  linksList: "w-full flex flex-col gap-[10px] mt-[8px]",
  listItem: "w-full",
  link:
    "w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-black/10 dark:border-white/15 hover:bg-black/[.04] dark:hover:bg-white/[.06] transition-colors",
  favicon: "rounded-sm",
  linkText: "text-sm sm:text-base font-medium truncate",
  emptyState: "text-sm text-gray-500 dark:text-gray-400",
}

export default async function UserPage({ params }: { params: { user: string } }) {
  const username = (await params).user;
  const data = await loadUserContent(username);
  const theme = data?.theme || "default";
  
  let themeData: ThemeContent | null = null;
  if (theme !== "default") {
    themeData = await loadThemeContent(theme);
  }

  const styles: ThemeContent = {
    ...defaultStyles,
    ...(themeData || {}),
  };

  if (!data) {
    return (
      <div className={styles.container}>
        <main className={styles.mainNotFound}>
          <h1 className={styles.headingNotFound}>Usuário não encontrado</h1>
          <p className={styles.descriptionNotFound}>
            Não foi possível localizar o arquivo de conteúdo para {username}.
          </p>
          <p className={styles.hintNotFound}>
            Crie o arquivo <code className={styles.codeInline}>src/content/{username}.json</code> com os campos
            <code className={styles.codeInlineSpaced}>imageUrl</code>,
            <code className={styles.codeInlineSpaced}>name</code>,
            <code className={styles.codeInlineSpaced}>description</code> e
            <code className={styles.codeInlineSpaced}>links</code>.
          </p>
        </main>
      </div>
    );
  }

  const { imageUrl, name, description, links } = data;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Image
          src={imageUrl}
          alt={`Avatar de ${name}`}
          width={120}
          height={120}
          className={styles.avatar}
          priority
        />
        <div className={styles.header}>
          <h1 className={styles.title}>{name}</h1>
          <p className={styles.subheading}>
            {description}
          </p>
        </div>

        <ul className={styles.linksList}>
          {Array.isArray(links) && links.length > 0 ? (
            links.map((link) => {
              const faviconUrl = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=32&url=${encodeURIComponent(
                link.url
              )}`;
              return (
                <li key={link.url} className={styles.listItem}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    <Image
                      src={faviconUrl}
                      alt={`Favicon de ${link.name}`}
                      width={20}
                      height={20}
                      className={styles.favicon}
                    />
                    <span className={styles.linkText}>{link.name}</span>
                  </a>
                </li>
              );
            })
          ) : (
            <li className={styles.emptyState}>
              Nenhum link disponível.
            </li>
          )}
        </ul>
      </main>
    </div>
  );
}
