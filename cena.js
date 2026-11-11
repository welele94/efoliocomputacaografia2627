/*
E-FÓLIO A — COMPUTAÇÃO GRÁFICA — PROTÓTIPO V1

MEDIÇÕES E OBSERVAÇÕES
- Vídeo original: 1280x720, 30 fps, 30 s (enunciado; confiança alta).
- Engrenagem dourada esquerda: 21 dentes (contagem do aluno; alta).
- Engrenagem cinzenta pequena: 12 dentes (contagem do aluno; alta).
- Engrenagem dourada grande: ~25 dentes (estimativa do aluno; média).
- Engrenagem dourada sobreposta: 16 dentes (contagem do aluno; alta).
- Engrenagem cinzenta direita: ~16 dentes (estimativa do aluno; média).
- Disco claro: quatro ranhuras (observação do aluno; alta).
- Disco claro: 1,5 voltas / 30 s (observação do aluno; média).
- Disco claro: acionamentos intermitentes de ~90 graus (inferido das 4 ranhuras).
- Primeiro acionamento do disco: entre 2 e 3 s (observação do aluno).
- Duração de um acionamento: 540 a 550 ms (estimativa do aluno).
- Período da engrenagem do ponto rosa: ~5 s (análise preliminar).
- Fases Beta 2: comparacao do aluno em t=0 — projeto vermelho/azul/verde
  em 3h, rosa em 7h, laranja em 4h; referencia professor vermelho 3h,
  azul 6h, verde 5h, rosa 11h, laranja 3h. Conversao angular provisoria.
- Períodos das engrenagens vermelha/azul/verde: ~10/6/8 s (hipóteses
  preliminares; precisam de validação fotograma a fotograma).
- Dimensões, eixos, materiais, iluminação e movimento de câmara deste
  protótipo são aproximações visuais sem medição geométrica definitiva.

O QUE FICOU POR EXPLICAR
- Sincronização exata dos cinco eixos e fase angular em t=0.
- Forma real da aceleração do disco durante a entrada do pino.
- Geometria exata das ranhuras e ligação física ao braço.
- Câmara, iluminação e padrão do painel ao longo dos 30 s.
- Sobreposição visual das engrenagens não confirma acoplamento rígido.

FERRAMENTAS
- Observação manual do vídeo, fotogramas, comparação de marcas coloridas.
- Assistente de IA para estrutura Three.js e modelo de animação.
- Validar a saída por comparação em t=0, 2, 2.5, 3, 5, 10, 15, 20, 29 s.
- Os valores não confirmados estão centralizados no objeto CONFIG.
*/
'use strict';

if (!window.THREE) throw new Error('three.min.js nao foi carregado');

