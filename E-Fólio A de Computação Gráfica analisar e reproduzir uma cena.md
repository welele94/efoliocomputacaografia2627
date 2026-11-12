# E-Fólio A de Computação Gráfica: analisar e reproduzir uma cena

## O que é pedido

Recebe um vídeo de 30 segundos (1280 × 720, 30 imagens por segundo) de uma cena originalmente feita em Three.js e mais nenhuma informação para além deste briefing. A tarefa é analisar o que vê, medir o que conseguir e escrever uma cena Three.js que, em qualquer instante, se pareça o mais possível com a do vídeo.

É uma tarefa de análise e reprodução. Não conta apenas o aspeto de uma imagem parada: o movimento, o tempo e a forma como os objetos dependem uns dos outros fazem parte da cena. O vídeo tem um carimbo com o tempo (t) e o número da imagem (f), que pode usar para medir.

## Como será avaliado

A nota resulta de 20 correspondências específicas entre a sua cena e a do vídeo. Não são divulgadas. Algumas são evidentes, outras nem tanto; umas veem-se numa imagem parada, outras só ao longo do tempo.

Não existe uma lista do que não conta. Aponte para a máxima verosimilhança em tudo o que conseguir analisar, incluindo o que lhe pareça um pormenor.

A verificação combina testes automáticos e leitura do código (por pessoas e por ferramentas de apoio). No fim receberá indicação das correspondências falhadas e da causa provável, por exemplo: "a engrenagem 1 gira no sentido contrário" ou "o período da oscilação da luz está errado". Uma única causa pode explicar várias falhas.

## Ferramentas e método

Pode usar o que quiser: assistentes de IA, color-pickers, ffmpeg, folhas de cálculo, programas de edição de vídeo, bibliotecas de visão por computador. Nada disto é proibido.

Pedimos, no entanto, que evite tentar resolver tudo em zero-shot, entregando o vídeo a um assistente e pedindo "faz-me esta cena" (até porque, sem prompt-engineering muito sofisticado, não o conseguimos). Mesmo que, ao fim de poucas tentativas, o resultado pareça bom, aprende-se muito menos, e o que é avaliado é a sua análise. Um assistente rende mais como instrumento de medição e de escrita de código do que como substituto da observação.

Algumas sugestões de método:

- Meça antes de programar: tempos, períodos, razões, sentidos, contagens.
- Compare a sua cena com o vídeo em vários instantes, lado a lado, e escolha instantes que ajudem a separar hipóteses.
- Separe o que observa do que infere, e registe quão seguro está de cada coisa.
- Desconfie das primeiras impressões: o que parece parado, ou a mover-se ao contrário, pode ser efeito da forma como observa (por exemplo, da taxa de amostragem).

## Requisitos eliminatórios (nota 0)

Estes pontos são verificados automaticamente antes de tudo o resto. Falhar um deles dá nota 0, por melhor que seja a cena.

1. **Abre sem servidor.** A página abre com duplo clique em `index.html` (endereço `file://`), num browser atual (Chrome ou Firefox), sem ligação à internet.
2. **Arranca sozinha.** Sem cliques nem teclas e sem erros na consola ao carregar. O instante 0 da cena corresponde ao início do vídeo. A cena dura 30 s e pode repetir-se em ciclo.
3. **Só usa o Three.js das aulas.** Use o `three.min.js` (r160) na mesma pasta, com `<script src="three.min.js"></script>`. Não são permitidos módulos ES, `importmap`, CDN, outras bibliotecas nem qualquer pedido de rede.
4. **O tempo é tempo real.** A animação depende do tempo decorrido (`THREE.Clock`, `performance.now`) e não do número de imagens desenhadas: o resultado tem de ser o mesmo a 60 Hz e a 144 Hz.
5. **Sem código ofuscado.** Sem `eval`, `new Function`, `atob` nem blocos codificados (por exemplo, base64). O seu código, sem contar o `three.min.js`, ocupa menos de 300 KB.

**Regras com consequência limitada.** Estas não anulam a prova inteira:

- **Tudo é gerado por código.** O que for copiado do vídeo (fotogramas, recortes, `<video>`, `VideoTexture`, imagens `data:`) vale 0 nas correspondências afetadas. Reproduzir o vídeo inteiro vale 0 no total.
- **Three.js a sério.** Desenhe com `THREE.WebGLRenderer` e chame `renderer.render(scene, camera)` em cada imagem. Os ficheiros que não o façam são avaliados manualmente. Prefira a proporção 16:9: desvios penalizam apenas as correspondências afetadas (por exemplo, a perspetiva).
- **Código legível.** Nomes de variáveis e de funções com significado e comentários onde o raciocínio não é óbvio.

## O que entregar

Um ficheiro `.zip` (o nome é indiferente) com:

- `index.html` (pode carregar um `cena.js` na mesma pasta, se preferir separar o código);
- `three.min.js`.

No topo do ficheiro principal, um comentário com três partes:

1. **MEDIÇÕES.** Uma linha por cada coisa que mediu ou observou: o quê, o valor obtido, como o obteve (instante, imagem, contagem, razão, ferramenta) e quão seguro está.
2. **O QUE FICOU POR EXPLICAR.** O que viu e não conseguiu explicar ou reproduzir, e o que tentou.
3. **FERRAMENTAS.** Que ferramentas e assistentes usou, para quê, e como verificou o que produziram.

O cabeçalho é a única mensagem dirigida a quem avalia. Sem ele a prova não é anulada, mas as dúvidas na leitura do código resolvem-se contra si.

No código, agrupe os valores numéricos num bloco de constantes no início, com nomes que digam o que são e em que unidades (por exemplo, `PERIODO_LUZ_S`, `VELOCIDADE_G1_GRAUS_POR_S`), em vez de os espalhar pelo programa.

Poderá ser-lhe pedido que explique as suas medições.

Prazo de entrega: 16 de novembro de 2026 até 23:59.
