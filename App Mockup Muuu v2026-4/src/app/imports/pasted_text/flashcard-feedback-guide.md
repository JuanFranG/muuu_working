Frames a crear
Duplica el frame actual de Ponte a Prueba y crea estas variantes nuevas:

PP-Flashcard-Frente — igual al actual pero sin las opciones A/B/C/D. La card de la integral se escala y centra verticalmente en el espacio libre.
PP-Flashcard-Reverso — misma estructura, la card muestra la respuesta y la nemotecnia de Ada en lugar de la fórmula.
PP-Feedback-Correcto — frame actual con opción marcada en verde + card de feedback verde debajo de las opciones.
PP-Feedback-Incorrecto — frame actual con opción marcada en rojo + opción correcta resaltada en verde + card de feedback rojo debajo.


Ícono de cambio de modo
Agregar en la esquina superior derecha de la card de flashcard (top 8, right 8, tamaño 36×36, border-radius 10). Usar los estilos de color globales del proyecto.
Dibujar en Figma: un rectángulo redondeado pequeño (la "tarjeta") con una flecha de volteo encima — representa físicamente una tarjeta que se da vuelta. Dos variantes del componente: mode=quiz (fondo lavanda, ícono púrpura) y mode=flashcard (fondo púrpura, ícono blanco).

Card de feedback
Mismo border-radius y estilo de card que el resto del proyecto. Dos variantes:
Correcto — fondo verde claro, borde verde, ícono 🎉, título "¡Muy bien!" bold, texto de explicación de acierto debajo.
Incorrecto — fondo rojo claro, borde rojo, ícono 💡, título "Casi..." bold, texto de retroalimentación específico de esa opción debajo. Este texto viene del campo que el docente llenó al diseñar la flashcard.
Ambas cards con Auto Layout vertical para que el texto de retroalimentación expanda la altura sin romper el layout.

Animaciones en Prototype
Quiz → Flashcard: Smart Animate 300ms Ease Out. Las opciones bajan con fade out, la card sube y se escala al centro.
Volteo de la card: Simular con dos frames intermedios — card en scaleX 1 → scaleX 0 (150ms Ease In) → scaleX 1 mostrando el reverso (150ms Ease Out). Esto imita el volteo físico real.
Flashcard → Quiz: Smart Animate inverso, las opciones reaparecen subiendo.

Conexiones

Toque en icon/mode-switch → alterna entre PP-Flashcard-Frente y el frame de Quiz
Toque en cualquier parte de la card → volteo entre Frente y Reverso
Botón Verificar → PP-Feedback-Correcto o PP-Feedback-Incorrecto según la opción marcada


Eso es todo lo que necesita Figma para implementarlo sobre los estilos que ya tienen.sin iconos,y dame tu el texto de retroalimentacion, ahi tienes la integral de ejemplo23:39Prompt Figma — Ponte a Prueba: Modo Flashcard + Feedback

Frames a crear
Duplica el frame actual y crea estas variantes:

PP-Flashcard-Frente — sin opciones A/B/C/D. La card de la integral se escala y centra verticalmente en el espacio libre.
PP-Flashcard-Reverso — la card muestra el reverso con la respuesta y la nemotecnia.
PP-Feedback-Correcto — opción marcada en verde + card de feedback verde debajo de las opciones.
PP-Feedback-Incorrecto-B, PP-Feedback-Incorrecto-C, PP-Feedback-Incorrecto-D — uno por cada opción incorrecta, cada uno con su retroalimentación específica.


Ícono de cambio de modo
Esquina superior derecha de la card, top 8 right 8, 36x36 border-radius 10. Dos variantes del componente: fondo lavanda con trazo púrpura cuando está en modo quiz, fondo púrpura con trazo blanco cuando está en modo flashcard. El ícono es un rectángulo pequeño con una flecha curva encima, representando una tarjeta que se voltea.

Textos de retroalimentación
Para la integral ∫ x·eˣ dx cuya respuesta correcta es x·eˣ − eˣ + C:
Opción A correcta — card verde:
"Correcto. Identificaste bien u = x y dv = eˣdx. Al aplicar la fórmula de integración por partes obtienes x·eˣ menos la integral de eˣ, que es eˣ. Resultado: x·eˣ − eˣ + C."
Opción B incorrecta (eˣ + C) — card roja:
"Esta es solo la integral de eˣ. Olvidaste que hay un producto x·eˣ que requiere integración por partes. La integral de un producto no se puede resolver sumando las integrales por separado."
Opción C incorrecta (x·eˣ + C) — card roja:
"Casi. Calculaste bien el primer término, pero te faltó restar eˣ. Al aplicar ∫v·du, la integral de eˣdx da eˣ, que debe restarse al resultado final."
Opción D incorrecta ((x−1)·eˣ + C) — card roja:
"Esta expresión es algebraicamente equivalente a la respuesta correcta si la expandes. El problema es la forma: (x−1)·eˣ puede llevar a confusión porque no muestra claramente los pasos de integración por partes. La forma canónica es x·eˣ − eˣ + C."

Reverso de la flashcard
Título: Respuesta y nemotecnia
Respuesta: x·eˣ − eˣ + C
Paso a paso:

Identifica u = x y dv = eˣdx
Deriva y antideriva: du = dx, v = eˣ
Aplica ∫u·dv = u·v − ∫v·du
Resultado: x·eˣ − ∫eˣdx = x·eˣ − eˣ + C

Nemotecnia de Ada: "Una vaca sin cola vestida de uniforme" — la vaca es u, sin cola es dv, vestida es v, uniforme es du. Recuerda el orden para elegir u: logaritmos, algebraicas, trigonométricas, exponenciales.

Animaciones en Prototype
Quiz a Flashcard: Smart Animate 300ms Ease Out. Las opciones bajan con fade out, la card sube y se escala al centro.
Volteo de la card: dos frames intermedios con scaleX 0 entre frente y reverso, 150ms Ease In seguido de 150ms Ease Out. Imita el volteo físico.
Flashcard a Quiz: Smart Animate inverso, las opciones reaparecen.

Conexiones

Toque en el icono de la card alterna entre PP-Flashcard-Frente y el frame de Quiz
Toque en cualquier parte de la card voltea entre Frente y Reverso
Botón Verificar conecta al frame de feedback correspondiente a la opción marcada
