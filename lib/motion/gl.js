// Every <img data-gl> is drawn as a plane on one fixed canvas. Planes track
// their element each frame, bend with scroll speed, get a lens under the
// pointer and focus in when revealed. Without WebGL the <img> is shown as is.
import {
  WebGLRenderer, Scene, OrthographicCamera, PlaneGeometry, ShaderMaterial, Mesh,
  Texture, LinearFilter, NoColorSpace, LinearSRGBColorSpace, Vector2,
} from 'three';
import gsap from 'gsap';

const vertex = /* glsl */ `
  uniform float uVelocity;
  uniform vec2 uViewport;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    // Curve the plane across the screen width as you scroll
    float nx = world.x / uViewport.x;            // -0.5 .. 0.5
    world.y -= cos(nx * 3.14159265) * uVelocity;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uTex;
  uniform vec2 uPlane;
  uniform vec2 uImg;
  uniform vec2 uMouse;
  uniform vec2 uFlow;
  uniform float uHover;
  uniform float uReveal;
  uniform float uVelocity;
  uniform float uTime;
  uniform float uZoom;
  varying vec2 vUv;

  vec2 cover(vec2 uv) {
    float rp = uPlane.x / uPlane.y;
    float ri = uImg.x / uImg.y;
    vec2 s = rp < ri ? vec2(rp / ri, 1.0) : vec2(1.0, ri / rp);
    // object-position: top  →  keep the top of the photo (faces)
    return uv * s + (1.0 - s) * vec2(0.5, 1.0);
  }

  void main() {
    float r = uReveal;                              // 0 = skeleton showing, 1 = photo in focus
    if (r <= 0.001) discard;

    vec2 uv = vUv;
    uv.y += (1.0 - r) * 0.025;                      // settles into place

    // -- hover: a soft magnifying lens that follows the pointer and
    //    drags the image a little in the direction the pointer moves
    vec2 aspect = vec2(uPlane.x / uPlane.y, 1.0);
    vec2 d = (vUv - uMouse) * aspect;
    float dist = length(d);
    float radius = 0.38;
    float lens = smoothstep(radius, 0.0, dist) * uHover;
    uv = uMouse + (uv - uMouse) * (1.0 - 0.22 * lens);     // magnify under the cursor
    uv -= uFlow * lens * 0.9;                                // liquid drag

    // overall zoom: reveal + gentle push-in on hover, centred on the face area
    float z = 1.0 - 0.05 * uHover - 0.09 * (1.0 - r) - uZoom;
    vec2 c = vec2(0.5, 0.72);
    uv = (uv - c) * z + c;
    uv = cover(uv);

    // colour fringe only at the lens rim + with scroll speed
    float rim = lens * (1.0 - lens) * 4.0;
    vec2 shift = normalize(d + 0.0001) * rim * 0.0028 + vec2(0.0, clamp(uVelocity * 0.00022, -0.005, 0.005));
    float cr = texture2D(uTex, uv + shift).r;
    float cg = texture2D(uTex, uv).g;
    float cb = texture2D(uTex, uv - shift).b;
    vec3 col = vec3(cr, cg, cb);

    // focus-in: soft blur while appearing
    float b = (1.0 - r) * 0.018;
    if (b > 0.0004) {
      vec3 soft = texture2D(uTex, uv).rgb * 0.2;
      soft += texture2D(uTex, uv + vec2(b, 0.0)).rgb * 0.2;
      soft += texture2D(uTex, uv - vec2(b, 0.0)).rgb * 0.2;
      soft += texture2D(uTex, uv + vec2(0.0, b)).rgb * 0.2;
      soft += texture2D(uTex, uv - vec2(0.0, b)).rgb * 0.2;
      col = mix(col, soft, smoothstep(0.0, 1.0, 1.0 - r));
    }

    // a touch of light inside the lens
    col += lens * 0.05;
    gl_FragColor = vec4(col, smoothstep(0.0, 0.85, r));
  }
`;

