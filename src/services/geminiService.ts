import { GoogleGenAI, Chat, Type, Modality } from "@google/genai";
import type { Character, DMResponse, Enemy } from '../types';

// FIX: Switched from import.meta.env.VITE_API_KEY to process.env.API_KEY to align with the coding guidelines.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    // FIX: Updated the error message to reflect the change to process.env.API_KEY.
    throw new Error("La variable de entorno API_KEY no está configurada");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        storyText: { type: Type.STRING, description: "La descripción narrativa de lo que está sucediendo. Esto siempre es obligatorio." },
        encounter: {
            type: Type.OBJECT,
            description: "Señala el inicio de un nuevo encuentro de combate. Incluir solo cuando comienza el combate.",
            properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                hp: { type: Type.INTEGER },
                attack: { type: Type.INTEGER },
                defense: { type: Type.INTEGER }
            },
        },
        playerUpdate: {
            type: Type.OBJECT,
            description: "Proporciona actualizaciones a las estadísticas del jugador (PS, PM). Solo incluye lo que ha cambiado.",
            properties: {
                currentHp: { type: Type.INTEGER },
                currentMp: { type: Type.INTEGER }
            },
        },
        enemyUpdate: {
            type: Type.OBJECT,
            description: "Proporciona actualizaciones a las estadísticas del enemigo (PS). Solo incluye si ha cambiado.",
            properties: {
                currentHp: { type: Type.INTEGER }
            }
        },
        loot: {
            type: Type.OBJECT,
            description: "Especifica los objetos que el jugador ha encontrado.",
            properties: {
                items: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            description: { type: Type.STRING },
                            quantity: { type: Type.INTEGER }
                        },
                        required: ["name", "description", "quantity"]
                    }
                }
            }
        },
        combatOver: {
            type: Type.BOOLEAN,
            description: "Establecer en true si el combate ha terminado (el jugador ganó, perdió o huyó)."
        },
        xpAward: {
            type: Type.INTEGER,
            description: "La cantidad de puntos de experiencia (XP) otorgados al jugador por ganar un combate o completar una tarea."
        }
    },
    required: ["storyText"]
};

