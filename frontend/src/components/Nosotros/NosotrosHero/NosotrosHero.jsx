import React, { useRef, useEffect, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Center } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./NosotrosHero.css";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCircleQuestion, faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";


gsap.registerPlugin(ScrollTrigger);

/* ─── Fallback mientras carga el GLB ────────────────────────────────────── */
function FallbackMesh() {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * 0.55;
    ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.35) * 0.15;
  });
  return (
    <group ref={ref}>
      <mesh>
        <torusKnotGeometry args={[1, 0.34, 160, 18]} />
        <meshStandardMaterial color="#FF8200" emissive="#FF2200" emissiveIntensity={0.3} roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
}

/* ─── Modelo 3D con mouse-follow ─────────────────────────────────────────── */
function MotoModel({ mouseRef }) {
  const { scene } = useGLTF("/models/moto_virtual_av5.glb");
  const groupRef  = useRef();
  const floatDone = useRef(false);

  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.position.y = -4;
    groupRef.current.rotation.x = -0.5;

    const tl = gsap.timeline({ delay: 0.6 });
    tl.to(groupRef.current.position, { y: 0, duration: 2, ease: "power4.out" })
      .to(groupRef.current.rotation, {
        x: 0, duration: 2, ease: "power4.out",
        onComplete: () => { floatDone.current = true; },
      }, "<");

    return () => tl.kill();
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    if (floatDone.current) {
      // Flotación suave
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.65) * 0.09;
    }
    // Mouse follow: lerp rotación hacia la posición del mouse
    if (mouseRef?.current) {
      const targetY = mouseRef.current.x * 0.5;
      const targetX = mouseRef.current.y * 0.18;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.06;
      if (floatDone.current) {
        groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.04;
      }
    }
  });

  return (
    <group ref={groupRef} scale={2.0}>
      <Center><primitive object={scene} /></Center>
    </group>
  );
}

/* ─── Hook contador animado ──────────────────────────────────────────────── */
function useCounter(target, duration = 1.8, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const obj = { val: 0 };
    const tl = gsap.to(obj, {
      val: target,
      duration,
      ease: "power2.out",
      delay: 0.3,
      onUpdate: () => setValue(Math.round(obj.val)),
    });
    return () => tl.kill();
  }, [start, target, duration]);
  return value;
}

/* ─── Stat con contador ──────────────────────────────────────────────────── */
function StatCounter({ value, suffix = "", label, started }) {
  const count = useCounter(value, 2, started);
  return (
    <div className="nh-stat">
      <strong>
        {suffix === "+" ? `+${count}` : count}
        {suffix !== "+" ? suffix : ""}
      </strong>
      <span>{label}</span>
    </div>
  );
}