export class GL {
  constructor(canvas) {
    this.canvas = canvas;
    this.items = [];
    this.ok = false;
    this.velocity = 0;
    try {
      this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
      if (!this.renderer.getContext()) throw new Error('no ctx');
    } catch (e) {
      return;
    }
    this.renderer.outputColorSpace = LinearSRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);
    this.scene = new Scene();
    this.camera = new OrthographicCamera(-1, 1, 1, -1, -1000, 1000);
    this.geo = new PlaneGeometry(1, 1, 24, 24);
    this.viewport = new Vector2();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.ok = true;
  }

  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.viewport.set(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.setSize(w, h, false);
    Object.assign(this.camera, { left: -w / 2, right: w / 2, top: h / 2, bottom: -h / 2 });
    this.camera.updateProjectionMatrix();
  }

  /** Mirror all <img data-gl> inside root */
  scan(root) {
    if (!this.ok) return;
    root.querySelectorAll('img[data-gl]').forEach((img) => this.add(img));
  }

  add(img) {
    if (img.__glItem) return;
    img.__glItem = true;
    const fig = img.closest('.media') || img.parentElement;
    fig.__r = fig.__r || { v: fig.hasAttribute('data-reveal') ? 0 : 1 };

    const build = async () => {
      if (!this.ok || !img.isConnected || !img.naturalWidth || fig.__gl) return;
      // decode a detached copy so the texture uses the real pixel size
      const src = new Image();
      src.src = img.currentSrc || img.src;
      try { await src.decode(); } catch (e) { return; }
      if (!img.isConnected || fig.__gl || !img.__glItem) return;
      const tex = new Texture(src);
      tex.colorSpace = NoColorSpace;
      tex.minFilter = tex.magFilter = LinearFilter;
      tex.generateMipmaps = false;
      tex.needsUpdate = true;

      const uniforms = {
        uTex: { value: tex },
        uPlane: { value: new Vector2(1, 1) },
        uImg: { value: new Vector2(src.naturalWidth, src.naturalHeight) },
        uMouse: { value: new Vector2(0.5, 0.5) },
        uFlow: { value: new Vector2(0, 0) },
        uHover: { value: 0 },
        uReveal: { value: fig.__r.v },
        uVelocity: { value: 0 },
        uTime: { value: 0 },
        uZoom: { value: 0 },
        uViewport: { value: this.viewport },
      };
      const mat = new ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms, transparent: true });
      const mesh = new Mesh(this.geo, mat);
      this.scene.add(mesh);

      // pointer target (eased toward in render) + flow from pointer speed
      const target = new Vector2(0.5, 0.5);
      const onMove = (e) => {
        const b = fig.getBoundingClientRect();
        target.set((e.clientX - b.left) / b.width, 1 - (e.clientY - b.top) / b.height);
      };
      const onEnter = (e) => {
        onMove(e); uniforms.uMouse.value.copy(target);
        gsap.to(uniforms.uHover, { value: 1, duration: 1.1, ease: 'expo.out', overwrite: true });
      };
      const onLeave = () => gsap.to(uniforms.uHover, { value: 0, duration: 1.3, ease: 'expo.out', overwrite: true });
      fig.addEventListener('pointermove', onMove);
      fig.addEventListener('pointerenter', onEnter);
      fig.addEventListener('pointerleave', onLeave);

      const item = { img, fig, mesh, uniforms, tex, mat, target, off: () => {
        fig.removeEventListener('pointermove', onMove);
        fig.removeEventListener('pointerenter', onEnter);
        fig.removeEventListener('pointerleave', onLeave);
      } };
      fig.__gl = item;
      this.items.push(item);
      img.classList.add('gl-ready');
      fig.style.background = 'transparent';
      fig.style.clipPath = 'none';
    };
    if (img.complete && img.naturalWidth) build();
    else img.addEventListener('load', build, { once: true });
  }

  clear() {
    for (const it of this.items) {
      it.off();
      this.scene.remove(it.mesh);
      it.mat.dispose();
      it.tex.dispose();
      it.img.classList.remove('gl-ready');
      it.img.__glItem = false;
      it.fig.__gl = null;
    }
    this.items = [];
    this.renderer && this.renderer.render(this.scene, this.camera);
  }

  render(time, velocity = 0) {
    if (!this.ok) return;
    // ease the velocity so the bend breathes
    this.velocity += (velocity - this.velocity) * 0.1;
    const v = Math.max(-34, Math.min(34, this.velocity * 0.55));
    const vh = this.viewport.y, vw = this.viewport.x;
    for (const it of this.items) {
      const b = it.fig.getBoundingClientRect();
      const visible = b.bottom > -120 && b.top < vh + 120 && b.right > -120 && b.left < vw + 120 && b.width > 0;
      it.mesh.visible = visible;
      if (!visible) continue;
      it.mesh.scale.set(b.width, b.height, 1);
      it.mesh.position.set(b.left + b.width / 2 - vw / 2, vh / 2 - b.top - b.height / 2, 0);
      const u = it.uniforms;
      u.uPlane.value.set(b.width, b.height);
      u.uReveal.value = it.fig.__r ? it.fig.__r.v : 1;
      u.uVelocity.value = v;
      u.uTime.value = time;
      u.uZoom.value = it.fig.__zoom || 0;
      // ease the lens toward the pointer; the lag becomes the flow vector
      const m = u.uMouse.value, t = it.target;
      const fx = (t.x - m.x) * 0.12, fy = (t.y - m.y) * 0.12;
      m.x += fx; m.y += fy;
      u.uFlow.value.x += (fx * 4 - u.uFlow.value.x) * 0.2;
      u.uFlow.value.y += (fy * 4 - u.uFlow.value.y) * 0.2;
      // respect CSS opacity / visibility of the figure (e.g. filtered or faded out)
      it.mesh.material.opacity = 1;
    }
    this.renderer.render(this.scene, this.camera);
  }
}