const CONFIG = {
  DURACAO_VIDEO_S: 30,
  PERIODO_DISCO_S: 5.0,             // estimativa: 6 acionamentos em 30 s
  PRIMEIRO_ACIONAMENTO_S: 2.2,      // HIPOTESE: entre 2 e 3 segundos
  DURACAO_ACIONAMENTO_S: 0.545,     // observacao: 540-550 ms
  PASSO_DISCO_GRAUS: 90,
  PERIODO_ESQUERDA_S: 10,
  // BETA 2: offsets iniciais aproximados do professor, medidos em horas
  // de relogio no ecra. Camera inclinada: verificar visualmente em t=0.
  // Negativo em rotation.y corresponde aproximadamente a horario no ecra.
  FASE_ESQUERDA_RAD: 0,                 // vermelho: 3h -> 3h
  FASE_PEQUENA_RAD: -Math.PI / 2,      // azul: 3h -> 6h
  FASE_CONJUNTO_DOURADO_RAD: -Math.PI / 3, // verde: 3h -> 5h
  FASE_DIREITA_RAD: -2 * Math.PI / 3,  // rosa: 7h -> 11h
  FASE_DISCO_RAD: Math.PI / 6,         // laranja: 4h -> 3h
  PERIODO_CINZENTA_PEQUENA_S: 6,
  PERIODO_DOURADA_SUPERIOR_S: 8,
  PERIODO_CINZENTA_DIREITA_S: 5,
  PERIODO_DOURADA_GRANDE_S: 8,      // HIPOTESE ate confirmar acoplamento
  RAIO_DENTES: 0.30,
  ALTURA_ENGRENAGEM: 0.20,
  ESPESSURA_ESQUERDA: 0.25, // hipotese: esquerda ocupa os dois niveis
  Y_ENGRENAGEM_INFERIOR: 0.15,
  Y_ENGRENAGEM_SUPERIOR: 0.25,
  VELOCIDADE_CAMARA_RAD_S: 0.013,   // HIPOTESE; V1 quase estatica
  COR_FUNDO: 0x171b22
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(CONFIG.COR_FUNDO);
const camera = new THREE.PerspectiveCamera(43, innerWidth / innerHeight, 0.1, 140);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.insertBefore(renderer.domElement, document.getElementById('info'));

const MAT = {
  tabuleiro: new THREE.MeshStandardMaterial({color:0x46382d, roughness:0.84}),
  ouro: new THREE.MeshStandardMaterial({color:0xc9913e, metalness:0.63, roughness:0.34}),
  ouroClaro: new THREE.MeshStandardMaterial({color:0xffe98e, metalness:0.48, roughness:0.33}),
  prata: new THREE.MeshStandardMaterial({color:0xb9c1c5, metalness:0.40, roughness:0.43}),
  cinza: new THREE.MeshStandardMaterial({color:0x6d7a81, metalness:0.34, roughness:0.48}),
  disco: new THREE.MeshStandardMaterial({color:0xdddddb, metalness:0.27, roughness:0.48}),
  preto: new THREE.MeshStandardMaterial({color:0x161b1c, roughness:0.8}),
  poste: new THREE.MeshStandardMaterial({color:0xb6a17b, roughness:0.71}),
  vermelho: new THREE.MeshStandardMaterial({color:0xff2928, emissive:0x3a0000}),
  azul: new THREE.MeshStandardMaterial({color:0x00a6ff}),
  verde: new THREE.MeshStandardMaterial({color:0x26df86}),
  rosa: new THREE.MeshStandardMaterial({color:0xe75bd0}),
  laranja: new THREE.MeshStandardMaterial({color:0xff8d18}),
  branco: new THREE.MeshStandardMaterial({color:0xf7f7f7, roughness:0.22})
};

function mesh(geometry, material, parent=scene) {
  const obj = new THREE.Mesh(geometry, material);
  obj.castShadow = true;
  obj.receiveShadow = true;
  parent.add(obj);
  return obj;
}
function caixa(w,h,d,material,x,y,z,parent=scene) {
  const o=mesh(new THREE.BoxGeometry(w,h,d),material,parent);
  o.position.set(x,y,z);
  return o;
}
function cilindro(raio,altura,material,x,y,z,parent=scene) {
  const o=mesh(new THREE.CylinderGeometry(raio,raio,altura,32),material,parent);
  o.position.set(x,y,z);
  return o;
}
function ponto(material, x, z, altura, parent) {
  const p=mesh(new THREE.SphereGeometry(0.085,16,12),material,parent);
  p.scale.y=0.36;
  p.position.set(x,altura,z);
  return p;
}

// Chao quadriculado procedural sem imagens nem bibliotecas externas.
function criarChao() {
  const c=document.createElement('canvas');
  c.width=c.height=256;
  const ctx=c.getContext('2d');
  const n=8, p=256/n;
  for(let j=0;j<n;j++) for(let i=0;i<n;i++){
    ctx.fillStyle=(i+j)%2 ? '#505259' : '#34363d';
    ctx.fillRect(i*p,j*p,p,p);
    ctx.strokeStyle='#85878e';
    ctx.lineWidth=1.6;
    ctx.strokeRect(i*p+.7,j*p+.7,p-1.4,p-1.4);
  }
  const tex=new THREE.CanvasTexture(c);
  tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
  tex.repeat.set(12,12);
  tex.colorSpace=THREE.SRGBColorSpace;
  const m=new THREE.MeshStandardMaterial({map:tex,roughness:0.98});
  const chão=mesh(new THREE.PlaneGeometry(80,80),m);
  chão.rotation.x=-Math.PI/2;
  chão.position.y=-0.18;
}
criarChao();

// Plataforma castanha; o modelo segue a referencia mas dimensoes sao V1.
caixa(11.2,.22,6.6,MAT.tabuleiro,0,0,0.45);

// Quatro postes de apoio em torno da plataforma.
for(const [x,z] of [[-6,-2.6],[6,-2.6],[-6,3.35],[6,3.35]]){
  cilindro(.13,1.50,MAT.poste,x,0.64,z);
}

// Engrenagens: perfil poligonal com dentes externos, extrudido em altura.
// O eixo de rotacao e Y (Three.js).
function criarEngrenagem({
  x, z, raio, dentes, material,
  pontoMat, pontoAng = 0,
  y = 0.20,
  espessura = CONFIG.ALTURA_ENGRENAGEM
}) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  scene.add(g);

  const altura = espessura;
  const profundidadeDente = CONFIG.RAIO_DENTES;
  const passo = 2 * Math.PI / dentes;

  const shape = new THREE.Shape();

  for (let i = 0; i < dentes; i++) {
    const a = i * passo;

    // perfil trapezoidal / triangular do dente
    const pontos = [
      [a + 0.00 * passo, raio],
      [a + 0.18 * passo, raio + profundidadeDente],
      [a + 0.50 * passo, raio + profundidadeDente],
      [a + 0.62 * passo, raio],
    ];

    for (let j = 0; j < pontos.length; j++) {
      const ang = pontos[j][0];
      const r = pontos[j][1];
      const px = Math.cos(ang) * r;
      const py = Math.sin(ang) * r;

      if (i === 0 && j === 0) shape.moveTo(px, py);
      else shape.lineTo(px, py);
    }
  }

  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: altura,
    bevelEnabled: false,
    curveSegments: 3
  });

  geom.rotateX(-Math.PI / 2);

  const gear = mesh(geom, material, g);
  gear.position.y = -altura / 2;

  const topo = altura / 2;
  cilindro(.055, .10, MAT.preto, 0, topo + .05, 0, g);

  if (pontoMat) {
    ponto(
      pontoMat,
      Math.cos(pontoAng) * raio * 0.72,
      Math.sin(pontoAng) * raio * 0.72,
      topo + .035,
      g
    );
  }

  return g;
}
// Posicoes iniciais e dimensoes sao aproximacoes para primeira comparacao.
const esquerda=criarEngrenagem({
  x:-3.95,z:-.68,raio:1.24,dentes:20,material:MAT.ouro,
  y:CONFIG.Y_ENGRENAGEM_INFERIOR + CONFIG.ALTURA_ENGRENAGEM/2,
  espessura:CONFIG.ESPESSURA_ESQUERDA,
  pontoMat:MAT.vermelho,pontoAng:-.1,
  espessura: .15
});
const pequena=criarEngrenagem({
  x:-1.7,z:-1.25,raio:.70,dentes:12,material:MAT.prata,
  y:CONFIG.Y_ENGRENAGEM_SUPERIOR,
  pontoMat:MAT.azul,pontoAng:.0, espessura: .15
});
const grande=criarEngrenagem({
  x:-.20,z:-.18,raio:1.54,dentes:25,material:MAT.ouro,
  y:CONFIG.Y_ENGRENAGEM_INFERIOR,
  pontoMat:null
});
const superior=criarEngrenagem({
  x:-.20,z:-.18,raio:.98,dentes:16,material:MAT.ouroClaro,
  pontoMat:MAT.verde,pontoAng:0.14,y:CONFIG.Y_ENGRENAGEM_SUPERIOR
});
const direita=criarEngrenagem({
  x:1.30,z:2.0,raio:.78,dentes:16,material:MAT.cinza,
  pontoMat:MAT.rosa,pontoAng:1.95
});

