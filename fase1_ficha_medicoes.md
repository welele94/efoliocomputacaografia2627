# Fase 1 — Ficha de análise e medições (versão 1)

**Fonte:** `video_cena.mp4`. **Método:** leitura dos metadados com OpenCV, extração de fotogramas nos instantes 0, 2,5, 5, 7,5, 10, 12,5, 15, 17,5, 20, 22,5, 25, 27,5 e ~29,9 segundos; observação e comparação visual. **Estado:** observações preliminares, não equivalem a dimensões ou velocidades 3D confirmadas.

## 1. Medições confirmadas

| Propriedade | Valor | Método | Confiança |
|---|---|---|---|
| Dimensões do vídeo | 1280 × 720 px (16:9) | Metadados OpenCV | Alta |
| Taxa de fotogramas | 30 FPS | Metadados OpenCV | Alta |
| Total de fotogramas | 900 | Metadados OpenCV | Alta |
| Duração nominal | 30 s | 900/30 e enunciado | Alta |
| Primeiro fotograma | t=0, f=000 | Carimbo sobreposto | Alta |
| Último fotograma disponível | f=899, aproximadamente t=29,967 s | Total e FPS | Alta |

## 2. Inventário visual

| Objeto ou grupo | Observação | Confiança |
|---|---|---|
| Base | Plataforma retangular horizontal, castanho-escura, espessura visível | Alta |
| Pavimento | Plano extenso, padrão quadriculado de cinzentos | Alta |
| Cilindros | Quatro postes cilíndricos bege em posições próximas das bordas da base | Alta |
| Esfera | Uma esfera branca/clara no lado esquerdo do cenário | Alta |
| Painel | Retângulo vertical escuro, com área superior de padrão nebuloso azul/ocre e barra inferior de gradiente vermelho–amarelo–verde | Alta |
| Engrenagem A | Peça grande dourada à esquerda; furo central; marca vermelha e pequena haste clara/vermelha | Alta |
| Engrenagem B | Peça pequena prateada entre A e o conjunto central; marca azul | Alta |
| Conjunto central | Duas peças dentadas douradas em alturas e diâmetros diferentes, centradas no mesmo eixo aparente | Alta para sobreposição; média para eixo rigorosamente comum |
| Engrenagem E | Peça prateada na zona dianteira direita; marca magenta e haste escura/clara | Alta |
| Disco F | Peça circular cinzenta à direita, com quatro ranhuras/aberturas radiais e marca laranja | Alta |
| Iluminação | Sombras direcionais, luzes de cor e variações de intensidade/localização aparente | Alta para presença; baixa para mecanismo |

**Nota de contagem:** é possível distinguir *cinco* rodas dentadas se as duas centrais sobrepostas forem contabilizadas separadamente (A, B, C superior, D inferior, E), mais um **disco F sem dentes exteriores claramente visíveis**. É necessário confirmar os contactos e dependências antes de assumir uma cadeia cinemática.

## 3. Observações ao longo do tempo

| Instante | O que se observa | O que não se deve ainda concluir |
|---|---|---|
| 0 s | Base vista diagonalmente; painel no fundo à esquerda; disco à direita; esfera no extremo esquerdo | Não permite inferir velocidades |
| 2,5–5 s | Marcas sobre as engrenagens mudam de orientação; incidência luminosa visivelmente diferente | As velocidades e sentidos exatos ainda não foram medidos |
| 7,5–12,5 s | Diferentes regiões da base/engrenagens são iluminadas com intensidades diferentes; brilho da esfera também varia | Pode haver luz móvel, oscilante ou várias luzes |
| ~15 s | Perspetiva ainda próxima da inicial, mas não idêntica | Não sabemos se a trajetória da câmara é contínua desde t=0 |
| 17,5–20 s | Mudança de perspetiva muito visível: o disco aproxima-se da zona inferior direita da imagem; painel muda de orientação aparente | Movimento no ecrã não significa que o objeto se move em coordenadas do mundo |
| 22,5–29,9 s | Perspetiva mais elevada/rodada sobre a base; engrenagens continuam a animar | Não se confirmou periodicidade da câmara nem retorno à posição inicial |

## 4. Hipóteses de trabalho (por testar)

- **H1:** A câmara percorre uma órbita e/ou muda de elevação. Teste: seguir os cantos da base e os postes, que funcionam como referências estáticas.
- **H2:** As engrenagens interagem por relações de transmissão. Teste: contar os dentes, seguir as marcas vermelha, azul, verde e magenta e medir ângulos nos mesmos intervalos de tempo.
- **H3:** As duas engrenagens douradas centrais compartilham rotação. Teste: comparar marcas e orientação de um dente identificável ao longo dos fotogramas.
- **H4:** A luz apresenta oscilação ou deslocação periódica. Teste: medir intensidade de regiões fixas da base a cada 0,1–0,25 s, corrigindo previamente o movimento da câmara.
- **H5:** O disco cinzento também gira. Teste: seguir a marca laranja e as ranhuras.
- **H6:** A textura do painel é animada. Teste: comparar recortes do painel depois de retificar a perspetiva.

## 5. Medições que faltam antes da implementação

- Contagem dos dentes de A, B, C, D e E, preferencialmente em fotogramas de maior visibilidade.
- Coordenadas dos centros das peças nos fotogramas de referência e proporções relativas dos diâmetros.
- Sentidos, velocidade em graus/segundo e período de cada peça com base nas marcas coloridas.
- Momento exato em que a câmara inicia a mudança evidente, duração e trajetória aproximada.
- Identificação do que varia na esfera, postes, disco e painel.
- Frequência, percurso e coloração da luz dinâmica.
- Estimativa das dimensões 3D relativas da plataforma, engrenagens e alturas.

## 6. Registo de ferramentas para o cabeçalho do código

- **OpenCV/Python:** inspecionar metadados e selecionar instantes específicos do vídeo; confirmar FPS, resolução e contagem.
- **Pillow/Python:** criar folha de contacto com fotogramas para comparar instantes.
- **Assistente de IA (ChatGPT):** apoiar a decomposição visual, hipóteses e organização das medições; qualquer valor inferido será verificado contra os fotogramas.

## 7. O que ficou por explicar (provisório)

Ainda não se determinou com segurança a contagem de dentes, razões de transmissão, velocidades de rotação, trajetória matemática da câmara, lei temporal da iluminação nem se a textura do painel é estática. Não serão apresentados valores inventados como medições.

**Próximo passo:** zoom de cada engrenagem e identificação de marcas/contagem de dentes; depois, medições angulares entre fotogramas próximos para evitar ambiguidades de rotação.
