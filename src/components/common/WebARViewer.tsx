import React, { useState, useEffect, useRef } from "react";
import { Product3D } from "../../types";
import { X, Camera, RotateCcw, Maximize2, Sparkles, Smartphone, Download, Check, Box } from "lucide-react";
import * as THREE from "three";

interface WebARViewerProps {
  product: Product3D;
  onClose: () => void;
}

export const WebARViewer: React.FC<WebARViewerProps> = ({ product, onClose }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0] : "#3b82f6"
  );
  const [scale, setScale] = useState(1);
  const [rotationY, setRotationY] = useState(0);
  const [arSupported, setArSupported] = useState(true);
  const [placedInRoom, setPlacedInRoom] = useState(false);

  // Three.js interactive 3D setup
  useEffect(() => {
    if (!mountRef.current) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x7c3aed, 2, 10);
    pointLight.position.set(-3, 2, -2);
    scene.add(pointLight);

    // Create realistic procedural 3D model geometry representing furniture/product
    const group = new THREE.Group();

    if (product.category === "Muebles") {
      // Main body (Sofa/Chair seat)
      const seatGeo = new THREE.BoxGeometry(1.6 * scale, 0.4 * scale, 0.9 * scale);
      const seatMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(selectedColor),
        roughness: 0.4,
        metalness: 0.1,
      });
      const seatMesh = new THREE.Mesh(seatGeo, seatMat);
      seatMesh.position.y = 0.4;
      seatMesh.castShadow = true;
      group.add(seatMesh);

      // Backrest
      const backGeo = new THREE.BoxGeometry(1.6 * scale, 0.7 * scale, 0.25 * scale);
      const backMesh = new THREE.Mesh(backGeo, seatMat);
      backMesh.position.set(0, 0.85, -0.32);
      backMesh.castShadow = true;
      group.add(backMesh);

      // Wooden Legs
      const legGeo = new THREE.CylinderGeometry(0.04, 0.02, 0.35, 12);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.8 });
      const legPositions = [
        [-0.7, 0.17, 0.35],
        [0.7, 0.17, 0.35],
        [-0.7, 0.17, -0.35],
        [0.7, 0.17, -0.35],
      ];
      legPositions.forEach(([x, y, z]) => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(x * scale, y * scale, z * scale);
        group.add(leg);
      });
    } else if (product.category === "Iluminación") {
      // Lamp Base & Pole
      const baseGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.05, 32);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.025;
      group.add(base);

      const poleGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.4, 16);
      const pole = new THREE.Mesh(poleGeo, baseMat);
      pole.position.y = 0.7;
      group.add(pole);

      // Shade
      const shadeGeo = new THREE.ConeGeometry(0.35, 0.4, 32, 1, true);
      const shadeMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(selectedColor), side: THREE.DoubleSide });
      const shade = new THREE.Mesh(shadeGeo, shadeMat);
      shade.position.y = 1.35;
      group.add(shade);
    } else {
      // Generic sleek product box/cube
      const boxGeo = new THREE.BoxGeometry(1 * scale, 0.8 * scale, 0.8 * scale);
      const boxMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(selectedColor),
        roughness: 0.3,
        metalness: 0.4,
      });
      const boxMesh = new THREE.Mesh(boxGeo, boxMat);
      boxMesh.position.y = 0.5;
      group.add(boxMesh);
    }

    // Shadow Floor Plane
    const shadowGeo = new THREE.PlaneGeometry(5, 5);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.3 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    group.position.y = 0;
    scene.add(group);

    mountRef.current.appendChild(renderer.domElement);

    let animationFrameId: number;
    let isDragging = false;
    let previousMouseX = 0;

    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      previousMouseX = clientX;
    };

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - previousMouseX;
      group.rotation.y += deltaX * 0.01;
      setRotationY(group.rotation.y);
      previousMouseX = clientX;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElem = mountRef.current;
    domElem.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    domElem.addEventListener("touchstart", onMouseDown);
    window.addEventListener("touchmove", onMouseMove);
    window.addEventListener("touchend", onMouseUp);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isDragging) {
        group.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElem.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      domElem.removeEventListener("touchstart", onMouseDown);
      window.removeEventListener("touchmove", onMouseMove);
      window.removeEventListener("touchend", onMouseUp);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [product, selectedColor, scale]);

  // Toggle AR Camera
  const toggleCamera = async () => {
    if (isCameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
      }
      setIsCameraActive(false);
      setPlacedInRoom(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
        setPlacedInRoom(true);
      } catch (err) {
        console.warn("Camera access unavailable, fallback to simulated room mode", err);
        setIsCameraActive(true);
        setPlacedInRoom(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[90vh] max-h-[720px] text-slate-900">
        
        {/* Header Bar */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 text-violet-700 rounded-xl border border-violet-200">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                {product.title}
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                  WebAR 3D
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                {product.merchantName} • {product.dimensions ? `${product.dimensions.width} x ${product.dimensions.height}` : "Escala 1:1"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Cerrar visor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport 3D Canvas / Camera Area */}
        <div className="relative flex-1 bg-slate-100 overflow-hidden flex items-center justify-center">
          
          {/* Simulated or Real Camera Video Stream */}
          {isCameraActive ? (
            <div className="absolute inset-0 z-0">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Camera AR Overlay grid simulation */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-xs text-emerald-800 font-bold flex items-center gap-2 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Superficie detectada • Modelo proyectado a escala real
              </div>
            </div>
          ) : (
            /* Studio 3D Background Grid */
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/60 via-slate-100 to-slate-100">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
            </div>
          )}

          {/* 3D Canvas Mounting Node */}
          <div ref={mountRef} className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Interactive Touch Hint Overlay */}
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 text-xs text-slate-700 shadow-sm flex items-center gap-2">
            <Box className="w-4 h-4 text-violet-600" />
            <span>Arrastra para girar 360°</span>
          </div>

          {/* Color Selector Overlay */}
          {product.colors && product.colors.length > 0 && (
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 p-2 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 text-center font-medium uppercase tracking-wider">Color</span>
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    selectedColor === c ? "scale-110 border-slate-900 ring-2 ring-violet-500" : "border-slate-300 opacity-80"
                  }`}
                  style={{ backgroundColor: c }}
                  title={`Seleccionar color ${c}`}
                />
              ))}
            </div>
          )}

          {/* Scale Slider */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-600 font-medium">Escala:</span>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-24 accent-violet-600 cursor-pointer"
            />
            <span className="text-xs font-mono text-violet-700 font-bold">{(scale * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 z-10">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={toggleCamera}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                isCameraActive
                  ? "bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-200"
                  : "bg-violet-600 text-white hover:bg-violet-700 shadow-md"
              }`}
            >
              <Camera className="w-4 h-4" />
              {isCameraActive ? "Desactivar Cámara AR" : "Proyectar en mi Espacio (Cámara AR)"}
            </button>
          </div>

          {/* Native Mobile Launchers (Google Scene Viewer / Apple AR Quick Look) */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={product.modelGlbUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              title="Abrir en Google Scene Viewer (Android)"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              Android SceneViewer (.glb)
            </a>
            <a
              href={product.modelUsdzUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              title="Abrir en Apple AR Quick Look (iOS)"
            >
              <Download className="w-3.5 h-3.5 text-sky-600" />
              Apple Quick Look (.usdz)
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