// Disco com quatro ranhuras, por enquanto representadas visualmente.
// A geometria das ranhuras sera afinada pela imagem de referencia.
const disco=new THREE.Group();
disco.position.set(2.80,.40,1.80);
scene.add(disco);
cilindro(.88,.20,MAT.disco,0,.04,0,disco);
for(let k=0;k<4;k++){
  const a=k*Math.PI/2;
  const ran=caixa(.59,.012,.17,MAT.preto,0,.148,0,disco);
  ran.position.x=.62*Math.cos(a);
  ran.position.z=.62*Math.sin(a);
  ran.rotation.y=-a;
}
cilindro(.07,.20,MAT.prata,0,.13,0,disco);
ponto(MAT.laranja,.60,.22,.16,disco);

// Braco condutor solidario com a engrenagem cinzenta da direita.
const braço=new THREE.Group();
direita.add(braço);
const haste=caixa(1.15,.07,.115,MAT.branco,.58,.29,-.08,braço);
cilindro(.11,.38,MAT.preto,1.12,.20,-.08,braço);
cilindro(.105,.28,MAT.preto,0,.23,-.08,braço);

// Regua com apontador multicolorido na engrenagem dourada esquerda.
const indicador=new THREE.Group();
esquerda.add(indicador);
caixa(.71,.07,.22,MAT.branco,.60,.29,-.27,indicador);
caixa(.22,.078,.22,MAT.vermelho,.86,.33,-.27,indicador);
caixa(.18,.08,.22,MAT.ouroClaro,.66,.33,-.27,indicador);
cilindro(.06,.28,MAT.preto,.91,.18,-.27,indicador);

