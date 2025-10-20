# te-git-github-2025/02
Repositório colaborativo para as aulas no Tópico Especial de Git e Github ministrado pela Liga Acadêmica Experience na Universidade Mackenzie.

## Proposta
Desenvolvimento de um organizador de links pessoal para cada estudante.

- Haverá uma pasta de conteúdos onde serão guardados em um JSON as informações de cada estudante
- Haverá uma série de layouts distintos (com um padrão) que será outra pasta com arquivos CSS
- Ao acessar nossa URL/@usuário renderiza a informação

## Passo-a-passo - Aula 20/out/25

1. Garantir que tem acesso ao repositório (este)
  1.1. Se não, entrar em contato para que seja adicionado
2. Criar um codespace na `main`
3. Criar/mudar para uma nova branch com seu nome (`git checkout -b <seu-nome-ra-aqui>`)
4. Ir para pasta `macktree` > `src` > `content`
5. Copiar e colar o arquivo `luisf.dev.json` e renomear para seu nome de usuário escolhido
6. Alterar as propriedades para o que desejar
  6.1. Dica: na imagem, use seu link do GitHub com `.png` no final
7. Adicione e faça o commit `git add .` e `git commit -m "Sua mensagem aqui"`
8. Suba as alterações pro Github `git push origin <nome-da-sua-branch-aqui>`
9. No GitHub, na página desse repositório na aba "Pull requests" crie um novo Pull Request
  9.1. Base: `main`, Compare: `nome-da-sua-branch-aqui`
  9.1. Clicar para criar com um titulo e descrição
10. Aguardar aprovação
11. [Opicional] no seu codespace rodar `cd macktree && yarn && yarn dev` e depois abrir o pop-up do GitHub para visualizar suas alterações
