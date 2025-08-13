// ----- Build Chakra spokes (24) -----
(function initChakra(){
  const g = document.getElementById('chakra-spokes');
  if(!g) return;
  for(let i=0;i<24;i++){
    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    const angle = (i/24)*Math.PI*2; const len = 38;
    const x1 = Math.cos(angle)*6, y1 = Math.sin(angle)*6;
    const x2 = Math.cos(angle)*len, y2 = Math.sin(angle)*len;
    line.setAttribute('x1', x1.toFixed(2));
    line.setAttribute('y1', y1.toFixed(2));
    line.setAttribute('x2', x2.toFixed(2));
    line.setAttribute('y2', y2.toFixed(2));
    g.appendChild(line);
  }
})();

// ----- Fireworks (auto, same vibe) -----
const canvas = document.getElementById('fx');
const ctx = canvas.getContext('2d', { alpha: true });
const DPR = Math.min(2, window.devicePixelRatio || 1);
let W, H;
function resize(){
  W = canvas.width = Math.floor(innerWidth * DPR);
  H = canvas.height = Math.floor(innerHeight * DPR);
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
}
addEventListener('resize', resize); resize();

const particles = [];
function rand(n=1){return Math.random()*n}
function burst(x,y,colors){
  const count = 140 + (Math.random()*80|0);
  for(let i=0;i<count;i++){
    const speed = 2 + rand(4);
    const angle = rand(Math.PI*2);
    particles.push({
      x, y,
      vx: Math.cos(angle)*speed,
      vy: Math.sin(angle)*speed,
      life: 80 + (rand(60)|0),
      alpha:1,
      color: colors[i%colors.length]
    });
  }
  // white ring for sparkle
  for(let i=0;i<50;i++){
    const a = i/50*Math.PI*2; const s = 3.2;
    particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:70,alpha:1,color:'#ffffff'});
  }
}

function step(){
  ctx.clearRect(0,0,W,H);
  ctx.globalCompositeOperation='lighter';
  for(let i=particles.length-1;i>=0;i--){
    const p = particles[i];
    p.vy += 0.03 * DPR;         // gravity
    p.vx *= 0.996; p.vy *= 0.996; // drag
    p.x += p.vx*DPR; p.y += p.vy*DPR;
    p.life--; p.alpha = Math.max(0, p.life/120);
    if(p.alpha<=0 || p.x<0 || p.x>W || p.y>H){particles.splice(i,1); continue;}
    ctx.globalAlpha = p.alpha;
    ctx.beginPath(); ctx.arc(p.x,p.y, 2.2*DPR, 0, Math.PI*2);
    ctx.fillStyle = p.color; ctx.fill();
  }
  requestAnimationFrame(step);
}
step();

// Auto fireworks (no buttons, no tips)
function autoFire(){
  const x = (0.15 + Math.random()*0.7) * W;
  const y = (0.2 + Math.random()*0.45) * H;
  burst(x,y,["#ff9933","#ffffff","#138808","#0a5bd3"]);
}
setInterval(autoFire, 1800);

// Optional: also burst on click (UI nahi, bas effect)
addEventListener('pointerdown', e=>{
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * DPR;
  const y = (e.clientY - rect.top) * DPR;
  burst(x,y,["#ff9933","#ffffff","#138808"]);
});

// ----- Floating flags -----
const container = document.getElementById('floaters');
for(let i=0;i<20;i++){
  const f = document.createElement('div'); f.className='flag';
  const x = Math.random()*100, delay = Math.random()*-20, size = 28+Math.random()*28;
  f.style.left = x+'%'; f.style.bottom = '-40px'; f.style.width = size+'px';
  f.style.animation = `rise ${18+Math.random()*10}s linear ${delay}s infinite`;
  container.appendChild(f);
}