// Esfera branca frontal.
const esfera=mesh(new THREE.SphereGeometry(.85,32,22),MAT.branco);
esfera.position.set(-5.45,.65,3.50);

// Painel vertical com padrao de nuvens procedural (nao e fotograma do video).
function criarTexturaPainel() {
  const c=document.createElement('canvas');
  c.width=256;c.height=128;
  const ctx=c.getContext('2d');
  const im=ctx.createImageData(c.width,c.height);
  let seed=79;
  function rnd(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;}
  const pontos=Array.from({length:43},()=>({
    x:rnd()*256,y:rnd()*128,r:15+rnd()*52,a:.3+rnd()*.7
  }));
  for(let y=0;y<128;y++)for(let x=0;x<256;x++){
    let v=0;
    for(const q of pontos){
      const dx=x-q.x,dy=y-q.y;
      v+=q.a*Math.exp(-(dx*dx+dy*dy)/(q.r*q.r));
    }
    const mix=Math.max(0,Math.min(1,(v-.9)/1.55));
    const off=(y*256+x)*4;
    im.data[off]=Math.round(22+219*mix);
    im.data[off+1]=Math.round(67+127*mix);
    im.data[off+2]=Math.round(88+47*mix);
    im.data[off+3]=255;
  }
  ctx.putImageData(im,0,0);
  const t=new THREE.CanvasTexture(c);
  t.colorSpace=THREE.SRGBColorSpace;
  return t;
}
const quadro=new THREE.Group();
quadro.position.set(-1.8,2.28,-3.64);
quadro.rotation.y=-.07;
scene.add(quadro);
caixa(3.5,2.18,.12,MAT.preto,0,0,0,quadro);
const imagem=mesh(new THREE.PlaneGeometry(3.11,1.35),
  new THREE.MeshBasicMaterial({map:criarTexturaPainel()}),quadro);
imagem.position.set(0,.30,.069);
const canvasGrad=document.createElement('canvas');
canvasGrad.width=256;canvasGrad.height=8;
const gc=canvasGrad.getContext('2d');
const gr=gc.createLinearGradient(0,0,256,0);
gr.addColorStop(0,'#ff2200');gr.addColorStop(.25,'#ff9900');
gr.addColorStop(.52,'#fff000');gr.addColorStop(.77,'#aaff00');
gr.addColorStop(1,'#00ff3a');
gc.fillStyle=gr;gc.fillRect(0,0,256,8);
const gradTex=new THREE.CanvasTexture(canvasGrad);
gradTex.colorSpace=THREE.SRGBColorSpace;
const faixa=mesh(new THREE.PlaneGeometry(2.90,.22),
  new THREE.MeshBasicMaterial({map:gradTex}),quadro);
faixa.position.set(0,-.78,.072);

