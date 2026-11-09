# Fase 1 — Medição das rotações (08/11/2026)

## Método
Vídeo de 1280×720 px, 30 fps, 900 fotogramas, duração 30 s. Extraídos fotogramas com OpenCV de 0,5 em 0,5 segundos, do fotograma 0 ao 450. Para cada engrenagem foram segmentados os pontos de cor através de HSV e comparadas as posições em píxeis. Coordenadas da imagem: x para a direita, y para baixo. Os sentidos descritos são os aparentes na projeção do vídeo, compatíveis com vista superior. Nesta primeira análise, os períodos são inferidos a partir de repetições dos pontos, com confirmação visual nos fotogramas correspondentes.

## Medições verificáveis (primeiros segundos)
| Engrenagem | Cor do ponto | t=0 (x,y) | t de retorno | (x,y) no retorno | Período estimado | Velocidade angular | Sentido aparente | Confiança |
|---|---|---|---|---|---|---|---|---|
| Dourada esquerda | vermelho | (482,408) | 10 s / f300 | (482,407) | ~10 s | 36°/s | horário | alta |
| Cinzenta pequena, atrás | azul | (530,354) | 6 s / f180 | (530,354) | ~6 s | 60°/s | anti-horário | alta |
| Dourada superior central | verde | (716,352) | 8 s / f240 | (716,352) | ~8 s | 45°/s | horário | alta |
| Cinzenta direita, à frente | rosa | (817,402) | 5 s / f150 | (817,403) | ~5 s | 72°/s | anti-horário | alta |

**Nota:** o disco cinzento mais à direita com ponto laranja é um objeto distinto da engrenagem com ponto rosa. O ponto laranja mantém-se aprox. em (1013,347) nos primeiros 2 s e depois muda de posição; exige investigação separada. A engrenagem dourada grande, por baixo da superior, não apresenta nesta análise um ponto independente claramente identificado; não presumir o seu período sem validação.

## Contagens manuais de dentes comunicadas pelo estudante
- Dourada esquerda: 21 (contagem relatada; confirmar)
- Cinzenta pequena: 12 (contagem relatada; confirmar)
- Dourada grande inferior: aproximadamente 25 (incerto)
- Dourada superior central: 16 (contagem relatada; confirmar)
- Cinzenta direita: aproximadamente 16 (incerto)

## Atenção às razões entre períodos e dentes
Em engrenagens externas ideais, sem escorregamento, a razão dos períodos de duas engrenagens que engrenam diretamente é igual à razão dos números de dentes. Os períodos medidos dão T_esquerda/T_cinzenta = 10/6 = 1,667, diferente da razão dos dentes contados 21/12 = 1,75. Isto pode indicar contagem errada, animação estilizada não estritamente mecânica ou outra relação entre peças. **Não corrigir os tempos medidos só para coincidir com os dentes.**

## Pendências
1. Examinar a dourada grande inferior: confirmar se roda solidariamente com a superior.
2. Verificar se todos os períodos se mantêm ao longo de 30 s (a partir dos ~12 s há mudanças visíveis na cena e eventual movimento de câmara).
3. Seguir separadamente o disco cinzento da direita e a marca laranja: identificar se gira, oscila ou se desloca.
4. Contar os dentes nas áreas ocultas e rever a relação mecânica entre pares.

## Ferramentas utilizadas
Assistente ChatGPT para orientar o procedimento, Python/OpenCV para leitura de fotogramas e segmentação HSV de marcadores, Pillow para criar imagens comparativas. Os resultados foram verificados confrontando a posição inicial com a posição no fotograma de retorno.
