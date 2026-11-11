# Beta 2 — Análise das animações

A branch `beta-2` preserva a geometria da `main` (11/11/2026).
O modo de análise é ativado abrindo `index.html?debug=1` no ambiente de desenvolvimento. Sem este parâmetro a cena arranca automaticamente e sem controlos.

## Controlo temporal
- Abrir `?debug=1` na URL do Codespaces (p.ex. `https://...-5500.app.github.dev/?debug=1`).
- A cena abre pausada em t=0. Arrastar o slider, usar -1/+1 frame, 0 s ou Reproduzir.
- A posição dos objetos é recalculada por tempo absoluto, e não pelo número de frames.
- O teste "razões mecânicas" muda temporariamente a lei de rotação, sem afetar os valores por defeito.
- Para testar a entrega normal, abrir sem `?debug=1`.

## Parâmetros do protótipo (não confirmados integralmente)
- Esquerda: 20 dentes no código atual, 10 s/volta; nota: a contagem manual anterior tinha sido 21.
- Cinzenta pequena: 12 dentes, 6 s/volta.
- Par dourado central: 25 dentes inferior, 16 superior, coaxiais e 8 s/volta.
- Cinzenta direita: 16 dentes, 5 s/volta.
- Disco 4 ranhuras: 90 graus/acionamento, primeiro aos 2.2 s, intervalo 5 s, duração 0.545 s.
- Os valores acima são os parâmetros em vigor, não prova de concordância com o vídeo.

## Próximos testes a realizar
1. Com o vídeo original e a cena lado a lado, registar os ângulos dos pontos coloridos aos t=0, 1, 2, 2.2, 2.5, 2.75, 3, 5, 10 e 20 s.
2. Confirmar número de dentes da roda esquerda (20 no código versus 21 na contagem anterior).
3. Comparar a trajetória do braço da cinzenta direita e o início/fim de cada encaixe do disco.
4. Afinar as fases, os períodos e a geometria do mecanismo só depois das medições.
5. Conferir que o código final abre em file:// sem bibliotecas ou pedidos de rede.

## Ferramentas
Análise manual do vídeo fornecido e assistência de IA para implementação e comparação; valores não verificados estão explicitamente assinalados.