// Iluminacao preliminar.
scene.add(new THREE.AmbientLight(0xffffff,.45));
const sol=new THREE.DirectionalLight(0xffebcb,2.45);
sol.position.set(-3,10,5);
sol.castShadow=true;
sol.shadow.mapSize.set(2048,2048);
sol.shadow.camera.left=-12;sol.shadow.camera.right=12;
sol.shadow.camera.top=12;sol.shadow.camera.bottom=-12;
sol.shadow.bias=-.00015;
scene.add(sol);

function rad(graus){ return graus*Math.PI/180; }
function suavizar(p){ return p*p*(3-2*p); }

// Numero de passos inteiros + parte em curso.
// Funcao pura do tempo: a cena e identica a 60 ou 144 Hz.
function anguloDisco(t) {
  const inicio=CONFIG.PRIMEIRO_ACIONAMENTO_S;
  if(t<inicio) return 0;
  const desde=t-inicio;
  const completos=Math.floor(desde/CONFIG.PERIODO_DISCO_S);
  const dentro=desde%CONFIG.PERIODO_DISCO_S;
  const frac=Math.min(1,dentro/CONFIG.DURACAO_ACIONAMENTO_S);
  return rad(CONFIG.PASSO_DISCO_GRAUS)*(completos+suavizar(frac));
}

const origemCamara=new THREE.Vector3(-9.1,7.0,5.6);
const centroCamara=new THREE.Vector3(-1.2,1.2,-3.90);
const raioCamara=Math.hypot(origemCamara.x,origemCamara.z);
const angCamara=Math.atan2(origemCamara.x,origemCamara.z);

function atualizar(t) {
  // Modo video: periodos observados (provisorios). Modo mecanico:
  // dentes 20:12 / 12:16 / 25:16 para testar relacoes de contacto.
  esquerda.rotation.y=CONFIG.FASE_ESQUERDA_RAD-2*Math.PI*t/CONFIG.PERIODO_ESQUERDA_S;
  if (debugMecanico) {
    pequena.rotation.y=CONFIG.FASE_PEQUENA_RAD-(esquerda.rotation.y-CONFIG.FASE_ESQUERDA_RAD)*20/12;
    grande.rotation.y=CONFIG.FASE_CONJUNTO_DOURADO_RAD-(pequena.rotation.y-CONFIG.FASE_PEQUENA_RAD)*12/16;
    direita.rotation.y=CONFIG.FASE_DIREITA_RAD-(grande.rotation.y-CONFIG.FASE_CONJUNTO_DOURADO_RAD)*25/16;
  } else {
    pequena.rotation.y=CONFIG.FASE_PEQUENA_RAD+2*Math.PI*t/CONFIG.PERIODO_CINZENTA_PEQUENA_S;
    grande.rotation.y=CONFIG.FASE_CONJUNTO_DOURADO_RAD-2*Math.PI*t/CONFIG.PERIODO_DOURADA_GRANDE_S;
    direita.rotation.y=CONFIG.FASE_DIREITA_RAD+2*Math.PI*t/CONFIG.PERIODO_CINZENTA_DIREITA_S;
  }
  // Conjunto composto: as duas engrenagens douradas do centro sao solidarias.
  superior.rotation.y=grande.rotation.y;
  disco.rotation.y=CONFIG.FASE_DISCO_RAD-anguloDisco(t);
  const a=angCamara+CONFIG.VELOCIDADE_CAMARA_RAD_S*t;
  camera.position.set(raioCamara*Math.sin(a),origemCamara.y,raioCamara*Math.cos(a));
  camera.lookAt(centroCamara);
  document.getElementById('tempo').textContent=t.toFixed(2);
}

// BETA 2: ferramentas de verificacao. Apenas visiveis com ?debug=1.
// A entrega normal continua a iniciar automaticamente em tempo real, sem UI.
const modoDebug = new URLSearchParams(window.location.search).get('debug') === '1';
let debugMecanico = false;
let pausado = modoDebug;
let tempoManual = 0;
let relogioBase = performance.now();
let tempoBase = 0;
let velocidadeReproducao = 1;
let controleTempo = null;
let indicadorDebug = null;

