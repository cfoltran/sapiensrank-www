# Règles du motion studio

## Contrat de livraison
- Chaque film est une fonction pure du temps : window.seek(t) peint la frame t.
- Interdit dans seek(t) : transitions CSS, requestAnimationFrame comme horloge,
  Date.now(), Math.random() non seedé, setTimeout, état accumulé entre les frames.
- Un seul fichier index.html par film. Polices en base64 ou stack système déclarée.
- Boutons Play / Replay / Pause. Flèches = frame précédente / suivante.

## Charte par défaut (remplace par la tienne)
- Suis le style du site
- Interdit : dégradé arc-en-ciel, particules, chrome lumineux, emoji,
  lorem ipsum, rebond cartoon, flip 3D gratuit

## Mouvement
- Springs en forme fermée. Damping ≥ 0.72. Overshoot minuscule.
- Une seule chose bouge à la fois, sauf si un slider pilote une transformation continue.
- Une forme / un système visuel du début à la fin. Des transformations, pas de cuts,
  sauf hard cut demandé.
- Boucle : frame 0 = dernière frame, en position ET en vélocité.

## Process obligatoire
1. Beats horodatés (8 lignes max). Attendre validation.
2. 4 stills (hook, milieu, climax, outro). Attendre validation.
3. Code + preview navigateur.
4. Contact sheet : 1 frame par beat + 0,3 s après.
5. Notes /10. Corriger tout ce qui est sous 8.
6. Export draft 540p 30 fps sans flou.
7. Export master.

## Export
- Playwright Chromium. Après chaque seek : attendre 2 rAF avant le screenshot.
- 30 fps draft / 60 fps master.
- Master : 4 sous-frames, mix, H.264 yuv420p crf 18, +faststart.
- Audio : -14 LUFS, true peak -1 dBTP.