/* ─── Hero principal ─────────────────────────────────────────────────────── */
const NosotrosHero = ({ onComunidadClick, onInfoClick }) => {
  const navigate = useNavigate();
  const ctaRef = useRef();
  const sectionRef  = useRef();
  const leftRef     = useRef();
  const badgeRef    = useRef();
  const titleRef    = useRef();
  const paraRef     = useRef();
  const ruleRef     = useRef();
  const statsRef    = useRef();
  const btn1Ref     = useRef();
  const btn2Ref     = useRef();
  const canvasWrap  = useRef();
  const mouseRef    = useRef({ x: 0, y: 0 });
  const [countersOn, setCountersOn] = useState(false);

  /* ── Animaciones de entrada ── */
  useEffect(() => {
    const els = [badgeRef, titleRef, paraRef, ruleRef, statsRef]
      .map(r => r.current).filter(Boolean);

    gsap.set(els, { opacity: 0, y: 30 });
    gsap.set([btn1Ref.current, btn2Ref.current], { opacity: 0, scale: 0.8 });
    gsap.set(ctaRef.current, { opacity: 0, y: 20 });

    const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "power3.out" } });
    tl.to(badgeRef.current,  { opacity: 1, y: 0, duration: 0.5 })
      .to(titleRef.current,  { opacity: 1, y: 0, duration: 0.65 }, "-=0.2")
      .to(paraRef.current,   { opacity: 1, y: 0, duration: 0.6  }, "-=0.4")
      .to(ruleRef.current,   { opacity: 1, y: 0, duration: 0.4  }, "-=0.3")
      .to(statsRef.current,  {
          opacity: 1, y: 0, duration: 0.4,
          onComplete: () => setCountersOn(true),   // arrancar contadores
        }, "-=0.25")
      .to(ctaRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out"
        }, "-=0.2")
      .to([btn1Ref.current, btn2Ref.current], {
          opacity: 1, scale: 1, duration: 0.5,
          stagger: 0.13, ease: "back.out(1.7)",
        }, "-=0.15");

    return () => tl.kill();
  }, []);

  /* ── Mouse follow — mueve botones y canvas sutilmente ── */
  const onMouseMove = (e) => {
    const rect = canvasWrap.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    mouseRef.current = { x, y };

    // Botones siguen el mouse con parallax suave
    gsap.to(btn1Ref.current, {
      x: x * 10, y: y * 8,
      duration: 0.6, ease: "power2.out", overwrite: "auto",
    });
    gsap.to(btn2Ref.current, {
      x: x * -8, y: y * -10,
      duration: 0.7, ease: "power2.out", overwrite: "auto",
    });
  };

  const onMouseLeave = () => {
    mouseRef.current = { x: 0, y: 0 };
    gsap.to([btn1Ref.current, btn2Ref.current], {
      x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)", overwrite: true,
    });
  };

  return (
    <section ref={sectionRef} className="nh-section">

      {/* Fondo cuadrícula decorativa sutil */}
      <div className="nh-grid-bg" aria-hidden="true" />

      {/* ═══ IZQUIERDA — texto ════════════════════════════════════════════ */}
      <div ref={leftRef} className="nh-left">

        {/* Badge */}
        <span ref={badgeRef} className="nh-badge">
          <span className="nh-badge-dot" />
          Taller certificado — Desde 2019
        </span>

        {/* Título limpio, no exagerado */}
        <div ref={titleRef} className="nh-title-wrap">
          <h1 className="nh-title">
            Nuestra <span className="nh-accent">Historia</span>
          </h1>
          <p className="nh-subtitle">
            Cinco años construyendo confianza en el corazón de la comunidad biker colombiana ...
          </p>
          <p className="nh-subtitle">
            Taller #1 en la ciudad de Neiva.
          </p>
        </div>

        {/* Párrafo */}
        <p ref={paraRef} className="nh-para">
          En <strong>MotorFix SAS</strong> somos especialistas en mantenimiento,
          diagnóstico y personalización de motocicletas. Certificados, apasionados
          y comprometidos con cada servicio que ofrecemos.
        </p>

        {/* Regla */}
        <div ref={ruleRef} className="nh-rule">
          <span className="nh-rule-long" />
          <span className="nh-rule-mid"  />
          <span className="nh-rule-short"/>
        </div>

        {/* Contadores animados */}
        <div ref={statsRef} className="nh-stats">
          <StatCounter value={300} suffix="+" label="Motos reparadas" started={countersOn} />
          <div className="nh-stat-divider" />
          <StatCounter value={5}   suffix=" Años" label="de experiencia" started={countersOn} />
          <div className="nh-stat-divider" />
          <StatCounter value={6}   label="Ciudades" started={countersOn} />
        </div>

        {/* CTA pequeño */}
        <button
        ref={ctaRef}
        onClick={() => navigate("/servicios")}
        className="nh-cta"
        >
        Conoce nuestros servicios
        <FontAwesomeIcon icon={faCircleChevronRight} />
      </button>
      </div>

      {/* ═══ DERECHA — canvas 3D ══════════════════════════════════════════ */}
      <div
        ref={canvasWrap}
        className="nh-right"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* Halos detrás del modelo */}
        <div className="nh-glow-orange" aria-hidden="true" />
        <div className="nh-glow-red"    aria-hidden="true" />

        {/* Canvas 3D */}
        <Canvas
          camera={{ position: [0, 0.6, 6.5], fov: 48 }}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          dpr={[1, 2]}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5,  7,  4]} intensity={1.7} color="#FFC100" />
          <directionalLight position={[-4, 3, -3]} intensity={0.8} color="#FF5500" />
          <spotLight position={[0, 10, 3]} intensity={1.1} color="#ffffff" angle={0.35} penumbra={1} />
          <pointLight position={[0, -2, 3]} intensity={0.6} color="#FF8200" />

          <Suspense fallback={<FallbackMesh />}>
            <MotoModel mouseRef={mouseRef} />
          </Suspense>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.8}
            rotateSpeed={0.55}
            dampingFactor={0.08}
            enableDamping
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.7}
          />
        </Canvas>

        {/* Hint interacción — desaparece luego */}
        <p className="nh-drag-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3"/>
          </svg>
          Arrastra · Rota 360°
        </p>

        {/* ── Botones flotantes centrados, siguen el mouse ── */}
        <button
          ref={btn1Ref}
          className="nh-float-btn nh-btn-dark"
          onClick={onComunidadClick}
        >
          <FontAwesomeIcon icon={faUsers} className="nh-icon-btn" />
          Nuestra Comunidad
        </button>

        <button
          ref={btn2Ref}
          className="nh-float-btn nh-btn-fire"
          onClick={onInfoClick}
        >
          Información adicional
          <FontAwesomeIcon icon={faCircleQuestion} className="nh-icon-btn" />
        </button>
      </div>
    </section>
  );
};

useGLTF.preload("/models/moto_virtual_av5.glb");
export default NosotrosHero;