function tempoAtual(agora) {
  if (pausado) return tempoManual;
  return ((tempoBase + (agora-relogioBase)/1000*velocidadeReproducao)
    % CONFIG.DURACAO_VIDEO_S + CONFIG.DURACAO_VIDEO_S) % CONFIG.DURACAO_VIDEO_S;
}
function definirTempo(t) {
  tempoManual = Math.max(0,Math.min(CONFIG.DURACAO_VIDEO_S,t));
  tempoBase=tempoManual;
  relogioBase=performance.now();
  atualizar(tempoManual);
  renderer.render(scene,camera);
  if (controleTempo) controleTempo.value=String(Math.round(tempoManual*30));
}
function criarControlosDebug() {
  const painel=document.createElement('div');
  painel.style.cssText='position:fixed;right:12px;bottom:12px;z-index:20;'+
    'background:#151a20ed;color:white;padding:12px;border:1px solid #59636e;'+
    'border-radius:8px;font:13px monospace;max-width:390px';
  const titulo=document.createElement('div');
  titulo.textContent='BETA 2 · analise temporal (30 fps)';
  titulo.style.marginBottom='8px';
  painel.appendChild(titulo);
  controleTempo=document.createElement('input');
  controleTempo.type='range';controleTempo.min='0';controleTempo.max='900';
  controleTempo.step='1';controleTempo.value='0';
  controleTempo.style.width='100%';
  controleTempo.addEventListener('input',()=>{
    pausado=true;botaoPlay.textContent='Reproduzir';
    definirTempo(Number(controleTempo.value)/30);
  });
  painel.appendChild(controleTempo);
  indicadorDebug=document.createElement('div');
  indicadorDebug.style.margin='5px 0';
  painel.appendChild(indicadorDebug);
  const botoes=document.createElement('div');
  botoes.style.display='flex';botoes.style.gap='5px';botoes.style.flexWrap='wrap';
  function botao(texto,acao) {
    const b=document.createElement('button');
    b.textContent=texto;b.type='button';
    b.style.cssText='padding:5px 8px;cursor:pointer';
    b.addEventListener('click',acao);botoes.appendChild(b);return b;
  }
  const botaoPlay=botao('Reproduzir',()=>{
    if (pausado) {
      tempoBase=tempoManual;relogioBase=performance.now();pausado=false;
      botaoPlay.textContent='Pausar';
    } else {
      definirTempo(tempoAtual(performance.now()));pausado=true;
      botaoPlay.textContent='Reproduzir';
    }
  });
  function passo(frames) {
    definirTempo(tempoAtual(performance.now())+frames/30);
    pausado=true;botaoPlay.textContent='Reproduzir';
  }
  botao('-1 frame',()=>passo(-1));
  botao('+1 frame',()=>passo(1));
  botao('0 s',()=>{pausado=true;botaoPlay.textContent='Reproduzir';definirTempo(0);});
  painel.appendChild(botoes);
  const modo=document.createElement('label');
  modo.style.cssText='display:block;margin-top:8px';
  const checkbox=document.createElement('input');
  checkbox.type='checkbox';
  checkbox.addEventListener('change',()=>{
    debugMecanico=checkbox.checked;definirTempo(tempoAtual(performance.now()));
  });
  modo.appendChild(checkbox);
  modo.appendChild(document.createTextNode(' Testar razoes mecanicas (hipotese)'));
  painel.appendChild(modo);
  const nota=document.createElement('div');
  nota.textContent='Normal: periodos observados. Teste: razoes por dentes, nao validado.';
  nota.style.cssText='font-size:10px;opacity:.72;margin-top:5px';
  painel.appendChild(nota);
  document.body.appendChild(painel);
}
if (modoDebug) criarControlosDebug();

function animar(agora) {
  requestAnimationFrame(animar);
  const t=tempoAtual(agora);
  if (!pausado) tempoManual=t;
  atualizar(t);
  if (modoDebug && controleTempo) {
    controleTempo.value=String(Math.round(t*30));
    indicadorDebug.textContent='t='+t.toFixed(3)+' s | f='+Math.round(t*30)+
      ' | disco='+THREE.MathUtils.radToDeg(anguloDisco(t)).toFixed(1)+' graus';
  }
  renderer.render(scene,camera);
}
window.addEventListener('resize',()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});
atualizar(0);
requestAnimationFrame(animar);
