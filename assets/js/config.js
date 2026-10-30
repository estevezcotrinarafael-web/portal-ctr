/* Constantes del portal CTR TEAM. Todo lo que cambia a mano vive aquí. */
window.CTR = {
  /* ID del vídeo de bienvenida de Rafa (YouTube). Vacío = se ve el marco "Aquí va el vídeo de Rafa". */
  WELCOME_VIDEO_ID: "",
  /* ID del vídeo del mecanismo en /entra (YouTube). Vacío = marco discreto sin vídeo. */
  ENTRA_VIDEO_ID: "",
  /* Enlace de reserva (CTA fijo, calculadora, test de señales, /entra). */
  CALENDLY_URL: "https://calendly.com/rafa-cotri/llamada-de-diagnosticoo",
  /* Endpoint que recibe el registro (POST JSON). Vacío = el lead se guarda en el navegador (ctr_pending_lead) y se avisa. */
  RELAY_URL: "https://ctr-portal-relay.ctrteam.workers.dev",
  /* Formularios de Airtable (se embeben en iframe). */
  AIRTABLE_FORM_URL: "https://airtable.com/embed/appIUwpe8cWfs0LRu/paglLBvckUtdGd2qe/form",
  /* Test de 15 preguntas (se abre en pestaña nueva). */
  TEST_METABOLICO_URL: "https://ctrteam.es/test-metabolico",
  /* Clase larga (YouTube). */
  CLASE_LARGA: { id: "xloZ_MygfIk", title: "Guía definitiva: pierde grasa comiendo MÁS (+3.300 kcal)" },
  /* Las clases del método, por secciones y ordenadas por lo que más vendió (decisión de Rafael, 30/10/2026). key = dolor; cambia los id aquí. */
  SECTIONS: [
    { id: "grasa", title: "Pérdida de grasa", line: "Por qué recortar dejó de funcionar y qué pasa cuando sueltas la dieta." },
    { id: "energia", title: "Aumento de energía", line: "La energía es el primer resultado: llega antes que el espejo." },
    { id: "mente", title: "Sueño, estrés y concentración", line: "La misma deuda vista a distintas horas del día." }
  ],
  CLASSES: [
    { key: "rebote", sec: "grasa", id: "4inuA35FyUA", title: "Cómo mantenerte definido todo el año", line: "Qué pasa cuando sueltas la dieta y por qué tu cuerpo corre a llenar lo que le faltaba." },
    { key: "mecanismo", sec: "grasa", id: "nmsb3Vxxc9w", title: "Convierte tu metabolismo en una máquina de quemar grasa", line: "El orden del método: con el metabolismo encendido el cuerpo usa la grasa; apagado, la guarda." },
    { key: "calorias", sec: "grasa", id: "6Rjg2_OKgc4", title: "Por qué contar calorías dejó de funcionarte", line: "Por qué comer poco no mueve el peso: el cuerpo aprende a gastar lo que le das." },
    { key: "energia", sec: "energia", id: "OI-aRPnbiVY", title: "Por qué la dieta low carb te deja sin energía", line: "Sin hidratos el cuerpo no optimiza: sobrevive. De ahí el bajón de las cinco." },
    { key: "sueno", sec: "mente", id: "OQwX_CGD7lA", title: "Cómo un mal descanso está destruyendo tu progreso", line: "Dormir cuesta energía. Sin ella aguantas, no descansas, y el cuerpo guarda." },
    { key: "estres", sec: "mente", id: "cnJmjtftlIc", title: "Cómo reducir el cortisol para perder grasa más rápido", line: "El cortisol es energía prestada: por qué te está guardando la grasa." },
    { key: "mente", sec: "mente", id: "yM6TjdYv-0o", title: "El estado que te tiene tapado y sin foco", line: "La niebla mental no es de la cabeza: es de combustible." }
  ],
  /* Testimonios (entrevistas de YouTube). Sin cifras que no estén en el vídeo. */
  TESTIMONIALS: [
    { id: "k4-7CnzotlE", name: "Ángel", line: "De 2.400 a 3.000 kcal." },
    { id: "F2thkwx4UFw", name: "Xavier", line: "1.700 kcal entre semana, hoy casi 3.000." },
    { id: "HUbKrWzlPDA", name: "Alejandro", line: "De ayunar seis días a comer más de 3.000." }
  ]
};
