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
  AIRTABLE_REQUEST_FORM_URL: "https://airtable.com/embed/appIUwpe8cWfs0LRu/pag3bY0txbaRUousS/form",
  /* Test de 15 preguntas (se abre en pestaña nueva). */
  TEST_METABOLICO_URL: "https://ctrteam.es/test-metabolico",
  /* Clase larga (YouTube). */
  CLASE_LARGA: { id: "xloZ_MygfIk", title: "Guía definitiva: pierde grasa comiendo MÁS (+3.300 kcal)" },
  /* Las 6 clases del método. Provisionales hasta que Rafa grabe la miniserie: cambia aquí los id. */
  CLASSES: [
    { id: "GzxFCf36lvc", title: "El Método Bioenergético: primero enciendes el metabolismo, después pierdes la grasa", line: "El orden del método: con el metabolismo encendido el cuerpo usa la grasa; apagado, la guarda." },
    { id: "4inuA35FyUA", title: "Rebote: por qué te tapas en cuanto sueltas la dieta", line: "Qué pasa cuando sueltas la dieta y por qué tu cuerpo corre a llenar lo que le faltaba." },
    { id: "6Rjg2_OKgc4", title: "Como poco y no bajo: las calorías no son el problema", line: "Por qué comer poco no mueve el peso: el cuerpo aprende a gastar lo que le das." },
    { id: "OI-aRPnbiVY", title: "Te apagas a las cinco: la energía es el primer resultado", line: "Por qué la energía llega antes que el espejo y qué dice de tu metabolismo." },
    { id: "Vr0x5wKIA78", title: "No descansas: el cortisol nocturno", line: "Cómo el cortisol alto de noche te despierta y te frena la recuperación." },
    { id: "cnJmjtftlIc", title: "Estrés: la corriente que conecta todo lo anterior", line: "Cómo el estrés conecta temperatura, sueño y hambre en una sola corriente." }
  ],
  /* Testimonios (entrevistas de YouTube). Sin cifras que no estén en el vídeo. */
  TESTIMONIALS: [
    { id: "k4-7CnzotlE", name: "Ángel", line: "De 2.400 a 3.000 kcal." },
    { id: "F2thkwx4UFw", name: "Xavier", line: "1.700 kcal entre semana, hoy casi 3.000." },
    { id: "HUbKrWzlPDA", name: "Alejandro", line: "De ayunar seis días a comer más de 3.000." }
  ]
};
