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
  PERIODO_CINZENTA_PEQUENA_S: 6,
  PERIODO_DOURADA_SUPERIOR_S: 8,
  PERIODO_CINZENTA_DIREITA_S: 5,
  PERIODO_DOURADA_GRANDE_S: 8,      // HIPOTESE ate confirmar acoplamento
  RAIO_DENTES: 0.20,
  ALTURA_ENGRENAGEM: 0.40,
  ESPESSURA_ESQUERDA: 0.80, // hipotese: esquerda ocupa os dois niveis
  Y_ENGRENAGEM_INFERIOR: 0.20,
  Y_ENGRENAGEM_SUPERIOR: 0.60,
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
function criarEngrenagem({x,z,raio,dentes,material,pontoMat,pontoAng=0,y=.20,espessura=CONFIG.ALTURA_ENGRENAGEM}) {
  const g = new THREE.Group();
  g.position.set(x,y,z);
  scene.add(g);

  const altura = espessura;
  const profundidadeDente = CONFIG.RAIO_DENTES * 1.5;
  const passo = 2 * Math.PI / dentes;
  const larguraDente = (2 * Math.PI * raio / dentes) * 0.55;

  // Disco base ligeiramente recuado, para os dentes se destacarem.
  mesh(new THREE.CylinderGeometry(
    raio - profundidadeDente * 0.42,
    raio - profundidadeDente * 0.42,
    altura, 64
  ), material, g);

  // Cada caixa tem X radial e Z tangencial; rotacao Y = -a.
  // A pequena sobreposicao evita falhas entre o disco e os dentes.
  for (let i = 0; i < dentes; i++) {
    const a = i * passo;
    const dente = mesh(
      new THREE.BoxGeometry(profundidadeDente, altura, larguraDente),
      material, g
    );
    const distancia = raio - profundidadeDente * 0.05;
    dente.position.set(
      Math.cos(a) * distancia, 0, Math.sin(a) * distancia
    );
    dente.rotation.y = -a;
  }

  // Eixo e marcador acompanham a face superior da engrenagem.
  const topo = altura / 2;
  cilindro(.055,.10,MAT.preto,0,topo+.05,0,g);
  if (pontoMat) {
    ponto(pontoMat,
      Math.cos(pontoAng)*raio*.72,
      Math.sin(pontoAng)*raio*.72,topo+.035,g);
  }
  return g;
}

// Posicoes iniciais e dimensoes sao aproximacoes para primeira comparacao.
const esquerda=criarEngrenagem({
  x:-3.45,z:-.48,raio:1.34,dentes:21,material:MAT.ouro,
  y:CONFIG.Y_ENGRENAGEM_INFERIOR + CONFIG.ALTURA_ENGRENAGEM/2,
  espessura:CONFIG.ESPESSURA_ESQUERDA,
  pontoMat:MAT.vermelho,pontoAng:-.1
});
const pequena=criarEngrenagem({
  x:-1.05,z:-1.10,raio:.95,dentes:12,material:MAT.prata,
  y:CONFIG.Y_ENGRENAGEM_SUPERIOR,
  pontoMat:MAT.azul,pontoAng:.0
});
const grande=criarEngrenagem({
  x:.23,z:.02,raio:1.36,dentes:25,material:MAT.ouro,
  y:CONFIG.Y_ENGRENAGEM_INFERIOR,
  pontoMat:null
});
const superior=criarEngrenagem({
  x:.23,z:.02,raio:.98,dentes:16,material:MAT.ouroClaro,
  pontoMat:MAT.verde,pontoAng:0.14,y:CONFIG.Y_ENGRENAGEM_SUPERIOR
});
const direita=criarEngrenagem({
  x:3.3,z:1.0,raio:.98,dentes:16,material:MAT.cinza,
  pontoMat:MAT.rosa,pontoAng:1.95
});

// Disco com quatro ranhuras, por enquanto representadas visualmente.
// A geometria das ranhuras sera afinada pela imagem de referencia.
const disco=new THREE.Group();
disco.position.set(4.75,.20,-.50);
scene.add(disco);
cilindro(.93,.20,MAT.disco,0,.04,0,disco);
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
  // Periodos e fases sao parametros do prototipo V1, nao dados definitivos.
  esquerda.rotation.y=-2*Math.PI*t/CONFIG.PERIODO_ESQUERDA_S;
  pequena.rotation.y=+2*Math.PI*t/CONFIG.PERIODO_CINZENTA_PEQUENA_S;
  grande.rotation.y=-2*Math.PI*t/CONFIG.PERIODO_DOURADA_GRANDE_S;
  // As duas douradas direitas partilham eixo e angulo.
  superior.rotation.y=grande.rotation.y;
  direita.rotation.y=+2*Math.PI*t/CONFIG.PERIODO_CINZENTA_DIREITA_S;
  disco.rotation.y=-anguloDisco(t);
  const a=angCamara+CONFIG.VELOCIDADE_CAMARA_RAD_S*t;
  camera.position.set(raioCamara*Math.sin(a),origemCamara.y,raioCamara*Math.cos(a));
  camera.lookAt(centroCamara);
  document.getElementById('tempo').textContent=t.toFixed(2);
}

const inicio=performance.now();
function animar(agora) {
  requestAnimationFrame(animar);
  const t=((agora-inicio)/1000)%CONFIG.DURACAO_VIDEO_S;
  atualizar(t);
  renderer.render(scene,camera);
}
window.addEventListener('resize',()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});
atualizar(0);
requestAnimationFrame(animar);
