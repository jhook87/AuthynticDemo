import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { NetworkSnapshot } from '@authyntic/demo-core';
import { authynticTheme } from '../theme/authynticTheme.js';

export interface NetworkTopologyProps {
  readonly snapshot: NetworkSnapshot;
}

export const NetworkTopology: React.FC<NetworkTopologyProps> = ({ snapshot }) => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>();

  useEffect(() => {
    if (!canvasRef.current) {
      return undefined;
    }

    const width = canvasRef.current.clientWidth || 640;
    const height = canvasRef.current.clientHeight || 360;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(authynticTheme.colors.background);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    canvasRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight('#54627a', 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight('#ffffff', 1.2);
    pointLight.position.set(0, 5, 10);
    scene.add(pointLight);

    const nodeGeometry = new THREE.IcosahedronGeometry(0.35, 0);
    const nodePositions = new Map<string, THREE.Vector3>();

    snapshot.nodes.forEach((node, index) => {
      const material = new THREE.MeshPhongMaterial({ color: resolveColor(node.status) });
      const mesh = new THREE.Mesh(nodeGeometry.clone(), material);
      const angle = (index / Math.max(snapshot.nodes.length, 1)) * Math.PI * 2;
      const radius = 2.5 + (node.role === 'operator' ? 0.5 : 0);
      const position = new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
      mesh.position.copy(position);
      nodePositions.set(node.id, position);
      scene.add(mesh);
    });

    const linkMaterial = new THREE.LineBasicMaterial({ color: '#5dade2', transparent: true, opacity: 0.65 });
    snapshot.links.forEach((link) => {
      const source = nodePositions.get(link.source);
      const target = nodePositions.get(link.target);
      if (!source || !target) {
        return;
      }

      const points = new Float32Array([
        source.x,
        source.y,
        source.z,
        target.x,
        target.y,
        target.z,
      ]);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
      const line = new THREE.Line(geometry, linkMaterial.clone());
      scene.add(line);
    });

    const animate = () => {
      scene.rotation.z += 0.0008;
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    return () => {
      renderer.setAnimationLoop(null);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      nodeGeometry.dispose();
      linkMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      rendererRef.current = undefined;
    };
  }, [snapshot]);

  return <div ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

function resolveColor(status: NetworkSnapshot['nodes'][number]['status']): string {
  switch (status) {
    case 'critical':
      return authynticTheme.colors.critical;
    case 'warning':
      return authynticTheme.colors.warning;
    default:
      return authynticTheme.colors.secure;
  }
}