const createSystemInstruction = (character: Character): string => {
    const spellList = character.spells.map(s => `- ${s.name} (Coste: ${s.cost} PM): ${s.description}`).join('\n');
    const inventoryList = character.inventory.map(i => `- ${i.name} (x${i.quantity}): ${i.description}`).join('\n');
    const skillList = character.skills.map(s => `- ${s.name} (Enfriamiento: ${s.cooldown} turnos): ${s.description}`).join('\n');

    return `
    Eres un maestro narrador y Dungeon Master para una partida de Dungeons and Dragons.
    Tu rol es crear un mundo cautivador de fantasía oscura para un jugador, narrando todo en español.

    PERSONAJE DEL JUGADOR:
    - Nombre: ${character.name}
    - Raza: ${character.race}
    - Clase: ${character.class}
    - Nivel: ${character.level}
    - Experiencia: ${character.xp}/${character.xpToNextLevel}
    - Estadísticas: PS: ${character.currentHp}/${character.maxHp}, PM: ${character.currentMp}/${character.maxMp}, Ataque: ${character.attack}, Defensa: ${character.defense}
    - Habilidades:
    ${skillList || 'Ninguna'}
    - Hechizos:
    ${spellList || 'Ninguno'}
    - Inventario:
    ${inventoryList || 'Ninguno'}

    Debes controlar el estado del juego y responder en formato JSON según el esquema proporcionado.

    FLUJO DEL JUEGO:
    1. NARRATIVA: Comienza presentando una escena de apertura donde el jugador despierta en una celda de piedra tenuemente iluminada. Describe el entorno con gran detalle. Espera la entrada del jugador. Cuando el jugador encuentre objetos, usa el objeto 'loot'.
    2. COMBATE: Cuando decidas que aparece un enemigo, DEBES iniciar el combate incluyendo un objeto 'encounter' en tu respuesta JSON.
    3. RECOMPENSAS: Después de que el jugador gane un combate o complete un hito importante, DEBES recompensarlo con experiencia usando el campo 'xpAward'. También puedes dar objetos con el campo 'loot'.

    ACCIONES DEL JUGADOR:
    - Exploración: El jugador describirá sus acciones con texto (ej., "mirar debajo de la cama", "intentar abrir la puerta").
    - Combate: El jugador usará comandos específicos: "ATACAR", "DEFENDER", "HUIR", "LANZAR [Nombre del Hechizo]", "USAR [Nombre del Objeto]", "USAR HABILIDAD [Nombre de la Habilidad]".

    REGLAS DE COMBATE Y ACCIÓN:
    - El combate es por turnos. El jugador actúa primero.
    - Tu respuesta DEBE narrar los resultados del turno e incluir un objeto 'playerUpdate' con cualquier cambio en los PS o PM del jugador y un objeto 'enemyUpdate' con cualquier cambio en los PS del enemigo.
    - Cálculo de daño: max(1, ataque del atacante - defensa del defensor).
    - "DEFENDER": La defensa del jugador se duplica por un turno.
    - "USAR HABILIDAD [Nombre de la Habilidad]": Se activa el efecto de la habilidad. La aplicación gestiona el enfriamiento, así que solo tienes que narrar el poderoso efecto de la habilidad.
    - "LANZAR [Nombre del Hechizo]": Se activa el efecto del hechizo. Debes reducir el PM del jugador por el coste del hechizo en 'playerUpdate'. Si el PM es demasiado bajo, narra el fallo. Tú decides el daño o efecto del hechizo. Un hechizo de daño simple debería infligir un daño igual al Ataque del jugador + una pequeña bonificación.
    - "USAR [Nombre del Objeto]": Se activa el efecto del objeto. Una 'Poción de Salud' debería restaurar 10 PS. Actualiza las estadísticas del jugador correspondientemente en 'playerUpdate'. El inventario del jugador es gestionado por la aplicación, así que no necesitas rastrearlo, solo aplica el efecto del objeto para el turno actual.
    - El enemigo siempre ataca después del jugador, a menos que el jugador huya.
    - Cuando los PS de cualquiera de los combatientes lleguen a 0, o el jugador huya, DEBES establecer 'combatOver' en true. Después de ganar, DEBES otorgar XP al jugador usando 'xpAward'.

    IMPORTANTE:
    - Responde siempre en el formato JSON especificado.
    - Nunca rompas el personaje. Eres el Dungeon Master.
    - Tu 'storyText' debe ser solo la historia, sin frases introductorias.
    - Actualiza las estadísticas del jugador ÚNICAMENTE a través del objeto 'playerUpdate'. Las del enemigo a través de 'enemyUpdate'.
    `;
};


export function createGameSession(character: Character): Chat {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: createSystemInstruction(character),
            temperature: 0.9,
            topP: 1,
            topK: 1,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });
    return chat;
}

async function parseResponse(chat: Chat, message: string): Promise<DMResponse> {
    const response = await chat.sendMessage({ message });
    const jsonText = response.text.trim().replace(/```json|```/g, '');
    try {
        return JSON.parse(jsonText) as DMResponse;
    } catch (e) {
        console.error("Error al analizar la respuesta JSON:", jsonText, e);
        // Fallback si la IA no genera un JSON válido
        return { storyText: "Una fuerza misteriosa perturba la realidad, y el mundo parece detenerse... (Respuesta inválida del DM)" };
    }
}

export async function getInitialStory(chat: Chat): Promise<DMResponse> {
    return parseResponse(chat, "Comienza la aventura.");
}

export async function sendPlayerAction(chat: Chat, playerAction: string, character: Character, enemy: Enemy | null): Promise<DMResponse> {
    let prompt = `Acción del jugador: ${playerAction}.`;
    if (enemy) {
        prompt += ` Estado actual: Jugador PS=${character.currentHp}, Jugador PM=${character.currentMp}, Enemigo (${enemy.name}) PS=${enemy.currentHp}.`;
    }
    return parseResponse(chat, prompt);
}

export async function generateSpeech(text: string): Promise<string> {
  try {
    // FIX: The prompt for TTS should just be the text to synthesize. Instructions about voice style are handled by speechConfig.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, 
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No se recibieron datos de audio.");
    }
    return base64Audio;
  } catch (error) {
    console.error("Error al generar el audio:", error);
    return "";
  }
}
