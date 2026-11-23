import React from 'react';
import {
  HALFTONE_PALETTES,
  type HalftonePalette,
  type HalftonePaletteName,
  backing,
  hexToRgb,
} from '@/components/ui/halftone-flow-hero';

interface GlobalHalftoneBackdropProps {
  palette: HalftonePaletteName | HalftonePalette;
  dotSize: number;
}

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

const FRAG =
  'precision highp float;' +
  'uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uHover;uniform float uIntro;uniform float uCell;uniform float uScroll;' +
  'uniform vec3 uGround;uniform vec3 uFlow;uniform vec3 uHot;' +
  'float flow(vec2 p,float t){vec2 w=p*2.;for(int i=1;i<6;i++){float fi=float(i);' +
  'w+=vec2(.85/fi*sin(fi*w.y*1.2+t*.42+fi*2.3),.7/fi*cos(fi*w.x*1.05-t*.31+fi*1.1));}' +
  'float b=.5+.5*sin(w.x*2.6-w.y*1.7);return smoothstep(.15,1.,pow(b,2.2));}' +
  'void main(){' +
  'float a=.5236;mat2 R=mat2(cos(a),-sin(a),sin(a),cos(a));' +
  'vec2 px=R*gl_FragCoord.xy;vec2 cell=floor(px/uCell);vec2 cc=(cell+.5)*uCell;' +
  'vec2 cs=(cc*R-.5*uRes)/uRes.y;' +
  'vec2 p=(gl_FragCoord.xy-.5*uRes)/uRes.y;' +
  'float I=flow(cs+vec2(0.,-uScroll*.35),uTime);' +
  'float md=length(cs-uMouse);I=clamp(I+uHover*.6*exp(-md*md*12.),0.,1.);' +
  'I*=uIntro;' +
  'float r=sqrt(I)*.54*uCell;float d=length(px-cc);' +
  'float dotm=1.-smoothstep(r-1.,r+.6,d);' +
  'float g=flow(p+vec2(0.,-uScroll*.35),uTime)*uIntro;' +
  'vec3 col=uGround+uFlow*g*.16;' +
  'vec3 ink=mix(uFlow,uHot,smoothstep(.7,1.,I)*.85);' +
  'col=mix(col,ink,dotm);' +
  'vec2 uv=gl_FragCoord.xy/uRes;col*=mix(.65,1.,smoothstep(1.15,.25,length((uv-.5)*vec2(1.,1.15))));' +
  'gl_FragColor=vec4(col,1.);}';

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export function GlobalHalftoneBackdrop({ palette, dotSize }: GlobalHalftoneBackdropProps) {
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = React.useState(false);

  const pal =
    typeof palette === 'string'
      ? HALFTONE_PALETTES[palette] || HALFTONE_PALETTES.ember
      : palette;

  const live = React.useRef({ pal, dotSize });
  live.current = { pal, dotSize };

  React.useEffect(() => {
    const holder = hostRef.current;
    if (!holder) return;

    const cv = document.createElement('canvas');
    cv.className = 'block h-full w-full';
    holder.appendChild(cv);

    const gl = cv.getContext('webgl', { antialias: false, alpha: false });
    const vs = gl && compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = gl && compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl && gl.createProgram();

    if (!gl || !vs || !fs || !prog) {
      cv.remove();
      setFailed(true);
      return;
    }

    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const U = {
      res: u('uRes'),
      time: u('uTime'),
      mouse: u('uMouse'),
      hover: u('uHover'),
      intro: u('uIntro'),
      cell: u('uCell'),
      scroll: u('uScroll'),
      ground: u('uGround'),
      flow: u('uFlow'),
      hot: u('uHot'),
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const size = { w: 1, h: 1, dpr: 1 };
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, hover: 0, thover: 0 };
    const scrollState = { y: 0, ty: 0 };
    let raf = 0;
    let running = false;
    let t = 0;
    let last = performance.now();
    const start = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const L = live.current;
      if (!reduce.matches) t += dt;
      const intro = reduce.matches ? 1 : Math.min(1, Math.max(0, (now - start - 150) / 1600));

      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      pointer.hover += (pointer.thover - pointer.hover) * 0.06;
      scrollState.y += (scrollState.ty - scrollState.y) * 0.08;

      const g = hexToRgb(L.pal.ground);
      const f = hexToRgb(L.pal.flow);
      const h = hexToRgb(L.pal.hot);

      gl.uniform2f(U.res, cv.width, cv.height);
      gl.uniform1f(U.time, t + 4);
      gl.uniform2f(U.mouse, pointer.x, pointer.y);
      gl.uniform1f(U.hover, reduce.matches ? 0 : pointer.hover);
      gl.uniform1f(U.intro, 1 - Math.pow(1 - intro, 3));
      gl.uniform1f(U.cell, Math.max(3, L.dotSize) * size.dpr);
      gl.uniform1f(U.scroll, scrollState.y);
      gl.uniform3f(U.ground, g[0], g[1], g[2]);
      gl.uniform3f(U.flow, f[0], f[1], f[2]);
      gl.uniform3f(U.hot, h[0], h[1], h[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const measure = () => {
      size.w = window.innerWidth;
      size.h = window.innerHeight;
      size.dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      cv.width = backing(size.w, size.dpr);
      cv.height = backing(size.h, size.dpr);
      gl.viewport(0, 0, cv.width, cv.height);
      if (!running) draw(performance.now());
    };

    const loop = (now: number) => {
      draw(now);
      raf = running ? requestAnimationFrame(loop) : 0;
    };

    const sync = () => {
      const want = !document.hidden && !reduce.matches;
      if (want && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (!want && running) {
        running = false;
        cancelAnimationFrame(raf);
        draw(performance.now());
      }
    };

    const onMove = (e: PointerEvent) => {
      if (size.h <= 0) return;
      pointer.thover = 1;
      pointer.tx = (e.clientX - size.w / 2) / size.h;
      pointer.ty = (size.h / 2 - e.clientY) / size.h;
    };

    const onLeave = () => {
      pointer.thover = 0;
    };

    const onScroll = () => {
      scrollState.ty = window.scrollY / Math.max(1, window.innerHeight);
    };

    window.addEventListener('resize', measure);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', sync);
    reduce.addEventListener('change', sync);

    measure();
    onScroll();
    sync();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', sync);
      reduce.removeEventListener('change', sync);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      cv.remove();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ backgroundColor: pal.ground }}
    >
      {failed ? (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(70% 60% at 30% 30%, color-mix(in oklab, ${pal.flow} 45%, transparent), transparent 70%), radial-gradient(60% 50% at 75% 75%, color-mix(in oklab, ${pal.flow} 35%, transparent), transparent 70%)`,
          }}
        />
      ) : (
        <div ref={hostRef} className="absolute inset-0" />
      )}
    </div>
  );
}
